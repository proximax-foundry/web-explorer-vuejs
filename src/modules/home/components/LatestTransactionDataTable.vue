<template>
  <div class="border divide-y divide-gray-200"> 
    <div class="font-bold text-base ml-4 mt-4 mb-4">
        Latest Transactions
    </div>
    <div v-if="isFetching">
      <div class="flex justify-center items-center border-gray-400 mt-10 mb-10">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-navy-primary"></div>
        <span class="text-tsm ml-2">Fetching transactions</span>
      </div>
    </div>
    <div v-else>
    <DataTable
      :value="transactions"
      :paginator="true"
      :rows="20"
      responsiveLayout="scroll"
      scrollDirection="horizontal"
      :alwaysShowPaginator="false"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate=""
      tableStyle=""
    >
      <Column style="width: 20px" v-if="!wideScreen">
          <template #body="{data}">
            <div class="mb-2 px-4">
              <div class="uppercase text-xs text-gray-300 font-bold mt-1 mb-2">TX Hash</div>
              <router-link :to="{ name: 'ViewTransaction', params: {hash: data.hash}}" class="uppercase font-bold text-xs text-blue-600 hover:text-blue-primary hover:underline inline-flex w-20"><span class="text-ellipsis overflow-hidden"> {{data.hash}}</span>...</router-link>
              <div class="text-xs text-gray-500 mb-4 mt-1">{{ countDuration(data.timestamp)}} ago</div>
            </div>
          </template>
        </Column>
        <Column style="width: 240px" v-if="!wideScreen">
          <template #body="{data}">
            <div class="-ml-1">
              <div class="uppercase text-xs text-gray-300 font-bold -mt-3 mb-2">Signer / TX Type</div>
              <div class="text-xs text-gray-500 inline-flex">Signer:</div>
              <router-link :to="{ name: 'ViewAccount', params: {accountParam: data.signerAddress}}" class="uppercase font-bold text-xs text-blue-600 ml-1 hover:text-blue-primary hover:underline inline-flex"><span class="text-ellipsis overflow-hidden truncate w-36">{{Helper.createAddress(data.signerAddress).pretty()}}</span></router-link>
            <div>
            <div class="text-xs inline-flex text-gray-500 mt-1">
            TX Type: </div>
              <span class="uppercase truncate break-all text-xs ml-1">{{data.type}}</span>
            
            </div>

            </div>
          </template>
        </Column>
        <Column style="width:130px" v-if="!wideScreen">
          <template #body="{data}">
            <div>
              <div class="uppercase text-xs text-gray-300 font-bold mb-2">Tx Fee</div>
              <div class="uppercase font-bold text-xs">{{data.fee+ " " + nativeTokenNamespace}}</div>
              <div class="mb-7"></div>
            </div>
          </template>
        </Column>
      <Column style="width: 80px; padding-bottom: 0rem; padding-top: 0rem;padding-left: 1rem;" field="TX Hash" header="TX HASH" class="ml-4" v-if="wideScreen"> 
        <template #body="{data}">                
          <div>
            <router-link :to="{ name: 'ViewTransaction', params: {hash: data.hash}}" class="uppercase text-xs text-blue-600 hover:text-blue-primary hover:underline inline-flex w-14 pt-3 "><span class="text-ellipsis overflow-hidden text-xs" v-tooltip.bottom="data.hash">{{data.hash}} </span>...</router-link>
            <div class="text-txs text-gray-500 mb-4 pt-1">{{countDuration(data.timestamp)}} ago</div>
          </div>
        </template> 
      </Column>
      <Column style="width: 50px; padding-bottom: 0rem; padding-top: 0rem;" field="Signer / Tx Type" header="SIGNER / TX TYPE" v-if="wideScreen"> 
        <template #body="{data}"> 
          <div>
            <div class="text-xs text-gray-500 inline-flex truncate pt-2">SIGNER:
              <div class="uppercase text-xs pl-1.5"><router-link :to="{ name: 'ViewAccount', params: {accountParam: data.signerAddress}}" class="uppercase text-xs text-blue-600 hover:text-blue-primary hover:underline inline-flex"><span class="text-ellipsis overflow-hidden text-xs w-60"  v-tooltip.top="Helper.createAddress(data.signerAddress).pretty()">{{Helper.createAddress(data.signerAddress).pretty()}}</span>...</router-link></div>
            </div>
            <div class="text-txs text-gray-500 inline-flex truncate w-72 px-px mb-3 pt-1.5">TX TYPE:
              <div class="pl-2">{{data.type}}</div>
            </div>
          </div>
        </template> 
      </Column>
      <Column style="width: 120px; padding-bottom: 0rem; padding-top: 0rem; padding-right: 1rem; " field="Fee" header="Tx FEE" v-if="wideScreen"> 
        <template #body="{data}"> 
          <div>
            <div class="text-xs pt-2.5">{{data.fee + " " + nativeTokenNamespace}}</div>
          </div>
          <div class="mb-7"></div>
        </template> 
      </Column>
    </DataTable>
    </div>
  </div>
