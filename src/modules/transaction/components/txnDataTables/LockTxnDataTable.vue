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
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">Lock Hash</div>
            <div class="flex items-center">
              <div class="font-bold text-xs" v-tooltip.right="data.lockHash">{{data.lockHash.substring(0, 20) }}...</div>
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
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">Duration</div>
            <div class="uppercase font-bold " v-tooltip.left="'<tiptext>Approximately ' + durationTime(data.duration) + ' Day' + (durationTime(data.duration)>1?'s':'') + '</tiptext>'">{{data.duration ? data.duration + ' Block' + (data.duration>1?'s':'') : "-"}}</div>
          </div>
          <div>
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">Refunded</div>
            <div class="uppercase font-bold text-xs">{{ data.isRefunded ? 'Yes':'No' }}</div>
          </div>
        </template>
      </Column>
      <Column field="hash" header="Hash" headerStyle="width:100px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <router-link :to="{ name: 'ViewTransaction', params:{ hash: data.hash }}" class="text-xs text-blue-600 hover:text-blue-primary hover:underline" v-tooltip.bottom="data.hash">{{data.hash.substring(0, 15) }}...</router-link>
        </template>
      </Column>
      <Column field="timestamp" header="Timestamp" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" headerStyle="width:110px;text-transform:uppercase">
        <template #body="{data}">
          <span class="text-xs">{{ convertLocalTime(data.timestamp) }}</span>
        </template>
      </Column>
      <Column field="typeName" header="Type" headerStyle="width:110px" v-if="wideScreen">
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
          <div class="text-xs">{{ data.fee }} <b v-if="data.fee">{{ nativeTokenName }}</b></div>
        </template>
      </Column>
      <Column header="Lock Hash" headerStyle="width:40px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <span class="text-xs" v-tooltip.bottom="data.lockHash">{{data.lockHash.substring(0, 20) }}...</span>
        </template>
      </Column>
      <Column header="Duration" headerStyle="width:40px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <span class="text-xs font-bold " v-tooltip.left="'<tiptext>Approximately ' + durationTime(data.duration) + ' Day' + (durationTime(data.duration)>1?'s':'') + '</tiptext>'">{{data.duration ? data.duration + ' Block' + (data.duration>1?'s':'') : "-"}}</span>
        </template>
      </Column>
      <Column header="Refunded" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" headerStyle="width:40px;text-transform:uppercase">
        <template #body="{data}">
          <span class="text-xs">{{ data.isRefunded ? 'Yes':'No' }}</span>
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

<script lang="ts">
import { defineComponent } from 'vue';
import { getCurrentInstance, ref, computed, watch, onMounted, onUnmounted } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { networkState } from "@/state/networkState";
import Tooltip from 'primevue/tooltip';
import { Helper } from "@/util/typeHelper";
import { ChainProfileConfig } from "@/models/stores/chainProfileConfig";
import { AppState } from '@/state/appState';

export default defineComponent({
  components: {
    DataTable,
    Column,
    // SplitButton
  },
  name: 'LockTxnDataTable',
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
      durationTime,
      wideScreen,
    }
  }
})
</script>

<style lang="scss" scoped>
</style>