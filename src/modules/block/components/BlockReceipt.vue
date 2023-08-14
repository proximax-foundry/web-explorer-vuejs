<template>
  <div
    class="text-gray-500 mb-5 text-sm font-bold"
    v-if="Object.entries(txnStatements).length"
  >
    Block Receipts
  </div>
  <div class="flex gap-4 flex-wrap">
    <div
      v-for="(value, index) in Object.entries(txnStatements)"
      :key="index"
      class="mb-6"
    >
      <div
        @click="tabIndex = index"
        class="cursor-pointer"
        :class="
          tabIndex == index
            ? 'border-b-2 w-fit border-blue-primary'
            : 'hover-underline-animation '
        "
      >
        {{ value[0] }}
      </div>
    </div>
  </div>
  <div class="filter shadow-xl border border-gray-50 p-5 mb-15">
    <AssetResolutionDt v-if="selectedTabName== receiptClass.assetResolution" :data="selectedTabData as assetResolution[]" :pages="pages"/>
    <AddressResolutionDt v-else-if="selectedTabName== receiptClass.addressResolution " :data="selectedTabData as addressResolution[]" :pages="pages" />
    <ArtifactExpiryDt   v-else-if="selectedTabName==receiptClass.artifactExpiry "  :data="selectedTabData as artifactExpiry[]" :pages="pages"/>
    <BalanceChangeDt   v-else-if="selectedTabName==receiptClass.balanceChange"  :data="selectedTabData as balanceChange[]" :pages="pages"/>
    <BalanceTransferDt v-else-if="selectedTabName==receiptClass.balanceTransfer"  :data="selectedTabData as balanceTransfer[]" :pages="pages" />
    <SdaOfferCreationDt  v-else-if="selectedTabName==receiptClass.sdaOfferCreation"  :data="selectedTabData as sdaOfferCreation[]"  :pages="pages" />
    <SdaOfferRemovalDt  v-else-if="selectedTabName==receiptClass.sdaOfferRemoval"  :data="selectedTabData as sdaOfferRemoval[]"  :pages="pages"/>
    <SdaofferExchangeDt  v-else-if="selectedTabName==receiptClass.sdaOfferExchange"  :data="selectedTabData as sdaOfferExchange[]"  :pages="pages" />
  <div class="sm:flex sm:justify-between my-5 mb-15" v-if="totalPages > 1">
    <div class="text-xs text-gray-700 mb-3 sm:mb-0 text-center sm:text-left">
      Show
      <select
        v-model="pages"
        class="border border-gray-300 rounded-md p-1"
        @change="changeRows"
      >
        <option value="20">20</option>
        <option value="30">30</option>
        <option value="40">40</option>
        <option value="50">50</option>
      </select>
      Records
    </div>
    <div class="sm:flex sm:items-center text-center sm:text-right">
      <div
        v-if="enableFirstPage"
        @click="naviFirst"
        class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs mx-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all"
      >
        First
      </div>
      <div
        v-else
        class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs mx-1"
      >
        First
      </div>
      <div
        v-if="enablePreviousPage"
        @click="naviPrevious"
        class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs mx-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all"
      >
        Previous
      </div>
      <div
        v-else
        class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs mx-1"
      >
        Previous
      </div>
      <div
        class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs"
      >
        Page {{ currentPage }} of {{ totalPages }}
      </div>
      <div
        v-if="enableNextPage"
        @click="naviNext"
        class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs mx-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all"
      >
        Next
      </div>
      <div
        v-else
        class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs mx-1"
      >
        Next
      </div>
      <div
        v-if="enableLastPage"
        @click="naviLast"
        class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs ml-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all"
      >
        Last
      </div>
      <div
        v-else
        class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs mx-1"
      >
        Last
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import AddressResolutionDt from "./AddressResolutionDt.vue";
import type { addressResolution } from "./AddressResolutionDt.vue";
import  ArtifactExpiryDt from "./ArtifactExpiryDt.vue";
import type { artifactExpiry } from "./ArtifactExpiryDt.vue";
import BalanceChangeDt from "./BalanceChangeDt.vue";
import type { balanceChange } from "./BalanceChangeDt.vue";
import BalanceTransferDt from "./BalanceTransfer.Dt.vue";
import type { balanceTransfer } from "./BalanceTransfer.Dt.vue";
import AssetResolutionDt  from "./AssetResolutionDt.vue";
import type { assetResolution } from "./AssetResolutionDt.vue";
import  SdaOfferCreationDt from "./SdaOfferCreationDt.vue";
import type { sdaOfferCreation } from "./SdaOfferCreationDt.vue";
import  SdaOfferRemovalDt from "./SdaOfferRemovalDt.vue";
import  type{sdaOfferRemoval} from "./SdaOfferRemovalDt.vue";
import SdaofferExchangeDt from "./SdaofferExchangeDt.vue";
import type {sdaOfferExchange} from "./SdaofferExchangeDt.vue";


interface blockReceipt {
  class?: string;
  type?: string;
  namespaceId?: string;
  mosaicId?: string;
  account?: string;
  amount?: number;
  recipient?: string;
  sender?: string;
  artifactId?: string;
  mosaicIdGive?: string;
  mosaicIdGet?: string;
  mosaicIdGiveAmount?: number;
  mosaicIdGetAmount?: number;
  mosaicAmountGiveReturned?: number;
  address?: string
}

enum receiptClass {
  addressResolution = "Address Resolution Statement",
  assetResolution = "Asset Resolution Statement",
  balanceTransfer = "Balance Transfer",
  balanceChange = "Balance Change",
  artifactExpiry = "Artifact Expiry",
  sdaOfferCreation = "SDA Offer Creation",
  sdaOfferRemoval = "SDA Offer Removal",
  sdaOfferExchange = "SDA Offer Exchange"
}

const { txnStatements } = defineProps<{
  txnStatements: Record<string, blockReceipt[]>;
}>();

const selectedTabName = computed(
  () => Object.entries(txnStatements)[tabIndex.value][0]
);

const selectedTabData = computed(
  () => Object.entries(txnStatements)[tabIndex.value][1]
);

const tabIndex = ref(0);

const pages = ref(20);
const currentPage = ref(1);
const totalPages = ref(0);

const enableFirstPage = computed(() => {
  return currentPage.value > 1;
});

const enablePreviousPage = computed(() => {
  return currentPage.value > 1;
});

const enableNextPage = computed(() => {
  return totalPages.value - currentPage.value > 0;
});

const enableLastPage = computed(() => {
  return currentPage.value < totalPages.value;
});

const naviFirst = () => {
  currentPage.value = 1;
};

const naviPrevious = () => {
  --currentPage.value;
};

const naviNext = () => {
  ++currentPage.value;
};

const naviLast = () => {
  currentPage.value = totalPages.value;
};

const changeRows = () => {
  currentPage.value = 1;
};
</script>

<style>
.hover-underline-animation {
  position: relative;
}

.hover-underline-animation:after {
  content: "";
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: #007cff;
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
}

.hover-underline-animation:hover:after {
  transform: scaleX(1);
  transform-origin: bottom left;
}
</style>
