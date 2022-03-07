<template>
  <div class="w-52">
    <div @click='toggleSelection = !toggleSelection' class= "ml-auto mr-auto py-1 cursor-pointer">
      <div class="flex justify-between">
        <div class="flex flex-col ml-2 text-left">
          <div v-if='selectedNetwork.name!=""' class='mt-1 text-xs text-white'>{{selectedNetwork.name}}<div class="text-xxs text-yellow-400 mt-1">{{ selectedNetwork.node }}</div></div>
          <div v-else class="text-tsm font-bold">Select Network</div>
        </div>
        <img src="@/assets/img/icon-caret-down.svg" class="ml-2 transition-all duration-200" :class="`${toggleSelection?'rotate-180 transform':''}`">
      </div>
    </div>

    <div class="relative">
      <div v-if='toggleSelection' class="absolute border border-t-0 w-full z-50 bg-white max-h-40 overflow-auto px-1 filter drop-shodow-xl pb-2">
        <div v-if='networks.length > 0' class="pl-2 pt-4 text-xxs text-gray-400">SELECT NETWORK</div>
        <div v-else class="text-xxs pt-2 pl-2 pb-2">The list is empty.</div>
        <div v-for='(items, index) in networks' :key="items" class="px-2 py-3 flex cursor-pointer items-center hover:bg-gray-50 transition-all duration-300" @click="selectNetwork(items.name, items.node, items.index);$emit('update:modelValue', selectedNetwork);$emit('select-network', selectedNetwork);" :class='`${(index != networks.length - 1)?"border-b border-gray-200":""}`'>
          <div>
            <div class='text-xs ml-2 font-semibold'>{{items.name}}</div>
            <div class='text-txs mt-1 ml-2 text-gray-400'>{{items.node}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { networkState } from '@/state/networkState';
import { computed, defineComponent, ref, watch, getCurrentInstance } from 'vue';
import { NetworkStateUtils } from '@/state/utils/networkStateUtils';
import { ChainProfile } from "@/models/stores/chainProfile";
import { AppState } from '@/state/appState';

export default defineComponent({
  name: 'SelectNetwork',
  emits:[
    'update:modelValue', 'select-network'
  ],
  setup(){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const toggleSelection = ref(false);
    const networks = computed(()=> {
      let options = [];
      networkState.availableNetworks.forEach((network, index) => {
        let chainProfile = new ChainProfile(network);
        chainProfile.init();
        options.push({ name: network, node: chainProfile.apiNodes[0], index: index });
      });
      return options;
    });

    const selectNetwork = (networkName, networkNode, index) => {
      selectedNetwork.value.name = networkName;
      selectedNetwork.value.node = networkNode;
      node.value = networkNode;
      NetworkStateUtils.changeNetworkByIndex(parseInt(index));
      toggleSelection.value = false;
      emitter.emit("CHANGE_NETWORK", true);
    }

    const node = ref('')
    const selectedNetwork = computed(()=>{ return {name: networkState.chainNetworkName, node: node.value }});

    const init = ()=>{
      let currentChainProfile = new ChainProfile(networkState.chainNetworkName);
      currentChainProfile.init();
      node.value = currentChainProfile.apiNodes[0];
    }

    if(AppState.isReady){
      init();
    }
    else{
      let readyWatcher = watch(AppState, (value) => {
        if(value.isReady){
          init();
          readyWatcher();
        }
      });
    }

    return {
      networks,
      toggleSelection,
      selectedNetwork,
      selectNetwork
    };
  }
})
</script>

