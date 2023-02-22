<template>
  <div>
    <div
      class="xl:grid xl:grid-cols-2 xl:mb-10 md:grid md:grid-cols-2 md:mb-5 sm:mb-5 sm:grid-cols-1 px-4 gap-4"
    >
      <div>
        <div class="text-base font-bold justify-center mb-4">
          The Sirius Explorer
        </div>
        <div class="text-justify text-xs sm:mb-4">
          Blockchain information for XPX including historical prices, the most
          recently mined blocks, the mempool size of unconfirmed transactions,
          and data for the latest transactions.
        </div>
      </div>
      <div>
        <div class="grid grid-cols-2">
          <div>
            <div class="text-xs text-gray-400 xl:ml-24 md:ml-24 sm:ml-2 mt-5">
              Latest Block
            </div>
            <div class="text-base font-bold xl:ml-24 md:ml-24 mb-5 mt-1">
              {{ trx == false ? "Fetching..." : trx.numBlocks }}
            </div>
          </div>

          <div>
            <div class="text-xs text-gray-400 xl:ml-20 md:ml-20 sm:ml-2 mt-5">
              Transactions
            </div>
            <div class="text-base font-bold xl:ml-20 md:ml-20 mb-5 mt-1">
              {{ trx == false ? "Fetching..." : trx.numTransactions }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="xl:grid xl:grid-cols-2 xl:gap-4 md:grid md:grid-rows-1 md:gap-2 sm:grid sm:grid-rows-1"
    >
      <div class="box-border h-auto w-auto" style="width: 540px">
        <LatestBlockDataTable></LatestBlockDataTable>
        <button
          class="content-center w-full h-6 text-xs text-center text-blue-primary rounded-none bg-gray-200"
          @click="showBlockList(trx ? trx.numBlocks : 0)"
        >
          View all blocks
        </button>
      </div>
      <div
        class="box-content h-auto w-auto border-collapse"
        style="width: 540px"
      >
        <LatestTransactionDataTable></LatestTransactionDataTable>
        <button
          class="content-center w-full h-6 text-xs text-center text-blue-primary rounded-none bg-gray-200"
          @click="showTransactionList"
        >
          View all transactions
        </button>
      </div>
      <br />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from "vue";
import LatestBlockDataTable from "@/modules/home/components/LatestBlockDataTable.vue";
import LatestTransactionDataTable from "@/modules/home/components/LatestTransactionDataTable.vue";
import { AppState } from "@/state/appState";
import { useRouter } from "vue-router";
import { HomeUtils } from "@/util/homeUtil";
import type { BlockchainStorageInfo } from "tsjs-xpx-chain-sdk";

const router = useRouter();
const internalInstance = getCurrentInstance();
const emitter = internalInstance?.appContext.config.globalProperties.emitter;
const trx = ref<false | BlockchainStorageInfo>(false);
const getChainInfo = async () => {
  if (!AppState.isReady) {
    setTimeout(getChainInfo, 1000);
    return;
  }
  trx.value = await HomeUtils.getDiagnosticStorage();
  return;
};

const showTransactionList = () => {
  router.push({ name: "ViewTransactionList" });
};

const showBlockList = (blockHeight: number) => {
  router.push({ name: "ViewBlockList", params: { blockHeight: blockHeight } });
};

emitter.on("CHANGE_NETWORK", (payload: boolean) => {
  if (payload) {
    getChainInfo();
  }
});

getChainInfo();
</script>
