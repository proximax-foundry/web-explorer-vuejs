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
            <div class="uppercase text-xs text-gray-300 font-bold mb-1">Hasn</div>
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
        </template>
      </Column>
      <Column style="width: 200px" v-if="!wideScreen">
        <template #body="{data}">
          <div v-if="selectedGroupType === transactionGroupType.CONFIRMED">
            <div class="uppercase text-xs text-gray-300 font-bold mb-1">Timestamp</div>
            <div class="uppercase font-bold text-xs">{{ convertLocalTime(data.timestamp) }}</div>
          </div>
          <div>
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">Restriction Type</div>
            <div class="font-bold text-xs">{{ data.restrictionTypeOutput }}</div>
          </div>
          <div>
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">Modification</div>
            <div>
              <div v-bind:key="restrictMod.value" v-for="restrictMod in data.modification">
                <div class="break-all inline-block bg-green-200 font-bold text-green-700 text-xs rounded py-1 px-2 my-1" v-if="restrictMod.action === 'Add'">
                  {{ restrictMod.name ? restrictMod.name : restrictMod.value }}
                </div>
                <div class="break-all inline-block bg-red-200 font-bold text-red-700 text-xs rounded py-1 px-2 my-1" v-else>
                  {{ restrictMod.name ? restrictMod.name : restrictMod.value }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </Column>
      <Column field="hash" header="Hash" headerStyle="width:50px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <router-link :to="{ name: 'ViewTransaction', params:{ hash: data.hash }}" class="text-xs text-blue-600 hover:text-blue-primary hover:underline" v-tooltip.bottom="data.hash">{{data.hash.substring(0, 15) }}...</router-link>
        </template>
      </Column>
      <Column field="timestamp" header="Timestamp" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" headerStyle="width:110px;text-transform:uppercase">
        <template #body="{data}">
          <span class="text-xs">{{ convertLocalTime(data.timestamp) }}</span>
        </template>
      </Column>
      <Column field="typeName" header="Type" headerStyle="width:150px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <span class="text-xs">{{data.type}}</span>
        </template>
      </Column>
      <Column field="block" header="Block" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" headerStyle="width:70px;text-transform:uppercase">
        <template #body="{data}">
          <div class="text-xs">{{ data.block }}</div>
        </template>
      </Column>
      <Column header="Tx Fee" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" headerStyle="width:70px;text-transform:uppercase">
        <template #body="{data}">
          <div class="text-xs">{{ data.fee }} <b v-if="data.fee">{{ nativeTokenName }}</b></div>
        </template>
      </Column>
      <Column header="Restriction Type" headerStyle="width:70px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <div class="text-xs">{{ data.restrictionTypeOutput }}</div>
        </template>
      </Column>
      <Column header="Modification" headerStyle="width:110px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <div v-bind:key="restrictMod.value" v-for="restrictMod in data.modification">
            <div class="break-all inline-block bg-green-200 font-bold text-green-700 text-xs rounded py-1 px-2 my-1 mx-1" v-if="restrictMod.restrictionTypeOutput === 'Add'">
              {{ restrictMod.name ? restrictMod.name : restrictMod.value }}
            </div>
            <div class="break-all inline-block bg-red-200 font-bold text-red-700 text-xs rounded py-1 px-2 my-1 mx-1" v-else>
              {{ restrictMod.name ? restrictMod.name : restrictMod.value }}
            </div>
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

<script lang="ts">
import { defineComponent } from 'vue';
import { getCurrentInstance, ref, computed, watch, onMounted, onUnmounted } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tooltip from 'primevue/tooltip';
import { Helper } from "@/util/typeHelper";
import { AppState } from '@/state/appState';

export default defineComponent({
  components: {
    DataTable,
    Column,
  },
  name: 'RestrictionTxnDataTable',
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