<template>
  <div>
    <div class="flex justify-between">
      <p class="text-gray-500 mb-5 text-sm font-bold">
      Transactions
      </p>
      <div class="bg-gray-50">
        <select v-model="selectedTxnType" @change="changeSearchTxnType" class="border border-gray-200 px-2 py-1 focus:outline-none">
          <option value="all" class="text-sm">All</option>
          <option v-bind:key="txnType.value" v-for="txnType in txnTypeList" :value="txnType.value" class="text-sm">{{ txnType.label}}</option>
        </select>
      </div>
    </div>
    <div v-if="isFetching">
      <div class="flex justify-center items-center border-gray-400 mt-5">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-navy-primary mr-2"></div>
        <span class="text-tsm">Fetching transactions</span>
      </div>
    </div>
    <div v-else>
      <MixedTxnDataTable :transactions="transactions" :pages="pages" v-if="selectedTxnType == 'all'" />
      <TransferTxnDataTable :transactions="transactions" :pages="pages" v-else-if="selectedTxnType === TransactionFilterType.TRANSFER" />
      <AccountTxnDataTable :transactions="transactions" :pages="pages" v-else-if="selectedTxnType === TransactionFilterType.ACCOUNT" />
      <AggregateTxnDataTable :transactions="transactions" :pages="pages" :selectedGroupType="transactionGroupType.CONFIRMED" v-else-if="selectedTxnType === TransactionFilterType.AGGREGATE" />
      <AliasTxnDataTable :transactions="transactions" :pages="pages" :selectedGroupType="transactionGroupType.CONFIRMED" v-else-if="selectedTxnType === TransactionFilterType.ALIAS" />
      <AssetTxnDataTable :transactions="transactions" :pages="pages" :selectedGroupType="transactionGroupType.CONFIRMED" v-else-if="selectedTxnType === TransactionFilterType.ASSET" />
      <NamespaceTxnDataTable :transactions="transactions" :pages="pages" :selectedGroupType="transactionGroupType.CONFIRMED" v-else-if="selectedTxnType === TransactionFilterType.NAMESPACE" />
      <MetadataTxnDataTable :transactions="transactions" :pages="pages" :selectedGroupType="transactionGroupType.CONFIRMED" v-else-if="selectedTxnType === TransactionFilterType.METADATA" />
      <ExchangeTxnDataTable :transactions="transactions" :pages="pages" :selectedGroupType="transactionGroupType.CONFIRMED" v-else-if="selectedTxnType === TransactionFilterType.EXCHANGE" />
      <LockTxnDataTable :transactions="transactions" :pages="pages" :selectedGroupType="transactionGroupType.CONFIRMED" v-else-if="selectedTxnType === TransactionFilterType.LOCK" />
      <LinkTxnDataTable :transactions="transactions" :pages="pages" :selectedGroupType="transactionGroupType.CONFIRMED" v-else-if="selectedTxnType === TransactionFilterType.LINK" />
      <RestrictionTxnDataTable :transactions="transactions" :pages="pages" :selectedGroupType="transactionGroupType.CONFIRMED" v-else-if="selectedTxnType === TransactionFilterType.RESTRICTION" />
      <SecretTxnDataTable :transactions="transactions" :pages="pages" :selectedGroupType="transactionGroupType.CONFIRMED" v-else-if="selectedTxnType === TransactionFilterType.SECRET" />
      <ChainTxnDataTable :transactions="transactions" :pages="pages" :selectedGroupType="transactionGroupType.CONFIRMED" v-else-if="selectedTxnType === TransactionFilterType.CHAIN" />
      <div class="sm:flex sm:justify-between my-5 mb-15" v-if="totalPages > 1 && transactions.length > 0">
        <div class="text-xs text-gray-700 mb-3 sm:mb-0 text-center sm:text-left">Show
          <select v-model="pages" class="border border-gray-300 rounded-md p-1" @change="changeRows">
            <option value=10>10</option>
            <option value=20>20</option>
            <option value=30>30</option>
            <option value=40>40</option>
            <option value=50>50</option>
          </select>
          Records
        </div>
        <div class="sm:flex sm:items-center text-center sm:text-right">
          <div v-if="enableFirstPage" @click="naviFirst" class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs mx-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all">First</div><div v-else class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs">First</div>
          <div v-if="enablePreviousPage" @click="naviPrevious" class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs mx-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all">Previous</div><div v-else class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs">Previous</div>
          <div class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs">Page {{ currentPage }} of {{ totalPages }}</div>
          <div v-if="enableNextPage" @click="naviNext" class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs mx-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all">Next</div><div v-else class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs">Next</div>
          <div v-if="enableLastPage" @click="naviLast" class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs ml-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all">Last</div><div v-else class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs">Last</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, computed, ref, watch } from "vue";
