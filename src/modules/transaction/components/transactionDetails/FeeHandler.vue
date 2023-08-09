<template>
    <div :class="styleClass">
      <div>
        <div>{{ label }}</div>
        <div><span class="font-bold">{{ displayArrayValue[0] }}</span>{{ displayArrayValue[1] > 0 ? "." : ""
           }}<span class="text-xxs">{{ displayArrayValue[1] }}</span>
          <img src="@/assets/img/icon-xpx.svg" class="ml-1 mr-2 inline-block" style="top: -1px; width: 14px" /><span
          class="font-bold">{{ nativeTokenNamespace }}</span>
         <span class="text-sm text-red-300" v-if="errorMsg">{{ errorMsg }}</span></div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  import { AppState } from "@/state/appState";
  
  const displayValue = ref("");
  const displayArrayValue = ref();
  const errorMsg = ref("");
  const nativeTokenNamespace = ref(AppState.nativeToken.label);
  
  const props = defineProps({
    label: String,
    value: String,
    styleClass: String,
    toggleResolve: Boolean
  });
  
  const initAssign = ()=>{
    displayValue.value = props.value || "0";
  }
  
  initAssign();
  
  const resolve = ()=>{
  
    if(displayValue.value !== "0"){
      let tokenDecimalPlace = AppState.nativeToken.divisibility;
      let divider = Math.pow(10, tokenDecimalPlace);
      let quotient = BigInt(displayValue.value)/ BigInt(divider);
      let remainder = displayValue.value.slice(-tokenDecimalPlace);
      
      let remainderInteger = parseInt(remainder);
  
      let amountWithDecimal = remainderInteger ? remainderInteger / divider: 0;
      let adjustedDecimalAmount = remainderInteger ? amountWithDecimal.toString().split(".")[1].toString(): "";
  
      displayValue.value = quotient.toString() + (remainderInteger ? "." + adjustedDecimalAmount :"");
    }
    
    displayArrayValue.value = displayValue.value.split(".");
  }
  
  if(props.toggleResolve){
    resolve();
  }
  
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped lang="scss">
  .txn-div,
  .details {
    @apply text-gray-800 text-xs;
  
    > div {
      @apply flex items-center border-b border-gray-100 py-4;
  
      > div:first-child {
        @apply w-40 text-xs pl-4;
      }
  
      > div:nth-child(2) {
        @apply text-xs w-full;
      }
  
      > div:last-child {
        @apply border-none;
      }
    }
  }
  
  .table_div {
    @apply text-xs;
  
    > div {
      @apply grid grid-cols-4;
  
      > div {
        @apply p-2;
      }
  
      > div:first-child {
        @apply text-blue-primary font-bold;
      }
  
      > div:nth-child(2) {
        @apply break-all col-span-3;
      }
    }
  
    > div:nth-child(2n + 1) {
      @apply bg-gray-100;
    }
  }
  </style>