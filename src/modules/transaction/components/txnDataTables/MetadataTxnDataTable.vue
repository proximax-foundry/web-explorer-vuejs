<template>
  <div>
    <DataTable
      :value="transactions"
      :paginator="false"
      :rows="Number(pages)"
      scrollDirection="horizontal"
      :alwaysShowPaginator="false"
      responsiveLayout="scroll"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate=""
    >
      <Column style="width: 200px" v-if="!wideScreen">
        <template #body="{ data }">
          <div>
            <div class="uppercase text-xs text-gray-300 font-bold mb-1">
              TX Hash
            </div>
            <router-link
              class="uppercase font-bold text-xs block text-blue-600 hover:text-blue-primary hover:underline"
              :to="{ name: 'ViewTransaction', params: { hash: data.hash } }"
            >
              <span
                class="text-xs break-all hover:underline hover:text-blue-primary truncate inline-flex text-ellipsis overflow-hidden w-44"
                v-tooltip.right="data.hash"
                >{{ data.hash }}.</span
              >..
            </router-link>
          </div>
          <div>
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
              Type
            </div>
            <div class="flex items-center">
              <div class="uppercase font-bold text-xs">{{ data.type }}</div>
            </div>
          </div>
          <div>
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
              Scoped Metadata Key
            </div>
            <div class="flex items-center">
              <div class="font-bold text-xs">{{ data.scopedMetadataKey }}</div>
            </div>
          </div>
        </template>
      </Column>
      <Column style="width: 200px" v-if="!wideScreen">
        <template #body="{ data }">
          <div v-if="selectedGroupType === transactionGroupType.CONFIRMED">
            <div class="uppercase text-xs text-gray-300 font-bold mb-1">
              Timestamp
            </div>
            <div class="uppercase font-bold text-xs">
              {{ convertLocalTime(data.timestamp) }}
            </div>
          </div>
          <div>
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
              Target
            </div>
            <span
              class="text-xs font-bold inline-flex"
              v-if="data.metadataTypeName === 'Account'"
              v-tooltip.bottom="data.targetPublicKey"
              ><span class="text-ellipsis overflow-hidden w-44">
                {{ data.targetPublicKey }}</span
              >...
            </span>
            <span
              class="text-xs uppercase font-bold"
              v-else-if="data.metadataTypeName === 'Asset'"
            >
              {{ data.targetId }}
              {{ data.targetIdName ? `(${data.targetIdName})` : "" }}
            </span>
            <span
              class="text-xs uppercase font-bold"
              v-else-if="data.metadataTypeName === 'Namespace'"
            >
              {{ data.targetIdName ? data.targetIdName : data.targetId }}
            </span>
          </div>
          <div v-if="selectedGroupType !== transactionGroupType.CONFIRMED">
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
              Value
            </div>
            <div>
              <img
                src="@/modules/transaction/img/icon-message.svg"
                v-if="data.valueChange"
                v-tooltip.left="
                  '<tiptext>' + constructValueDisplay(data) + '</tiptext>'
                "
                class="inline-block"
              />
            </div>
          </div>
          <div v-else class="mb-1 mt-14"></div>
        </template>
      </Column>
      <Column
        field="hash"
        header="TX Hash"
        headerStyle="width:100px;text-transform:uppercase"
        v-if="wideScreen"
      >
        <template #body="{ data }">
          <router-link
            :to="{ name: 'ViewTransaction', params: { hash: data.hash } }"
            class="text-xs text-blue-600 hover:text-blue-primary hover:underline inline-flex"
            v-tooltip.bottom="data.hash"
            ><span class="text-ellipsis overflow-hidden w-44">{{
              data.hash
            }}</span
            >...</router-link
          >
        </template>
      </Column>
      <Column
        field="timestamp"
        header="Timestamp"
        v-if="
          selectedGroupType === transactionGroupType.CONFIRMED && wideScreen
        "
        headerStyle="width:200px;text-transform:uppercase"
      >
        <template #body="{ data }">
          <span class="text-xs">{{ convertLocalTime(data.timestamp) }}</span>
        </template>
      </Column>
      <Column
        field="typeName"
        header="Type"
        headerStyle="width:110px;text-transform:uppercase"
        v-if="wideScreen"
      >
        <template #body="{ data }">
          <span class="text-xs">{{ data.type }}</span>
        </template>
      </Column>
      <Column
        field="block"
        header="Block"
        v-if="
          selectedGroupType === transactionGroupType.CONFIRMED && wideScreen
        "
        headerStyle="width:110px;text-transform:uppercase"
      >
        <template #body="{ data }">
          <router-link
            :to="{ name: 'ViewBlock', params: { blockHeight: data.block } }"
            class="text-blue-600 hover:text-blue-primary hover:underline text-xs"
            >{{ data.block }}</router-link
          >
        </template>
      </Column>
      <Column
        header="TX FEE"
        v-if="
          selectedGroupType === transactionGroupType.CONFIRMED && wideScreen
        "
        headerStyle="width:110px"
      >
        <template #body="{ data }">
          <div class="text-xs">
            {{ data.fee }}
            <b v-if="data.fee == 0 || data.fee > 0">{{ nativeTokenName }}</b>
          </div>
        </template>
      </Column>
      <Column
        header="Scoped Metadata Key"
        headerStyle="width:110px;text-transform:uppercase"
        v-if="wideScreen"
      >
        <template #body="{ data }">
          <div class="text-xs">{{ data.scopedMetadataKey }}</div>
        </template>
      </Column>
      <Column
        header="Target"
        headerStyle="width:60px;text-transform:uppercase"
        v-if="wideScreen"
      >
        <template #body="{ data }">
          <div
            class="text-xs truncate inline-flex block-all"
            v-if="data.metadataTypeName === 'Account'"
            v-tooltip.bottom="data.targetPublicKey"
          >
            <span class="text-ellipsis overflow-hidden w-40">{{
              data.targetPublicKey
            }}</span
            >...
          </div>
          <div
            class="text-xs uppercase"
            v-else-if="data.metadataTypeName === 'Asset'"
          >
            {{ data.targetId }}
            {{ data.targetIdName ? `(${data.targetIdName})` : "" }}
          </div>
          <div
            class="text-xs uppercase"
            v-else-if="data.metadataTypeName === 'Namespace'"
          >
            {{ data.targetIdName ? data.targetIdName : data.targetId }}
          </div>
        </template>
      </Column>
      <Column
        header="Value"
        v-if="
          selectedGroupType !== transactionGroupType.CONFIRMED && wideScreen
        "
        headerStyle="width:40px"
      >
        <template #body="{ data }">
          <div>
            <img
              src="@/modules/transaction/img/icon-message.svg"
              v-if="data.valueChange"
              v-tooltip.left="
                '<tiptext>' + constructValueDisplay(data) + '</tiptext>'
              "
              class="inline-block"
            />
          </div>
        </template>
      </Column>
      <template #empty> No transaction found </template>
      <template #loading> Fetching transactions </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { Helper } from "@/util/typeHelper";
