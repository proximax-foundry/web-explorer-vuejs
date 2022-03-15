<template>
  <div>
    <p class="text-gray-500 mb-5 text-sm font-bold">
      Block details
    </p>
    <div class="mt-10">{{ number }}</div>
  </div>
</template>

<script>
import { computed, defineComponent, getCurrentInstance, inject, ref, watch } from "vue";
import { networkState } from '@/state/networkState';
import { AppState } from '@/state/appState';
import { Helper } from "@/util/typeHelper";
import { TransactionUtils } from '@/models/util/transactionUtils';
export default {
  name: 'ViewBlock',
  props: {
    number: String
  },
  setup(props){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;


    return {

    }
  }
}
</script>