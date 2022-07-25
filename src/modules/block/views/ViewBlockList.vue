<template>
  <div>
    <p class="text-gray-500 mb-5 text-sm font-bold">
      Blocks
    </p>
    <div v-if="isFetching">
      <div class="flex justify-center items-center border-gray-400 mt-10">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-navy-primary mr-2"></div>
        <span class="text-tsm">Fetching Blocks</span>
      </div>
    </div>
    <div v-else>
      <DataTable
        :value="transactions"
        :paginator="false"
        :rows="Number(pages)"
        scrollDirection="horizontal"
        :alwaysShowPaginator="false"
        responsiveLayout="scroll"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        currentPageReportTemplate=""
        >
        <Column style="width: 200px" v-if="!wideScreen">
          <template #body="{data}">
            <div>
              <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-1 break-all">Block</div>
                <router-link :to="{ name: 'ViewBlock', params: { blockHeight: data.height.compact()}}" class="text-xs text-blue-600 hover:text-blue-primary  font-bold hover:underline">{{data.height.compact()}}</router-link>
            </div>
             <div>
              <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">Validator</div>
              <div class="uppercase font-bold text-xs">
                <router-link :to="{ name: 'ViewAccount', params:{ accountParam: data.signer.publicKey }}" class="truncate text-xs text-blue-600 hover:text-blue-primary hover:underline inline-flex w-40"><span class="text-ellipsis overflow-hidden">{{data.signer.publicKey}}</span>...</router-link>
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
              <div class="uppercase text-xs text-gray-300 font-bold mb-1 -mt-7">Timestamp</div>
              <div class="uppercase font-bold text-xs">{{ Helper.formatDeadline(data.timestamp.compact()) }}</div>
            </div>
            <div>
              <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">TX FEE</div>
              <div class="text-xs uppercase font-bold" >{{ TransactionUtils.convertToExactNativeAmount(data.totalFee.compact()) + " " + nativeTokenNamespace}}</div>
            </div>
            <div>
              <div class="mb-1 mt-5"></div>
              <div class="mr-2"></div>
            </div>
          </template>
        </Column>
        <Column field="timestamp" v-if="wideScreen" header="BLOCK" headerStyle="width:100px">
          <template #body="{data}">
            <router-link :to="{ name: 'ViewBlock', params: { blockHeight: data.height.compact()}}" class="text-xs text-blue-600 hover:text-blue-primary hover:underline">{{data.height.compact()}}</router-link>
          </template>
        </Column>
        <Column field="timestamp" v-if="wideScreen" header="TIMESTAMP" headerStyle="width:200px">
          <template #body="{data}">
            <span class="text-xs">{{ Helper.formatDeadline(data.timestamp.compact()) }}</span>
          </template>
        </Column>
         <Column field="signer" header="VALIDATOR" headerStyle="width:150px" v-if="wideScreen">
          <template #body="{data}">
            <router-link :to="{ name: 'ViewAccount', params:{ accountParam: data.signer.publicKey }}" class="truncate text-xs text-blue-600 hover:text-blue-primary hover:underline">{{ data.signer.publicKey}}</router-link>
          </template>
        </Column>
        <Column field="type" header="NO. OF TRANSACTIONS" headerStyle="width:150px" v-if="wideScreen">
          <template #body="{data}">
            <span class="text-xs">{{ data.numTransactions }}</span>
          </template>
        </Column>
        <Column field="block" v-if="wideScreen" header="TX FEE" headerStyle="width:120px">
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
    <div class="sm:flex sm:justify-between my-5 mb-15" v-if="transactions.length > 1">
        <div class="text-xs text-gray-700 mb-3 sm:mb-0 text-center sm:text-left">Show
          <select v-model="pages" class="border border-gray-300 rounded-md p-1" @change="changeRows">
            <option value=25>25</option>
            <option value=50>50</option>
            <option value=75>75</option>
          </select>
          Records
        </div>
        <div class="sm:flex sm:items-center text-center sm:text-right">
          <div v-if="enableFirstPage" @click="naviFirst" class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs mx-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all">First</div><div v-else class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs mx-1">First</div>
          <div v-if="enablePreviousPage" @click="naviPrevious" class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs mx-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all">Previous</div><div v-else class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs mx-1">Previous</div>
          <div class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs">Page {{ currentPage }} of {{ totalPages }}</div>
          <div v-if="enableNextPage" @click="naviNext" class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs mx-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all">Next</div><div v-else class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs mx-1">Next</div>
          <div v-if="enableLastPage" @click="naviLast" class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs ml-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all">Last</div><div v-else class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs mx-1">Last</div>
        </div>
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


    const pages = ref(25);
    const currentPage = ref(1)
    const totalPages = ref(100/25);
    
    
    const enableFirstPage = computed(() => {
      return currentPage.value > 1;
    });

    const enablePreviousPage = computed(() => {
      return currentPage.value > 1;
    });

    const enableNextPage = computed(() => {
      return (totalPages.value - currentPage.value) > 0;
    });

    const enableLastPage = computed(() => {
      return currentPage.value < totalPages.value;
    });

    const naviFirst = () => {
      currentPage.value = 1;
      isFetching.value = true;
      loadRecentBlock();
    }

    const naviPrevious = () => {
      --currentPage.value;
      isFetching.value = true;
      loadRecentBlock();
    }

    const naviNext = () => {
      ++currentPage.value;
      isFetching.value = true;
      loadRecentBlock();
    }

    const naviLast = () => {
      currentPage.value = totalPages.value;
      isFetching.value = true;
      loadRecentBlock();
    }

    const changeRows = () => {
      currentPage.value = 1;
      isFetching.value = true;
      loadRecentBlock();
    }

    const nativeTokenName = computed(()=> AppState.nativeToken.label);
    
    const transactions = ref([]);
    let loadRecentBlock = async() =>{
      if(!AppState.isReady){
        setTimeout(loadRecentBlock, 1000);
        return;
      }
      
      let block = await BlockUtils.getBlocksList(p.blockHeight);
      transactions.value = pagination(block);
      totalPages.value = Math.ceil(100 / pages.value);
      isFetching.value = false;
    };
    loadRecentBlock();

    let pagination = (blocks)=>{
      let blockValue = blocks.slice((currentPage.value-1) * pages.value, currentPage.value * pages.value);
      return blockValue;
    }

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
      BlockUtils,
      TransactionUtils,
      nativeTokenNamespace,
      pages,
      currentPage,
      totalPages,
      enableFirstPage,
      enablePreviousPage,
      enableNextPage,
      enableLastPage,
      naviFirst,
      naviPrevious,
      naviNext,
      naviLast,
      changeRows
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
