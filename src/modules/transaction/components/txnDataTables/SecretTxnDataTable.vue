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
              <span class="text-xs hover:underline hover:text-blue-primary truncate inline-flex text-ellipsis overflow-hidden w-44 break-all" v-tooltip.right="data.hash">{{data.hash }}</span>...
            </router-link>
          </div>
          <div>
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">Type</div>
            <div class="flex items-center">
              <div class="uppercase font-bold text-xs mr-2">{{data.type}}</div>
            </div>
          </div>
          <div v-if="data.recipient != '' && data.recipient != null">
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">Recipient</div>
            <router-link v-tooltip.bottom="Helper.createAddress(data.recipient).pretty()" :to="{ name: 'ViewAccount', params: { accountParam: data.recipient }}" class="hover:text-blue-primary font-bold text-blue-600 hover:underline truncate text-xs inline-flex">
              <span class="text-ellipsis overflow-hidden w-44">{{ Helper.createAddress(data.recipient).pretty() }}</span>...
            </router-link>
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
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">Hash Type</div>
            <div class="uppercase font-bold text-xs">{{ data.hashType }}</div>
          </div>
          <div>
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">Info</div>
            <span class="inline-block bg-blue-200 text-blue-700 rounded py-1 px-2 my-1 text-xs font-bold" v-if="data.duration">{{ `Duration: ${data.duration} blocks` }}</span>
            <span v-else>-</span>
          </div>
        </template>
      </Column>
      <Column field="hash" header="Tx Hash" headerStyle="width:100px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <router-link :to="{ name: 'ViewTransaction', params:{ hash: data.hash }}" class="text-xs text-blue-600 hover:text-blue-primary hover:underline inline-flex w-32" v-tooltip.bottom="data.hash"><span class="text-ellipsis overflow-hidden">{{data.hash }}</span>...</router-link>
        </template>
      </Column>
      <Column field="timestamp" header="Timestamp" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" headerStyle="width:110px;text-transform:uppercase">
        <template #body="{data}">
          <span class="text-xs">{{ convertLocalTime(data.timestamp) }}</span>
        </template>
      </Column>
      <Column field="typeName" header="Type" headerStyle="width:70px" v-if="wideScreen">
        <template #body="{data}">
          <span class="text-xs">{{data.type}}</span>
        </template>
      </Column>
      <Column field="block" header="Block" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" headerStyle="width:70px;text-transform:uppercase">
        <template #body="{data}">
          <div class="text-xs">{{ data.block }}</div>
        </template>
      </Column>
      <Column field="recipient" header="Recipient" headerStyle="width:110px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <router-link v-tooltip.bottom="Helper.createAddress(data.recipient).pretty()" :to="{ name: 'ViewAccount', params: { accountParam: data.recipient }}" class="text-blue-600 hover:text-blue-primary hover:underline truncate inline-block text-xs">
            {{ Helper.createAddress(data.recipient).pretty() }}
          </router-link>
        </template>
      </Column>
      <Column header="Tx Fee" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" headerStyle="width:80pxwidth:40px;text-transform:uppercase">
        <template #body="{data}">
          <div class="text-xs">{{ data.fee }} <b v-if="data.fee">{{ nativeTokenName }}</b></div>
        </template>
      </Column>
      <Column header="Hash Type" headerStyle="width:40pxwidth:40px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <div class="text-xs">{{ data.hashType }}</div>
        </template>
      </Column>
      <Column header="Secret" headerStyle="width:40pxwidth:40px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <div>
            <img src="@/modules/transaction/img/icon-message.svg" v-tooltip.left="'<tiptitle>Secret</tiptitle><tiptext>' + data.secret + '</tiptext>'" class="inline-block">
          </div>
        </template>
      </Column>
      <Column header="Proof" headerStyle="width:40pxwidth:40px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <div>
            <img src="@/modules/transaction/img/icon-message.svg" v-if="data.proof" v-tooltip.left="'<tiptitle>Proof</tiptitle><tiptext>' + data.proof + '</tiptext>'" class="inline-block">
          </div>
        </template>
      </Column>
      <Column header="SDA" headerStyle="width:30px; text-align:center;width:40px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <div>
            <img src="@/modules/transaction/img/icon-sda.svg" v-if="data.assetId" class="inline-block" v-tooltip.left="'<tiptitle>Sirius Digital Asset</tiptitle><tiptext>' + constructSDA(data.assetId, data.amount, data.namespaceName) + '</tiptext>'">
          </div>
        </template>
      </Column>
      <Column header="Info" headerStyle="width:40px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <!-- <span class="inline-block bg-blue-500 text-white py-1 px-1 my-1 mx-1">{{ `Hash Type: ${data.hashType}` }}</span> -->
          <span class="inline-block bg-blue-200 text-blue-700 rounded py-1 px-2 my-1 mx-1 text-xs font-bold" v-if="data.duration">{{ `Duration: ${data.duration} blocks` }}</span>
          <span v-else>-</span>
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
import { AppState } from '@/state/appState';

export default defineComponent({
  components: {
    DataTable,
    Column,
    // SplitButton
  },
  name: 'SecretTxnDataTable',
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

    const constructSDA = (assetId, amount, namespaceName) => {
      return namespaceName ? amount + ' ' + namespaceName : assetId + ' - ' + amount;
    }

    const convertLocalTime = (dateTimeInJSON)=>{
      return Helper.convertDisplayDateTimeFormat24(dateTimeInJSON);
    };

    return {
      nativeTokenName,
      convertLocalTime,
      transactionGroupType,
      constructSDA,
      wideScreen,
      Helper,
    }
  }
})
</script>

<style lang="scss" scoped>
</style>