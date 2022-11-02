<template>
  <div class="pb-14">
    <p class="text-gray-500 mb-5 text-sm font-bold">Search not found</p>
    <div class="p-3 bg-yellow-100 text-yellow-700">{{ searchType }} is not found in {{ networkName }}</div>
    <div class="txn-div">
      <div>
        <div id="raw"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, getCurrentInstance, inject, ref, watch } from "vue";
import { networkState } from '@/state/networkState';
import { ChainProfile } from "@/models/stores/chainProfile";
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

    let currentChainProfile = new ChainProfile(networkState.chainNetworkName);
     currentChainProfile.init();


const BASE_URL = 'https://'+currentChainProfile.apiNodes[0]+'/transactions/confirmed/'+ props.param
async function fetchToDo(BASE_URL){
  const response=await fetch(BASE_URL);
  // fetching the reponse body data
  const data = response.json();
  return data
}

function displayValue(data){
  let rawData = '',
    f = {
            brace: 0
        };
  rawData=data.replace(/({|}[,]*|[^{}:]+:[^{}:,]*[,{]*)/g, function (m, p1) {
    var rtnFn = function() {
            return '<div style="text-indent: ' + (f['brace'] * 20) + 'px;">' + p1 + '</div>';
        },
        rtnStr = 0;
    if (p1.lastIndexOf('{') === (p1.length - 1)) {
        rtnStr = rtnFn();
        f['brace'] += 1;
    } else if (p1.indexOf('}') === 0) {
        f['brace'] -= 1;
        rtnStr = rtnFn();
    } else {
        rtnStr = rtnFn();
    }
    return rtnStr;
});

  const rawDiv=document.getElementById("raw")

  rawDiv.innerHTML=rawData

}

fetchToDo(BASE_URL).then((value) => {
  const data = JSON.stringify(value)
    displayValue(data)
  });

    return {
      networkName,
      searchType,
    }
  }
}
</script>

<style scoped lang="scss">
.txn-div, .details{
  @apply text-gray-800 text-xs;
  > div{
    @apply flex items-center border-b border-gray-100 py-4;

    > div:first-child{
      @apply w-40 text-xs pl-4;
    }

    > div:nth-child(2){
      @apply text-xs w-full;
    }

    > div:last-child{
      @apply border-none;
    }
  }
}
</style>