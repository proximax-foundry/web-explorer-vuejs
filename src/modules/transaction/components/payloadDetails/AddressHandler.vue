<template>
  <div :class="styleClass">
    <div>
      <div>{{ label }}</div>
      <div v-if="isValidAddress" class="overflow-hidden">
        <router-link
          :to="{
            name: 'ViewAccount',
            params: { accountParam: value },
          }"
          class="hover:text-blue-primary hover:underline text-blue-600"
          >{{ value }}
        </router-link>
      </div>
      <div v-else class="overflow-hidden">
        {{ value }} <span class="text-sm text-red-300" >Invalid address</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { AppState } from "@/state/appState";
import { Address } from "tsjs-xpx-chain-sdk";

const isValidAddress = ref(false);

const props = defineProps({
  label: String,
  value: String,
  styleClass: String
});

const checkValidAddress = (addressString: string)=>{

  try {
    const address = Address.createFromRawAddress(addressString);

    if(address.networkType === AppState.networkType){
      isValidAddress.value = true;
    }
    else{
      isValidAddress.value = false;
    }
  } catch (error) {
    isValidAddress.value = false;
  }
}

checkValidAddress(props.value || "");

watch(
  () => props.value,
  (address) => {
    checkValidAddress(address || "");
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
