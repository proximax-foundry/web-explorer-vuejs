<template>
  <div>
    <p class="text-gray-500 mb-5 text-sm font-bold">
      Transactions
    </p>
    <div v-if="isFetching">
      <div class="flex justify-center items-center border-gray-400 mt-15">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-navy-primary mr-2"></div>
        <span class="text-tsm">Fetching transactions</span>
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
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate=""
        :globalFilterFields="['recipient','sender', 'signerAddress', 'type']"
        >
        <Column style="width: 200px" v-if="!wideScreen">
          <template #body="{data}">
            <div>
              <div class="uppercase text-xxs text-gray-300 font-bold mb-1 break-all">Tx Hash</div>
              <router-link class="uppercase font-bold text-txs block text-blue-600 hover:text-blue-primary hover:underline" :to="{ name: 'ViewTransaction', params:{ hash: data.hash }}">
                <span class="text-txs break-all hover:underline hover:text-blue-primary" v-tooltip.right="data.hash">{{data.hash }}</span>
              </router-link>
            </div>
            <div>
              <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">Type</div>
              <div class="flex items-center">
                <div class="uppercase font-bold text-txs mr-2">{{data.type}}</div>
              </div>
            </div>
            <div>
              <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5" v-if="data.recipient != '' && data.recipient != null">Receipient</div>
              <div class="uppercase font-bold text-txs">
                <span v-if="data.recipient === '' || data.recipient === null"></span>
                <router-link :to="{ name: 'ViewAccount', params:{ accountParam: data.recipient }}" v-tooltip.right="Helper.createAddress(data.recipient).pretty()" v-else class="truncate inline-block text-txs break-all text-blue-600 hover:text-blue-primary hover:underline">{{ Helper.createAddress(data.recipient).pretty() }}</router-link>
              </div>
            </div>
          </template>
        </Column>
        <Column style="width: 200px" v-if="!wideScreen">
          <template #body="{data}">
            <div>
              <div class="uppercase text-xxs text-gray-300 font-bold mb-1">Timestamp</div>
              <div class="uppercase font-bold text-txs">{{ Helper.convertDisplayDateTimeFormat24(data.timestamp) }}</div>
            </div>
            <div>
              <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">Sender</div>
              <div class="uppercase font-bold text-txs">
                <span v-if="data.sender === '' || data.sender === null"></span>
                <router-link :to="{ name: 'ViewAccount', params:{ accountParam: data.sender }}" v-else v-tooltip.right="Helper.createAddress(data.sender).pretty()" class="truncate inline-block text-txs break-all text-blue-600 hover:text-blue-primary hover:underline">
                  {{ data.sender.substring(0, 20) }}...
                </router-link>
              </div>
            </div>
            <div>
              <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">Tx Amount</div>
              <div class="text-txs uppercase font-bold" >{{ data.amountTransfer ? data.amountTransfer:'-' }} <b v-if="data.amountTransfer">{{ nativeTokenName }}</b></div>
            </div>
          </template>
        </Column>
        <Column field="hash" header="TX HASH" headerStyle="width:100px" v-if="wideScreen">
          <template #body="{data}">
            <router-link :to="{ name: 'ViewTransaction', params:{ hash: data.hash }}" class="text-txs text-blue-600 hover:text-blue-primary hover:underline" v-tooltip.bottom="data.hash">{{data.hash.substring(0, 15) }}...</router-link>
          </template>
        </Column>
        <Column field="timestamp" v-if="wideScreen" header="TIMESTAMP" headerStyle="width:110px">
          <template #body="{data}">
            <span class="text-txs">{{ Helper.convertDisplayDateTimeFormat24(data.timestamp) }}</span>
          </template>
        </Column>
        <Column field="type" header="TYPE" headerStyle="width:110px" v-if="wideScreen">
          <template #body="{data}">
            <span class="text-txs">{{data.type}}</span>
          </template>
        </Column>
        <Column field="block" v-if="wideScreen" header="BLOCK" headerStyle="width:110px">
          <template #body="{data}">
            <div class="text-txs">{{ data.block }}</div>
          </template>
        </Column>
        <Column field="signer" header="SENDER" headerStyle="width:110px" v-if="wideScreen">
          <template #body="{data}">
            <span v-if="data.sender === '' || data.sender === null"></span>
            <router-link :to="{ name: 'ViewAccount', params:{ accountParam: data.sender }}" v-else v-tooltip.bottom="Helper.createAddress(data.sender).pretty()" class="truncate inline-block text-txs text-blue-600 hover:text-blue-primary hover:underline">
              {{ shortenedAddress(Helper.createAddress(data.sender).pretty()) }}
            </router-link>
          </template>
        </Column>
        <Column field="recipient" header="RECIPIENT" headerStyle="width:110px" v-if="wideScreen">
          <template #body="{data}">
            <span v-if="data.recipient === '' || data.recipient === null"></span>
            <router-link :to="{ name: 'ViewAccount', params:{ accountParam: data.recipient }}" v-tooltip.bottom="Helper.createAddress(data.recipient).pretty()" v-else class="truncate inline-block text-txs text-blue-600 hover:text-blue-primary hover:underline">{{ shortenedAddress(Helper.createAddress(data.recipient).pretty()) }}</router-link>
          </template>
        </Column>
        <Column header="TX FEE" v-if="wideScreen" headerStyle="width:110px">
          <template #body="{data}">
            <div class="text-txs">{{ data.fee }} <b v-if="data.fee">{{ nativeTokenName }}</b></div>
          </template>
        </Column>
        <Column header="AMOUNT" headerStyle="width:110px" v-if="wideScreen">
          <template #body="{data}">
            <div class="text-txs" >{{ data.amountTransfer ? data.amountTransfer:'-' }} <b v-if="data.amountTransfer">{{ nativeTokenName }}</b></div>
          </template>
        </Column>
        <Column header="SDA" headerStyle="width:40px" v-if="wideScreen">
          <template #body="{data}">
            <div>
              <img src="@/modules/transaction/img/icon-sda.svg" class="inline-block" v-if="checkOtherAsset(data.sda)" v-tooltip.left="'<tiptitle>Sirius Digital Asset</tiptitle><tiptext>' + displaySDAs(data.sda) + '</tiptext>'">
              <span v-else>-</span>
            </div>
          </template>
        </Column>
        <Column header="MESSAGE" headerStyle="width:40px" v-if="wideScreen">
          <template #body="{data}">
            <div>
              <img src="@/modules/transaction/img/icon-message.svg" v-tooltip.left="'<tiptitle>' + data.messageTypeTitle + '</tiptitle><tiptext>' + data.message + '</tiptext>'" class="inline-block" v-if="data.message && data.messageType !== 1">
              <div v-else class="w-full text-center">-</div>
            </div>
          </template>
        </Column>
        <template #empty>
          No transaction found
        </template>
        <template #loading>
          Fetching transactions
        </template>
      </DataTable>
      <div class="flex justify-between my-5 mb-15" v-if="transactions.length > 20">
        <div class="text-xs text-gray-700">Show
          <select v-model="pages" class="border border-gray-300 rounded-md p-1" @change="changeRows">
            <option value=10>10</option>
            <option value=20>20</option>
            <option value=30>30</option>
            <option value=40>40</option>
            <option value=50>50</option>
          </select>
          Records
        </div>
        <div class="flex items-center">
          <div v-if="enableFirstPage" @click="naviFirst" class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs mx-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all">First</div><div v-else class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs">First</div>
          <div v-if="enablePreviousPage" @click="naviPrevious" class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs mx-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all">Previous</div><div v-else class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs">Previous</div>
          <div class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs">Page {{ currentPage }} of {{ totalPages }}</div>
          <div v-if="enableNextPage" @click="naviNext" class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs mx-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all">Next</div><div v-else class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs">Next</div>
          <div v-if="enableLastPage" @click="naviLast" class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs ml-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all">Last</div><div v-else class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs">Last</div>
        </div>
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
// import { TransactionFilterTypes } from '@/models/transactions/transactionFilterType';
import { TransactionUtils } from '@/models/util/transactionUtils';
import Tooltip from 'primevue/tooltip';

