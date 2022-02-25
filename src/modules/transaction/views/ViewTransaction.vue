<template>
  <div>
    <p class="text-gray-500 mb-5 text-sm font-bold">
      Transaction Details
    </p>
    <div v-if="isFetching">
      <div class="flex justify-center items-center border-gray-400 mt-15">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-navy-primary mr-2"></div>
        <span class="text-tsm">Fetching transaction</span>
      </div>
    </div>
    <div v-else>
      <div class="filter shadow-xl border border-gray-50 p-5 mb-15" v-if="formattedTransaction.hash">
        <div class="flex items-center mb-4 border-b border-gray-100 relative">
          <div class="w-32 font-bold text-xs text-center p-2 relative" :class="`${ (currentPage != 'detail')?'cursor-pointer':'' }`" @click="currentPage = 'detail'">Overview<div v-if="currentPage == 'detail'" class="absolute w-full border-b border-yellow-500 transition-all duration-200" style="bottom: -1px;"></div></div>
          <div class="w-32 font-bold text-xs text-center p-2 relative" :class="`${ (currentPage != 'inner')?'cursor-pointer':'' }`" @click="currentPage = 'inner'" v-if="innerTransaction">Inner Txns<div v-if="currentPage == 'inner'" class="absolute w-full border-b border-yellow-500 transition-all duration-200" style="bottom: -1px;"></div></div>
        </div>
        <TxnDetailComponent v-if="currentPage == 'detail'" :txnDetail="formattedTransaction" />
        <InnerTxnComponent v-else :innerTxn="innerTransaction" />
      </div>
      <div v-if="!formattedTransaction.isFound" class="p-3 bg-yellow-100 text-yellow-700">Transaction not found</div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, getCurrentInstance, inject, ref, watch } from "vue";
import TxnDetailComponent from '@/modules/transaction/components/TxnDetailComponent.vue';
import InnerTxnComponent from '@/modules/transaction/components/InnerTxnComponent.vue';
import { AppState } from '@/state/appState';
import { Helper } from "@/util/typeHelper";
import { TransactionUtils } from '@/models/util/transactionUtils';
export default {
  name: 'ViewTransaction',
  components: {
    TxnDetailComponent,
    InnerTxnComponent
  },
  props: {
    hash: String
  },
  setup(props){
    const currentPage = ref('detail');
    const isFetching = ref(true);
    const formattedTransaction = ref({
      hash: '',
      status: '',
      timestamp: '',
      height: 0,
      type: '',
      fee: 0,
      signature: '',
      signer: '',
      version: '',
      isMissingSignature: false,
      cosigners: [],
      amount: '',
      amountTransfer: []
    });
    const innerTransaction = ref({});

    (async() => {
      let transaction = await TransactionUtils.getTransaction(props.hash);
      console.log(transaction.txn)
      if(transaction.isFound){
        formattedTransaction.value = {
          hash: props.hash,
          status: transaction.txn.isConfirmed(),
          timestamp: Helper.formatDeadline(transaction.txn.deadline.adjustedValue.compact()),
          height: transaction.txn.transactionInfo.height.compact(),
          type: TransactionUtils.getTransactionTypeName(transaction.txn.type),
          fee: Helper.convertToExact(transaction.txn.maxFee.compact(), AppState.nativeToken.divisibility),
          signature: transaction.txn.signature,
          signer: transaction.txn.signer.address.address,
          version: transaction.txn.version,
          isMissingSignature: transaction.txn.hasMissingSignatures(),
          group: transaction.txnStatus.group,
          isFound: transaction.isFound,
        }
        if(transaction.txn.cosignatures!=undefined){
          formattedTransaction.value.cosigners = transaction.txn.cosignatures;
        }

        if(transaction.txn.amountTransfer!=undefined){
          formattedTransaction.value.amountTransfer = transaction.txn.amountTransfer;
        }

        if(transaction.txn.amount!=undefined){
          formattedTransaction.value.amount = transaction.txn.amount;
        }

        innerTransaction.value = transaction.txn.innerTransactions;
      }else{
        formattedTransaction.value = transaction;
      }

      isFetching.value = false;
    })();

    return {
      currentPage,
      AppState,
      formattedTransaction,
      innerTransaction,
      isFetching,
    }
  }
}
</script>