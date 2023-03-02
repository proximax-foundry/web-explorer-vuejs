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
                class="text-xs truncate inline-flex hover:underline hover:text-blue-primary text-ellipsis overflow-hidden w-44"
                v-tooltip.right="data.hash"
                >{{ data.hash }}</span
              >...</router-link
            >
          </div>
          <div>
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
              Type
            </div>
            <div class="flex items-center">
              <div class="uppercase font-bold text-xs mr-2">
                {{ data.type }}
              </div>
            </div>
          </div>
          <div>
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
              Account
            </div>
            <div class="flex items-center">
              <router-link
                :to="{
                  name: 'ViewAccount',
                  params: { accountParam: data.signerAddress },
                }"
                v-tooltip.right="
                  Helper.createAddress(data.signerAddress).pretty()
                "
                class="uppercase font-bold truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-44"
                ><span class="text-ellipsis overflow-hidden">{{
                  Helper.createAddress(data.signerAddress).pretty()
                }}</span
                >...</router-link
              >
            </div>
          </div>
        </template>
      </Column>
      <Column style="width: 200px" v-if="!wideScreen">
        <template #body="{ data }">
          <div>
            <div class="uppercase text-xs text-gray-300 font-bold mb-1">
              Timestamp
            </div>
            <div class="uppercase font-bold text-xs">
              {{ convertLocalTime(data.timestamp) }}
            </div>
          </div>
          <div>
            <div class="uppercase text-xs text-gray-300 font-bold mb-1">
              Approval and Removal
            </div>
            <div class="flex items-center">
              <div class="text-xs">
                {{ data.oldApprovalNumber ? data.oldApprovalNumber + " " : ""
                }}{{
                  data.approvalDelta > 0
                    ? `+${data.approvalDelta}`
                    : data.approvalDelta
                }}
              </div>
              <div class="text-xs ml-5">
                {{ data.oldRemovalNumber ? data.oldRemovalNumber + " " : ""
                }}{{
                  data.removalDelta > 0
                    ? `+${data.removalDelta}`
                    : data.removalDelta
                }}
              </div>
            </div>
          </div>
          <div>
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
              Info
            </div>
            <div class="inline-grid grid-cols-1 gap-2 break-all">
              <div
                v-bind:key="cosigner"
                v-tooltip.bottom="'Adding account:<br><br>' + cosigner"
                v-for="cosigner in data.addedCosigner"
                class="truncate inline-flex bg-green-200 font-bold text-green-700 text-xs rounded py-1 px-2 my-1 mr-1"
              >
                <span class="text-ellipsis overflow-hidden w-44">{{
                  cosigner.toString()
                }}</span
                >...
              </div>
              <div
                v-bind:key="cosigner"
                v-tooltip.bottom="'Removing account:<br><br>' + cosigner"
                v-for="cosigner in data.removedCosigner"
                class="truncate inline-block bg-red-200 font-bold text-red-700 text-xs py-1 px-2 my-1 mr-1"
              >
                <span class="text-ellipsis overflow-hidden w-44">{{
                  cosigner.toString()
                }}</span
                >...
              </div>
              <span
                v-if="
                  data.addedCosigner.length == 0 &&
                  data.removedCosigner.length == 0
                "
                >-</span
              >
            </div>
          </div>
        </template>
      </Column>
      <Column
        field="hash"
        header="TX Hash"
        headerStyle="width:70px;text-transform:uppercase"
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
        headerStyle="width:110px;text-transform:uppercase"
        v-if="wideScreen"
      >
        <template #body="{ data }">
          <span class="text-xs">{{ convertLocalTime(data.timestamp) }}</span>
        </template>
      </Column>
      <Column
        field="typeName"
        header="Type"
        headerStyle="width:140px;text-transform:uppercase"
        v-if="wideScreen"
      >
        <template #body="{ data }">
          <span class="text-xs">{{ data.type }}</span>
        </template>
      </Column>
      <Column
        field="block"
        header="Block"
        v-if="wideScreen"
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
        v-if="wideScreen"
        headerStyle="width:110px;text-transform:uppercase"
      >
        <template #body="{ data }">
          <div class="text-xs">
            {{ data.fee }}
            <b v-if="data.fee == 0 || data.fee > 0">{{ nativeTokenName }}</b>
          </div>
        </template>
      </Column>
      <Column
        header="Account"
        headerStyle="width:110px;text-transform:uppercase"
        v-if="wideScreen"
      >
        <template #body="{ data }">
          <router-link
            :to="{
              name: 'ViewAccount',
              params: { accountParam: data.signerAddress },
            }"
            v-tooltip.right="Helper.createAddress(data.signerAddress).pretty()"
            class="truncate inline-flex text-xs break-all text-blue-600 hover:text-blue-primary hover:underline w-44"
            ><span class="text-ellipsis overflow-hidden">{{
              Helper.createAddress(data.signerAddress).pretty()
            }}</span
            >...</router-link
          >
        </template>
      </Column>
      <Column
        header="Approval Delta"
        headerStyle="width:60px;text-transform:uppercase"
        v-if="wideScreen"
      >
        <template #body="{ data }">
          <span class="text-xs">
            {{ data.oldApprovalNumber ? data.oldApprovalNumber + " " : ""
            }}{{
              data.approvalDelta > 0
                ? `+${data.approvalDelta}`
                : data.approvalDelta
            }}
          </span>
        </template>
      </Column>
      <Column
        header="Removal Delta"
        headerStyle="width:60px;text-transform:uppercase"
        v-if="wideScreen"
      >
        <template #body="{ data }">
          <span class="text-xs">
            {{ data.oldRemovalNumber ? data.oldRemovalNumber + " " : ""
            }}{{
              data.removalDelta > 0
                ? `+${data.removalDelta}`
                : data.removalDelta
            }}
          </span>
        </template>
      </Column>
      <Column
        header="Info"
        headerStyle="width:40px;text-transform:uppercase"
        v-if="wideScreen"
      >
        <template #body="{ data }">
          <div
            v-bind:key="cosigner"
            v-tooltip.bottom="'Adding account:<br><br>' + cosigner"
            v-for="cosigner in data.addedCosigner"
            class="truncate inline-flex bg-green-200 font-bold text-green-700 text-xs rounded py-1 px-2 my-1 mx-1"
          >
            <span class="text-ellipsis overflow-hidden w-48">
              {{ cosigner.toString() }}</span
            >...
          </div>
          <div
            v-bind:key="cosigner"
            v-tooltip.bottom="'Removing account:<br><br>' + cosigner"
            v-for="cosigner in data.removedCosigner"
            class="truncate inline-flex bg-red-200 font-bold text-red-700 text-xs rounded py-1 px-2 my-1 mx-1"
          >
            <span class="text-ellipsis overflow-hidden w-48">{{
              cosigner.toString()
            }}</span
            >...
          </div>
          <!-- <span v-if="data.addedCosigner.length ==0  && data.removedCosigner.length ==0">-</span> -->
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

defineProps({
  transactions: Array,
  pages: Number,
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

const nativeTokenName = computed(() => AppState.nativeToken.label);

const convertLocalTime = (dateTimeInJSON: string) => {
  return Helper.convertDisplayDateTimeFormat24(dateTimeInJSON);
};
</script>
