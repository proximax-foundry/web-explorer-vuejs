<template>
  <div class="bg-gray-50">
    <div class="grid grid-cols-3">
      <div class="col-span-2"></div>
      <div class="col-span-1">
      <ExportCSVComponent :selectedTxnType="selectedTxnType" :transactions="transactions" :disabled="isFetching||transactions.length==0"/>
      <select v-model="selectedTxnType" @change="changeSearchTxnType" class="border border-gray-200 px-2 py-1 focus:outline-none">
        <option value="all" class="text-sm">All</option>
        <option v-bind:key="txnType.value" v-for="txnType in txnTypeList" :value="txnType.value" class="text-sm">{{ txnType.label}}</option>
      </select>
      </div>
    </div>
  </div>
  <div v-if="isFetching">
    <div class="flex justify-center items-center border-gray-400 mt-15">
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
    <div class="sm:flex sm:justify-between my-5 mb-15" v-if="totalPages > 1">
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
</template>

<script>
import { watch, ref, computed, getCurrentInstance, onMounted ,onUnmounted  } from "vue";
import { useToast } from "primevue/usetoast";
import { copyToClipboard } from '@/util/functions';
import { Helper } from '@/util/typeHelper';
import { AccountUtils } from "@/util/accountUtil";
import { AppState } from '@/state/appState';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { TransactionUtils } from '@/models/util/transactionUtils';
import Tooltip from 'primevue/tooltip';
import ExportCSVComponent from '@/modules/transaction/components/ExportCSVComponent';
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
import { TransactionFilterType, TransactionFilterTypes } from '@/models/transactions/transaction';


export default {
  name:"TransactionComponent",
  props:{
    accountAddress: String,
    accountPublicKey: String,
  },
  components: {
    ExportCSVComponent,
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
  directives: {
    'tooltip': Tooltip
  },
  setup(props){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const invalidPublicKey = '0000000000000000000000000000000000000000000000000000000000000000';
    let selectedTxnType = ref("all");
    let txnTypeList = Object.entries(TransactionFilterType).map(([label, value])=>({label, value}));
    const isFetching = ref(true);
    const wideScreen = ref(false);
    const QueryParamsType = ref('');
    const screenResizeHandler = () => {
      if(window.innerWidth < 1024){
        wideScreen.value = false;
      }else{
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

    const nativeTokenName = computed(()=> AppState.nativeToken.label);

    const displaySDAs = (sdas) => {
      let sda_rows = [];
      if(sdas.length > 0){
        for(const sda of sdas){
          let asset_div = displayAssetDiv(sda);
          sda_rows.push(asset_div);
        }
        return sda_rows.join("<br>");
      }
    }

    const checkOtherAsset = (assets) => {
      if(assets){
        if(assets.length > 0){
          return true;
        }
      }
      return false;
    }

    const displayAssetDiv = (sda) => {
      let asset_div;
      let assetArray = []
      assetArray.push(sda.id);

      if(sda.currentAlias && sda.currentAlias.length){
        asset_div = (sda.amount + ' ' + sda.currentAlias[0].name);
      }
      else{
        asset_div = (sda.amount + ' - ' + sda.id);
      }
      return asset_div;
    }

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
      loadAccountTransactions();
    }

    const naviPrevious = () => {
      --currentPage.value;
      loadAccountTransactions();
    }

    const naviNext = () => {
      ++currentPage.value;
      loadAccountTransactions();
    }

    const naviLast = () => {
      currentPage.value = totalPages.value;
      loadAccountTransactions();
    }

    const changeRows = () => {
      currentPage.value = 1;
      loadAccountTransactions();
    }
    const changeSearchTxnType = () =>{
      isFetching.value = true;
      transactions.value = [];
      let txnFilterGroup = selectedTxnType.value;
      switch (txnFilterGroup) {
        case TransactionFilterType.TRANSFER:
          QueryParamsType.value = TransactionFilterTypes.getTransferTypes();
          break;
        case TransactionFilterType.ACCOUNT:
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
      loadAccountTransactions();
    }
    
    const transactions = ref([]);
    let transactionGroupType = Helper.getTransactionGroupType();
    let blockDescOrderSortingField = Helper.createTransactionFieldOrder(Helper.getQueryParamOrder_v2().DESC, Helper.getTransactionSortField().BLOCK);

    let loadAccountTransactions = async() =>{
      isFetching.value = true;
      let txnQueryParams = Helper.createTransactionQueryParams();
      txnQueryParams.pageSize = pages.value;
      if(props.accountPublicKey == invalidPublicKey){
        txnQueryParams.address = Helper.createAddress(props.accountAddress).plain();
      }else{
        txnQueryParams.publicKey = props.accountPublicKey;
      }
      txnQueryParams.pageNumber = currentPage.value;
      if(selectedTxnType.value == undefined || selectedTxnType.value == 'all' || selectedTxnType.value == TransactionFilterType.ASSET){
        txnQueryParams.embedded = false;
      }else{
        txnQueryParams.embedded = true;
      }      if(QueryParamsType.value!=undefined){
        txnQueryParams.type = QueryParamsType.value;
      }
      txnQueryParams.updateFieldOrder(blockDescOrderSortingField);
      let transactionSearchResult = await TransactionUtils.searchTxns(transactionGroupType.CONFIRMED, txnQueryParams);
      if(transactionSearchResult.transactions.length > 0){
        let formattedTxns = await formatConfirmedTransaction(transactionSearchResult.transactions);
        transactions.value = formattedTxns;
        totalPages.value = transactionSearchResult.pagination.totalPages;
      }else{
        transactions.value = [];
      }
      isFetching.value = false;
    };
    loadAccountTransactions();
   
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
    
    if(AppState.isReady){
      loadAccountTransactions();
    }
    else{
      let readyWatcher = watch(AppState, (value) => {
        if(value.isReady){
          init();
          readyWatcher();
        }
      });
    }

    emitter.on('CHANGE_NETWORK', payload => {
      isFetching.value = true;
      if(payload){
        loadAccountTransactions();
      }
    });

    const currencyDivisibility = computed(() => {
      return AppState.nativeToken.divisibility;
    })

    return{
      isFetching,
      wideScreen,
      transactions,
      nativeTokenName,
      checkOtherAsset,
      displaySDAs,
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
      currencyDivisibility,
      changeSearchTxnType,
      txnTypeList,
      selectedTxnType,
      TransactionFilterType,
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
