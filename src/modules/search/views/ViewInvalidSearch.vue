<template>
  <div class="pb-14">
    <p class="text-gray-500 mb-5 text-sm font-bold">Search not found</p>
    <div class="p-3 bg-yellow-100 text-yellow-700">{{ searchType }} is not found in {{ networkName }}</div>
    <div class="txn-div">
      <div>
        <div>TX HASH</div>
        <div id="hash" class="flex items-center break-all"></div>
      </div>
      <div>
        <div>Signer</div>
        <div id="signer" class="break-all"></div>
      </div>
      <div>
        <div>Tx Type</div>
        <div id="type"></div>
      </div>
      <div>
        <div>TX FEE</div>
        <div id="fee" class="relative"></div>
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
  const hash=data.meta.hash
  const signer =data.transaction.signer
  const type =data.transaction.type
  const fee =data.transaction.maxFee

  const hashDiv=document.getElementById("hash")
  const signerDiv=document.getElementById("signer")
  const typeDiv=document.getElementById("type")
  const feeDiv=document.getElementById("fee")

  hashDiv.innerHTML=hash
  signerDiv.innerHTML=signer
  typeDiv.innerHTML=type
  feeDiv.innerHTML=fee
}

fetchToDo(BASE_URL).then((value) => {
    displayValue(value)
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