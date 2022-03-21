<template>
  <div class="border">    
    <div class="xl:grid xl:grid-cols-2 xl:mb-10 xl:gap-4 md:grid md:grid-cols-2 md:mb-5 md:gap-4 sm:mb-5 sm:grid-cols-1 sm:gap-4">
      <div>
        <div class="xl:text-base xl:font-bold md:text-base md:font-bold sm:font-bold sm:text-base ">The Sirius Explorer</div>
        <div class="xl:text-txs xl:text-justify md:text-justify	md:text-txs md:mt-4 sm:text-justify sm:text-txs sm:mt-4 sm:mb-4">Blockchain information for XPX including historical prices, the most recently mined blocks, the mempool size of unconfirmed transactions, and data for the latest transactions.</div>
      </div>
      <div>
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
      <div class="xl:grid xl:grid-cols-2 xl:gap-4 md:grid md:grid-rows-1 md:gap-2 sm:grid sm:grid-rows-1 sm:gap-5">
      <div class="box-border h-auto" style="width: 540px">  
        <LatestBlockDataTable class="!border-collapse"></LatestBlockDataTable>
         <button class="content-center w-full h-6 text-txs text-center text-blue-primary rounded-none bg-gray-200">View all blocks</button>
      </div>
      <div class="box-content h-auto border-collapse" style="width:540px">  
        <LatestTransactionDataTable class="!border-collapse"></LatestTransactionDataTable>
        <button class="content-center w-full h-6 text-txs text-center text-blue-primary rounded-none bg-gray-200" @click="showTransactionList">View all transactions</button>       
      </div>
      <br>
    </div>
  </div>
</template>

<script>
import { ref, getCurrentInstance,watch } from 'vue';
import LatestBlockDataTable from '@/modules/home/components/LatestBlockDataTable.vue';
import LatestTransactionDataTable from '@/modules/home/components/LatestTransactionDataTable.vue';
import { AppState } from '@/state/appState';
import { useRouter } from "vue-router";

export default {
  components: { LatestBlockDataTable,LatestTransactionDataTable },
  name: 'Home',
  setup(){
    const router = useRouter();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const lastestBlock = ref();
    const totalTransaction = ref();

    const getChainInfo = async() => {
      let trx = await AppState.chainAPI.diagnosticAPI.getDiagnosticStorage();
      totalTransaction.value = trx.numTransactions;
      lastestBlock.value = trx.numBlocks;
    };
     // setInterval(getChainInfo, 15000);
     //getChainInfo();
    const showTransactionList = () =>{
      router.push({ name: "ViewTransactionList"});
    }
    
    emitter.on('CHANGE_NETWORK', payload => {
      if(payload){
        getChainInfo();
      }
    });

    if(AppState.isReady){
      getChainInfo();
    }else{
      let readyWatcher = watch(AppState, (value) => {
        if(value.isReady){
          getChainInfo();
          readyWatcher();
        }
      });
    }
    return{
      lastestBlock,
      totalTransaction,
      showTransactionList
    }
  },
}
</script>
<style scoped>


</style>