<template>
  <div>
      <p class="text-gray-500 mb-5 text-sm font-bold">Transaction Details</p>
      <div v-if="!isFetching">
        <div class="filter shadow-xl border border-gray-50 p-5 mb-15">
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
            <PayloadDetailComponent
            v-if="currentPage == 'detail'"
            :txnDetail="transactionPayload"
          />
          <InnerPayloadTxnComponent
            v-else
            :innerTxn="innerTransaction"
            :txn="txn"
            :txnGroup="transactionPayload.group"
          />
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
import { TransactionMapping } from 'tsjs-xpx-chain-sdk';
import { ref } from 'vue';
import { AppState } from "@/state/appState";
import { TransactionUtils } from '@/util/transactionUtils';
import { Helper } from '@/util/typeHelper';
import PayloadDetailComponent from "@/modules/transaction/components/PayloadDetailComponent.vue";
import InnerPayloadTxnComponent from "@/modules/transaction/components/InnerPayloadTxnComponent.vue";
  
  const props = defineProps({
    payload: {
    type: String,
    required: true,
    }
  });

  const currentPage = ref("detail");
  const transactionPayload = ref<any>({});
  const txnType = ref(0);
  const isFetching = ref(true);
  const innerTransaction = ref({});

  const txn :any = TransactionMapping.createFromPayload(props.payload)
console.log(txn)

const loadPayloadTransaction = async () =>{
  if(txn){
    transactionPayload.value = {
      timestamp: txn.deadline.value,
      type: txn.type,
      typeName: txn.transactionName,
      fee: Helper.convertToExact(
            TransactionUtils.getFee(txn),
            AppState.nativeToken.divisibility
          ),
      version: txn.version,
      unknownData: txn.unknownData ? txn.unknownData: {} 
    }
    if(txn.cosignatures != undefined) {
      transactionPayload.value.cosigners = txn.cosignatures;
        } else {
          transactionPayload.value.cosigners = {};
        }

        txnType.value = txn.type;

        // if(transaction.txn.amountTransfer!=undefined){
        //   formattedTransaction.value.amountTransfer = transaction.txn.amountTransfer;
        // }

        if(txn.mosaic != undefined) {
          transactionPayload.value.assetAmount = Helper.convertToExact(
            txn.mosaic.amount.compact(),
            AppState.nativeToken.divisibility
          );
          transactionPayload.value.assetId =
            txn.mosaic.id.toHex();
          let isNamespace = TransactionUtils.isNamespace(
            txn.mosaic.id
          );
          if(isNamespace) {
            let namespaceId = Helper.createNamespaceId(
              txn.mosaic.id.toDTO().id
            );
            let nsNames = await TransactionUtils.getNamespacesName([
              namespaceId,
            ]);
            transactionPayload.value.assetName = nsNames[0].name;
          }
        }

        // if(transaction.txn.amount!=undefined){
        //   formattedTransaction.value.amount = transaction.txn.amount;
        // }

        innerTransaction.value = txn.innerTransactions;
      }
      isFetching.value = false;
  }
  loadPayloadTransaction()

</script>