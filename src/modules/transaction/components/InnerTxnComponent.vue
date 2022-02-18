<template>
  <div class="mt-3 border border-gray-200 p-3" v-for="(item, index) in innerTransactions" :key="index">
    <div class="text-xs flex justify-between cursor-pointer" @click="viewInnerTxn[index] = !viewInnerTxn[index]">{{ item.Inner }}<img src="@/modules/transaction/img/icon-down-caret-black.svg" class="mr-1 transition-all duration-200" :class="`${viewInnerTxn[index]?'rotate-180 transform':''}`"></div>
    <transition name="slide">
      <div class="mt-4 table_div" v-if="viewInnerTxn[index]">
        <div>
          <div>Type</div>
          <div>{{ item.Type }}</div>
        </div>
        <div>
          <div>Public Key</div>
          <div>{{ item.PublicKey }}</div>
        </div>
        <div>
          <div>Signer</div>
          <div>{{ item.Address }}</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { computed, defineComponent, getCurrentInstance, inject, ref, watch } from "vue";
export default {
  name: 'InnerTxnComponent',
  setup(){
    const viewInnerTxn = ref([true, true]);
    const innerTransactions = ref([
      {
        Inner: 'Asset definition',
        Type: '16717',
        PublicKey: 'B41C331FCEF5DFB5C8D9F954DAC23F714A5177A86EDE7BFCE7675FD76B61709C',
        Address: 'VCZUOH-XBPZHT-P5QI53-TJWF7L-4NZ4TK-CBNEKZ-LIFW'
      },
      {
        Inner: 'Asset supply change',
        Type: '16973',
        PublicKey: 'B41C331FCEF5DFB5C8D9F954DAC23F714A5177A86EDE7BFCE7675FD76B61709C',
        Address: 'VCZUOH-XBPZHT-P5QI53-TJWF7L-4NZ4TK-CBNEKZ-LIFW'
      }
    ]);
    return {
      viewInnerTxn,
      innerTransactions
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.table_div{
  @apply text-xs;
  > div{
    @apply grid grid-cols-4;
    > div{
      @apply p-2;
    }
    > div:first-child{
      @apply text-blue-primary w-24 font-bold;
    }
    > div:nth-child(2){
      @apply break-all col-span-3;
    }
  }

  > div:nth-child(2n+1){
    @apply bg-gray-100;
  }
}
</style>
