<template>
  <div :class="styleClass">
    <div>
      <div>{{ label }}</div>
      <div>
        
        <router-link
          :to="{
            name: 'ViewAsset',
            params: { id: displayValue },
          }"
          class="hover:text-blue-primary hover:underline text-blue-600"
          >{{ displayValue }} 
        </router-link>

        <div v-if="alias && !isNamespace"> 
          (alias of  
          <router-link
          :to="{
            name: 'ViewNamespace',
            params: { namespaceParam: alias },
          }"
          class="hover:text-blue-primary hover:underline text-blue-600"
          >{{ alias }}
          </router-link>
          )
        </div>

        <div v-if="alias && isNamespace"> 
          (
          <router-link
          :to="{
            name: 'ViewNamespace',
            params: { namespaceParam: alias },
          }"
          class="hover:text-blue-primary hover:underline text-blue-600"
          >{{ alias }}
          </router-link>
          )
        </div>
        <div v-if="isResolving" class="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-navy-primary mr-2"></div>
        <span class="text-sm text-red-300 px-2" v-if="errorMsg">{{ errorMsg }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { AppState } from "@/state/appState";
import { UInt64, MosaicId, NamespaceId, MosaicInfo, Convert } from "tsjs-xpx-chain-sdk";
import { TransactionUtils } from "@/util/transactionUtils";

const displayValue = ref("");
const errorMsg = ref("");
const alias = ref("");
const isResolving = ref(false);
const isNamespace = ref(false);

const props = defineProps({
  label: String,
  value: {
    type: String,
    required: true
  },
  styleClass: String,
  toggleResolve: Boolean,
  secondaryValue: {
    type: String,
    required: true
  }
});

const initAssign = ()=>{
  displayValue.value = props.secondaryValue + " " + props.value;
  alias.value = "";
}

initAssign();

const resolve = async ()=>{

  if(displayValue.value !== ""){

    isResolving.value = true;
    errorMsg.value = "";

    try {
      let assetId = new MosaicId(props.value);
      let usingAssetId = assetId;

      if(TransactionUtils.isNamespaceWithString(assetId.toHex())){
        isNamespace.value = true;
      }
      else{
        isNamespace.value = false;
      }

      if(isNamespace.value){
        let linkedAssetId = await AppState.chainAPI!.namespaceAPI.getLinkedMosaicId(new NamespaceId(assetId.toDTO().id));

        if(!linkedAssetId){
          throw new Error("Linked SDA not found");
        }

        usingAssetId = linkedAssetId;
      }

      let assetInfo: MosaicInfo = await AppState.chainAPI!.assetAPI.getMosaic(usingAssetId);

      let tokenDecimalPlace = assetInfo.divisibility;
      let divider = Math.pow(10, tokenDecimalPlace);
      let quotient = BigInt(props.secondaryValue)/ BigInt(divider);
      let remainder = props.secondaryValue.slice(-tokenDecimalPlace);
      
      let remainderInteger = parseInt(remainder);

      let amountWithDecimal = remainderInteger ? remainderInteger / divider: 0;
      let adjustedDecimalAmount = remainderInteger ? amountWithDecimal.toString().split(".")[1].toString(): "";

      displayValue.value = quotient.toString() + (remainderInteger ? "." + adjustedDecimalAmount :"");

      displayValue.value = displayValue.value + " " + props.value;

      if(isNamespace.value){
        let nsName = await AppState.chainAPI!.namespaceAPI.getNamespacesName([new NamespaceId(assetId.toDTO().id)]);

        if(nsName[0] && nsName[0].name){
          alias.value = nsName[0].name;
        }
        else{
          throw new Error("Namespace name not found");
        }
      }
      else{
        let names = await AppState.chainAPI!.assetAPI.getMosaicsNames([assetId]);
      
        if(names[0] && names[0].names[0]){
          alias.value = names[0].names[0].name;
        }
        else{
          alias.value = "";
        }
      }
      
    } catch (error) {
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
      @apply w-40 text-xs pl-4 flex-none;
    }

    > div:nth-child(2) {
      @apply text-xs grow;
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
      @apply col-span-3;
    }
  }

  > div:nth-child(2n + 1) {
    @apply bg-gray-100;
  }
}
</style>
