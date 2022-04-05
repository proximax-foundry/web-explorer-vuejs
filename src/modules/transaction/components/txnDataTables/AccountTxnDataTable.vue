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
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">Account</div>
            <div class="flex items-center">
              <router-link :to="{ name: 'ViewAccount', params:{ accountParam: data.signerAddress }}" v-tooltip.right="Helper.createAddress(data.signerAddress).pretty()" class="uppercase font-bold truncate inline-block text-xs break-all text-blue-600 hover:text-blue-primary hover:underline">{{ shortenedAddress(Helper.createAddress(data.signerAddress).pretty()) }}</router-link>
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
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">Approval and Removal</div>
            <div class="flex items-center">
              <div class="text-xs">
                {{ data.oldApprovalNumber ? data.oldApprovalNumber + " " : '' }}{{ data.approvalDelta > 0 ? `+${data.approvalDelta}`: data.approvalDelta }}
              </div>
              <div class="text-xs ml-5">
                {{ data.oldRemovalNumber ? data.oldRemovalNumber + " " : '' }}{{ data.removalDelta > 0 ? `+${data.removalDelta}`: data.removalDelta }}
              </div>
            </div>
          </div>
          <div>
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">Info</div>
            <div class="flex items-center">
              <span v-bind:key="cosigner" v-tooltip.bottom="'Adding account:<br><br>' + cosigner" v-for="cosigner in data.addedCosigner" class="inline-block bg-green-200 font-bold text-green-700 text-xs rounded py-1 px-2 my-1">
                {{ cosigner.toString().substring(0, 20) }}...
              </span>
              <span v-bind:key="cosigner" v-tooltip.bottom="'Removubg account:<br><br>' + cosigner" v-for="cosigner in data.removedCosigner" class="inline-block bg-red-200 font-bold text-red-700 text-xs py-1 px-1 my-1">
                {{ cosigner.toString().substring(0, 20) }}...
              </span>
              <span v-if="data.addedCosigner.length ==0  && data.removedCosigner.length ==0">-</span>
            </div>
          </div>
        </template>
      </Column>
      <Column field="hash" header="Hash" headerStyle="width:100px;text-transform:uppercase"  v-if="wideScreen">
        <template #body="{data}">
          <router-link :to="{ name: 'ViewTransaction', params:{ hash: data.hash }}" class="text-xs text-blue-600 hover:text-blue-primary hover:underline" v-tooltip.bottom="data.hash">{{data.hash.substring(0, 15) }}...</router-link>
        </template>
      </Column>
      <Column field="timestamp" header="Timestamp" headerStyle="width:110px;text-transform:uppercase"  v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" >
        <template #body="{data}">
          <span class="text-xs">{{ convertLocalTime(data.timestamp) }}</span>
        </template>
      </Column>
      <Column field="typeName" header="Type" headerStyle="width:110px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <span class="text-xs">{{data.type}}</span>
        </template>
      </Column>
      <Column field="block" header="Block"  v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" headerStyle="width:110px;text-transform:uppercase">
        <template #body="{data}">
          <div class="text-xs">{{ data.block }}</div>
        </template>
      </Column>
      <Column header="tX Fee" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" headerStyle="width:110px;text-transform:uppercase">
        <template #body="{data}">
          <div class="text-xs">{{ data.fee }} <b v-if="data.fee">{{ nativeTokenName }}</b></div>
        </template>
      </Column>
      <Column header="Account" headerStyle="width:110px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <router-link :to="{ name: 'ViewAccount', params:{ accountParam: data.signerAddress }}" v-tooltip.right="Helper.createAddress(data.signerAddress).pretty()" class="truncate inline-block text-xs break-all text-blue-600 hover:text-blue-primary hover:underline">{{ shortenedAddress(Helper.createAddress(data.signerAddress).pretty()) }}</router-link>
        </template>
      </Column>
      <Column header="Approval Delta" headerStyle="width:60px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <span class="text-xs">
            {{ data.oldApprovalNumber ? data.oldApprovalNumber + " " : '' }}{{ data.approvalDelta > 0 ? `+${data.approvalDelta}`: data.approvalDelta }}
          </span>
        </template>
      </Column>
      <Column header="Removal Delta" headerStyle="width:60px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <span class="text-xs">
            {{ data.oldRemovalNumber ? data.oldRemovalNumber + " " : '' }}{{ data.removalDelta > 0 ? `+${data.removalDelta}`: data.removalDelta }}
          </span>
        </template>
      </Column>
      <Column header="Info" headerStyle="width:40px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <span v-bind:key="cosigner" v-tooltip.bottom="'Adding account:<br><br>' + cosigner" v-for="cosigner in data.addedCosigner" class="inline-block bg-green-200 font-bold text-green-700 text-xs rounded py-1 px-2 my-1 mx-1">
            {{ cosigner.toString().substring(0, 20) }}...
          </span>
          <span v-bind:key="cosigner" v-tooltip.bottom="'Removing account:<br><br>' + cosigner" v-for="cosigner in data.removedCosigner" class="inline-block bg-red-200 font-bold text-red-700 text-xs rounded py-1 px-1 my-1 mx-1">
            {{ cosigner.toString().substring(0, 20) }}...
          </span>
          <!-- <span v-if="data.addedCosigner.length ==0  && data.removedCosigner.length ==0">-</span> -->
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
    // SplitButton
  },
  name: 'AccountTxnDataTable',
  props: {
    transactions: Array,
    pages: Number
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

    const constructValueDisplay = (data) => {

      let display = "Size:" + (data.sizeChanged > 0 ? `+${data.sizeChanged}`: data.sizeChanged);

      if(data.oldValue){
        display += `<br>Old Value: ${data.oldValue}`;
      }
      if(data.newValue){
        display += `<br>New Value: ${data.newValue}`;
      }

      display += `<br>Value Change: ${data.valueChange}`;
      return display;
    }

    const convertLocalTime = (dateTimeInJSON)=>{
      return Helper.convertDisplayDateTimeFormat24(dateTimeInJSON);
    };

    const shortenedAddress = (address) => {
      return address.substring(0, 4) + '...' + address.substring(address.length - 4, address.length);
    }

    return {
      constructValueDisplay,
      nativeTokenName,
      convertLocalTime,
      transactionGroupType,
      wideScreen,
      Helper,
      shortenedAddress,
    }
  }
}
</script>

<style lang="scss" scoped>
</style>