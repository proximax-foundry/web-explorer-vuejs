<template>
  <div>
    <p class="text-gray-500 mb-5 text-sm font-bold">Transaction Details</p>
    <div v-if="!isFetching">
      <div
        class="filter shadow-xl border border-gray-50 p-5 mb-15"
        v-if="formattedTransaction.isFound === true" >
        <div class="flex items-center mb-4 border-b border-gray-100 relative">
          <div
            class="w-32 font-bold text-xs text-center p-2 relative"
            :class="`${currentPage != 'detail' ? 'cursor-pointer' : ''}`"
            @click="currentPage = 'detail'" >
            Overview
            <div
              v-if="currentPage == 'detail'"
              class="absolute w-full border-b border-yellow-500 transition-all duration-200"
              style="bottom: -1px" >
            </div>
          </div>
          <div
            class="w-32 font-bold text-xs text-center p-2 relative"
            :class="`${currentPage != 'inner' ? 'cursor-pointer' : ''}`"
            @click="currentPage = 'inner'"
            v-if="innerTransaction">
            Inner Txns
            <div
              v-if="currentPage == 'inner'"
              class="absolute w-full border-b border-yellow-500 transition-all duration-200"
              style="bottom: -1px">
            </div>
          </div>
        </div>
        <TxnDetailComponent
          v-if="currentPage == 'detail'"
          :txnDetail="formattedTransaction"
          :txnType="txnType"
        />
        <InnerTxnComponent
          v-else
          :innerTxn="innerTransaction"
          :txn="txn"
          :txnGroup="formattedTransaction.group"
        />
      </div>
      <div
        v-else-if="formattedTransaction.isFound === 'error'"
        class="p-3 bg-yellow-100 text-yellow-700">
        Transaction not found in {{ networkName }}
      </div>
      <div v-else class="filter shadow-xl border border-gray-50 p-5 mb-15">
        <TxnFailedComponent :hash="hash" :status="failedStatus" />
      </div>
    </div>
    <div v-if="isFetching">
      <div class="flex justify-center items-center border-gray-400 mt-10">
        <div
          class="animate-spin rounded-full h-5 w-5 border-b-2 border-navy-primary mr-2"
        ></div>
        <span class="text-tsm">Fetching Transaction Details</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, ref } from "vue";
import { networkState } from "@/state/networkState";
import TxnDetailComponent from "@/modules/transaction/components/TxnDetailComponent.vue";
import InnerTxnComponent from "@/modules/transaction/components/InnerTxnComponent.vue";
import TxnFailedComponent from "@/modules/transaction/components/TxnFailedComponent.vue";
import { AppState } from "@/state/appState";
import { Helper } from "@/util/typeHelper";
import { TransactionUtils } from "@/util/transactionUtils";

const props = defineProps({
  hash: String,
});
const internalInstance = getCurrentInstance();
const emitter = internalInstance?.appContext.config.globalProperties.emitter;
const currentPage = ref("detail");
const txnType = ref(0);
const isFetching = ref(true);
const isTxnFailed = ref(false);
const failedStatus = ref("");
("");
const txn = ref({});
const formattedTransaction = ref<any>({});
const innerTransaction = ref({});

const loadTxn = async () => {
  if (!AppState.isReady) {
    setTimeout(loadTxn, 1000);
    return;
  }
  if (!props.hash) {
    return;
  }
  let transaction = await TransactionUtils.getTransaction(props.hash);
  if (transaction.isFound == "error") {
    formattedTransaction.value = transaction;
    isFetching.value = false;
    return;
  } else {
    if (transaction.txnStatus.group == "failed") {
      isTxnFailed.value = true;
      failedStatus.value = transaction.txnStatus.status;
    } else {
      txn.value = transaction.txn;
      if (transaction.isFound == true) {
        formattedTransaction.value = {
          hash: props.hash,
          status: transaction.txnStatus.status
            ? transaction.txnStatus.status
            : "",
          timestamp: transaction.txn.timestamp,
          height: transaction.txn.transactionInfo.height.compact(),
          type: transaction.txn.type,
          typeName: transaction.txn.transactionName,
          fee: Helper.convertToExact(
            transaction.txn.fee,
            AppState.nativeToken.divisibility
          ),
          signature: transaction.txn.signature,
          signer: transaction.txn.signer.address.address,
          version: transaction.txn.version,
          isMissingSignature: transaction.txn.hasMissingSignatures(),
          detail: transaction.txn.detail,
          group: transaction.txnStatus.group,
          isFound: transaction.isFound,
          unknownData: transaction.txn.unknownData ? transaction.txn.unknownData: {} 
        };
        
        if (transaction.txn.cosignatures != undefined) {
          formattedTransaction.value.cosigners = transaction.txn.cosignatures;
        } else {
          formattedTransaction.value.cosigners = {};
        }

        txnType.value = transaction.txn.type;

        // if(transaction.txn.amountTransfer!=undefined){
        //   formattedTransaction.value.amountTransfer = transaction.txn.amountTransfer;
        // }

        if (transaction.txn.mosaic != undefined) {
          formattedTransaction.value.assetAmount = Helper.convertToExact(
            transaction.txn.mosaic.amount.compact(),
            AppState.nativeToken.divisibility
          );
          formattedTransaction.value.assetId =
            transaction.txn.mosaic.id.toHex();
          let isNamespace = TransactionUtils.isNamespace(
            transaction.txn.mosaic.id
          );
          if (isNamespace) {
            let namespaceId = Helper.createNamespaceId(
              transaction.txn.mosaic.id.toDTO().id
            );
            let nsNames = await TransactionUtils.getNamespacesName([
              namespaceId,
            ]);
            formattedTransaction.value.assetName = nsNames[0].name;
          }
        }

        // if(transaction.txn.amount!=undefined){
        //   formattedTransaction.value.amount = transaction.txn.amount;
        // }

        innerTransaction.value = transaction.txn.innerTransactions;
      } else {
        formattedTransaction.value = transaction;
      }
    }
  }
  isFetching.value = false;
};
loadTxn();

const networkName = computed(() => {
  return networkState.chainNetworkName;
});

emitter.on("CHANGE_NETWORK", (payload: boolean) => {
  if (payload) {
    loadTxn();
    isFetching.value = true;
  }
});
</script>
