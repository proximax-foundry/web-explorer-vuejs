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
          <div>
            <div class="text-xs text-gray-300 font-bold mb-1 mt-5">Block</div>
            <div class="flex items-center">
              <router-link
                :to="{ name: 'ViewBlock', params: { blockHeight: data.block } }"
                class="text-blue-600 hover:text-blue-primary hover:underline text-xs"
                >{{ data.block }}</router-link
              >
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
              Offer
            </div>
            <div v-if="data.isTakingOffer">
              <span
                v-bind:key="index"
                v-for="(exchangeOffer, index) in data.exchangeOffers"
              >
                <span
                  class="inline-block bg-green-200 font-bold text-green-700 text-xs rounded py-2 px-1 my-1"
                  v-if="exchangeOffer.type === 'Sell'"
                >
                  {{ displayExchangeSDA(exchangeOffer) }}
                </span>
                <span
                  class="inline-block bg-red-200 font-bold text-red-700 text-xs rounded py-2 px-1 my-1"
                  v-else
                >
                  {{ displayExchangeSDA(exchangeOffer) }}
                </span>
              </span>
            </div>
            <div v-else>
              <span
                v-bind:key="index"
                v-for="(exchangeOffer, index) in data.exchangeOffers"
              >
                <span
                  class="inline-block bg-green-200 font-bold text-green-700 text-xs rounded py-2 px-1 my-1"
                  v-if="exchangeOffer.type === 'Buy'"
                >
                  {{ displayExchangeSDA(exchangeOffer) }}
                  <span v-if="exchangeOffer.duration"
                    >Duration: {{ exchangeOffer.duration }}</span
                  >
                </span>
                <span
                  class="inline-block bg-red-200 font-bold text-red-700 text-xs rounded py-2 px-1 my-1"
                  v-else
                >
                  {{ displayExchangeSDA(exchangeOffer) }}
                </span>
              </span>
            </div>
          </div>
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
        headerStyle="width:110px;text-transform:uppercase"
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
          <span class="text-xs">{{ data.typeName }}</span>
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
        header="Offer"
        headerStyle="width:40px;text-transform:uppercase"
        v-if="wideScreen"
      >
        <template #body="{ data }">
          <div v-if="data.isTakingOffer">
            <span
              v-bind:key="index"
              v-for="(exchangeOffer, index) in data.exchangeOffers"
            >
              <span
                class="inline-block bg-green-200 font-bold text-green-700 text-xs rounded py-2 px-1 my-1 mx-1"
                v-if="exchangeOffer.type === 'Sell'"
              >
                {{ displayExchangeSDA(exchangeOffer) }}
              </span>
              <span
                class="inline-block bg-red-200 font-bold text-red-700 text-xs rounded py-2 px-1 my-1 mx-1"
                v-else
              >
                {{ displayExchangeSDA(exchangeOffer) }}
              </span>
            </span>
          </div>
          <div v-else>
            <span
              v-bind:key="index"
              v-for="(exchangeOffer, index) in data.exchangeOffers"
            >
              <span
                class="inline-block bg-green-200 font-bold text-green-700 text-xs rounded py-2 px-1 my-1 mx-1"
                v-if="exchangeOffer.type === 'Buy'"
              >
                {{ displayExchangeSDA(exchangeOffer) }}
                <span v-if="exchangeOffer.duration"
                  >Duration: {{ exchangeOffer.duration }}</span
                >
              </span>
              <span
                class="inline-block bg-red-200 font-bold text-red-700 text-xs rounded py-2 px-1 my-1 mx-1"
                v-else
              >
                {{ displayExchangeSDA(exchangeOffer) }}
              </span>
            </span>
          </div>
        </template>
      </Column>
      <template #empty> No transaction found </template>
      <template #loading> Fetching transactions </template>
    </DataTable>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { Helper } from "@/util/typeHelper";
import type { TxnExchangeOffer } from "@/models/transactions/exchangeOffer";
import { AppState } from "@/state/appState";

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

const convertLocalTime = (dateTimeInJSON: string) => {
  return Helper.convertDisplayDateTimeFormat24(dateTimeInJSON);
};

const displayExchangeSDA = (exchangeOffer: TxnExchangeOffer) => {
  if (!exchangeOffer.amount || !exchangeOffer.cost) {
    return "";
  }
  let asset_div =
    exchangeOffer.amount > 0
      ? Helper.convertToCurrency(exchangeOffer.amount, 0) + " "
      : "";
  asset_div += exchangeOffer.assetNamespace
    ? exchangeOffer.assetNamespace
    : exchangeOffer.assetId;
  asset_div +=
    exchangeOffer.cost > 0
      ? " - " +
        Helper.convertToCurrency(exchangeOffer.cost, 0) +
        " " +
        nativeTokenName.value
      : "";

  return asset_div;
};
</script>
