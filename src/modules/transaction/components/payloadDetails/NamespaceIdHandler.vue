<template>
  <div
    v-for="item in formattedNamespaceId"
    :class="[txnType === 'Aggregate Bonded V1' ? 'table_div' : 'details']"
  >
    <div v-if="item.aliasName">
      <div>Namespace Name</div>
      <div>{{ item.aliasName }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TransactionUtils } from "@/util/transactionUtils";
import { NamespaceId } from "tsjs-xpx-chain-sdk";
import { computed, ref } from "vue";

const props = defineProps({
  txnDetail: NamespaceId,
  txnData: Object,
});

const formattedNamespaceId = ref<any>([]);
const txnType = computed(() => {
  for (let item in props.txnData) {
    if (props.txnData[item].name === "Type") {
      return props.txnData[item].value;
    }
  }
});

const formatNamespaceID = async (namespaceId: NamespaceId | undefined) => {
  let txn = <{
      aliasName: string;
    }
  >{};
  try {
    if(namespaceId){
      const nsName = await TransactionUtils.getNamespacesName([namespaceId]);
      txn.aliasName = nsName[0].name;
    }
  } catch (error) {console.log(error)}
  formattedNamespaceId.value.push(txn)
};

formatNamespaceID(props.txnDetail)

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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
  }

  > div:last-child {
    @apply border-none;
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
  