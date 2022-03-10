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
      class="w-full !border-collapse"
    >
      <Column style="width: 250px" v-if="!wideScreen">
          <template #body="{data}">
            <div>
              <div class="uppercase text-xxs text-gray-300 font-bold mb-1">TX Hash</div>
              <div class="uppercase text-txs text-blue-primary mt-3">{{data.hash}}</div>
              <div class="text-xxs text-gray-500 mb-4">{{ countDuration(data.timestamp)}} ago</div>
            </div>
          </template>
        </Column>
        <Column style="width: 250px" v-if="!wideScreen">
          <template #body="{data}">
            <div>
              <div class="uppercase text-xxs text-gray-300 font-bold mb-1">Addresses</div>
              <div class="text-xxs text-gray-500 inline-flex truncate w-80">Sender:
              <div class="uppercase text-txs text-blue-primary pl-1.5">{{data.signerAddress}}</div>
            </div>
            <div class="text-xxs text-gray-500 inline-flex truncate w-84 px-px">Recipient:
              <div class="uppercase text-txs text-blue-primary pl-1.5">{{data.recipient?data.recipient:"-"}}</div>
            </div>
            </div>
          </template>
        </Column>
        <Column style="width: 250px" v-if="!wideScreen">
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
            <div class="uppercase text-txs text-blue-primary inline-flex truncate w-24 mt-4">{{data.hash}}</div>
            <div class="text-xxs text-gray-500 mb-4">{{countDuration(data.timestamp)}} ago</div>
          </div>
        </template> 
      </Column>
      <Column style="width: 50px; padding-bottom: 0rem; padding-top: 0rem;" field="Addresses" header="Addresses" > 
        <template #body="{data}" v-if="wideScreen"> 
          <div>
            <div class="text-xxs text-gray-500 inline-flex truncate w-80 mt-4">Sender:
              <div class="uppercase text-txs text-blue-primary pl-1.5">{{data.signerAddress}}</div>
            </div>
            <div class="text-xxs text-gray-500 inline-flex truncate w-80 px-px mb-4">Recipient:
              <div class="uppercase text-txs text-blue-primary pl-1.5">{{data.recipient?data.recipient:"-"}}</div>
            </div>
          </div>
        </template> 
      </Column>
      <Column style="width: 50px; padding-bottom: 0rem; padding-top: 0rem;" field="Fee" header="Fee" v-if="wideScreen"> 
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

export default{
  components: { DataTable, Column },
  name: 'LatestTransactionDataTable',
  setup(){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const wideScreen = ref(false);
    const isFetching = ref(true);

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
    const transactions = ref([]);

    const countDuration = (timestamp) =>{
      let trxDuration = "";
      const current = new Date().getTime();

      const blockTimestamp = new Date(timestamp).getTime();

      const getMinutes = parseInt(Math.abs(current-blockTimestamp)/(1000 * 60)); 
      const getSeconds = parseInt(Math.abs(current-blockTimestamp)/(1000 * 60)*60); 

    if(getSeconds < 60){
      let second = s;
     
      trxDuration = getSeconds + second ;
    }else{
      if(getMinutes > 59){
        let diff_hour = parseInt(Math.abs(current-blockTimestamp)/(1000 * 60 * 60) % 24);
        
        let hour = "";
        if(diff_hour < 2){
          hour = " hr";
        }else{
          hour = " hrs";
        }
        trxDuration = diff_hour + hour;
      }else{
        let minutes = "";
        if(getMinutes > 1){
          minutes = " mins";
        }else {
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
      let blockDescOrderSortingField = Helper.createTransactionFieldOrder(Helper.getQueryParamOrder_v2().DESC, Helper.getTransactionSortField().BLOCK);
      txnQueryParams.updateFieldOrder(blockDescOrderSortingField);
      let txns = await TransactionUtils.searchTxns(TransactionGroupType.CONFIRMED,txnQueryParams);
      if(txns.transactions.length >0){
        let transactionSearchResult = await TransactionUtils.formatConfirmedMixedTxns(txns.transactions);
        transactions.value = transactionSearchResult;
      }
      isFetching.value = false;
    }

    setInterval(generateDatatable, 15000);
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
      isFetching
    }
  }
}
</script>
