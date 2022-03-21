<template>
  <div class="border divide-y divide-gray-200 !border-collapse"> 
    <div class="font-bold text-xs ml-4 mt-4 mb-4">
        Latest Transactions
      </div>
      <div v-if="isFetching">
      <div class="flex justify-center items-center border-gray-400 mt-10 mb-10">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-navy-primary"></div>
        <span class="text-tsm">Fetching transactions</span>
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
      <Column style="width: 10px" v-if="!wideScreen">
          <template #body="{data}">
            <div class="ml-2">
              <div class="uppercase text-xxs text-gray-300 font-bold">TX Hash</div>
              <div class="uppercase text-txs text-blue-primary">{{data.hash.substring(0, 7)}}...</div>
              <div class="text-xxs text-gray-500 mb-4">{{ countDuration(data.timestamp)}} ago</div>
            </div>
          </template>
        </Column>
        <Column style="width: 229px" v-if="!wideScreen">
          <template #body="{data}">
            <div>
              <div class="uppercase text-xxs text-gray-300 font-bold -mt-3">Signer/TX Type</div>
              <div class="text-xxs text-gray-500 inline-flex">Signer:
              <div class="uppercase text-txs text-blue-primary">{{shortenedString(Helper.createAddress(data.signerAddress).pretty())}}}}</div>
            </div>
            <div class="text-xxs text-gray-500 inline-flex">Transaction Type:
              <div class="uppercase text-txs text-blue-primary">{{data.type}}</div>
            </div>
            </div>
          </template>
        </Column>
        <Column style="width:145px" v-if="!wideScreen">
          <template #body="{data}">
            <div>
              <div class="uppercase text-xxs text-gray-300 font-bold mb-1">Fee</div>
              <div class="uppercase font-bold text-txs">{{data.fee + data.amountTransfer}}</div>
              <div class="mb-7"></div>
            </div>
          </template>
        </Column>
      <Column style="width: 50px; padding-bottom: 0rem; padding-top: 0rem;padding-left: 1rem;" field="TX Hash" header="TX Hash" class="ml-4" v-if="wideScreen"> 
        <template #body="{data}">                
          <div>
            <router-link :to="{ name: 'ViewTransaction', params: {hash: data.hash}}" class="uppercase text-txs text-blue-primary inline-flex truncate w-24 mt-4"><span class="text-txs" v-tooltip.bottom="data.hash">{{data.hash.substring(0, 12)}}...</span></router-link>
            <div class="text-xxs text-gray-500 mb-4">{{countDuration(data.timestamp)}} ago</div>
          </div>
        </template> 
      </Column>
      <Column style="width: 50px; padding-bottom: 0rem; padding-top: 0rem;" field="Transaction Details" header="Signer / TX Type" v-if="wideScreen"> 
        <template #body="{data}"> 
          <div>
            <div class="text-xxs text-gray-500 inline-flex truncate w-80 mt-4">Signer:
             <router-link :to="{ name: 'ViewAccount', params: {accountParam: data.signerAddress}}" class="uppercase text-txs text-blue-primary pl-1.5"><span class="text-txs" v-tooltip.top="Helper.createAddress(data.signerAddress).pretty()">{{shortenedString(Helper.createAddress(data.signerAddress).pretty())}}</span></router-link>
            </div>
            <div class="text-xxs text-gray-500 inline-flex truncate w-80 px-px mb-4">Transaction Type:
              <div class="uppercase text-txs text-blue-primary pl-1.5">{{data.type}}</div>
            </div>
          </div>
        </template> 
      </Column>
      <Column style="width: 50px; padding-bottom: 0rem; padding-top: 0rem; padding-right: 1rem; " field="Fee" header="Fee" v-if="wideScreen"> 
        <template #body="{data}"> 
          <div>
            <div class="text-txs mt-3">{{data.fee + data.amountTransfer}}</div>
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
import { ref, onMounted, onUnmounted, watch, getCurrentInstance } from 'vue';
import { TransactionUtils } from '@/models/util/transactionUtils';
import { TransactionGroupType,TransactionQueryParams,Deadline,Order_v2 } from 'tsjs-xpx-chain-sdk';
import Tooltip from 'primevue/tooltip';
import { number } from 'mathjs';

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

    const shortenedString = (value) => {
      if(wideScreen.value == true){
        return value.substring(0, 4) + '...' + value.substring(value.length - 32, value.length);
      }else{
        return value.substring(0, 4) + '...' + value.substring(value.length - 20, value.length);
      }
    }

    const countDuration = (timestamp) =>{
      let trxDuration = "";
      const current = new Date().getTime();
      const blockTimestamp = new Date(timestamp).getTime();
      const getSeconds = parseInt(Math.abs(current-blockTimestamp)/(1000 * 60)*60);
      const getHour = Math.floor(getSeconds / 3600);
      const getMinutes = Math.floor(getSeconds / 60);

      if(getSeconds < 60){
        let second = "s";
        trxDuration = getSeconds + second ;
      }else{
        let hour = "";
        if(getHour > 0){
          
          if(getHour > 1){
            hour = " hrs";
          }else{
            hour = " hr";
          }
          trxDuration = getHour + hour;
        }else{
          let minutes = "";
          if(getMinutes > 1){
            minutes = " mins";
          }else{
            minutes = " min";
          }
          trxDuration = getMinutes + minutes;
        }
      }
      return trxDuration;
    };

    const generateDatatable = async() => {
      let txnQueryParams = new TransactionQueryParams();
      txnQueryParams.pageSize = 10;
      let trx = await AppState.chainAPI.diagnosticAPI.getDiagnosticStorage();
      txnQueryParams.fromHeight = trx.numBlocks - 10000;
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
    const init = () =>{
      generateDatatable();
    }

    if(AppState.isReady){
      generateDatatable();
    }else{
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
      shortenedString,
      Tooltip
    }
  }
}
</script>
