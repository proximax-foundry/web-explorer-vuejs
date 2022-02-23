<template>
  <div>
    <p class="text-gray-500 mb-5 text-sm font-bold">
      Asset <span class="text-blue-primary font-bold">[[ namespacename ]]</span>
    </p>
    <div class="md:grid md:grid-cols-2">
      <div class="filter shadow-xl border border-gray-50 p-5 mb-15 md:mr-2">
        <div class="text-xs font-bold mb-5">Overview</div>
        <div class="txn-div">
          <div>
            <div>Total Supply </div>
            <div>9,000,000,000</div>
          </div>
          <div>
            <div>Decimals</div>
            <div>6</div>
          </div>
          <div>
            <div>Holders</div>
            <div>1,000</div>
          </div>
        </div>
      </div>
      <div class="filter shadow-xl border border-gray-50 p-5 mb-15 sm:ml-2">
        <div class="text-xs font-bold mb-5">More Info</div>
        <div class="txn-div">
          <div>
            <div>Creator</div>
            <div>[[ ADDRESS ]] at height [[ block ]]</div>
          </div>
          <div>
            <div>Asset ID</div>
            <div class="font-bold">[[ ASSETID ]]</div>
          </div>
          <div>
            <div>Expiry</div>
            <div class="font-bold">NIL</div>
          </div>
          <div>
            <div>Supply Mutable</div>
            <div class="font-bold text-green-600">True</div>
            <div>Transferable</div>
            <div class="font-bold text-green-600">True</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="filter shadow-xl border border-gray-50 p-5 mb-15">
      <div class="flex items-center mb-4 border-b border-gray-100 relative">
        <div class="w-32 font-bold text-xs text-center p-2 relative" :class="`${ (currentPage != 'rich')?'cursor-pointer':'' }`" @click="currentPage = 'rich'">Richlist<div v-if="currentPage == 'rich'" class="absolute w-full border-b border-yellow-500 transition-all duration-200" style="bottom: -1px;"></div></div>
        <div class="w-32 font-bold text-xs text-center p-2 relative" :class="`${ (currentPage != 'metadata')?'cursor-pointer':'' }`" @click="currentPage = 'metadata'">Metadata<div v-if="currentPage == 'metadata'" class="absolute w-full border-b border-yellow-500 transition-all duration-200" style="bottom: -1px;"></div></div>
      </div>
      <transition name="slide">
        <RichlistComponent v-if="currentPage == 'rich'" />
        <InnerTxnComponent v-else />
      </transition>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, getCurrentInstance, inject, ref, watch } from "vue";
import RichlistComponent from '@/modules/asset/components/RichlistComponent.vue';
import InnerTxnComponent from '@/modules/transaction/components/InnerTxnComponent.vue';

export default {
  name: 'ViewAsset',
  components: {
    RichlistComponent,
    InnerTxnComponent
  },
  props: {
    hash: String
  },
  setup(){
    const currentPage = ref('rich');
    return {
      currentPage
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">


.txn-div{
  @apply text-gray-800 text-xs;
  > div{
    @apply flex justify-start items-center border-b border-gray-100 py-4;

    > div:first-child{
      @apply w-40 text-xs pl-4 font-bold;
    }

    > div:nth-child(2){
      @apply text-xs;
    }

    > div:nth-child(3){
      @apply ml-7 w-36 text-xs pl-4 font-bold;
    }

    > div:last-child{
      @apply border-none;
    }
  }
}
</style>
