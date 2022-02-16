<template>
  <div class="w-60">
    <div @click='toggleSelection = !toggleSelection' class= "ml-auto mr-auto py-3 px-2 cursor-pointer">
      <div class="flex justify-between">
        <div class="flex flex-col ml-2 text-left mr-5">
          <div v-if='selectedNetwork.name!=""' class='mt-1 text-tsm text-white'>{{selectedNetwork.name}}<div class="text-txs text-yellow-400 mt-1">{{ selectedNetwork.node }}</div></div>
          <div v-else class="text-tsm font-bold">Select Network</div>
        </div>
        <img src="@/assets/img/icon-caret-down.svg" class="ml-2 transition-all duration-200" :class="`${toggleSelection?'rotate-180 transform':''}`">
      </div>
    </div>

    <div class="relative">
      <div v-if='toggleSelection' class="absolute border border-t-0 w-full z-50 bg-white max-h-40 overflow-auto px-1 filter drop-shodow-xl pb-2">
        <div v-if='networks.length > 0' class="pl-2 pt-4 text-xxs text-gray-400">SELECT NETWORK</div>
        <div v-else class="text-xxs pt-2 pl-2 pb-2">The list is empty.</div>
        <div v-for='(items, index) in networks' :key="items" class="px-2 py-3 flex cursor-pointer items-center hover:bg-gray-50 transition-all duration-300" @click="selectNetwork(items.name, items.node);$emit('update:modelValue', selectedNetwork);$emit('select-network', selectedNetwork);" :class='`${(index != networks.length - 1)?"border-b border-gray-200":""}`'>
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
import { computed, defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'SelectNetwork',
  emits:[
    'update:modelValue', 'select-network'
  ],
  setup(){
    const toggleSelection = ref(false);
    const selectedNetwork = ref({name:'Sirius Testnet 1', node: 'bctestnet1.brimstone.xpxsirius.io'});

    const networks = ref([
      {
        name: 'Sirius Testnet 1',
        node: 'bctestnet1.brimstone.xpxsirius.io'
      },
      {
        name: 'Sirius Testnet 2',
        node: 'api-1.testnet2.xpxsirius.io'
      }
    ]);

    const selectNetwork = (name, node) => {
      selectedNetwork.value.name = name;
      selectedNetwork.value.node = node;
      toggleSelection.value = false;
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

