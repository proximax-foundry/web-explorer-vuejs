<template>
  <div>
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
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 break-all">Tx Hash</div>
            <router-link class="uppercase font-bold text-xs block text-blue-600 hover:text-blue-primary hover:underline" :to="{ name: 'ViewTransaction', params:{ hash: data.hash }}">
              <span class="text-xs truncate inline-flex break-all hover:underline hover:text-blue-primary text-ellipsis overflow-hidden w-44" v-tooltip.right="data.hash">{{data.hash}}</span>...
            </router-link>
          </div>
          <div>
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">Type</div>
            <div class="flex items-center">
              <div class="uppercase font-bold text-xs mr-2">{{data.type}}</div>
            </div>
          </div>
          <div>            
            <!-- v-if="data.recipient != '' && data.recipient != null" -->
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">Recipient</div>
            <div class="uppercase font-bold text-xs">
              <span v-if="data.recipient === '' || data.recipient === null"></span>
              <router-link :to="{ name: 'ViewAccount', params:{ accountParam: data.recipient }}" v-tooltip.right="Helper.createAddress(data.recipient).pretty()" v-else class="truncate inline-flex text-xs break-all text-blue-600 hover:text-blue-primary hover:underline w-44"><span class="text-ellipsis overflow-hidden">{{Helper.createAddress(data.recipient).pretty() }}</span>...</router-link>
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
              <span v-if="data.sender === '' || data.sender === null"></span>
              <router-link :to="{ name: 'ViewAccount', params:{ accountParam: data.sender }}" v-else v-tooltip.bottom="Helper.createAddress(data.sender).pretty()" class="truncate inline-flex w-44 text-xs break-all text-blue-600 hover:text-blue-primary hover:underline"><span class="text-ellipsis overflow-hidden">{{ Helper.createAddress(data.sender).pretty() }}</span>...</router-link>
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
          <router-link :to="{ name: 'ViewTransaction', params:{ hash: data.hash }}" class="text-xs text-blue-600 hover:text-blue-primary hover:underline inline-flex" v-tooltip.bottom="data.hash"><span class="text-ellipsis overflow-hidden w-20">{{data.hash }}</span>...</router-link>
        </template>
      </Column>
      <Column field="timestamp" v-if="wideScreen" header="TIMESTAMP" headerStyle="width:130px">
        <template #body="{data}">
          <span class="text-xs">{{ Helper.convertDisplayDateTimeFormat24(data.timestamp) }}</span>
        </template>
      </Column>
      <Column field="type" header="TYPE" headerStyle="width:70px" v-if="wideScreen">
        <template #body="{data}">
          <span class="text-xs">{{data.type}}</span>
        </template>
      </Column>
      <Column field="block" v-if="wideScreen" header="BLOCK" headerStyle="width:70px">
        <template #body="{data}">
          <router-link :to="{ name: 'ViewBlock', params: { blockHeight: data.block}}" class="text-blue-600 hover:text-blue-primary hover:underline text-xs">{{ data.block }}</router-link>
        </template>
      </Column>
      <Column field="signer" header="FROM" headerStyle="width:130px" v-if="wideScreen">
        <template #body="{data}">
          <span v-if="data.sender === '' || data.sender === null"></span>
          <router-link :to="{ name: 'ViewAccount', params:{ accountParam: data.sender }}" v-else v-tooltip.bottom="Helper.createAddress(data.sender).pretty()" class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-32"><span class="text-ellipsis overflow-hidden">{{ Helper.createAddress(data.sender).pretty() }} </span>...
          </router-link>
        </template>
      </Column>
      <Column field="recipient" header="RECIPIENT" headerStyle="width:130px" v-if="wideScreen">
        <template #body="{data}">
          <span v-if="data.recipient === '' || data.recipient === null"></span>
          <router-link :to="{ name: 'ViewAccount', params:{ accountParam: data.recipient }}" v-tooltip.bottom="Helper.createAddress(data.recipient).pretty()" v-else class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-32">
          <span class="text-ellipsis overflow-hidden">{{ Helper.createAddress(data.recipient).pretty() }}</span>...
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
          <div class="flex justify-center">
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
</template>

<script>
import { getCurrentInstance, ref, computed, watch, onMounted, onUnmounted } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { networkState } from "@/state/networkState";
import Tooltip from 'primevue/tooltip';
import { Helper } from "@/util/typeHelper";
import { AppState } from '@/state/appState';

export default {
  components: {
    DataTable,
    Column,
  },
  name: 'TransferTxnDataTable',
  props: {
    transactions: Array,
    pages: Number
  },
  directives: {
    'tooltip': Tooltip
  },
  setup(p){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
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

    const currencyDivisibility = computed(() => {
      return AppState.nativeToken.divisibility;
    })

    return {
      wideScreen,
      nativeTokenName,
      checkOtherAsset,
      displaySDAs,
      Helper,
      currencyDivisibility,
    }
  }
}
</script>

<style lang="scss" scoped>

</style>