<template>
    <div v-if="isFetching">
      <div class="flex justify-center items-center border-gray-400 mt-15">
        <div
          class="animate-spin rounded-full h-5 w-5 border-b-2 border-navy-primary mr-2"
        ></div>
        <span class="text-tsm">Fetching transactions</span>
      </div>
    </div>
    <div v-else class="mb-15">
        <TraceTxnDataTable
          :accountAddress="strAddress"
          :transactions="traceTransactions"
          :selectedGroupType="transactionGroupType.CONFIRMED"
        />
      <div class="mb-15">
        <button
          v-if="height !== 1"
          class="text-sm text-blue-primary py-2 bg-gray-200 w-full"
          @click="loadTraceTransactionsXpx(100000)"
        >
          Load More
        </button>
      </div>
    </div>
  </template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import TraceTxnDataTable from "@/modules/transaction/components/txnDataTables/TraceTxnDataTable.vue";
import { AppState } from "@/state/appState";
import { Helper } from "@/util/typeHelper";
import { AccountUtils } from "@/util/accountUtil";
import { TransactionUtils } from "@/util/transactionUtils";
import { MosaicId, NamespaceId } from "tsjs-xpx-chain-sdk";

const props = defineProps({
  accountParam: {
    type: String,
    required: true,
  },
});

const nativeToken = computed(() => AppState.nativeToken);
const isFetching = ref(true);
const wideScreen = ref(false);
const strAddress = ref("");
const height = ref(1);
const totalTrace = ref(100000);
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

const traceTransactions = ref<any[]>([]);
let transactionGroupType = Helper.getTransactionGroupType();
let blockDescOrderSortingField = Helper.createTransactionFieldOrder(
  Helper.getTransactionSortField().BLOCK,
  Helper.getQueryParamOrder_v2().DESC
);

let loadTraceTransactionsXpx = async (loadMore: number) => {
  isFetching.value = true;
  if (!AppState.isReady) {
    setTimeout(loadTraceTransactionsXpx, 1000);
    return;
  }
  if (!AppState.chainAPI) {
    return;
  }

  let txnQueryParams = Helper.createTransactionQueryParams();

  let isPublicKey = props.accountParam.length === 64;
  if (props.accountParam !== "" && !isPublicKey) {
    const account = await AccountUtils.getAccountFromAddress(
      props.accountParam
    );
    if (account) {
      strAddress.value = Helper.createAddress(props.accountParam).pretty();
      txnQueryParams.publicKey = account.publicKey;
    }
  } else {
    const publicKey = props.accountParam;
    const address = AccountUtils.getAddressFromPublicKey(publicKey);
    if (address) {
      strAddress.value = Helper.createAddress(address).pretty();
      txnQueryParams.publicKey = publicKey;
    }
  }

  const blockHeight = await AppState.chainAPI.chainAPI.getBlockchainHeight();
  totalTrace.value = totalTrace.value + loadMore
  height.value = blockHeight - totalTrace.value;
  if (height.value <= 0) {
    height.value = 1;
  }
  txnQueryParams.fromHeight = height.value;

  txnQueryParams.updateFieldOrder(blockDescOrderSortingField);
  let transactionSearchResultMixed = await TransactionUtils.searchTxns(
    transactionGroupType.CONFIRMED,
    txnQueryParams
  );
  transactionSearchResultMixed.transactions = transactionSearchResultMixed.transactions.filter((txn) => txn.type !== 16724)
  txnQueryParams.transferMosaicIdFilters = Helper.createTransactionMosaicSearchFilters(new MosaicId(nativeToken.value.assetId))
  let transactionSearchResultFilterByAssetId = await TransactionUtils.searchTxns(
    transactionGroupType.CONFIRMED,
    txnQueryParams
  );

  txnQueryParams.transferMosaicIdFilters = Helper.createTransactionMosaicSearchFilters(new NamespaceId(nativeToken.value.fullNamespace))
  let transactionSearchResultFilterByNamespaceId = await TransactionUtils.searchTxns(
    transactionGroupType.CONFIRMED,
    txnQueryParams
  );
  let transactionSearchResult = transactionSearchResultMixed.transactions.concat(transactionSearchResultFilterByAssetId.transactions,transactionSearchResultFilterByNamespaceId.transactions);
  if (transactionSearchResult.length > 0) {
    traceTransactions.value = transactionSearchResult
  } else {
    traceTransactions.value = [];
  }
  isFetching.value = false;
};

if (AppState.isReady) {
    loadTraceTransactionsXpx(100000);
} else {
  let readyWatcher = watch(AppState, (value) => {
    if (value.isReady) {
        loadTraceTransactionsXpx(100000);
        readyWatcher();
    }
  });
}
</script>