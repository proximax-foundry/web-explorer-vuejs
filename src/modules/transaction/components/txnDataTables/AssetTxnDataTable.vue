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
      >
      <Column style="width: 200px" v-if="!wideScreen">
        <template #body="{data}">
          <div>
            <div class="uppercase text-xs text-gray-300 font-bold mb-1">Hash</div>
            <router-link class="uppercase font-bold text-xs block text-blue-600 hover:text-blue-primary hover:underline" :to="{ name: 'ViewTransaction', params:{ hash: data.hash }}">
              <span class="text-xs break-all hover:underline hover:text-blue-primary" v-tooltip.right="data.hash">{{data.hash.substring(0, 15) }}...</span>
            </router-link>
          </div>
          <div>
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">Type</div>
            <div class="flex items-center">
              <div class="uppercase font-bold text-xs mr-2">{{data.type}}</div>
            </div>
          </div>
          <div>
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">Asset ID</div>
            <div class="flex items-center">
              <div class="text-xs font-bold">{{ data.assetId }}{{ data.namespaceName ? `(${data.namespaceName})`: "" }}</div>
            </div>
          </div>
        </template>
      </Column>
      <Column headerStyle="width:200px" v-if="!wideScreen">
        <template #body="{data}">
          <div v-if="selectedGroupType === transactionGroupType.CONFIRMED">
            <div class="uppercase text-xs text-gray-300 font-bold mb-1">Timestamp</div>
            <div class="uppercase font-bold text-xs">{{ convertLocalTime(data.timestamp) }}</div>
          </div>
          <div>
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">Info</div>
            <div>
              <div class="inline-block bg-blue-100 text-blue-700 font-bold text-xs py-1 px-2 my-1 mr-1 rounded" v-if="data.nonce">Nonce: {{data.nonce}} </div>
              <div class="inline-block bg-blue-100 text-blue-700 font-bold text-xs py-1 px-2 my-1 mr-1 rounded" v-if="data.divisibility !== null">Divisibility: {{data.divisibility}} </div>
              <div v-bind:class="['inline-block','text-black', 'py-1', 'px-2', 'my-1', 'mr-1', 'text-xs', 'font-bold', 'rounded', (data.transferable) ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700']" v-if="data.transferable !== null">Transferable</div>
              <div v-bind:class="['inline-block','text-black', 'py-1', 'px-2', 'my-1', 'mr-1', 'text-xs', 'font-bold', 'rounded', (data.supplyMutable) ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700']" v-if="data.supplyMutable !== null">Supply Mutable</div>
              <div class="inline-block bg-blue-100 text-blue-700 font-bold text-xs py-1 px-2 my-1 mr-1 rounded" v-if="data.duration">Duration: {{data.duration}}</div>
              <div class="inline-block bg-blue-100 text-blue-700 font-bold text-xs py-1 px-2 my-1 mr-1 rounded" v-if="data.supplyDelta !== null">Supply:{{ data.supplyDelta > 0 ? "+" + data.supplyDelta : data.supplyDelta }}</div>
              <div v-if="data.levyAssetId">
                <div class="inline-block bg-blue-100 text-blue-700 font-bold text-xs py-1 px-2 my-1 mr-1 rounded">
                  Levy: {{ data.levyAssetId }}{{ data.levyAssetName ? `(${data.levyAssetName})`: "" }}
                </div>
                <div class="inline-block bg-blue-100 text-blue-700 font-bold text-xs py-1 px-2 my-1 mr-1 rounded" >
                  Levy Amount: {{ data.levyAssetAmount }}
                </div>
                <div v-tooltip.bottom="data.levyRecipient" class="inline-block bg-blue-100 text-blue-700 font-bold text-xs rounded py-1 px-2 my-1 mr-1 truncate">
                  Levy Recipient: {{ data.levyRecipient }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </Column>
      <Column field="hash" header="Hash" headerStyle="width:100px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <router-link :to="{ name: 'ViewTransaction', params:{ hash: data.hash }}" class="text-xs text-blue-600 hover:text-blue-primary hover:underline" v-tooltip.bottom="data.hash">{{data.hash.substring(0, 15) }}...</router-link>
        </template>
      </Column>
      <Column field="timestamp" header="Timestamp" headerStyle="width:110px;text-transform:uppercase" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" >
        <template #body="{data}">
          <span class="text-xs">{{ convertLocalTime(data.timestamp) }}</span>
        </template>
      </Column>
      <Column field="typeName" header="Type" headerStyle="width:110px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <span class="text-xs">{{data.type}}</span>
        </template>
      </Column>
      <Column field="block" header="Block" headerStyle="width:110px;text-transform:uppercase" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" >
        <template #body="{data}">
          <div class="text-xs">{{ data.block }}</div>
        </template>
      </Column>
      <Column header="Tx Fee" headerStyle="width:110px;text-transform:uppercase" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" >
        <template #body="{data}">
          <div class="text-xs">{{ data.fee }} <b v-if="data.fee">{{ nativeTokenName }}</b></div>
        </template>
      </Column>

      <Column header="Asset ID" headerStyle="width:110px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <div class="text-xs">{{ data.assetId }}{{ data.namespaceName ? `(${data.namespaceName})`: "" }}</div>
        </template>
      </Column>
      <Column header="Info" headerStyle="width:40px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <span class="inline-block bg-blue-100 text-blue-700 font-bold text-xs py-1 px-2 my-1 mx-1 rounded" v-if="data.nonce">Nonce: {{data.nonce}} </span>
          <span class="inline-block bg-blue-100 text-blue-700 font-bold text-xs py-1 px-2 my-1 mx-1 rounded" v-if="data.divisibility !== null">Divisibility: {{data.divisibility}} </span>
          <span v-bind:class="['inline-block','text-black', 'py-1', 'px-2', 'my-1', 'mx-1', 'text-xs', 'font-bold', 'rounded', (data.transferable) ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700']" v-if="data.transferable !== null">Transferable</span>
          <span v-bind:class="['inline-block','text-black', 'py-1', 'px-2', 'my-1', 'mx-1', 'text-xs', 'font-bold', 'rounded', (data.supplyMutable) ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700']" v-if="data.supplyMutable !== null">Supply Mutable</span>
          <span class="inline-block bg-blue-100 text-blue-700 font-bold text-xs py-1 px-2 my-1 mx-1 rounded" v-if="data.duration">Duration: {{data.duration}} </span>
          <span class="inline-block bg-blue-100 text-blue-700 font-bold text-xs py-1 px-2 my-1 mx-1 rounded" v-if="data.supplyDelta !== null">Supply:{{ data.supplyDelta > 0 ? "+" + data.supplyDelta : data.supplyDelta }}</span>
          <span v-if="data.levyAssetId">
            <span class="inline-block bg-blue-100 text-blue-700 font-bold text-xs py-1 px-2 my-1 mx-1 rounded">
              Levy: {{ data.levyAssetId }}{{ data.levyAssetName ? `(${data.levyAssetName})`: "" }}
            </span>
            <span class="inline-block bg-blue-100 text-blue-700 font-bold text-xs py-1 px-2 my-1 mx-1 rounded" >
              Levy Amount: {{ data.levyAssetAmount }}
            </span>
            <span v-tooltip.bottom="data.levyRecipient" class="inline-block bg-blue-100 text-blue-700 font-bold text-xs rounded py-1 px-2 my-1 mx-1 truncate">
              Levy Recipient: {{ data.levyRecipient }}
            </span>
          </span>
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
import { getCurrentInstance, ref, computed, onMounted, onUnmounted } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tooltip from 'primevue/tooltip';
import { Helper } from "@/util/typeHelper";
import { AppState } from '@/state/appState';

export default {
  components: {
    DataTable,
    Column,
  },
  name: 'AssetTxnDataTable',
  props: {
    transactions: Array,
    pages: Number,
    selectedGroupType: String,
  },
  directives: {
    'tooltip': Tooltip
  },
  setup(p, context){
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

    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const transactionGroupType = Helper.getTransactionGroupType();
    const nativeTokenName = computed(() => AppState.nativeToken.label);


    const convertLocalTime = (dateTimeInJSON)=>{
      return Helper.convertDisplayDateTimeFormat24(dateTimeInJSON);
    };

    return {
      nativeTokenName,
      convertLocalTime,
      transactionGroupType,
      wideScreen,
      Helper,
    }
  }
}
</script>

<style lang="scss" scoped>
</style>