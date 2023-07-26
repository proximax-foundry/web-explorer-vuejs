<template>
  <div :class="styleClass">
    <div>
      <div>{{ label }}</div>
      <div>
        <div v-if="isResolving" class="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-navy-primary mr-2"></div>
        <div class="text-sm text-red-300 px-2" v-if="errorMsg">{{ errorMsg }}</div>
        {{ displayValue }}

        <div :class="styleClass" v-if="isResolved" >
          <div>
            <div class="flex-none">Current metadata raw value</div>
            <div class="grow">{{ currentHexValue }}</div>
          </div>
        </div>
        <div :class="styleClass" v-if="isResolved" >
          <div>
            <div class="flex-none">Current metadata value</div>
            <div class="grow">{{ currentValue }}</div>
          </div>
        </div>

        <div :class="styleClass" v-if="isResolved" >
          <div>
            <div class="flex-none">New metadata raw value</div>
            <div class="grow">{{ newHexValue }}</div>
          </div>
        </div>
        <div :class="styleClass" v-if="isResolved" >
          <div>
            <div class="flex-none">New metadata value</div>
            <div class="grow">{{ newValue }}</div>
          </div>   
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { AppState } from "@/state/appState";
import { MetadataQueryParams, MetadataType, Convert } from "tsjs-xpx-chain-sdk";
import { TransactionUtils } from "@/util/transactionUtils";

const displayValue = ref("");
const errorMsg = ref("");
const isResolved = ref(false);
const isResolving = ref(false);
const currentValue = ref("");
const currentHexValue = ref("");
const newValue = ref("");
const newHexValue = ref("");

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
  currentValue.value = "";
  currentHexValue.value = "";
  newValue.value = "";
  newHexValue.value = "";
  isResolved.value = false;
}

initAssign();

const resolve = async ()=>{

  if(displayValue.value !== ""){

    isResolving.value = true;
    errorMsg.value = "";

    try {
      let metadataQP = new MetadataQueryParams();
      let [targetId, scopedKey] = props.secondaryValue.split(",");
      let secondaryDataLength = targetId.length;
      
      metadataQP.scopedMetadataKey = scopedKey;

      if(secondaryDataLength === 64){
        metadataQP.metadataType = MetadataType.ACCOUNT;
        metadataQP.targetKey = targetId;
      }
      else{
        metadataQP.targetId = targetId;

        if(TransactionUtils.isNamespaceWithString(targetId)){
          metadataQP.metadataType = MetadataType.NAMESPACE;
        }
        else{
          metadataQP.metadataType = MetadataType.MOSAIC;
        }
      }

      let metadataSearch = await AppState.chainAPI!.metadataAPI.searchMetadatas(metadataQP);

      if(metadataSearch.metadataEntries.length){
        let metadataEntry = metadataSearch.metadataEntries[0];
        // let uint8Array = Convert.hexToUint8(metadataEntry.value);

        currentValue.value = metadataEntry.value;//new TextDecoder().decode(uint8Array);
        currentHexValue.value = Convert.utf8ToHex(metadataEntry.value);
        
        newHexValue.value = TransactionUtils.applyHexValueChange(
          currentHexValue.value,
          displayValue.value,
          (displayValue.value.length - currentHexValue.value.length) / 2
        );

        if(newHexValue.value){
          newValue.value = new TextDecoder().decode(Convert.hexToUint8(newHexValue.value));
        }

      }
      else{
        currentValue.value = "-";
        currentHexValue.value = "-";
        newValue.value = new TextDecoder().decode(Convert.hexToUint8(displayValue.value));;
        newHexValue.value = displayValue.value;
      }

      isResolved.value = true;
      
    } catch (error) {
      console.log(error);
      errorMsg.value = "unable to resolve";
    } 
  }
  isResolving.value = false;
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
