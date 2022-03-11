<template>
  <div>
    <p class="text-gray-500 mb-5 text-sm font-bold">
      Transaction Details
    </p>
    <div v-if="!isFetching">
      <div class="filter shadow-xl border border-gray-50 p-5 mb-15" v-if="formattedTransaction.isFound===true">
        <div class="flex items-center mb-4 border-b border-gray-100 relative">
          <div class="w-32 font-bold text-xs text-center p-2 relative" :class="`${ (currentPage != 'detail')?'cursor-pointer':'' }`" @click="currentPage = 'detail'">Overview<div v-if="currentPage == 'detail'" class="absolute w-full border-b border-yellow-500 transition-all duration-200" style="bottom: -1px;"></div></div>
          <div class="w-32 font-bold text-xs text-center p-2 relative" :class="`${ (currentPage != 'inner')?'cursor-pointer':'' }`" @click="currentPage = 'inner'" v-if="innerTransaction">Inner Txns<div v-if="currentPage == 'inner'" class="absolute w-full border-b border-yellow-500 transition-all duration-200" style="bottom: -1px;"></div></div>
        </div>
        <TxnDetailComponent v-if="currentPage == 'detail'" :txnDetail="formattedTransaction" />
        <InnerTxnComponent v-else :innerTxn="innerTransaction" :txn="txn" :txnGroup="formattedTransaction.group" />
      </div>
      <div v-if="formattedTransaction.isFound==='error'" class="p-3 bg-yellow-100 text-yellow-700">Transaction not found in {{ networkName }}</div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, getCurrentInstance, inject, ref, watch } from "vue";
import { networkState } from '@/state/networkState';
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
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const currentPage = ref('detail');
    const isFetching = ref(true);
    const txn = ref({});
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
      amountTransfer: [],
      assetAmount: '',
      assetId: '',
      assetName: {},
    });
    const innerTransaction = ref({});

    const loadTxn = async () => {
      if(!AppState.isReady){
        setTimeout(loadTxn, 1000);
      }

      let transaction = await TransactionUtils.getTransaction(props.hash);
      txn.value = transaction.txn;
      if(transaction.isFound==true){
        formattedTransaction.value = {
          hash: props.hash,
          status: transaction.txnStatus.status?transaction.txnStatus.status:'',
          timestamp: transaction.txn.timestamp,
          height: transaction.txn.transactionInfo.height.compact(),
          type: TransactionUtils.getTransactionTypeName(transaction.txn.type),
          fee: Helper.convertToExact(transaction.txn.fee, AppState.nativeToken.divisibility),
          signature: transaction.txn.signature,
          signer: transaction.txn.signer.address.address,
          version: transaction.txn.version,
          isMissingSignature: transaction.txn.hasMissingSignatures(),
          group: transaction.txnStatus.group,
          isFound: transaction.isFound,
        }
        if(transaction.txn.cosignatures!=undefined){
          formattedTransaction.value.cosigners = transaction.txn.cosignatures;
        }else{
          formattedTransaction.value.cosigners = {}
        }

        if(transaction.txn.amountTransfer!=undefined){
          formattedTransaction.value.amountTransfer = transaction.txn.amountTransfer;
        }

        if(transaction.txn.mosaic!=undefined){
          formattedTransaction.value.assetAmount = Helper.convertToExact(transaction.txn.mosaic.amount.compact(), AppState.nativeToken.divisibility);
          formattedTransaction.value.assetId = transaction.txn.mosaic.id.toHex();
          let isNamespace = TransactionUtils.isNamespace(transaction.txn.mosaic.id);
          if(isNamespace){
            let namespaceId = Helper.createNamespaceId(transaction.txn.mosaic.id.toDTO().id);
            let nsNames = await TransactionUtils.getNamespacesName([namespaceId]);
            formattedTransaction.value.assetName = nsNames[0].name;
          }
          // formattedTransaction.value.assetName = await TransactionUtils.getAssetsName([transaction.txn.mosaic.id]);
          // console.log(formattedTransaction.value.assetName)
        }

        if(transaction.txn.amount!=undefined){
          formattedTransaction.value.amount = transaction.txn.amount;
        }

        innerTransaction.value = transaction.txn.innerTransactions;
      }else{
        formattedTransaction.value = transaction;
      }

      isFetching.value = false;
    };
    loadTxn();

    const networkName = computed(() => {
      return networkState.chainNetworkName;
    });

    emitter.on('CHANGE_NETWORK', payload => {
      if(payload){
        loadTxn();
      }
    });

    return {
      currentPage,
      AppState,
      formattedTransaction,
      innerTransaction,
      isFetching,
      txn,
      networkName,
    }
  }
}
</script>