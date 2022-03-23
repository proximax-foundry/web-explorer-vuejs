<template>        
    <div v-if="isShowInvalid">
      <p class="text-gray-500 mb-5 text-sm font-bold">Block Details</p>
      <div class="p-3 bg-yellow-100 text-yellow-700">Block is not available in {{ networkName }}</div>
    </div>
    <div v-else> 
    <div>
      <p class="text-gray-500 mb-5 text-sm font-bold">
        Block Details <span class="text-blue-primary font-bold"></span>
      </p>   
      <div class="filter shadow-xl border border-gray-50 p-5 mb-15">
        <div class="txn-div">
          <div>
            <div>Block Height</div>
            <div>{{blockInfo.height}}</div>
          </div>
          <div>
            <div>Validator</div>
            <div class="break-all flex items-center">{{blockInfo.validator}}</div>
          </div>
          <div>
            <div>Hash</div>
            <div class="break-all flex items-center">{{blockInfo.hash}}</div>
          </div>
          <div>
            <div>Difficulty</div>
            <div>{{blockInfo.difficulty}}</div>
          </div>
          <div>
            <div>No. of Transactions</div>
            <div>{{blockInfo.numTransactions}}</div>
          </div>
          <div>
            <div>Total Fees</div>
            <div>{{blockInfo.totalFee}}</div>
          </div>
          <div>
            <div>Timestamp</div>
            <div>{{blockInfo.timestamp}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance, ref, watch } from "vue";
import { BlockUtils } from "@/util/blockUtil"
import { AppState } from '@/state/appState';
import { networkState } from '@/state/networkState';

export default {
  name: 'ViewBlock',
  props: {
    blockHeight: Number
  },
  setup(p){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const blockInfo = ref([]);
    const isShowInvalid = ref(false);

    const loadBlock = async() =>{
      if(!AppState.isReady){
        setTimeout(loadBlock, 1000);
      }
      const block = await BlockUtils.getBlockByHeight(p.blockHeight);
      if(block!=false){
        blockInfo.value = block;  
        isShowInvalid.value = false;
      }else{
        isShowInvalid.value = true;
      }
      return;
    };
    loadBlock();
    const networkName = computed(() => {
      return networkState.chainNetworkName;
    });

    emitter.on('CHANGE_NETWORK', payload => {
      if(payload){
        loadBlock();
      }
    });
    
    return {
      blockInfo,
      networkName,
      isShowInvalid
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.txn-div{
  @apply text-gray-800 text-xs;
  > div{
    @apply flex items-center border-b border-gray-100 py-4;

    > div:first-child{
      @apply w-48 text-xs pl-4 font-bold ;
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