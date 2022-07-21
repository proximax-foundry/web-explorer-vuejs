<template> 
  <div>    
    <p class="text-gray-500 mb-5 text-sm font-bold">Block Details</p>   
    <div v-if="isShowInvalid">
      <div class="p-3 bg-yellow-100 text-yellow-700">Block is not available in {{ networkName }}</div>
    </div>
    <div v-else-if="!isShowInvalid && blockInfo.length==0">
      <div class="flex justify-center items-center border-gray-400 mt-10 mb-20">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-navy-primary mr-2"></div>
        <span class="text-tsm">Fetching Block Details</span>
      </div>
    </div>
    <div v-else>   
      <div class="filter shadow-xl border border-gray-50 p-5 mb-15">
        <div class="txn-div">
          <div>
            <div>Block Height</div>
            <div>{{blockInfo.height}}</div>
          </div>
          <div>
            <div>Timestamp</div>
            <div>{{blockInfo.timestamp}}</div>
          </div>
          <div>
            <div>Validator</div>
            <div class="break-all flex items-center">  
             <router-link :to="{ name: 'ViewAccount', params:{ accountParam: blockInfo.validator }}" class="text-blue-600 hover:text-blue-primary hover:underline mr-2" id="validatorPublicKey" :copyValue="blockInfo.validator" copySubject="Validator Public Key">{{ blockInfo.validator }}</router-link>
              <img src="@/assets/img/icon-copy.svg" @click="copy('validatorPublicKey')" class="cursor-pointer" />
            </div>
          </div>
          <div>
            <div>Hash</div>
            <div class="break-all flex items-center">
              {{blockInfo.hash}}
            </div>
          </div>
          <div>
            <div>Difficulty</div>
            <div>{{blockInfo.difficulty}}</div>
          </div>
          <div>
            <div>No. of Transaction</div>
            <div>{{blockInfo.numTransactions}}</div>
          </div>
          <div>
            <div>Total Fees</div>
            <div class="font-bold">{{ TransactionUtils.convertToExactNativeAmount(blockInfo.totalFee) }}<img src="@/assets/img/icon-xpx.svg" class="inline-block ml-2" style="top:-3 width:14px;" />
            <span class="ml-2">{{ nativeTokenNamespace }}</span> </div>
          </div>
          <div>
            <div>Fee Multiplier</div>
            <div>{{blockInfo.feeMultiplier}}</div>
          </div>
        </div>
      </div>
      <div v-if="blockInfo.numTransactions > 0">
        <p class="text-gray-500 mb-5 text-sm font-bold">
        Transactions
        </p>
        <div class="filter shadow-xl border border-gray-50 p-5 mb-15">
          <MixedTxnDataTable :transactions="transactions" :pages="pages" />
           <div class="sm:flex sm:justify-between my-5 mb-15" v-if="totalPages > 1">
      <div class="text-xs text-gray-700 mb-3 sm:mb-0 text-center sm:text-left">Show
        <select v-model="pages" class="border border-gray-300 rounded-md p-1" @change="changeRows">
          <option value=20>20</option>
          <option value=30>30</option>
          <option value=40>40</option>
          <option value=50>50</option>
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
      </div>
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance, ref, watch } from "vue";
import { BlockUtils } from "@/util/blockUtil"
import { AppState } from '@/state/appState';
import { networkState } from '@/state/networkState';
import MixedTxnDataTable from '@/modules/transaction/components/txnDataTables/MixedTxnDataTable';
// import TransactionComponent from '@/modules/block/components/TransactionComponent.vue';
import { Helper } from "@/util/typeHelper";
import { TransactionUtils } from '@/models/util/transactionUtils';
import { TransactionGroupType,TransactionQueryParams } from 'tsjs-xpx-chain-sdk';
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";

export default {
  components: { MixedTxnDataTable },
  name: 'ViewBlock',
  props: {
    blockHeight: Number
  },
  setup(p) {
    const toast = useToast();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const blockInfo = ref([]);
    const transactions = ref([]);
    const isShowInvalid = ref(null);
    const nativeTokenNamespace = AppState.nativeToken.label;
    const copy = (id) =>{ 
      let stringToCopy = document.getElementById(id).getAttribute("copyValue");
      let copySubject = document.getElementById(id).getAttribute("copySubject");
      copyToClipboard(stringToCopy);
      toast.add({severity:'info', detail: copySubject + ' copied', group: 'br', life: 3000});
    };

    const loadBlock = async() =>{
      const block = await BlockUtils.getBlockByHeight(p.blockHeight);
        if(!AppState.isReady){
          setTimeout(loadBlock, 1000);
          return;
        }
    
        if(block){
          blockInfo.value = block; 
          isShowInvalid.value = false;
        }else{
          isShowInvalid.value = true;
        }
        getTransactions();

    };  
    loadBlock();

    const pages = ref(20);
    const currentPage = ref(1)
    const totalPages = ref(0);

    
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
      getTransactions();
    }

    const naviPrevious = () => {
      --currentPage.value;
      getTransactions();
    }

    const naviNext = () => {
      ++currentPage.value;
      getTransactions();
    }

    const naviLast = () => {
      currentPage.value = totalPages.value;
      getTransactions();
    }

    const changeRows = () => {
      currentPage.value = 1;
      getTransactions();
    }

    const networkName = computed(() => {
      return networkState.chainNetworkName;
    });

    emitter.on('CHANGE_NETWORK', payload => {
      if(payload){
        loadBlock();
      }
    });

    const getTransactions = async() =>{
      if(p.blockHeight != null){
        let txnQueryParams = new TransactionQueryParams();
        txnQueryParams.height = p.blockHeight;
        txnQueryParams.pageSize = pages.value;
        txnQueryParams.pageNumber = currentPage.value;
        let txns = await TransactionUtils.searchTxns(TransactionGroupType.CONFIRMED,txnQueryParams);
        if(txns.transactions.length > 0){
          let transactionSearchResult = await TransactionUtils.formatConfirmedMixedTxns(txns.transactions);
          transactions.value = transactionSearchResult;
          totalPages.value = transactionSearchResult.pagination.totalPages;
        }
      }
    }
    getTransactions();
    const currencyDivisibility = computed(() => {
      return AppState.nativeToken.divisibility;
    })

    return {
      blockInfo,
      networkName,
      isShowInvalid,
      nativeTokenNamespace,
      Helper,
      currencyDivisibility,
      TransactionUtils,
      copy,
      transactions,
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
    @apply flex items-center border-b border-gray-100 py-4;

    > div:first-child{
      @apply w-56 text-xs pl-4 font-bold;
    }

    > div:nth-child(2){
      @apply text-xs w-full;
    }

    > div:last-child{
      @apply border-none;
    }
  }
}
</style>