import { AppState } from "@/state/appState";
import type { ConfirmedMetadataTransaction } from "@/models/transactions/transaction";

defineProps({
  transactions: Array,
  pages: Number,
  selectedGroupType: String,
});
const wideScreen = ref(false);
const screenResizeHandler = () => {
  if (window.innerWidth < 1024) {
    wideScreen.value = false;
  } else {
    wideScreen.value = true;
  }
};
screenResizeHandler();

onUnmounted(() => {
  window.removeEventListener("resize", screenResizeHandler);
});

onMounted(() => {
  window.addEventListener("resize", screenResizeHandler);
});

const transactionGroupType = Helper.getTransactionGroupType();

const nativeTokenName = computed(() => AppState.nativeToken.label);

const constructValueDisplay = (data: ConfirmedMetadataTransaction) => {
  let display =
    "Size:" +
    (data.sizeChanged > 0 ? `+${data.sizeChanged}` : data.sizeChanged);

  if (data.oldValue) {
    display += "<br>Old value:" + " " + data.oldValue;
  }
  if (data.newValue) {
    display += "<br>New value:" + " " + data.oldValue;
  }

  display += "<br>Value changed:" + " " + data.oldValue;
  return display;
};

const convertLocalTime = (dateTimeInJSON: string) => {
  return Helper.convertDisplayDateTimeFormat24(dateTimeInJSON);
};
</script>