import { TransactionFilterType, TransactionFilterTypes } from '@/models/transactions/transaction';
import { AppState } from '@/state/appState';
import { Helper } from "@/util/typeHelper";
import { TransactionUtils } from '@/models/util/transactionUtils';
import MixedTxnDataTable from '@/modules/transaction/components/txnDataTables/MixedTxnDataTable';
import TransferTxnDataTable from '@/modules/transaction/components/txnDataTables/TransferTxnDataTable';
import AccountTxnDataTable from '@/modules/transaction/components/txnDataTables/AccountTxnDataTable';
import AggregateTxnDataTable from '@/modules/transaction/components/txnDataTables/AggregateTxnDataTable';
import AliasTxnDataTable from '@/modules/transaction/components/txnDataTables/AliasTxnDataTable';
import AssetTxnDataTable from '@/modules/transaction/components/txnDataTables/AssetTxnDataTable';
import NamespaceTxnDataTable from '@/modules/transaction/components/txnDataTables/NamespaceTxnDataTable';
import MetadataTxnDataTable from '@/modules/transaction/components/txnDataTables/MetadataTxnDataTable';
import ExchangeTxnDataTable from '@/modules/transaction/components/txnDataTables/ExchangeTxnDataTable';
import LockTxnDataTable from '@/modules/transaction/components/txnDataTables/LockTxnDataTable';
import LinkTxnDataTable from '@/modules/transaction/components/txnDataTables/LinkTxnDataTable';
import RestrictionTxnDataTable from '@/modules/transaction/components/txnDataTables/RestrictionTxnDataTable';
import SecretTxnDataTable from '@/modules/transaction/components/txnDataTables/SecretTxnDataTable';
import ChainTxnDataTable from '@/modules/transaction/components/txnDataTables/ChainTxnDataTable';


