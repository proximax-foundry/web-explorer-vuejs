<template>
  <div class="border divide-y divide-gray-200" > 
    <div class="font-bold text-xs ml-4 mt-4 mb-4 ">
      Latest Blocks
    </div>
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
              </div>
              <div class="text-xxs text-gray-500 mb-4">{{getTotalTrx(data.block)?trxn:""}}trx</div>
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
          </div>
          <div class="text-xxs text-gray-500 mb-4">{{getTotalTrx(data.block)?trxn:""}}trx</div>
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
    <template #empty>
      <div class="ml-4">
        No transaction found
      </div>
    </template>
    <template #loading>
      <div class="ml-4">
        Fetching transactions
      </div>
    </template>
  </DataTable>
  </div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { Helper } from '@/util/typeHelper';
import { AppState } from "@/state/appState";
import { ref, onMounted, onUnmounted, reactive } from 'vue';

import { TransactionUtils } from "../../../util/transactionUtils";
import { TransactionGroupType,TransactionQueryParams,Deadline,Order_v2 } from 'tsjs-xpx-chain-sdk';
import { DashboardService } from '@/services/dashboardService';
import { ChainUtils } from "../../../util/chainUtils";

export default{
  components: { DataTable, Column },
  name: 'LatestTransactionDataTable',
  
  setup(){
    const wideScreen = ref(false);
    const screenResizeHandler = () => {
      if(window.innerWidth < 1024){
        console.log(false);
        wideScreen.value = false;
      }else{
        console.log(true);
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

    
    const getTotalTrx = async(blockheight)=>{
      //let data = false;     
      try {
      let trx = await AppState.chainAPI.blockAPI.getBlockByHeight(blockheight);
      
        //test =  
       trxn.value = trx.numTransactions;
      }catch(error){
        console.log(error);
      }

     
      //console.log("trx value: " +trxn.value + "blockheight: " + blockheight + "data: " +data);
      
    };
    
    const generateDatatable = async() => {
      let txnQueryParams = new TransactionQueryParams();
      txnQueryParams.pageSize = 10;
      let blockDescOrderSortingField = Helper.createTransactionFieldOrder(Helper.getQueryParamOrder_v2().DESC, Helper.getTransactionSortField().BLOCK);
      txnQueryParams.updateFieldOrder(blockDescOrderSortingField);
      let txns = await TransactionUtils.searchTransactions(TransactionGroupType.CONFIRMED,txnQueryParams);
      let dashboardService = new DashboardService();
      let transactionSearchResult = await dashboardService.formatConfirmedMixedTxns(txns.transactions);
      transactions.value = transactionSearchResult;
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

    generateDatatable();
    setInterval(generateDatatable, 60000);

    return {
      transactions,
      getcurrentTimestamp,
      countDuration,
      getTotalTrx,
      trxn,
      wideScreen
      //loadDataTable,
      //generateDatatable

    }
  }
}
</script>

<style lang="scss" scoped>
.p-datatable-table{
  border-collapse: collapse !important;
}

</style>