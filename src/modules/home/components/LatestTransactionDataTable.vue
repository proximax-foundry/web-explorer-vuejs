<template>
  <div class="border divide-y divide-gray-200 !border-collapse"> 
    <div class="font-bold text-xs ml-4 mt-4 mb-4">
        Latest Transactions
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
              <div class="uppercase text-xxs text-gray-300 font-bold mb-1">TX Hash</div>
              <div class="uppercase text-txs text-blue-primary mt-4">{{data.hash}}</div>
              <div class="text-xxs text-gray-500 mb-4">{{ countDuration(data.timestamp)}} ago</div>
            </div>
          </template>
        </Column>
        <Column style="width: 250px" v-if="!wideScreen">
          <template #body="{data}">
            <div>
              <div class="uppercase text-xxs text-gray-300 font-bold mb-1">Addresses</div>
              <div class="text-xxs text-gray-500 inline-flex truncate w-80 mt-4">Sender:
              <div class="uppercase text-txs text-blue-primary pl-1.5">{{data.signerAddress}}</div>
            </div>
            <div class="text-xxs text-gray-500 inline-flex truncate w-84 px-px mb-4">Recipient:
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
            <div class="text-xxs text-gray-500 inline-flex truncate w-84 px-px mb-4">Recipient:
              <div class="uppercase text-txs text-blue-primary pl-1.5">{{data.recipient?data.recipient:"-"}}</div>
            </div>
          </div>
        </template> 
      </Column>
      <Column style="width: 50px; padding-bottom: 0rem; padding-top: 0rem;" field="Fee" header="Fee" v-if="wideScreen"> 
        <template #body="{data}"> 
          <div>
            <div class="text-txs mt-4">{{data.fee + data.amountTransfer}}</div>
          </div>
          <div class="mb-7"></div>
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
export default{
  components: { DataTable, Column },
  name: 'LatestBlockDataTable',
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
    const transactions = ref([]);

    const countDuration = (timestamp) =>{
      let trxDuration = "";
      const current = new Date().getTime();
      console.log("CurrentTimestamp: " + new Date().toISOString());

      const blockTimestamp = new Date(timestamp).getTime();
      console.log("Block Timestamp: " + timestamp);

      const getMinutes = parseInt(Math.abs(current-blockTimestamp)/(1000 * 60)); 

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
        return trxDuration;
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
    }

    generateDatatable();
    setInterval(generateDatatable, 60000);

    return {
      transactions,
      countDuration,
      AppState,
      Helper,
      wideScreen
    }
  }
}
</script>