</template>

<script>

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { Helper } from '@/util/typeHelper';
import { AppState } from "@/state/appState";
import { ref, onMounted, onUnmounted, getCurrentInstance } from 'vue';
import { TransactionUtils } from '@/models/util/transactionUtils';
import { TransactionGroupType,TransactionQueryParams } from 'tsjs-xpx-chain-sdk';
import Tooltip from 'primevue/tooltip';
import { HomeUtils } from '@/util/homeUtil';

export default{
  components: { DataTable, Column },
  name: 'LatestTransactionDataTable',
  directives: {
    'tooltip': Tooltip
  },
  setup(){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const wideScreen = ref(false);
    const isFetching = ref(true);
    const transactions = ref([]);
    const nativeTokenNamespace = AppState.nativeToken.label;

    const screenResizeHandler = () => {
      if(window.innerWidth < 1024){
        wideScreen.value = false;
      }else{
        wideScreen.value = true;
      }
    };

    screenResizeHandler();
    onMounted(() => {
      window.addEventListener("resize", screenResizeHandler);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", screenResizeHandler);
    });

     const countDuration = (timestamp) =>{
      let trxDuration = HomeUtils.countDuration(timestamp);
      return trxDuration;
    };

    const generateDatatable = async() => {
      if(!AppState.isReady){
        setTimeout(generateDatatable, 1000);
        isFetching.value = true;
        return;
      }
      let txnQueryParams = new TransactionQueryParams();
      let trx = await HomeUtils.getDiagnosticStorage();
      txnQueryParams.pageSize = 10;
      let fromHeight = trx.numBlocks - 200000;
      if(fromHeight <= 0){
        fromHeight = 1;
      }
      txnQueryParams.fromHeight = fromHeight;
      let blockDescOrderSortingField = Helper.createTransactionFieldOrder(Helper.getQueryParamOrder_v2().DESC, Helper.getTransactionSortField().BLOCK);
      txnQueryParams.updateFieldOrder(blockDescOrderSortingField);
      let txns = await TransactionUtils.searchTxns(TransactionGroupType.CONFIRMED,txnQueryParams);
      if(txns.transactions.length >0){
        let transactionSearchResult = await TransactionUtils.formatConfirmedMixedTxns(txns.transactions);
        transactions.value = transactionSearchResult;
      }
      isFetching.value = false;
    }

    //setInterval(generateDatatable, 15000);
    generateDatatable();

    emitter.on('CHANGE_NETWORK', payload => {
      isFetching.value = true;
      if(payload){
        generateDatatable();
      }
    });

    return {
      transactions,
      countDuration,
      AppState,
      Helper,
      wideScreen,
      isFetching,
      Tooltip,
      nativeTokenNamespace
    }
  }
}
</script>
