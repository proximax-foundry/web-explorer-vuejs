<template>
 <div>
    
    <div v-if="isFetching">
      <div class="flex justify-center items-center border-gray-400 mt-15">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-navy-primary mr-2"></div>
        <span class="text-tsm">Fetching transactions</span>
      </div>
    </div>
    <div v-else>
      <DataTable
        :value="transactions"
        :paginator="true"
        :rows="10"
        scrollDirection="horizontal"
        :alwaysShowPaginator="false"
        responsiveLayout="scroll"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate=""
        >
        <Column style="width: 200px" v-if="!wideScreen">
          <template #body="{data}">
            <div>
              <div class="uppercase text-xs text-gray-300 font-bold mb-1 break-all">Tx Hash</div>
              <router-link class="uppercase font-bold text-xs text-blue-600 hover:text-blue-primary inline-flex hover:underline w-36" :to="{ name: 'ViewTransaction', params:{ hash: data.hash }}">
                <span class="text-xs hover:underline hover:text-blue-primary text-ellipsis overflow-hidden" v-tooltip.right="data.hash">{{data.hash }}</span>...
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
                <span v-if="data.recipient === '' || data.recipient === null">-</span>
                <router-link :to="{ name: 'ViewAccount', params:{ accountParam: data.recipient }}" v-tooltip.right="Helper.createAddress(data.recipient).pretty()" v-else class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-36"><span class="text-ellipsis overflow-hidden">{{ Helper.createAddress(data.recipient).pretty() }}</span>...</router-link>
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
                <router-link :to="{ name: 'ViewAccount', params:{ accountParam: data.sender }}" v-else v-tooltip.bottom="Helper.createAddress(data.sender).pretty()" class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-36"><span class="text-ellipsis overflow-hidden">{{ Helper.createAddress(data.sender).pretty() }}</span>
                ...</router-link>
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
            <router-link :to="{ name: 'ViewTransaction', params:{ hash: data.hash }}" class="text-xs text-blue-600 hover:text-blue-primary hover:underline inline-flex w-24" v-tooltip.bottom="data.hash"><span class="text-ellipsis overflow-hidden">{{data.hash }}</span>...</router-link>
          </template>
        </Column>
        <Column field="timestamp" v-if="wideScreen" header="TIMESTAMP" headerStyle="width:130px">
          <template #body="{data}">
            <span class="text-xs">{{ Helper.convertDisplayDateTimeFormat24(data.timestamp) }}</span>
          </template>
        </Column>
        <Column field="type" header="TYPE" headerStyle="width:140px" v-if="wideScreen">
          <template #body="{data}">
            <span class="text-xs">{{data.type}}</span>
          </template>
        </Column>
        <Column field="block" v-if="wideScreen" header="BLOCK" headerStyle="width:60px">
          <template #body="{data}">
            <router-link :to="{ name: 'ViewBlock', params: { blockHeight: data.block}}" class="text-blue-600 hover:text-blue-primary hover:underline text-xs">{{ data.block }}</router-link>
          </template>
        </Column>
        <Column field="signer" header="FROM" headerStyle="width:110px" v-if="wideScreen">
          <template #body="{data}">
            <span v-if="data.signerAddress === '' || data.signerAddress === null"></span>
            <router-link :to="{ name: 'ViewAccount', params:{ accountParam: data.signerAddress }}" v-else v-tooltip.bottom="Helper.createAddress(data.signerAddress).pretty()" class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-28"><span class="text-ellipsis overflow-hidden ">
              {{ Helper.createAddress(data.signerAddress).pretty() }}</span>...
            </router-link>
          </template>
        </Column>
        <Column field="recipient" header="RECIPIENT" headerStyle="width:110px" v-if="wideScreen">
          <template #body="{data}">
            <span v-if="data.recipient === '' || data.recipient === null"></span>
            <router-link :to="{ name: 'ViewAccount', params:{ accountParam: data.recipient }}" v-tooltip.bottom="Helper.createAddress(data.recipient).pretty()" v-else class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-28"><span class="text-ellipsis overflow-hidden ">
              {{ Helper.createAddress(data.recipient).pretty() }}</span>...
            </router-link>
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
    </div>
  </div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, onMounted, onUnmounted,computed } from "vue";
import { Helper } from '@/util/typeHelper';
import { TransactionGroupType,TransactionQueryParams } from 'tsjs-xpx-chain-sdk';
import { TransactionUtils } from '@/models/util/transactionUtils';
import Tooltip from 'primevue/tooltip';
import { AppState } from '@/state/appState';

export default {
  name: 'TransactionComponent',
  components: { DataTable, Column },
  directives: {
    'tooltip': Tooltip
  },
  props:{
    blockHeight: Number
    },
  setup(p){
    const wideScreen = ref(false);
    const transactions = ref([]);
    const screenResizeHandler = () => {
      if(window.innerWidth < '1024'){
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
    const getTransactions = async() =>{
      if(p.blockHeight != null){
        let txnQueryParams = new TransactionQueryParams();
        txnQueryParams.height = p.blockHeight;
        let txns = await TransactionUtils.searchTxns(TransactionGroupType.CONFIRMED,txnQueryParams);
        if(txns.transactions.length > 0){
          let transactionSearchResult = await TransactionUtils.formatConfirmedMixedTxns(txns.transactions);
          transactions.value = transactionSearchResult;
          transactionSearchResult[0].sender;
          transactionSearchResult[0].timestamp;
          transactionSearchResult[0].recipient;
          transactionSearchResult[0].type;
        }
      }
    }
    getTransactions();
    const currencyDivisibility = computed(() => {
      return AppState.nativeToken.divisibility;
    })
    return{
      wideScreen,
      Helper,
      transactions,
      currencyDivisibility,
      nativeTokenName,
      checkOtherAsset
    }
  }
}
</script>

