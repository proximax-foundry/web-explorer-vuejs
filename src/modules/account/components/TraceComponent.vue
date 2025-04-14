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
import { Address, BalanceTransferReceipt, MosaicId, NamespaceId, ReceiptType, TransactionType, TransferTransaction } from "tsjs-xpx-chain-sdk";

const props = defineProps({
  accountParam: {
    type: String,
    required: true,
  },
});

interface TraceTransaction {
    hash: string | undefined,
    type: string,
    block: number,
    sender: string | null,
    recipient: string | null,
    amount: { fee?: number, xpx?: number},
    getXpxOffer?: boolean,
  }

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

const traceTransactions = ref<TraceTransaction[]>([]);
let transactionGroupType = Helper.getTransactionGroupType();
let blockDescOrderSortingField = Helper.createTransactionFieldOrder(
  Helper.getTransactionSortField().BLOCK,
  Helper.getQueryParamOrder_v2().DESC
);

const  formatTypeWord = (txnType: string) => {
    return txnType.replace(/_/g, ' ').replace(/\b\w+\b/g, type => {
      return type.charAt(0) + type.slice(1).toLowerCase();
    });
  }

const storeTxnDetails = (hash: string | undefined, type: number, blockHeight: number, signer: string  | null, recipient: string | null, fee: number | null, xpx: number | null) => {
  traceTransactions.value.push({
    hash: hash,
    type: formatTypeWord(TransactionType[type]),
    block: blockHeight,
    sender: signer,
    recipient: recipient,
    amount: { fee:TransactionUtils.convertToExactNativeAmount(fee!), xpx: TransactionUtils.convertToExactNativeAmount(xpx!)},
  })
}

const getBlockReceiptDetail = async (txn: any, currentAddress: string, fee: number | null) => {
  const blockReceipts = await AppState.chainAPI!.blockAPI.getBlockReceipts(txn.transactionInfo.height.compact());
  const {transactionStatements,} = blockReceipts;
  for(const statement of transactionStatements){
    for(const receipt of statement.receipts){
      if (receipt instanceof BalanceTransferReceipt) {
        const { type, version, size, ...val } = receipt;
        if((txn.type === TransactionType.REGISTER_NAMESPACE && type === ReceiptType.Namespace_Rental_Fee) || (txn.type === TransactionType.MOSAIC_DEFINITION && type === ReceiptType.Mosaic_Rental_Fee)){
          if(val.mosaicId.toHex() === nativeToken.value.assetId){
            if(val.sender.address.plain() === currentAddress){
              if(val.recipient instanceof Address){
                storeTxnDetails(txn.transactionInfo.hash? txn.transactionInfo.hash : txn.transactionInfo.aggregateHash, txn.type, txn.transactionInfo.height.compact(), txn.signer ? txn.signer.address.address : null,val.recipient? val.recipient.plain() : null, fee, val.amount.compact());
              }
              else{
                storeTxnDetails(txn.transactionInfo.hash? txn.transactionInfo.hash : txn.transactionInfo.aggregateHash, txn.type, txn.transactionInfo.height.compact(), txn.signer ? txn.signer.address.address : null,txn.recipient? txn.recipient.address : null, fee, val.amount.compact());
              }
            }
          }
        }
      }
    }
  }
}

const getTransactionDetails = async (transactions: any[]) => {
  if(!AppState.chainAPI){
    return;
  }
  traceTransactions.value = []
  const currentAddress = Helper.createAddress(props.accountParam).plain();
  for(const transaction of transactions){
    let txn = transaction as any
    let txnBytes: number
    if(!txn.transactionInfo.size){
      let convertTxn = txn as TransferTransaction
      txnBytes = convertTxn.size
    }
    else{
      txnBytes = txn.transactionInfo.size
    }
    const blockInfo = await AppState.chainAPI.blockAPI.getBlockByHeight(
      txn.transactionInfo.height.compact()
    );
    const txnSize = txnBytes * blockInfo.feeMultiplier;
    if(txn.type === TransactionType.AGGREGATE_BONDED_V1 || txn.type === TransactionType.AGGREGATE_COMPLETE_V1){
      if(txn.signer.address.address === currentAddress){
        storeTxnDetails(txn.transactionInfo.hash? txn.transactionInfo.hash : txn.transactionInfo.aggregateHash, txn.type, txn.transactionInfo.height.compact(), txn.signer ? txn.signer.address.address : null,txn.recipient? txn.recipient.address : null, txnSize, null);
      }
      let getTxn = await TransactionUtils.getTransaction(txn.transactionInfo.hash? txn.transactionInfo.hash : txn.transactionInfo.aggregateHash);
      const filterTransaction = getTxn.txn.innerTransactions.filter((txn: { type: number; }) => txn.type === TransactionType.TRANSFER || txn.type === TransactionType.REGISTER_NAMESPACE || txn.type === TransactionType.MOSAIC_DEFINITION);
      if(getTxn.isFound){
        for(const txn of filterTransaction){
          if(txn.signer ? txn.signer.address.address === currentAddress : false || txn.recipient? txn.recipient.address === currentAddress : false){
            if(txn.type === TransactionType.TRANSFER){
              for(const mosaic of txn.mosaics){
                if(mosaic.id.toHex() === nativeToken.value.assetId || mosaic.id.toHex() === new NamespaceId(nativeToken.value.fullNamespace).toHex()){
                  storeTxnDetails(txn.transactionInfo.hash? txn.transactionInfo.hash : txn.transactionInfo.aggregateHash, txn.type, txn.transactionInfo.height.compact(), txn.signer ? txn.signer.address.address : null,txn.recipient? txn.recipient.address : null, null, mosaic.amount.compact());
                }
              }
            }
            else if(txn.type === TransactionType.REGISTER_NAMESPACE || txn.type === TransactionType.MOSAIC_DEFINITION){
              await getBlockReceiptDetail(txn, currentAddress, null);
            }
            else{
              storeTxnDetails(txn.transactionInfo.hash? txn.transactionInfo.hash : txn.transactionInfo.aggregateHash, txn.type, txn.transactionInfo.height.compact(), txn.signer ? txn.signer.address.address : null,txn.recipient? txn.recipient.address : null, txnSize, null);
            }
          }
        }
      }
    }
    else if(txn.type === TransactionType.TRANSFER){
      for(const mosaic of txn.mosaics){
        if(mosaic.id.toHex() === nativeToken.value.assetId || mosaic.id.toHex() === new NamespaceId(nativeToken.value.fullNamespace).toHex()){
          storeTxnDetails(txn.transactionInfo.hash? txn.transactionInfo.hash : txn.transactionInfo.aggregateHash, txn.type, txn.transactionInfo.height.compact(), txn.signer ? txn.signer.address.address : null,txn.recipient? txn.recipient.address : null, txnSize, mosaic.amount.compact());
        }
      }
    }
    else if(txn.type === TransactionType.REGISTER_NAMESPACE || txn.type === TransactionType.MOSAIC_DEFINITION){
      await getBlockReceiptDetail(txn, currentAddress, txnSize);
    }
    else{
      storeTxnDetails(txn.transactionInfo.hash? txn.transactionInfo.hash : txn.transactionInfo.aggregateHash, txn.type, txn.transactionInfo.height.compact(), txn.signer ? txn.signer.address.address : null,txn.recipient? txn.recipient.address : null, txnSize, null);
    }
  }
  traceTransactions.value.sort((a,b) => b.block - a.block)
}

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
    getTransactionDetails(transactionSearchResult)
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