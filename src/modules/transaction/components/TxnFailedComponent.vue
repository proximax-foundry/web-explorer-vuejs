<template>
  <div class="txn-div">
    <div class="text-center text-tsm font-semibold py-1 rounded-full text-white bg-yellow-500 flex justify-center mb-5">Transaction failed</div>
    <div>
      <div>Tx Hash</div>
      <div class="break-all">{{ hash }}</div>
    </div>
    <div>
      <div>Status</div>
      <div class="break-all">{{ status }}</div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, getCurrentInstance, inject, ref, watch } from "vue";
import { useToast } from "primevue/usetoast";
import { AppState } from '@/state/appState';
import { Helper } from "@/util/typeHelper";
import { copyToClipboard } from '@/util/functions';
export default {
  name: 'TxnFailedComponent',
  props: {
    hash: String,
    status: String,
  },
}
</script>

<style scoped lang="scss">
.txn-div{
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
  > div:last-child{
    @apply border-none;
  }
}
</style>