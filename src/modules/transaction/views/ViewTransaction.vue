<template>
  <div>
    <p class="text-gray-500 mb-5 text-sm">
      Transaction Details
    </p>
    <div class="filter shadow-xl border border-gray-50 p-5 mb-15">
      <div class="flex items-center mb-4 border-b border-gray-100 relative">
        <div class="w-32 font-bold text-xs text-center p-2 relative" :class="`${ (currentPage != 'detail')?'cursor-pointer':'' }`" @click="currentPage = 'detail'">Overview<div v-if="currentPage == 'detail'" class="absolute w-full border-b border-yellow-500 transition-all duration-200" style="bottom: -1px;"></div></div>
        <div class="w-32 font-bold text-xs text-center p-2 relative" :class="`${ (currentPage != 'inner')?'cursor-pointer':'' }`" @click="currentPage = 'inner'">Inner Txns<div v-if="currentPage == 'inner'" class="absolute w-full border-b border-yellow-500 transition-all duration-200" style="bottom: -1px;"></div></div>
      </div>
      <transition name="slide">
        <TxnDetailComponent v-if="currentPage == 'detail'" />
        <InnerTxnComponent v-else />
      </transition>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, getCurrentInstance, inject, ref, watch } from "vue";
import TxnDetailComponent from '@/modules/transaction/components/TxnDetailComponent.vue';
import InnerTxnComponent from '@/modules/transaction/components/InnerTxnComponent.vue';
export default {
  name: 'ViewTransaction',
  components: {
    TxnDetailComponent,
    InnerTxnComponent
  },
  props: {
    hash: String
  },
  setup(){
    const currentPage = ref('detail');
    return {
      currentPage
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.slide-enter-active {
  -moz-transition-duration: 1s;
  -webkit-transition-duration: 1s;
  -o-transition-duration: 1s;
  transition-duration: 1s;
  -moz-transition-timing-function: ease-in-out;
  -webkit-transition-timing-function: ease-in-out;
  -o-transition-timing-function: ease-in-out;
  transition-timing-function: ease-in-out;
}

.slide-leave-active {
  -moz-transition-duration: 1s;
  -webkit-transition-duration: 1s;
  -o-transition-duration: 1s;
  transition-duration: 1s;
  -moz-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  -webkit-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  -o-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-enter-to,
.slide-leave-from {
  max-height: 1000px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  overflow: hidden;
  max-height: 0;
}
</style>
