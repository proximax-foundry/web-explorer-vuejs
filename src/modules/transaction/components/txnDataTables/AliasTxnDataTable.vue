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
            <div class="uppercase text-xs text-gray-300 font-bold mb-1">TX Hash</div>
            <router-link class="uppercase font-bold text-xs block text-blue-600 hover:text-blue-primary hover:underline" :to="{ name: 'ViewTransaction', params:{ hash: data.hash }}">
              <span class="text-xs truncate inline-flex break-all hover:underline hover:text-blue-primary text-ellipsis overflow-hidden w-44" v-tooltip.right="data.hash">{{data.hash }}</span>...
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
            <div class="flex items-center">
              <span class="inline-block bg-blue-100 text-blue-700 font-bold text-xs py-1 px-2 break-all">
                {{ data.aliasName }}
                <font-awesome-icon v-if="data.aliasTypeName === 'Link'" icon="link" />
                <font-awesome-icon v-else icon="unlink" />
                {{ data.assetId ? data.assetId: data.address}}
              </span>
            </div>
          </div>
        </template>
      </Column>
      <Column field="hash" header="TX Hash" headerStyle="width:100px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <router-link :to="{ name: 'ViewTransaction', params:{ hash: data.hash }}" class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-44" v-tooltip.bottom="data.hash"><span class="text-ellipsis overflow-hidden">{{data.hash }}</span>...</router-link>
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
      <Column field="block" header="Block" headerStyle="width:100px;text-transform:uppercase" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" >
        <template #body="{data}">
         <router-link :to="{ name: 'ViewBlock', params: { blockHeight: data.block}}" class="text-blue-600 hover:text-blue-primary hover:underline text-xs">{{ data.block }}</router-link>
        </template>
      </Column>
      <Column header="TX FEE" headerStyle="width:40px;text-transform:uppercase" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" >
        <template #body="{data}">
          <div class="text-xs">{{ data.fee }} <b v-if="data.fee == 0 || data.fee>0">{{ nativeTokenName }}</b></div>
        </template>
      </Column>
      <Column header="Info" headerStyle="width:200px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <span class="inline-block bg-blue-100 text-blue-700 font-bold text-xs py-1 px-2 my-1 mx-1 break-all">
            {{ data.aliasName }}
            <font-awesome-icon v-if="data.aliasTypeName === 'Link'" :icon="faLink" />
            <font-awesome-icon v-else :icon="faUnlink" />
             {{ data.assetId ? data.assetId: data.address}}
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
import { getCurrentInstance, ref, computed, watch, onMounted, onUnmounted } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tooltip from 'primevue/tooltip';
import { Helper } from "@/util/typeHelper";
import { AppState } from '@/state/appState';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faLink, faUnlink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faLink, faUnlink);

export default {
  components: {
    DataTable,
    Column,
    'font-awesome-icon': FontAwesomeIcon,
  },
  name: 'AliasTxnDataTable',
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
      faLink,
      faUnlink,
    }
  }
}
</script>

<style lang="scss" scoped>
</style>