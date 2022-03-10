<template>
  <div class="border divide-y divide-gray-200" > 
    <div class="font-bold text-xs ml-4 mt-4 mb-4">
      Latest Blocks
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
              <div class="uppercase text-xxs text-gray-300 font-bold mb-1">Height</div>
              <div class="uppercase text-txs text-blue-primary mt-4">{{data.block}}</div>
              <div class="text-xxs text-gray-500 mb-4">{{ countDuration(data.timestamp)}} ago</div>
            </div>
          </template>
        </Column>
        <Column style="width: 250px" v-if="!wideScreen">
          <template #body="{data}">
            <div>
              <div class="uppercase text-xxs text-gray-300 font-bold mb-1">Validator</div>
              <div>
                <div class="uppercase text-txs text-blue-primary inline-flex truncate w-60 mt-4">{{data.signer}}</div>
                <div class="text-xxs text-gray-500 mb-4">{{data.trx}}trx</div>
              </div>
            </div>
          </template>
        </Column>
        <Column style="width: 250px" v-if="!wideScreen">
          <template #body="{data}">
            <div>
              <div class="uppercase text-xxs text-gray-300 font-bold mb-1">fee</div>
              <div class="uppercase font-bold text-txs">{{data.fee + data.amountTransfer}}</div>
              <div class="mb-7"></div>
            </div>
          </template>
        </Column>
      <Column style="width: 50px; padding-bottom: 0rem; padding-top: 0rem; padding-left: 1rem;" field="Height" header="Height" v-if="wideScreen"> 
        <template #body="{data}"> 
          <div> 
            <div class="uppercase text-txs text-blue-primary mt-4">{{data.block}}</div>
            <div class="text-xxs text-gray-500 mb-4">{{ countDuration(data.timestamp)}} ago</div>
          </div>
        </template>           
      </Column>
      <Column style="width: 50px; padding-bottom: 0rem; padding-top: 0rem;" field="Validator" header="Validator" > 
        <template #body="{data}" v-if="wideScreen"> 
          <div>
            <div class="uppercase text-txs text-blue-primary inline-flex truncate w-80 mt-4">{{data.signer}}</div>         
            <div class="text-xxs text-gray-500 mb-4">{{data.trxNumber>1?data.trxNumber+" trxs":data.trxNumber+" trx"}}</div>
          </div>
        </template> 
      </Column>
      <Column style="width: 50px; padding-bottom: 0rem; padding-top: 0rem;" field="Fee" header="Fee"> 
        <template #body="{data}" v-if="wideScreen"> 
          <div>
            <div class="text-txs mt-4">{{data.fee + data.amountTransfer}}</div>
            <div class="mb-7"></div>
          </div>
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
import { AppState } from '@/state/appState';
import { ref, onMounted, onUnmounted, watch, getCurrentInstance } from 'vue';
import { TransactionUtils } from '@/models/util/transactionUtils';
import { TransactionGroupType,TransactionQueryParams,Deadline,Order_v2 } from 'tsjs-xpx-chain-sdk';

export default{
  components: { DataTable, Column },
  name: 'LatestBlockDataTable',
  
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

    const getcurrentTimestamp = ref();
    const transactions = ref([]);
    const trxn = ref(0);
    
    const generateDatatable = async() => {
      let txnQueryParams = new TransactionQueryParams();
      txnQueryParams.pageSize = 10;
      let blockDescOrderSortingField = Helper.createTransactionFieldOrder(Helper.getQueryParamOrder_v2().DESC, Helper.getTransactionSortField().BLOCK);
      txnQueryParams.updateFieldOrder(blockDescOrderSortingField);
      let txns = await TransactionUtils.searchTxns(TransactionGroupType.CONFIRMED,txnQueryParams);
      if(txns.transactions.length > 0){
        let transactionSearchResult = await TransactionUtils.formatConfirmedMixedTxns(txns.transactions);
        transactions.value = transactionSearchResult;
        console.log(transactionSearchResult);
      }
      isFetching.value = false;
    };

  const countDuration = (timestamp) =>{
    let trxDuration = "";
    const current = new Date().getTime();
    const blockTimestamp = new Date(timestamp).getTime();
    const getMinutes = parseInt(Math.abs(current-blockTimestamp)/(1000 * 60)); 
    if(getMinutes > 59){
      let diff_hour = parseInt(Math.abs(current-blockTimestamp)/(1000 * 60 * 60) % 24);
      let hour = "";
      if(diff_hour < 2){
        hour = " hr";
      } else {
        hour = " hrs";
      }
      trxDuration = diff_hour + hour;
    } else {
      let minutes = "";
      if(getMinutes > 1){
        minutes = " mins";
      }else {
        minutes = " min";
      }
      trxDuration = getMinutes + minutes;
    }   
      return trxDuration;
    };

    
    setInterval(generateDatatable, 60000);

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
      getcurrentTimestamp,
      countDuration,
      trxn,
      wideScreen,
      isFetching
    }
  }
}
</script>

<style lang="scss" scoped>
.p-datatable-table{
  border-collapse: collapse !important;
}

</style>