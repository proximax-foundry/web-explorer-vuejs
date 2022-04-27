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
              <span class="text-xs break-all hover:underline hover:text-blue-primary truncate inline-flex text-ellipsis overflow-hidden w-44" v-tooltip.right="data.hash">{{data.hash}}</span>...
            </router-link>
          </div>
          <div>
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">Type</div>
            <div class="flex items-center">
              <div class="uppercase font-bold text-xs mr-2">{{data.type}}</div>
            </div>
          </div>
          <div>
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">Register Type</div>
            <div class="flex items-center">
              <div class="uppercase font-bold text-xs mr-2">{{data.registerTypeName}}</div>
            </div>
          </div>
        </template>
      </Column>
      <Column style="width: 200px" v-if="!wideScreen">
        <template #body="{data}">
          <div v-if="selectedGroupType === transactionGroupType.CONFIRMED">
            <div class="uppercase text-xs text-gray-300 font-bold mb-1">Timestamp</div>
            <div class="uppercase font-bold text-xs">{{ convertLocalTime(data.timestamp) }}</div>
          </div>
          <div>
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">Namespace</div>
            <div class="flex items-center">
              <span class="text-xs font-bold">{{data.namespaceName}}</span>
            </div>
          </div>
          <div>
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">Duration</div>
            <div class="flex items-center">
              <span class="text-xs font-bold " v-tooltip.left="'<tiptext>Approximately ' + durationTime(data.duration) + ' Day' + (durationTime(data.duration)>1?'s':'') + '</tiptext>'">{{data.duration ? data.duration + ' Block' + (data.duration>1?'s':'') : "-"}}</span>
            </div>
          </div>
        </template>
      </Column>
      <Column field="hash" header="Hash" headerStyle="width:100px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <router-link :to="{ name: 'ViewTransaction', params:{ hash: data.hash }}" class="text-xs text-blue-600 hover:text-blue-primary hover:underline inline-flex" v-tooltip.bottom="data.hash"><span class="text-ellipsis overflow-hidden w-32">{{data.hash }}</span>...</router-link>
        </template>
      </Column>
      <Column field="timestamp" header="Timestamp" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" headerStyle="width:110px;text-transform:uppercase">
        <template #body="{data}">
          <span class="text-xs">{{ convertLocalTime(data.timestamp) }}</span>
        </template>
      </Column>
      <Column field="typeName" header="Type" headerStyle="width:110px;text-transform:uppercase" v-if="wideScreen">>
        <template #body="{data}">
          <span class="text-xs">{{data.type}}</span>
        </template>
      </Column>
      <Column field="block" header="Block" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" headerStyle="width:110px;text-transform:uppercase">
        <template #body="{data}">
          <div class="text-xs">{{ data.block }}</div>
        </template>
      </Column>
      <Column header="Tx Fee" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" headerStyle="width:110px;text-transform:uppercase">
        <template #body="{data}">
          <div class="text-xs">{{ data.fee }} <b v-if="data.fee==0 || data.fee> 0">{{ nativeTokenName }}</b></div>
        </template>
      </Column>
      <Column header="Register Type" headerStyle="width:110px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <div class="text-xs">{{ data.registerTypeName }}</div>
        </template>
      </Column>
      <Column header="Namespace" headerStyle="width:40px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <span class="text-xs" >{{data.namespaceName}}</span>
        </template>
      </Column>
      <Column header="Parent Namespace" headerStyle="width:40px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <span class="text-xs" >{{data.parentName ? data.parentName : ""}}</span>
        </template>
      </Column>
      <Column header="Duration" headerStyle="width:40px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <span class="text-xs font-bold " v-tooltip.left="'<tiptext>Approximately ' + durationTime(data.duration) + ' Day' + (durationTime(data.duration)>1?'s':'') + '</tiptext>'">{{data.duration ? data.duration + ' Block' + (data.duration>1?'s':'') : "-"}}</span>
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
import { AppState } from '@/state/appState';
import { Helper } from "@/util/typeHelper";
import { ChainProfileConfig } from "@/models/stores/chainProfileConfig";

export default {
  components: {
    DataTable,
    Column,
  },
  name: 'NamespaceTxnDataTable',
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

    let chainConfig = new ChainProfileConfig(networkState.chainNetworkName);
    chainConfig.init();
    let blockTargetTime = parseInt(chainConfig.blockGenerationTargetTime);

    const durationTime = (block) => {
      let durationByHour = block/(60/blockTargetTime * 60);
      let durationByDay = durationByHour/24;
      return durationByDay;
    }

    return {
      nativeTokenName,
      convertLocalTime,
      transactionGroupType,
      wideScreen,
      Helper,
      durationTime,
    }
  }
}
</script>

<style lang="scss" scoped>
</style>