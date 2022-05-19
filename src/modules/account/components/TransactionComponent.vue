<template>
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
              <div class="uppercase text-xs text-gray-300 font-bold mb-1">Tx Hash</div>
              <router-link class="uppercase font-bold text-xs block" :to="{ name: 'ViewTransaction', params:{ hash: data.hash }}">
                <span class="text-blue-600 hover:text-blue-primary hover:underline inline-flex text-ellipsis overflow-hidden w-44" v-tooltip.right="data.hash">{{ data.hash }}</span>...
              </router-link>
            </div>
            <div>
              <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">Type</div>
              <div class="flex items-center">
                <div class="uppercase font-bold text-xs mr-2">{{data.type}}</div>
              </div>
            </div>
            <div>
              <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">Recipient</div>
              <div class="uppercase font-bold text-xs">
                <!-- <span v-if="data.recipient === '' || data.recipient === null"></span> -->
                <div v-if="data.recipient === '' || data.recipient === null">-</div>
                <router-link :to="{ name: 'ViewAccount', params:{ accountParam: data.recipient }}" v-else v-tooltip.right="Helper.createAddress(data.recipient).pretty()"  class="truncate inline-block text-xs break-all text-blue-600 hover:text-blue-primary hover:underline w-44"><span class="text-ellipsis overflow-hidden">{{ Helper.createAddress(data.recipient).pretty()}}</span>...</router-link>
              </div>
            </div>
          </template>
        </Column>
        <Column style="width: 200px" v-if="!wideScreen">
          <template #body="{data}">
            <div>
              <div class="uppercase text-xs text-gray-300 font-bold mb-1">Timestamp</div>
              <div class="uppercase font-bold text-xs">{{ Helper.convertDisplayDateTimeFormat24(data.timestamp) }}</div>
            </div>
            <div>
              <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">From</div>
              <div class="uppercase font-bold text-xs">
                <span v-if="data.sender === '' || data.sender === null">-</span>
                <router-link :to="{ name: 'ViewAccount', params:{ accountParam: data.sender }}" v-else v-tooltip.bottom="Helper.createAddress(data.sender).pretty()" class="truncate inline-block text-xs break-all text-blue-600 hover:text-blue-primary hover:underline w-44"><span class="text-ellipsis overflow-hidden">
                  {{ Helper.createAddress(data.sender).pretty() }}</span>
                </router-link>
              </div>
            </div>
            <div>
              <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">Tx Amount</div>
              <div class="text-xs uppercase font-bold" >{{ data.amountTransfer ? Helper.toCurrencyFormat(data.amountTransfer, currencyDivisibility):'-' }} <b v-if="data.amountTransfer">{{ nativeTokenName }}</b></div>
            </div>
          </template>
        </Column>
        <Column field="hash" header="TX HASH" headerStyle="width:100px" v-if="wideScreen">
          <template #body="{data}">
            <router-link :to="{ name: 'ViewTransaction', params:{ hash: data.hash }}" class="text-xs text-blue-600 hover:text-blue-primary hover:underline inline-flex w-24" v-tooltip.bottom="data.hash"><span class="text-ellipsis overflow-hidden">{{data.hash}}</span>...</router-link>
          </template>
        </Column>
        <Column field="timestamp" v-if="wideScreen" header="TIMESTAMP" headerStyle="width:120px">
          <template #body="{data}">
            <span class="text-xs">{{ Helper.convertDisplayDateTimeFormat24(data.timestamp) }}</span>
          </template>
        </Column>
        <Column field="type" header="TYPE" headerStyle="width:120px" v-if="wideScreen">
          <template #body="{data}">
            <span class="text-xs">{{data.type}}</span>
          </template>
        </Column>
        <Column field="block" v-if="wideScreen" header="BLOCK" headerStyle="width:60px">
          <template #body="{data}">
            <div class="text-xs"><router-link :to="{ name: 'ViewBlock', params: { blockHeight: data.block}}" class="text-blue-600 hover:text-blue-primary hover:underline">{{ data.block }}</router-link></div>
          </template>
        </Column>
        <Column field="signer" header="FROM" headerStyle="width:110px" v-if="wideScreen">
          <template #body="{data}">
            <span v-if="data.sender === '' || data.sender === null"></span>
            <router-link :to="{ name: 'ViewAccount', params:{ accountParam: data.sender }}" v-else v-tooltip.bottom="Helper.createAddress(data.sender).pretty()" class="truncate text-xs text-blue-600 hover:text-blue-primary hover:underline inline-flex w-28"><span class="text-ellipsis overflow-hidden">{{ Helper.createAddress(data.sender).pretty() }}</span>...
            </router-link>
          </template>
        </Column>
        <Column field="recipient" header="RECIPIENT" headerStyle="width:110px" v-if="wideScreen">
          <template #body="{data}">
            <span v-if="data.recipient === '' || data.recipient === null"></span>
            <router-link :to="{ name: 'ViewAccount', params:{ accountParam: data.recipient }}" v-tooltip.bottom="Helper.createAddress(data.recipient).pretty()" v-else class="truncate text-xs text-blue-600 hover:text-blue-primary hover:underline inline-flex w-28"><span class="text-ellipsis overflow-hidden">{{ Helper.createAddress(data.recipient).pretty() }}</span>...</router-link>
          </template>
        </Column>
        <Column header="TX FEE" v-if="wideScreen" headerStyle="width:110px">
          <template #body="{data}">
            <div class="text-xs">{{ data.fee }} <b v-if="data.fee==0 || data.fee> 0">{{ nativeTokenName }}</b></div>
          </template>
        </Column>
        <Column header="AMOUNT" headerStyle="width:110px" v-if="wideScreen">
          <template #body="{data}">
            <div class="text-xs" >{{ data.amountTransfer ? Helper.toCurrencyFormat(data.amountTransfer, currencyDivisibility):'-' }} <b v-if="data.amountTransfer">{{ nativeTokenName }}</b></div>
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
    <div class="sm:flex sm:justify-between my-5 mb-15" v-if="totalPages > 1">
      <div class="text-xs text-gray-700 mb-3 sm:mb-0 text-center sm:text-left">Show
        <select v-model="pages" class="border border-gray-300 rounded-md p-1" @change="changeRows">
          <option value=10>10</option>
          <option value=20>20</option>
          <option value=30>30</option>
          <option value=40>40</option>
          <option value=50>50</option>
        </select>
        Records
      </div>
      <div class="sm:flex sm:items-center text-center sm:text-right">
        <div v-if="enableFirstPage" @click="naviFirst" class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs mx-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all">First</div><div v-else class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs">First</div>
        <div v-if="enablePreviousPage" @click="naviPrevious" class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs mx-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all">Previous</div><div v-else class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs">Previous</div>
        <div class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs">Page {{ currentPage }} of {{ totalPages }}</div>
        <div v-if="enableNextPage" @click="naviNext" class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs mx-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all">Next</div><div v-else class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs">Next</div>
        <div v-if="enableLastPage" @click="naviLast" class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs ml-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all">Last</div><div v-else class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs">Last</div>
      </div>
    </div>
  </div>
