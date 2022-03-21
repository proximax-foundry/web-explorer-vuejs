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
    >
        <Column style="width: 30px" v-if="!wideScreen">
          <template #body="{data}">
            <div class="ml-2">
              <div class="uppercase text-xxs text-gray-300 font-bold">Height</div>
              <div class="uppercase text-txs text-blue-primary">{{data.height.compact() }}</div>
              <div class="text-xxs text-gray-500 mb-4">{{ countDuration(data.timestamp.compact()+ Deadline.timestampNemesisBlock * 1000)}} ago</div>
            </div>
          </template>
        </Column>
        <Column style="width: 100px" v-if="!wideScreen">
          <template #body="{data}">
            <div>
              <div class="uppercase text-xxs text-gray-300 font-bold">Validator</div>
              <div>
                <div class="uppercase text-txs text-blue-primary inline-flex">{{shortenedPublicKey(data.signer.publicKey)}}</div>
                <div class="text-xxs text-gray-500 mb-4">{{data.numTransactions>1?data.numTransactions+" trxs":data.numTransactions+" trx"}}</div>
              </div>
            </div>
          </template>
        </Column>
        <Column style="width: 120px" v-if="!wideScreen">
          <template #body="{data}">
            <div>
              <div class="uppercase text-xxs text-gray-300 font-bold">fee</div>
              <div class="uppercase font-bold text-txs">{{data.totalFee.lower}}</div>
              <div class="mb-7"></div>
            </div>
          </template>
        </Column>
      <Column style="width: 50px; padding-bottom: 0rem; padding-top: 0rem; padding-left: 1rem;" field="Height" header="Height" v-if="wideScreen"> 
        <template #body="{data}"> 
          <div> 
            <div class="uppercase text-txs text-blue-primary mt-4">{{data.height.compact() }}</div>
            <div class="text-xxs text-gray-500 mb-4">{{ countDuration(data.timestamp.compact()+ Deadline.timestampNemesisBlock * 1000)}} ago</div>
          </div>
        </template>           
      </Column>
      <Column style="width: 50px; padding-bottom: 0rem; padding-top: 0rem;" field="Validator" header="Validator" v-if="wideScreen"> 
        <template #body="{data}" > 
          <div>
            <router-link :to="{ name: 'ViewAccount', params: {accountParam: data.signer.publicKey}}" class="uppercase text-txs inline-flex w-80 mt-4 text-blue-600 hover:text-blue-primary hover:underline"><span class="text-txs" v-tooltip.bottom="data.signer.publicKey">{{shortenedPublicKey(data.signer.publicKey)}}</span></router-link>        
            <div class="text-xxs text-gray-500 mb-4">{{data.numTransactions>1?data.numTransactions+" trxs":data.numTransactions+" trx"}}</div>
          </div>
        </template> 
      </Column>
      <Column style="width: 50px; padding-bottom: 0rem; padding-top: 0rem; padding-right: 1rem;" field="Fee" header="Fee" v-if="wideScreen"> 
        <template #body="{data}" > 
          <div>
            <div class="text-txs mt-4">{{data.totalFee.lower}}</div>
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
import { AppState } from '@/state/appState';
import { ref, onMounted, onUnmounted, watch, getCurrentInstance } from 'vue';
import { Deadline, LimitType } from 'tsjs-xpx-chain-sdk';
import Tooltip from 'primevue/tooltip';

export default{
  components: { DataTable, Column },
  name: 'LatestBlockDataTable',
  directives: {
    'tooltip': Tooltip
  },
  setup(){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const wideScreen = ref(false);
    const isFetching = ref(true);
    const getcurrentTimestamp = ref();
    const transactions = ref([]);
    const trxn = ref(0);
    
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

    const shortenedPublicKey = (publicKey) => {
      if(wideScreen.value == true){
         return publicKey.substring(0, 4) + '...' + publicKey.substring(publicKey.length - 48, publicKey.length);
      }else{
        return publicKey.substring(0, 4) + '...' + publicKey.substring(publicKey.length - 22, publicKey.length);
      }
    }
    const generateDatatable = async() => {
      let trx = await AppState.chainAPI.diagnosticAPI.getDiagnosticStorage();
      let txns = await AppState.chainAPI.blockAPI.getBlocksByHeightWithLimit(trx.numBlocks,LimitType.N_25);
       
      if(txns.length > 0){            
        if(txns.length > 10){
          let trx = txns.slice(0,10);
          transactions.value = trx;
        }else{
          transactions.value = txns;
        }
      }
      isFetching.value = false;
    };
   

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
      getcurrentTimestamp,
      countDuration,
      trxn,
      wideScreen,
      isFetching,
      shortenedPublicKey,
      Deadline,
      Tooltip
    }
  }
}
</script>

<style lang="scss" scoped>
.p-datatable-table{
  border-collapse: collapse !important;
}

</style>