export default {
  name: 'ViewTransactionList',
  components: {
    MixedTxnDataTable,
    TransferTxnDataTable,
    AccountTxnDataTable,
    AggregateTxnDataTable,
    AliasTxnDataTable,
    AssetTxnDataTable,
    NamespaceTxnDataTable,
    MetadataTxnDataTable,
    ExchangeTxnDataTable,
    LockTxnDataTable,
    LinkTxnDataTable,
    RestrictionTxnDataTable,
    SecretTxnDataTable,
    ChainTxnDataTable,
  },
  setup(){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;

    let selectedTxnType = ref("all");
    const isFetching = ref(true);

    let txnTypeList = Object.entries(TransactionFilterType).map(([label, value])=>({label, value}));

    const pages = ref(20);
    const currentPage = ref(1)
    const totalPages = ref(0);

    
    const enableFirstPage = computed(() => {
      return currentPage.value > 1;
    });

    const enablePreviousPage = computed(() => {
      return currentPage.value > 1;
    });

    const enableNextPage = computed(() => {
      return (totalPages.value - currentPage.value) > 0;
    });

    const enableLastPage = computed(() => {
      return currentPage.value < totalPages.value;
    });

    const naviFirst = () => {
      currentPage.value = 1;
      loadRecentTransactions();
    }

    const naviPrevious = () => {
      --currentPage.value;
      loadRecentTransactions();
    }

    const naviNext = () => {
      ++currentPage.value;
      loadRecentTransactions();
    }

    const naviLast = () => {
      currentPage.value = totalPages.value;
      loadRecentTransactions();
    }

    const changeRows = () => {
      currentPage.value = 1;
      loadRecentTransactions();
    }

    const transactions = ref([]);
    const QueryParamsType = ref('');
    let transactionGroupType = Helper.getTransactionGroupType();
    let blockDescOrderSortingField = Helper.createTransactionFieldOrder(Helper.getQueryParamOrder_v2().DESC, Helper.getTransactionSortField().BLOCK);

    let loadRecentTransactions = async() =>{
      isFetching.value = true;
      if(!AppState.isReady){
        setTimeout(loadRecentTransactions, 1000);
      }
      let txnQueryParams = Helper.createTransactionQueryParams();
      let blockHeight = await AppState.chainAPI.chainAPI.getBlockchainHeight();
      txnQueryParams.pageSize = pages.value;
      txnQueryParams.pageNumber = currentPage.value;
      if(selectedTxnType.value == undefined || selectedTxnType.value == 'all' || selectedTxnType.value == TransactionFilterType.ASSET){
        txnQueryParams.embedded = false;
      }else{
        txnQueryParams.embedded = true;
      }
      txnQueryParams.fromHeight = blockHeight - 2000000;
      if(QueryParamsType.value!=undefined){
        txnQueryParams.type = QueryParamsType.value;
      }
      txnQueryParams.updateFieldOrder(blockDescOrderSortingField);

      let transactionSearchResult = await TransactionUtils.searchTxns(transactionGroupType.CONFIRMED, txnQueryParams);
      if(transactionSearchResult.transactions.length > 0){
        // let formattedTxns = await TransactionUtils.formatConfirmedMixedTxns(transactionSearchResult.transactions);
       let formattedTxns = await formatConfirmedTransaction(transactionSearchResult.transactions);

        transactions.value = formattedTxns;
        totalPages.value = transactionSearchResult.pagination.totalPages;
      }else{
        transactions.value = []
      }
      isFetching.value = false;
    };
    loadRecentTransactions();

    const changeSearchTxnType = () =>{
      isFetching.value = true;
      transactions.value = [];
      let txnFilterGroup = selectedTxnType.value;
      switch (txnFilterGroup) {
        case TransactionFilterType.TRANSFER:
          QueryParamsType.value = TransactionFilterTypes.getTransferTypes();
          break;
        case TransactionFilterType.ACCOUNT:
          console.log('re')
          QueryParamsType.value = TransactionFilterTypes.getAccountTypes();
          break;
        case TransactionFilterType.ASSET:
          QueryParamsType.value = TransactionFilterTypes.getAssetTypes();
          break;
        case TransactionFilterType.ALIAS:
          QueryParamsType.value = TransactionFilterTypes.getAliasTypes();
          break;
        case TransactionFilterType.NAMESPACE:
          QueryParamsType.value = TransactionFilterTypes.getNamespaceTypes();
          break;
        case TransactionFilterType.METADATA:
          QueryParamsType.value = TransactionFilterTypes.getMetadataTypes();
          break;
        case TransactionFilterType.CHAIN:
          QueryParamsType.value = TransactionFilterTypes.getChainTypes();
          break;
        case TransactionFilterType.EXCHANGE:
          QueryParamsType.value = TransactionFilterTypes.getExchangeTypes();
          break;
        case TransactionFilterType.AGGREGATE:
          QueryParamsType.value = TransactionFilterTypes.getAggregateTypes();
          break;
        case TransactionFilterType.LINK:
          QueryParamsType.value = TransactionFilterTypes.getLinkTypes();
          break;
        case TransactionFilterType.LOCK:
          QueryParamsType.value = TransactionFilterTypes.getLockTypes();
          break;
        case TransactionFilterType.SECRET:
          QueryParamsType.value = TransactionFilterTypes.getSecretTypes();
          break;
        case TransactionFilterType.RESTRICTION:
          QueryParamsType.value = TransactionFilterTypes.getRestrictionTypes();
          break;
        default:
          QueryParamsType.value = undefined;
          break;
      }

      loadRecentTransactions();
    }

    const formatConfirmedTransaction = async(transactions)=>{

      let formattedTxns = [];

      switch(selectedTxnType.value){
        case TransactionFilterType.TRANSFER:
          formattedTxns = await TransactionUtils.formatConfirmedMixedTxns(transactions);
          break;
        case TransactionFilterType.ACCOUNT:
          formattedTxns = await TransactionUtils.formatConfirmedAccountTransaction(transactions);
          break;
        case TransactionFilterType.AGGREGATE:
          formattedTxns = await TransactionUtils.formatConfirmedAggregateTransaction(transactions);
          break;
        case TransactionFilterType.RESTRICTION:
          formattedTxns = await TransactionUtils.formatConfirmedRestrictionTransaction(transactions);
          break;
        case TransactionFilterType.SECRET:
          formattedTxns = await TransactionUtils.formatConfirmedSecretTransaction(transactions);
          break;
        case TransactionFilterType.ALIAS:
          formattedTxns = await TransactionUtils.formatConfirmedAliasTransaction(transactions);
          break;
        case TransactionFilterType.ASSET:
          formattedTxns = await TransactionUtils.formatConfirmedAssetTransaction(transactions);
          break;
        case TransactionFilterType.METADATA:
          formattedTxns = await TransactionUtils.formatConfirmedMetadataTransaction(transactions);
          break;
        case TransactionFilterType.CHAIN:
          formattedTxns = await TransactionUtils.formatConfirmedChainTransaction(transactions);
          break;
        case TransactionFilterType.EXCHANGE:
          formattedTxns = await TransactionUtils.formatConfirmedExchangeTransaction(transactions);
          break;
        case TransactionFilterType.LINK:
          formattedTxns = await TransactionUtils.formatConfirmedLinkTransaction(transactions);
          break;
        case TransactionFilterType.LOCK:
          formattedTxns = await TransactionUtils.formatConfirmedLockTransaction(transactions);
          break;
        case TransactionFilterType.NAMESPACE:
          formattedTxns = await TransactionUtils.formatConfirmedNamespaceTransaction(transactions);
          break;
        default:
          formattedTxns = await TransactionUtils.formatConfirmedMixedTxns(transactions);
          break;
      }

      return formattedTxns;
    }

    const formatUnconfirmedTransaction = async(transactions)=>{

      let formattedTxns = [];

      switch(selectedTxnType.value){
        case TransactionFilterType.TRANSFER:
          formattedTxns = await TransactionUtils.formatUnconfirmedMixedTxns(transactions);
          break;
        case TransactionFilterType.ACCOUNT:
          formattedTxns = await TransactionUtils.formatUnconfirmedAccountTransaction(transactions);
          break;
        case TransactionFilterType.AGGREGATE:
          formattedTxns = await TransactionUtils.formatUnconfirmedAggregateTransaction(transactions);
          break;
        case TransactionFilterType.RESTRICTION:
          formattedTxns = await TransactionUtils.formatUnconfirmedRestrictionTransaction(transactions);
          break;
        case TransactionFilterType.SECRET:
          formattedTxns = await TransactionUtils.formatUnconfirmedSecretTransaction(transactions);
          break;
        case TransactionFilterType.ALIAS:
          formattedTxns = await TransactionUtils.formatUnconfirmedAliasTransaction(transactions);
          break;
        case TransactionFilterType.ASSET:
          formattedTxns = await TransactionUtils.formatUnconfirmedAssetTransaction(transactions);
          break;
        case TransactionFilterType.METADATA:
          formattedTxns = await TransactionUtils.formatUnconfirmedMetadataTransaction(transactions);
          break;
        case TransactionFilterType.CHAIN:
          formattedTxns = await TransactionUtils.formatUnconfirmedChainTransaction(transactions);
          break;
        case TransactionFilterType.EXCHANGE:
          formattedTxns = await TransactionUtils.formatUnconfirmedExchangeTransaction(transactions);
          break;
        case TransactionFilterType.LINK:
          formattedTxns = await TransactionUtils.formatUnconfirmedLinkTransaction(transactions);
          break;
        case TransactionFilterType.LOCK:
          formattedTxns = await TransactionUtils.formatUnconfirmedLockTransaction(transactions);
          break;
        case TransactionFilterType.NAMESPACE:
          formattedTxns = await TransactionUtils.formatUnconfirmedNamespaceTransaction(transactions);
          break;
      }

      return formattedTxns;
    }

    const formatPartialTransaction = async(transactions)=>{

      let formattedTxns = [];
      switch(selectedTxnType.value){
        case TransactionFilterType.TRANSFER:
          formattedTxns = await TransactionUtils.formatPartialMixedTxns(transactions);
          break;
        case TransactionFilterType.ACCOUNT:
          formattedTxns = await TransactionUtils.formatPartialAccountTransaction(transactions);
          break;
        case TransactionFilterType.AGGREGATE:
          formattedTxns = await TransactionUtils.formatPartialAggregateTransaction(transactions);
          break;
        case TransactionFilterType.RESTRICTION:
          formattedTxns = await TransactionUtils.formatPartialRestrictionTransaction(transactions);
          break;
        case TransactionFilterType.SECRET:
          formattedTxns = await TransactionUtils.formatPartialSecretTransaction(transactions);
          break;
        case TransactionFilterType.ALIAS:
          formattedTxns = await TransactionUtils.formatPartialAliasTransaction(transactions);
          break;
        case TransactionFilterType.ASSET:
          formattedTxns = await TransactionUtils.formatPartialAssetTransaction(transactions);
          break;
        case TransactionFilterType.METADATA:
          formattedTxns = await TransactionUtils.formatPartialMetadataTransaction(transactions);
          break;
        case TransactionFilterType.CHAIN:
          formattedTxns = await TransactionUtils.formatPartialChainTransaction(transactions);
          break;
        case TransactionFilterType.EXCHANGE:
          formattedTxns = await TransactionUtils.formatPartialExchangeTransaction(transactions);
          break;
        case TransactionFilterType.LINK:
          formattedTxns = await TransactionUtils.formatPartialLinkTransaction(transactions);
          break;
        case TransactionFilterType.LOCK:
          formattedTxns = await TransactionUtils.formatPartialLockTransaction(transactions);
          break;
        case TransactionFilterType.NAMESPACE:
          formattedTxns = await TransactionUtils.formatPartialNamespaceTransaction(transactions);
          break;
      }

      return formattedTxns;
    }

    emitter.on('CHANGE_NETWORK', payload => {
      isFetching.value = true;
      if(payload){
        loadRecentTransactions();
      }
    });


    return {
      isFetching,
      TransactionFilterType,
      transactions,
      Helper,
      pages,
      currentPage,
      totalPages,
      enableFirstPage,
      enablePreviousPage,
      enableNextPage,
      enableLastPage,
      naviFirst,
      naviPrevious,
      naviNext,
      naviLast,
      changeRows,
      txnTypeList,
      selectedTxnType,
      changeSearchTxnType,
      QueryParamsType,
      transactionGroupType
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.txn-div{
  @apply text-gray-800 text-xs;
  > div{
    @apply flex justify-start items-center border-b border-gray-100 py-4;

    > div:first-child{
      @apply w-40 text-xs pl-4 font-bold;
    }

    > div:nth-child(2){
      @apply text-xs;
    }

    > div:nth-child(3){
      @apply ml-7 w-36 text-xs pl-4 font-bold;
    }

    > div:last-child{
      @apply border-none;
    }
  }
}
</style>
