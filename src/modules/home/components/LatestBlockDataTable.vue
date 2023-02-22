<template>
  <div class="border divide-y divide-gray-200"> 
    <div class="font-bold text-base ml-4 mt-4 mb-4">
      Latest Blocks
    </div>
     <div v-if="isFetching">
      <div class="flex justify-center items-center border-gray-400 mt-10 mb-10">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-navy-primary"></div>
        <span class="text-tsm ml-2">Fetching transactions</span>
      </div>
    </div>
    <div v-else>
    <DataTable
      :value="blockDataTable"
      :paginator="false"
      responsiveLayout="scroll"
      scrollDirection="horizontal"
      :alwaysShowPaginator="false"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate=""
    >
      <Column style="width: 100px" v-if="!wideScreen">
        <template #body="{data}">
          <div class="mb-2 px-4">
            <div class="uppercase text-xs text-gray-300 font-bold">Block</div>
            <div class="uppercase font-bold text-xs inline-flex mt-2"><router-link :to="{ name: 'ViewBlock', params: { blockHeight: data.height.compact()}}" class="uppercase text-xs text-blue-600 hover:text-blue-primary hover:underline inline-flex">{{data.height.compact() }}</router-link></div>
            <div class="text-xs text-gray-500 mb-4 mt-1">{{ countDuration(data.timestamp.compact()+ Deadline.timestampNemesisBlock * 1000)}} ago</div>
          </div>
        </template>
      </Column>
        <Column style="width: 180px" v-if="!wideScreen">
          <template #body="{data}">
            <div>
              <div class="uppercase text-xs text-gray-300 font-bold">Validator</div>
                <div class="uppercase font-bold text-xs text-blue-primary inline-flex mt-2"><router-link :to="{ name: 'ViewAccount', params: {accountParam: data.signer.publicKey}}" class="uppercase text-xs text-blue-600 hover:text-blue-primary hover:underline inline-flex"><span class="text-ellipsis overflow-hidden w-44">{{data.signer.publicKey}}</span>...</router-link></div>
                <div class="text-xs text-gray-500 mb-4 mt-1">{{data.numTransactions>1?data.numTransactions+" trxs":data.numTransactions+" trx"}}</div>
            </div>
          </template>
        </Column>
        <Column style="width: 100px" v-if="!wideScreen">
          <template #body="{data}">
            <div>
              <div class="uppercase text-xs text-gray-300 font-bold -mt-2 ml-1">TX FEE</div>
              <div class="uppercase font-bold text-xs mt-1 ml-1">{{ TransactionUtils.convertToExactNativeAmount(data.totalFee.compact()) + " " + nativeTokenNamespace}}</div>
              <div class="mb-7"></div>    
            </div>
          </template>
        </Column>
      <Column style="width: 50px; padding-bottom: 0rem; padding-top: 0rem; padding-left: 1rem;" field="Block" header="BLOCK" v-if="wideScreen"> 
        <template #body="{data}"> 
          <div> 
            <div class="uppercase text-xs pt-3">
            <router-link :to="{ name: 'ViewBlock', params: { blockHeight: data.height.compact()}}" class="truncate inline-block text-xs break-all text-blue-600 hover:text-blue-primary hover:underline"><span class="text-xs" v-tooltip.bottom="data.hash">{{data.height.compact()}}</span></router-link></div>
            <div class="text-txs text-gray-500 mb-4">{{ countDuration(data.timestamp.compact()+ Deadline.timestampNemesisBlock * 1000)}} ago</div>
          </div>
        </template>           
      </Column>
      <Column style="width: 20px; padding-bottom: 0rem; padding-top: 0rem;" field="Validator" header="VALIDATOR" v-if="wideScreen"> 
        <template #body="{data}" > 
          <div>
            <div class="uppercase text-xs text-blue-primary inline-flex w-72 pt-3"><router-link :to="{ name: 'ViewAccount', params: {accountParam: data.signer.publicKey}}" class="uppercase text-xs text-blue-600 hover:text-blue-primary hover:underline inline-flex"><span class="text-xs text-ellipsis overflow-hidden w-72" v-tooltip.bottom="data.signer.publicKey">{{data.signer.publicKey}}</span>...</router-link></div>         
            <div class="text-txs text-gray-500 mb-4 mt-1">{{data.numTransactions>1?data.numTransactions+" trxs":data.numTransactions+" trx"}}</div>
          </div>
        </template> 
      </Column>
      <Column style="width: 110px; padding-bottom: 0rem; padding-top: 0rem; padding-right: 1rem;" field="Fee" header="TX FEE" v-if="wideScreen"> 
        <template #body="{data}" > 
          <div>
            <div class="text-xs pt-2.5">{{ TransactionUtils.convertToExactNativeAmount(data.totalFee.compact())+" "+nativeTokenNamespace}}</div>
            <div class="mb-7"></div>
          </div>
        </template> 
      </Column> 
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { AppState } from '@/state/appState';
import { ref, onMounted, onUnmounted,  getCurrentInstance } from 'vue';
import { BlockInfo, Deadline } from 'tsjs-xpx-chain-sdk';
import { HomeUtils } from "@/util/homeUtil"
import { TransactionUtils } from '@/util/transactionUtils';


    const internalInstance = getCurrentInstance();
    const emitter = internalInstance?.appContext.config.globalProperties.emitter;
    const nativeTokenNamespace = AppState.nativeToken.label;
    const wideScreen = ref(false);
    const isFetching = ref(true);
    const blockDataTable =  ref<BlockInfo[]>([]);
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

    const getBlockDataTable = async() =>{
      if(!AppState.isReady){
        setTimeout(getBlockDataTable, 1000);
        isFetching.value = true;
        return;
      }
      let trx = await HomeUtils.getDiagnosticStorage();
      if(trx){
        let blockData = await HomeUtils.getBlocksByHeightWithLimit(trx.numBlocks);
        if(blockData){
          blockDataTable.value = blockData;
          isFetching.value = false;
        }
        
      }
      
    };
    
    const countDuration = (timestamp :number) =>{
      let trxDuration = HomeUtils.countDuration(timestamp);
      return trxDuration;
    };
    getBlockDataTable();
    //setInterval(generateDatatable, 15000);

    emitter.on('CHANGE_NETWORK', (payload:boolean)=> {
      isFetching.value = true;
      if(payload){
        getBlockDataTable();
      }
    });

  
</script>
