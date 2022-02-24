<template>
  <div class="mt-3 border border-gray-200 p-3" v-for="(item, index) in innerTxn" :key="index">
    <div class="mt-4 table_div">
      <div>
        <div>Type</div>
        <div>{{ TransactionUtils.getTransactionTypeName(item.type) }}</div>
      </div>
      <div>
        <div>Public Key</div>
        <div>{{ item.signer.publicKey }}</div>
      </div>
      <div>
        <div>Signer</div>
        <div>{{ Helper.createAddress(item.signer.address.address).pretty() }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, getCurrentInstance, inject, ref, watch } from "vue";
import { TransactionUtils } from '@/models/util/transactionUtils';
import { Helper } from "@/util/typeHelper";
export default {
  name: 'InnerTxnComponent',
  props: {
    innerTxn: Object
  },
  setup() {
    return {
      TransactionUtils,
      Helper,
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
