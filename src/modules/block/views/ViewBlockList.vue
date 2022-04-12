<template>
  <div>
    <p class="text-gray-500 mb-5 text-sm font-bold">
      Blocks
    </p>
    <div v-if="isFetching">
      <div class="flex justify-center items-center border-gray-400 py-30">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-navy-primary mr-2"></div>
        <span class="text-tsm">Fetching Blocks</span>
      </div>
    </div>
    <div v-else>
      <DataTable
        :value="transactions"
        :paginator="true"
        :rows="10"
        scrollDirection="horizontal"
        :alwaysShowPaginator="true"
        responsiveLayout="scroll"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        currentPageReportTemplate=""
        >
        <Column style="width: 200px" v-if="!wideScreen">
          <template #body="{data}">
            <div>
              <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-1 break-all">Height</div>
                <router-link :to="{ name: 'ViewBlock', params: { blockHeight: data.height.compact()}}" class="text-xs text-blue-600 hover:text-blue-primary  font-bold hover:underline">{{data.height.compact()}}</router-link>
            </div>
             <div>
              <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">Validator</div>
              <div class="uppercase font-bold text-xs">
                <router-link :to="{ name: 'ViewAccount', params:{ accountParam: data.signer.address.plain() }}" class="truncate text-xs text-blue-600 hover:text-blue-primary hover:underline">{{shortenedString(data.signer.address.pretty())}}</router-link>
              </div>
            </div>
            <div>
              <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">No. of Transactions</div>
              <div class="flex items-center">
                <div class="uppercase font-bold text-xs mr-2">{{data.numTransactions}}</div>
              </div>
            </div>
          </template>
        </Column>
        <Column style="width: 200px" v-if="!wideScreen">
          <template #body="{data}">
            <div>
              <div class="uppercase text-xs text-gray-300 font-bold mb-1 -mt-6">Timestamp</div>
              <div class="uppercase font-bold text-xs">{{ BlockUtils.fmtTime(data.timestamp.compact()) }}</div>
            </div>
            <div>
              <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">Fee</div>
              <div class="text-xs uppercase font-bold" >{{ TransactionUtils.convertToExactNativeAmount(data.totalFee.compact()) + " " + nativeTokenNamespace}}</div>
            </div>
            <div>
              <div class="mb-1 mt-5"></div>
              <div class="mr-2"></div>
            </div>
          </template>
        </Column>
        <Column field="timestamp" v-if="wideScreen" header="HEIGHT" headerStyle="width:100px">
          <template #body="{data}">
            <router-link :to="{ name: 'ViewBlock', params: { blockHeight: data.height.compact()}}" class="text-xs text-blue-600 hover:text-blue-primary hover:underline">{{data.height.compact()}}</router-link>
          </template>
        </Column>
        <Column field="timestamp" v-if="wideScreen" header="TIMESTAMP" headerStyle="width:150px">
          <template #body="{data}">
            <span class="text-xs">{{ BlockUtils.fmtTime(data.timestamp.compact()) }}</span>
          </template>
        </Column>
         <Column field="signer" header="SIGNER" headerStyle="width:150px" v-if="wideScreen">
          <template #body="{data}">
            <router-link :to="{ name: 'ViewAccount', params:{ accountParam: data.signer.address.plain() }}" class="truncate text-xs text-blue-600 hover:text-blue-primary hover:underline">{{ data.signer.address.pretty()}}</router-link>
          </template>
        </Column>
        <Column field="type" header="NO. OF TRANSACTIONS" headerStyle="width:150px" v-if="wideScreen">
          <template #body="{data}">
            <span class="text-xs">{{ data.numTransactions }}</span>
          </template>
        </Column>
        <Column field="block" v-if="wideScreen" header="FEE" headerStyle="width:120px">
          <template #body="{data}">
            <span class="text-xs">{{ TransactionUtils.convertToExactNativeAmount(data.totalFee.compact()) + " " +nativeTokenNamespace}}</span>
          </template>
        </Column>
        <template #empty>
          No transaction found
        </template>
        <template #loading>
          Fetching transactions
        </template>
      </DataTable>
      <div class="mb-12"></div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, getCurrentInstance, inject, ref, watch, onMounted, onUnmounted } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { AppState } from '@/state/appState';
import { Helper } from "@/util/typeHelper";
import { BlockUtils } from "@/util/blockUtil";
import { TransactionUtils } from "@/models/util/transactionUtils";
import Tooltip from 'primevue/tooltip';

export default {
  name: 'ViewBlockList',
  components: {
    DataTable,
    Column
  },
  directives: {
    'tooltip': Tooltip
  },
  props: {
    blockHeight: Array
  },
  setup(p){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const isFetching = ref(true);
    const wideScreen = ref(false);
    const nativeTokenNamespace = AppState.nativeToken.label;

    const screenResizeHandler = () => {
      if(window.innerWidth < 1024){
        wideScreen.value = false;
      }else{
        wideScreen.value = true;
      }
    };
    screenResizeHandler();

    onUnmounted(() => {
      window.removeEventListener("resize", screenResizeHandler);
    });
   
    onMounted(() => {
      window.addEventListener("resize", screenResizeHandler);
    });

    const shortenedString = (value) => {
      if(wideScreen.value == true){
        return value.substring(0, 4) + '...' + value.substring(value.length - 32, value.length);
      }else{
        return value.substring(0, 4) + '...' + value.substring(value.length - 20, value.length);
      }
    }

    const nativeTokenName = computed(()=> AppState.nativeToken.label);
    
    const shortenedAddress = (address) => {
      return address.substring(0, 4) + '...' + address.substring(address.length - 4, address.length);
    }
    
    const transactions = ref([]);
    let loadRecentBlock = async() =>{
      if(!AppState.isReady){
        setTimeout(loadRecentBlock, 1000);
      }
      let block = await BlockUtils.getBlocksList(p.blockHeight);
      transactions.value = block;
      isFetching.value = false;
      return;
    };
    loadRecentBlock();
    
    emitter.on('CHANGE_NETWORK', payload => {
      isFetching.value = true;
      if(payload){
        loadRecentBlock();
      }
    });

    return {
      isFetching,
      wideScreen,
      transactions,
      nativeTokenName,
      Helper,
      shortenedAddress,
      BlockUtils,
      TransactionUtils,
      shortenedString,
      nativeTokenNamespace
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.txn-div{
  @apply text-gray-800 text-xs;
  > div{
    @apply flex justify-start items-center border-b border-gray-100 py-4;

    > div:first-child{
      @apply w-40 text-xs pl-4 font-bold;
    }

    > div:nth-child(2){
      @apply text-xs;
    }

    > div:nth-child(3){
      @apply ml-7 w-36 text-xs pl-4 font-bold;
    }

    > div:last-child{
      @apply border-none;
    }
  }
}
</style>
