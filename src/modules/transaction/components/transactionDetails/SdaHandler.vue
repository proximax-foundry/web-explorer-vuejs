<template>
  <div :class="styleClass">
    <div>
      <div>{{ label }}</div>
      <div>
        <span>{{ secondaryValue }}</span>
        <img
          v-if="
            alias == 'xarcade.xar'
          "
          src="@/modules/account/img/xarcade-logo.svg"
          class="inline-block h-7 w-7 mr-2 ml-2 border-2 rounded-3xl"
        />
        <img
          v-else-if="
            alias == 'prx.metx'
          "
          src="@/modules/account/img/metx-logo.svg"
          class="inline-block h-7 w-7 mr-2 ml-2 border-2 rounded-3xl"
        />
        <img
          v-else
          src="@/modules/transaction/img/proximax-logo-gray.svg"
          class="inline-block h-6 w-6 mr-2 ml-2"
        />
        <div class="inline-block text-gray-400 text-txs hover:text-gray-700 duration-300 transition-all">
          <router-link v-if="!isNamespace"
          :to="{
            name: 'ViewAsset',
            params: { id: value },
          }"
          class="hover:text-blue-primary hover:underline text-blue-600"
          >{{ value }} 
          </router-link>

          <router-link v-else
            :to="{
              name: 'ViewNamespace',
              params: { namespaceParam: value },
            }"
            class="hover:text-blue-primary hover:underline text-blue-600"
            >{{ value }} 
          </router-link>
        </div>
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
  displayValue.value =  props.value;
  alias.value = "";

  if(TransactionUtils.isNamespaceWithString(props.value)){
    isNamespace.value = true;
  }
  else{
    isNamespace.value = false;
  }
}

initAssign();

const resolve = async ()=>{

  if(displayValue.value !== ""){

    isResolving.value = true;
    errorMsg.value = "";

    try {
      let assetId = new MosaicId(props.value);

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
      console.log(error)
    } 
  }
  isResolving.value = false;
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
      @apply col-span-3;
    }
  }

  > div:nth-child(2n + 1) {
    @apply bg-gray-100;
  }
}
</style>