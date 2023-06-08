<template>
  <div>
    <p class="text-gray-500 mb-5 text-sm font-bold">Raw Data</p>
    <div v-if="!isFetching">
      <div class="filter shadow-xl border border-gray-50 p-5 mb-15">
        <pre>{{ JSON.stringify(transactionPayload, null, 2) }}</pre>
      </div>
    </div>
    <p class="text-gray-500 mb-5 text-sm font-bold">Transaction Details</p>
    <div class="filter shadow-xl border border-gray-50 p-5 mb-15">
      <PayloadDetailComponent :txnDetail="transactionDetail" :txnType="transactionPayload.type" />
      <div v-if="transactionPayload.innerTransactions">
        <div class="txn-div">
          <div>
            <div>Inner Transaction</div>
          </div>
          <InnerPayloadTxnComponent :innerTxn="transactionPayload.innerTransactions" :txn="txn" />
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { Convert, TransactionMapping } from 'tsjs-xpx-chain-sdk';
import { ref } from 'vue';
import { AppState } from "@/state/appState";
import { Helper } from '@/util/typeHelper';
import { TransactionUtils } from '@/util/transactionUtils';
import InnerPayloadTxnComponent from "@/modules/transaction/components/InnerPayloadTxnComponent.vue";
import PayloadDetailComponent from "@/modules/transaction/components/PayloadDetailComponent.vue"

const props = defineProps({
  payload: {
    type: Uint8Array,
    required: true,
  }
});

const transactionPayload = ref<any>({});
const isFetching = ref(true);
const txn = ref();
const transactionDetail = ref<any>({});

const convertPayload = Convert.uint8ArrayToHex(props.payload)

if (convertPayload) {
  txn.value = TransactionMapping.createFromPayload(convertPayload)
}

const loadPayloadTransaction = async () => {
  if (!AppState.isReady) {
    setTimeout(loadPayloadTransaction, 1000);
    return;
  }
  if (txn.value) {
    let transaction = await TransactionUtils.extractTransactionDetails(txn.value)
    transactionDetail.value = {
      deadline: Helper.formatDeadline(txn.value.deadline.adjustedValue.compact()),
      type: txn.value.type,
      typeName: txn.value.transactionName,
      fee: TransactionUtils.convertToExactNativeAmount(txn.value.maxFee.compact()),
      detail: transaction,
      version: txn.value.version.txnTypeVersion,
      dataType: "Payload"
    }
    if (txn.value.cosignatures != undefined) {
      transactionDetail.value.cosigners = txn.value.cosignatures;
    } else {
      transactionDetail.value.cosigners = {};
    }
    if (txn.value.mosaic != undefined) {
      transactionDetail.value.assetAmount = Helper.convertToExact(
        txn.value.mosaic.amount.compact(),
        AppState.nativeToken.divisibility
      );
      transactionDetail.value.assetId =
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
        transactionDetail.value.assetName = nsNames[0].name;
      }
    }

    for (const property in txn.value) {
      if (txn.value.hasOwnProperty(property) && (typeof txn.value[property] === "object")) {
        let second: any = {}
        for (const subProperty in txn.value[property]) {
          if (txn.value[property].hasOwnProperty(subProperty) && (typeof txn.value[property][subProperty] === "object")) {
            let third: any = {}
            for (const thirdProperty in txn.value[property][subProperty]) {
              third[thirdProperty] = txn.value[property][subProperty][thirdProperty]
            }
            second[subProperty] = third
          }
          else {
            second[subProperty] = txn.value[property][subProperty]
          }
        }
        transactionPayload.value[property] = second
      }
      else if (txn.value[property] !== undefined) {
        transactionPayload.value[property] = txn.value[property]

      }
    }
  }
  isFetching.value = false;
}

loadPayloadTransaction()

</script>

<style scoped lang="scss">
.txn-div,
.details {
  @apply text-gray-800 text-xs;

  >div {
    @apply flex items-center border-b border-gray-100 py-4;

    >div:first-child {
      @apply w-40 text-xs pl-4;
    }

    >div:nth-child(2) {
      @apply text-xs w-full;
    }

    >div:last-child {
      @apply border-none;
    }
  }
}
</style>