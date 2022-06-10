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
              <span class="text-xs truncate inline-flex break-all text-ellipsis overflow-hidden w-44 hover:underline hover:text-blue-primary" v-tooltip.right="data.hash">{{data.hash }}</span>...
            </router-link>
          </div>
          <div>
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">Type</div>
            <div class="flex items-center">
              <div class="uppercase font-bold text-xs mr-2">{{data.type}}</div>
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
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">Info</div>
            <div class="inline-block bg-blue-200 text-blue-700 rounded py-1 text-xs font-bold px-1 my-1" v-if="data.applyHeightDelta">Apply Height Delta: {{data.applyHeightDelta}}</div>
            <div class="inline-block bg-blue-200 text-blue-700 rounded py-1 text-xs font-bold px-1 my-1" v-if="data.newVersion">New Version: {{data.newVersion}}</div>
            <div class="inline-block bg-blue-200 text-blue-700 rounded py-1 text-xs font-bold px-1 my-1" v-if="data.upgradePeriod">Upgrade Period: {{data.upgradePeriod}}</div>
          </div>
        </template>
      </Column>
      <Column field="hash" header="Tx Hash" headerStyle="width:100px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <router-link :to="{ name: 'ViewTransaction', params:{ hash: data.hash }}" class="text-xs truncate inline-flex text-blue-600 hover:text-blue-primary hover:underline w-32" v-tooltip.bottom="data.hash"><span class="text-ellipsis overflow-hidden">{{data.hash }}</span>...</router-link>
        </template>
      </Column>
      <Column field="timestamp" header="Timestamp" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" headerStyle="width:110px;text-transform:uppercase">
        <template #body="{data}">
          <span class="text-xs">{{ convertLocalTime(data.timestamp) }}</span>
        </template>
      </Column>
      <Column field="typeName" header="Type" headerStyle="width:110px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <span class="text-xs">{{data.type}}</span>
        </template>
      </Column>
      <Column field="block" header="Block" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" headerStyle="width:110px;text-transform:uppercase">
        <template #body="{data}">
          <router-link :to="{ name: 'ViewBlock', params: { blockHeight: data.block}}" class="text-blue-600 hover:text-blue-primary hover:underline text-xs">{{ data.block }}</router-link>        
        </template>
      </Column>
      <Column header="Tx Fee" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" headerStyle="width:110px;text-transform:uppercase">
        <template #body="{data}">
          <div class="text-xs">{{ data.fee }} <b v-if="data.fee==0 || data.fee> 0">{{ nativeTokenName }}</b></div>
        </template>
      </Column>
      <Column header="Info" headerStyle="width:40px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <span class="inline-block bg-blue-200 text-blue-700 rounded py-1 text-xs font-bold px-1 my-1 mx-1" v-if="data.applyHeightDelta">Apply Height Delta: {{data.applyHeightDelta}}</span>
          <span class="inline-block bg-blue-200 text-blue-700 rounded py-1 text-xs font-bold px-1 my-1 mx-1" v-if="data.newVersion">New Version: {{data.newVersion}}</span>
          <span class="inline-block bg-blue-200 text-blue-700 rounded py-1 text-xs font-bold px-1 my-1 mx-1" v-if="data.upgradePeriod">Upgrade Period: {{data.upgradePeriod}}</span>
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
import {FilterMatchMode} from 'primevue/api';
import { networkState } from "@/state/networkState";
import Tooltip from 'primevue/tooltip';
import { Helper } from "@/util/typeHelper";
import { AppState } from '@/state/appState';

export default defineComponent({
  components: {
    DataTable,
    Column,
    // SplitButton
  },
  name: 'ChainTxnDataTable',
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
    }
  }
})
</script>

<style lang="scss" scoped>
</style>