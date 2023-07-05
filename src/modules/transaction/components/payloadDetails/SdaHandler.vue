<template>
  <div v-for="item in formattedAssetId">
    <div
      v-if="item.amountLocking"
      :class="[txnType === 'Aggregate Bonded V1' ? 'table_div' : 'details']"
    >
      <div>
        <div>Amount</div>
        <div>
          <span class="font-bold">{{
            formatCurrency(item.amountLocking)[0]
          }}</span>
          <span class="text-xxs" v-if="formatCurrency(item.amountLocking)[1]"
            >.{{ formatCurrency(item.amountLocking)[1] }}</span
          >
          <div class="font-bold inline-block ml-1">
            {{ nativeTokenNamespace }}
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      :class="[txnType === 'Aggregate Bonded V1' ? 'table_div' : 'details']"
    >
      <div v-if="item.targetIdName">
        <div>Asset Name</div>
        <div>{{ item.targetIdName }}</div>
      </div>
      <div v-else>
        <div>Asset Name</div>
        <div>-</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppState } from "@/state/appState";
import { TransactionUtils } from "@/util/transactionUtils";
import { computed, ref } from "vue";

const props = defineProps({
  txnDetail: Object,
  txnData: Object,
});

console.log(props.txnDetail);

const formattedAssetId = ref<any>([]);
const nativeTokenNamespace = AppState.nativeToken.label;
const txnType = computed(() => {
  for (let item in props.txnData) {
    if (props.txnData[item].name === "Type") {
      return props.txnData[item].value;
    }
  }
});

const formatNamespaceID = async (data: any) => {
  let txn = <
    {
      amountLocking: number;
      targetIdName: string;
    }
  >{};
  if (data.secondaryValue) {
    const amount = data.secondaryValue;
    txn.amountLocking = AppState.nativeToken.divisibility
      ? amount / Math.pow(10, AppState.nativeToken.divisibility)
      : amount;
  }
  const assetId = data.value;
  const assetName = await TransactionUtils.getAssetName(assetId);
  console.log(assetName);
  if (assetName.names.length) {
    txn.targetIdName = assetName.names[0].name;
  }
  formattedAssetId.value.push(txn);
};

const formatCurrency = (cost: any) => {
  return cost.toString().split(".");
};

formatNamespaceID(props.txnDetail);
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
