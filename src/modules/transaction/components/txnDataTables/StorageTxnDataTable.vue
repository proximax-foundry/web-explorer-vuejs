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
      :globalFilterFields="['recipient', 'sender', 'signerAddress', 'type']"
    >

      <!-- Below is for mobile screen -->
      <Column style="width: 200px" v-if="!wideScreen">
        <template #body="{ data }">
          <div>
            <div
              class="uppercase text-xs text-gray-300 font-bold mb-1 break-all"
            >
              TX HASH
            </div>
            <router-link
              class="uppercase font-bold text-xs block text-blue-600 hover:text-blue-primary hover:underline"
              :to="{ name: 'ViewTransaction', params: { hash: data.hash } }"
            >
              <span
                class="text-xs inline-flex text-ellipsis overflow-hidden hover:underline hover:text-blue-primary w-40"
                v-tooltip.right="data.hash"
                >{{ data.hash }}</span
              >...
            </router-link>
          </div>
          <div>
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
              Type
            </div>
            <div class="flex items-center">
              <div class="uppercase font-bold text-xs mr-2">
                {{ data.typeName }}
              </div>
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
              {{ Helper.convertDisplayDateTimeFormat24(data.timestamp) }}
            </div>
          </div>
          <div>
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
              From
            </div>
            <div class="uppercase font-bold text-xs">
              <span
                v-if="data.signerAddress === '' || data.signerAddress === null"
                >-</span
              >
              <router-link
                :to="{
                  name: 'ViewAccount',
                  params: { accountParam: data.signerAddress },
                }"
                v-else
                v-tooltip.bottom="
                  Helper.createAddress(data.signerAddress).pretty()
                "
                class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-40"
                ><span class="text-ellipsis overflow-hidden"
                  >{{
                    Helper.createAddress(data.signerAddress).pretty()
                  }} </span
                >...</router-link
              >
            </div>
          </div>
        </template>
      </Column>

<!-- Below is for normal screen -->

      <Column
        field="hash"
        header="TX HASH"
        headerStyle="width:90px"
        v-if="wideScreen"
      >
        <template #body="{ data }">
          <router-link
            :to="{ name: 'ViewTransaction', params: { hash: data.hash } }"
            class="text-xs text-blue-600 hover:text-blue-primary inline-flex hover:underline"
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
        v-if="wideScreen"
        header="TIMESTAMP"
        headerStyle="width:200px"
      >
        <template #body="{ data }">
          <span class="text-xs">{{
            Helper.convertDisplayDateTimeFormat24(data.timestamp)
          }}</span>
        </template>
      </Column>
      <Column
        field="type"
        header="TYPE"
        headerStyle="width:120px"
        v-if="wideScreen"
      >
        <template #body="{ data }">
          <span class="text-xs">{{ data.typeName }}</span>
        </template>
      </Column>
      <Column
        field="block"
        v-if="wideScreen"
        header="BLOCK"
        headerStyle="width:60px"
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
        field="signer"
        header="FROM"
        headerStyle="width:120px"
        v-if="wideScreen"
      >
        <template #body="{ data }">
          <span
            v-if="data.signerAddress === '' || data.signerAddress === null"
          ></span>
          <router-link
            :to="{
              name: 'ViewAccount',
              params: { accountParam: data.signerAddress },
            }"
            v-else
            v-tooltip.bottom="Helper.createAddress(data.signerAddress).pretty()"
            class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-32"
            ><span class="text-ellipsis overflow-hidden">
              {{ Helper.createAddress(data.signerAddress).pretty() }}</span
            >...</router-link
          >
        </template>
      </Column>
      <Column header="TX FEE" v-if="wideScreen" headerStyle="width:110px">
        <template #body="{ data }">
          <div class="text-xs">
            {{ data.fee }}
            <b v-if="data.fee == 0 || data.fee > 0">{{ nativeTokenName }}</b>
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
import type { SDA } from "@/models/transactions/sda";
import { TransactionType } from "tsjs-xpx-chain-sdk";

defineProps({
  transactions: Array,
  pages: Number,
});

const transferTxnType = TransactionType.TRANSFER;
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

const displaySDAs = (sdas: SDA[]) => {
  let sda_rows: { name: string; amount: number }[] = [];
  if (sdas.length > 0) {
    for (const sda of sdas) {
      if (sda.currentAlias && sda.currentAlias.length) {
        if (sda.currentAlias[0].name) {
          sda_rows.push({ amount: sda.amount, name: sda.currentAlias[0].name });
        }
      } else {
        sda_rows.push({ amount: sda.amount, name: sda.id });
      }
    }
    return sda_rows;
  }
};

const checkOtherAsset = (assets: SDA[]) => {
  if (assets) {
    if (assets.length > 0) {
      return true;
    }
  }
  return false;
};

const currencyDivisibility = computed(() => {
  return AppState.nativeToken.divisibility;
});
</script>
