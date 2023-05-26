<template>
  <div>
    <p class="text-gray-500 mb-5 text-sm font-bold">Transaction Details</p>
    <div v-if="!isFetching">
      <div class="filter shadow-xl border border-gray-50 p-5 mb-15">
        <div class="flex items-center mb-4 border-b border-gray-100 relative">
          <div class="w-32 font-bold text-xs text-center p-2 relative"
            :class="`${currentPage != 'detail' ? 'cursor-pointer' : ''}`" @click="currentPage = 'detail'">
            Overview
            <div v-if="currentPage == 'detail'"
              class="absolute w-full border-b border-yellow-500 transition-all duration-200" style="bottom: -1px">
            </div>
          </div>
          <div class="w-32 font-bold text-xs text-center p-2 relative"
            :class="`${currentPage != 'inner' ? 'cursor-pointer' : ''}`" @click="currentPage = 'inner'"
            v-if="innerTransaction">
            Inner Txns
            <div v-if="currentPage == 'inner'"
              class="absolute w-full border-b border-yellow-500 transition-all duration-200" style="bottom: -1px">
            </div>
          </div>
        </div>
        <PayloadDetailComponent v-if="currentPage == 'detail'" :txnDetail="transactionPayload" :txnType="txnType" />
        <InnerPayloadTxnComponent v-else :innerTxn="innerTransaction" :txn="txn" :txnGroup="transactionPayload.group" />
      </div>
    </div>
    <div v-if="isFetching">
      <div class="flex justify-center items-center border-gray-400 mt-10">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-navy-primary mr-2"></div>
        <span class="text-tsm">Fetching Transaction Details</span>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { Convert, TransactionMapping } from 'tsjs-xpx-chain-sdk';
import { ref } from 'vue';
import { AppState } from "@/state/appState";
import { TransactionUtils } from '@/util/transactionUtils';
import { Helper } from '@/util/typeHelper';
import PayloadDetailComponent from "@/modules/transaction/components/PayloadDetailComponent.vue";
import InnerPayloadTxnComponent from "@/modules/transaction/components/InnerPayloadTxnComponent.vue";

const props = defineProps({
  payload: {
    type: Uint8Array,
    required: true,
  }
});

const currentPage = ref("detail");
const transactionPayload = ref<any>({});
const txnType = ref(0);
const isFetching = ref(true);
const innerTransaction = ref({});
const txn = ref();

const convertPayload = Convert.uint8ToHex(props.payload)

if(convertPayload){
  txn.value = TransactionMapping.createFromPayload(convertPayload)
}

const loadPayloadTransaction = async () => {
  if (!AppState.isReady) {
    setTimeout(loadPayloadTransaction, 1000);
    return;
  }
  if (txn.value) {
    let transaction = await TransactionUtils.decodeTransaction(txn.value)
    transactionPayload.value = {
      deadline: Helper.formatDeadline(txn.value.deadline.adjustedValue.compact()),
      type: txn.value.type,
      typeName: txn.value.transactionName,
      fee: TransactionUtils.convertToExactNativeAmount(txn.value.maxFee.compact()),
      detail: transaction,
      version: txn.value.version,
    }
  }
  if (txn.value.cosignatures != undefined) {
    transactionPayload.value.cosigners = txn.value.cosignatures;
  } else {
    transactionPayload.value.cosigners = {};
  }

  txnType.value = txn.value.type;

  if (txn.value.mosaic != undefined) {
    transactionPayload.value.assetAmount = Helper.convertToExact(
      txn.value.mosaic.amount.compact(),
      AppState.nativeToken.divisibility
    );
    transactionPayload.value.assetId =
    txn.value.mosaic.id.toHex();
    let isNamespace = TransactionUtils.isNamespace(
      txn.value.mosaic.id
    );
    if (isNamespace) {
      let namespaceId = Helper.createNamespaceId(
        txn.value.mosaic.id.toDTO().id
      );
      let nsNames = await TransactionUtils.getNamespacesName([
        namespaceId,
      ]);
      transactionPayload.value.assetName = nsNames[0].name;
    }
  }
  innerTransaction.value = txn.value.innerTransactions;
  isFetching.value = false;
}

loadPayloadTransaction()

</script>