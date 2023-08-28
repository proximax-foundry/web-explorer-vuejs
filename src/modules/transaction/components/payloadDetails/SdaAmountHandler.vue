<template>
  <div :class="styleClass">
    <div>
      <div>{{ label }}</div>
      <div>
        {{ displayValue }} 
        <div v-if="isResolving" class="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-navy-primary mr-2"></div>
        <span class="text-sm text-red-300 px-2" v-if="errorMsg">{{ errorMsg }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { AppState } from "@/state/appState";
import { UInt64, MosaicId } from "tsjs-xpx-chain-sdk";

const displayValue = ref("");
const errorMsg = ref("");
const isResolving = ref(false);
const isSameData = ref(false);
const oldValue = ref("");
const cachedDecimal = ref(0); 

const props = defineProps({
  label: String,
  value: String,
  styleClass: String,
  toggleResolve: Boolean,
  secondaryValue: {
    type: String,
    required: true
  }
});

const initAssign = ()=>{
  displayValue.value = props.value || "";
  checkDataNotChanged();
  oldValue.value = props.value || "";
}

const checkDataNotChanged = ()=>{
  if(oldValue.value == props.value){
    isSameData.value = true;
  }
  else{
    isSameData.value = false;
  }
}

initAssign();

const resolve = async ()=>{

  if(isSameData.value){
    displayValue.value = calcValue(oldValue.value, cachedDecimal.value);
    return;
  }

  if(displayValue.value !== "0"){

    isResolving.value = true;
    errorMsg.value = "";

    try {
      let assetId = new MosaicId(props.secondaryValue);

      let assetInfo = await AppState.chainAPI!.assetAPI.getMosaic(assetId);

      cachedDecimal.value = assetInfo.divisibility;
      displayValue.value = calcValue(displayValue.value, cachedDecimal.value);
      
    } catch (error) {
      errorMsg.value = "unable to resolve";
    } 
  }
  isResolving.value = false;
}

const calcValue = (value: string, decimal: number)=>{
  let tokenDecimalPlace = decimal;
  let divider = Math.pow(10, decimal);
  let quotient = BigInt(value)/ BigInt(divider);
  let remainder = value.slice(-tokenDecimalPlace);

  if(tokenDecimalPlace){
    let remainderInteger = parseInt(remainder);

    let amountWithDecimal = remainderInteger ? remainderInteger / divider: 0;
    let adjustedDecimalAmount = remainderInteger ? amountWithDecimal.toString().split(".")[1].toString(): "";

    return quotient.toString() + (remainderInteger ? "." + adjustedDecimalAmount :"");
  }
  else{
    return value;
  }
}

if(props.toggleResolve){
  resolve();
}

watch(
  () => props.toggleResolve,
  (isToggleResolve) => {
    if(isToggleResolve){
      resolve();
    }
    else{
      initAssign(); 
    }
  }
)

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
      @apply text-xs;
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