export default {
  name: 'ViewTransactionList',
  components: {
    DataTable,
    Column
  },
  directives: {
    'tooltip': Tooltip
  },
  props: {
    hash: String
  },
  setup(){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const isFetching = ref(true);
    const wideScreen = ref(false);
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

    const nativeTokenName = computed(()=> AppState.nativeToken.label);

    const displaySDAs = (sdas) => {
      let sda_rows = [];
      if(sdas.length > 0){
        for(const sda of sdas){
          let asset_div = displayAssetDiv(sda);
          sda_rows.push(asset_div);
        }
        return sda_rows.join("<br>");
      }
    }

    const checkOtherAsset = (assets) => {
      if(assets){
        if(assets.length > 0){
          return true;
        }
      }
      return false;
    }

    const displayAssetDiv = (sda) => {
      let asset_div;
      let assetArray = []
      assetArray.push(sda.id);

      if(sda.currentAlias && sda.currentAlias.length){
        asset_div = (sda.amount + ' ' + sda.currentAlias[0].name);
      }
      else{
        asset_div = (sda.amount + ' - ' + sda.id);
      }
      return asset_div;
    }

    const shortenedAddress = (address) => {
      return address.substring(0, 4) + '...' + address.substring(address.length - 4, address.length);
      // return address;
    }

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
      loadRecentTransferTransactions();
    }

    const naviPrevious = () => {
      --currentPage.value;
      loadRecentTransferTransactions();
    }

    const naviNext = () => {
      ++currentPage.value;
      loadRecentTransferTransactions();
    }

    const naviLast = () => {
      currentPage.value = totalPages.value;
      loadRecentTransferTransactions();
    }

    const changeRows = () => {
      loadRecentTransferTransactions();
    }

    const transactions = ref([]);
    let transactionGroupType = Helper.getTransactionGroupType();
    let blockDescOrderSortingField = Helper.createTransactionFieldOrder(Helper.getQueryParamOrder_v2().DESC, Helper.getTransactionSortField().BLOCK);

    let loadRecentTransferTransactions = async() =>{
      isFetching.value = true;
      if(!AppState.isReady){
        setTimeout(loadRecentTransferTransactions, 1000);
      }
      let txnQueryParams = Helper.createTransactionQueryParams();
      let blockHeight = await AppState.chainAPI.chainAPI.getBlockchainHeight();
      txnQueryParams.pageSize = pages.value;
      txnQueryParams.pageNumber = currentPage.value;
      txnQueryParams.embedded = false;
      txnQueryParams.fromHeight = blockHeight - 20000;
      txnQueryParams.updateFieldOrder(blockDescOrderSortingField);

      let transactionSearchResult = await TransactionUtils.searchTxns(transactionGroupType.CONFIRMED, txnQueryParams);

      if(transactionSearchResult.transactions.length > 0){
        let formattedTxns = await TransactionUtils.formatConfirmedMixedTxns(transactionSearchResult.transactions);
        transactions.value = formattedTxns;
        totalPages.value = transactionSearchResult.pagination.totalPages;
      }else{
        transactions.value = []
      }
      isFetching.value = false;
    };
    loadRecentTransferTransactions();

    emitter.on('CHANGE_NETWORK', payload => {
      isFetching.value = true;
      if(payload){
        loadRecentTransferTransactions();
      }
    });

    return {
      isFetching,
      wideScreen,
      transactions,
      nativeTokenName,
      checkOtherAsset,
      displaySDAs,
      Helper,
      shortenedAddress,
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
      changeRows,
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
