<template>
  <div class="pb-14">
    <p class="text-gray-500 mb-5 text-sm font-bold">Search not found</p>
    <div class="p-3 bg-yellow-100 text-yellow-700">
      {{ searchType }} is not found in {{ networkName }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { networkState } from "@/state/networkState";

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  param: {
    type: String,
    required: true,
  },
});
const networkName = computed(() => {
  return networkState.chainNetworkName;
});

const searchType = ref("Search");
switch (props.type) {
  case "Hash":
    searchType.value = "Transaction";
    break;
  case "Block":
    searchType.value = "Block";
    break;
  case "Asset":
    searchType.value = "Asset";
    break;
  case "Namespace":
    searchType.value = "Namespace";
    break;
  case "Address":
    searchType.value = "Address";
    break;
  case "PublicKey":
    searchType.value = "Public Key";
    break;
  default:
    searchType.value = "Search";
    break;
}

</script>

<style scoped lang="scss">
.txn-div,
.details {
  @apply text-gray-800 text-xs;

  >div {
    @apply flex items-center border-b border-gray-100 py-4;

    >div:first-child {
      @apply w-40 text-xs pl-4;
    }

    >div:nth-child(2) {
      @apply text-xs w-full;
    }

    >div:last-child {
      @apply border-none;
    }
  }
}
</style>
