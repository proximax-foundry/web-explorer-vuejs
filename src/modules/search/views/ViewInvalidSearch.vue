<template>
  <div class="pb-14">
    <p class="text-gray-500 mb-5 text-sm font-bold">Search not found</p>
    <div class="p-3 bg-yellow-100 text-yellow-700">{{ searchType }} is not found in {{ networkName }}</div>
  </div>
</template>

<script>
import { computed, defineComponent, getCurrentInstance, inject, ref, watch } from "vue";
import { networkState } from '@/state/networkState';
export default {
  name: 'ViewInvalidSearch',
  props: {
    type: String,
    param: String,
  },
  setup(props){
    const networkName = computed(() => {
      return networkState.chainNetworkName;
    });

    const searchType = ref('Search');
    switch (props.type){
      case 'Hash':
        searchType.value = 'Transaction';
        break;
      case 'Block':
        searchType.value = 'Block';
        break;
      case 'Asset':
        searchType.value = 'Asset';
        break;
      case 'Namespace':
        searchType.value = 'Namespace';
        break;
      case 'Address':
        searchType.value = 'Address';
        break;
      case 'PublicKey':
        searchType.value = 'Public Key';
        break;
      default:
        searchType.value = 'Search';
        break;
    }

    return {
      networkName,
      searchType
    }
  }
}
</script>