</template>

<script>
import { watch, ref, computed, getCurrentInstance, onMounted ,onUnmounted  } from "vue";
import { useToast } from "primevue/usetoast";
import { copyToClipboard } from '@/util/functions';
import { Helper } from '@/util/typeHelper';
import { AccountUtils } from "@/util/accountUtil";
import { AppState } from '@/state/appState';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { TransactionUtils } from '@/models/util/transactionUtils';
import Tooltip from 'primevue/tooltip';

export default {
  name:"TransactionComponent",
  props:{
    accountAddress: String,
    accountPublicKey: String,
  },
  components: {
    DataTable,
    Column
  },
  directives: {
    'tooltip': Tooltip
  },
  setup(props){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const invalidPublicKey = '0000000000000000000000000000000000000000000000000000000000000000';
    const toast = useToast();
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
      loadAccountTransactions();
    }

    const naviPrevious = () => {
      --currentPage.value;
      loadAccountTransactions();
    }

    const naviNext = () => {
      ++currentPage.value;
      loadAccountTransactions();
    }

    const naviLast = () => {
      currentPage.value = totalPages.value;
      loadAccountTransactions();
    }

    const changeRows = () => {
      currentPage.value = 1;
      loadAccountTransactions();
    }

    const transactions = ref([]);
    let transactionGroupType = Helper.getTransactionGroupType();
    let blockDescOrderSortingField = Helper.createTransactionFieldOrder(Helper.getQueryParamOrder_v2().DESC, Helper.getTransactionSortField().BLOCK);

    let loadAccountTransactions = async() =>{
      isFetching.value = true;
      let txnQueryParams = Helper.createTransactionQueryParams();
      txnQueryParams.pageSize = pages.value;
      if(props.accountPublicKey == invalidPublicKey){
        txnQueryParams.address = Helper.createAddress(props.accountAddress).plain();
      }else{
        txnQueryParams.publicKey = props.accountPublicKey;
      }
      txnQueryParams.pageNumber = currentPage.value;
      txnQueryParams.embedded = true;
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

    if(AppState.isReady){
      loadAccountTransactions();
    }
    else{
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
        loadAccountTransactions();
      }
    });

    const currencyDivisibility = computed(() => {
      return AppState.nativeToken.divisibility;
    })

    return{
      isFetching,
      wideScreen,
      transactions,
      nativeTokenName,
      checkOtherAsset,
      displaySDAs,
      Helper,
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
      currencyDivisibility,
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
