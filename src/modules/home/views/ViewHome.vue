<template>
  <div class="border">    
    <div class="xl:grid xl:grid-cols-2 xl:mb-10 xl:gap-4 md:grid md:grid-cols-2 md:mb-5 md:gap-4 sm:mb-5 sm:grid-cols-1 sm:gap-4">
      <div>
        <div class="xl:text-base xl:font-bold md:text-base md:font-bold sm:font-bold sm:text-base ">The Sirius Explorer</div>
        <div class="xl:text-txs xl:text-justify md:text-justify	md:text-txs md:mt-4 sm:text-justify sm:text-txs sm:mt-4 sm:mb-4">Blockchain information for XPX including historical prices, the most recently mined blocks, the mempool size of unconfirmed transactions, and data for the latest transactions.</div>
      </div>
      <div>
        <!-- <div class="xl:grid xl:grid-cols-2 xl:gap-4 md:grid md:grid-cols-2 md:gap-4 sm:grid-cols-1 sm:gap-4 sm:mt-4"> -->
        <div class="grid grid-cols-2"> 

          <div>
            <div class="text-xxs text-gray-400 xl:ml-20 md:ml-20 sm:ml-0 mt-5">Latest Block</div>
            <div class="text-base font-bold xl:ml-20 md:ml-20  mb-5">{{lastestBlock==null?'Fetching...':lastestBlock}}</div>
          </div>
          
          <div>
            <div class="text-xxs text-gray-400 xl:ml-6 md:ml-6 mt-5 ">Transactions</div>
            <div class="text-base font-bold xl:ml-6 md:ml-6 mb-5">{{totalTransaction==null?'Fetching...':totalTransaction}}</div>
          </div>    
        </div>
      </div>
    </div>

    <!-- <div class="flex mb-10 gap-4"> -->
      <div class="xl:grid xl:grid-cols-2 xl:gap-4 md:grid md:grid-rows-1 md:gap-2 sm:grid sm:grid-rows-1 sm:gap-5">
      <div class="box-border h-auto" style="width: 540px">  
        <LatestBlockDataTable class="!border-collapse"></LatestBlockDataTable>
         <button class="content-center w-full h-6 text-txs text-center text-blue-primary rounded-none bg-gray-200">View all blocks</button>
      </div>
      <div class="box-content h-auto border-collapse" style="width:540px">  
        <LatestTransactionDataTable class="!border-collapse"></LatestTransactionDataTable>
        <button class="content-center w-full h-6 text-txs text-center text-blue-primary rounded-none bg-gray-200">View all transactions</button>       
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, ref, onMounted, onUnmounted } from 'vue';
import LatestBlockDataTable from '@/modules/home/components/LatestBlockDataTable.vue';
import LatestTransactionDataTable from '@/modules/home/components/LatestTransactionDataTable.vue';
import ChainUtils from '@/util/chainUtils'
import { AppState } from "@/state/appState";
import { DashboardService } from '@/services/dashboardService';
import { TransactionGroupType,TransactionQueryParams,Order_v2 } from 'tsjs-xpx-chain-sdk';
import { Helper } from '@/util/typeHelper';

export default {
  components: { LatestBlockDataTable,LatestTransactionDataTable },
  name: 'Home',
  setup(){
    const lastestBlock = ref();
    const totalTransaction = ref();

    const getChainInfo = async() => {
      let currentBlockHeight = await AppState.chainAPI.chainAPI.getBlockchainHeight();
      lastestBlock.value = currentBlockHeight;
      let trx = await AppState.chainAPI.transactionAPI.searchTransactions(TransactionGroupType.CONFIRMED);
      totalTransaction.value = trx.pagination.totalEntries;
      console.log("lastest transaction: " + totalTransaction.value);
      console.log("latest block: "+lastestBlock.value)
    };


  //   const getTransaction = async() =>{

  //     let txnQueryParams = new TransactionQueryParams();
  //     txnQueryParams.pageSize = 10;
  //     let blockDescOrderSortingField = Helper.createTransactionFieldOrder(Helper.getQueryParamOrder_v2().DESC, Helper.getTransactionSortField().BLOCK);
  //     txnQueryParams.updateFieldOrder(blockDescOrderSortingField);
  //     let txns = await AppState.chainAPI.transactionAPI.searchTransactions(TransactionGroupType.CONFIRMED,txnQueryParams);
  //     let dashboardService = new DashboardService();
  //     let transactionSearchResult = await dashboardService.formatConfirmedMixedTxns(txns.transactions);
  //     transactions.value = txns.transactions;
  //     let block = await AppState.chainAPI.blockAPI.getBlockByHeight(await AppState.chainAPI.chainAPI.getBlockchainHeight());
  //     let getTrxTimestamp = new Date(block.timestamp.compact() + Deadline.timestampNemesisBlock * 1000).getTime();
  //     let getBlockTimestamp = new Date().getTime();
  //     let diff =  parseInt(Math.abs(getBlockTimestamp-getTrxTimestamp)/(1000 * 60) % 60);
  //     console.log("different: "+diff);
  //  }
//  const generateDatatable = async() => {
//       //let formattedNamespaces = [];
//       let txnQueryParams = new TransactionQueryParams();
//       txnQueryParams.pageSize = 10;
//       let blockDescOrderSortingField = Helper.createTransactionFieldOrder(Helper.getQueryParamOrder_v2().DESC, Helper.getTransactionSortField().BLOCK);
//       txnQueryParams.updateFieldOrder(blockDescOrderSortingField);
//       let txns = await TransactionUtils.searchTransactions(TransactionGroupType.CONFIRMED,txnQueryParams);
//    let dashboardService = new DashboardService();
//      let transactionSearchResult = await dashboardService.formatConfirmedMixedTxns(txns.transactions);
//      transactions.value = txns.transactions;
//  }
//    generateDatatable();
  setInterval(getChainInfo, 60000);
    


    return{
      lastestBlock,
      totalTransaction
    }
  },
}
</script>
<style scoped>


</style>