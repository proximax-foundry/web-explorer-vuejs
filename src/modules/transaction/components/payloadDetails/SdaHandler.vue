<template>
  <div v-if="toggleTransform && txnType == TransactionType.HASH_LOCK">
    <div v-if="!detectError">
      <div v-for="item in formattedAssetId">
        <div :class="[checkTxnType(txnType) ? 'table_div' : 'txn-div']">
          <div>
            <div>Amount</div>
            <div>
              <span class="font-bold">{{
                formatCurrency(item.amountLocking)[0]
              }}</span>
              <span class="text-xxs" v-if="formatCurrency(item.amountLocking)[1]">.{{ formatCurrency(item.amountLocking)[1]
              }}</span>
              <div class="font-bold inline-block ml-1">
                {{ nativeTokenNamespace }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="txn-div">
      <div v-if="txnDetail">
        <div>{{ txnDetail.name }}</div>
        <div>
          <router-link
            :to="{ name: 'ViewAsset', params: { id: txnDetail.value } }"
            class="hover:text-blue-primary hover:underline"
            >{{ txnDetail.value }}
          </router-link>
          <span
            class="text-xxs text-gray-500"
            v-if="txnDetail.secondaryValue"
            >({{ txnDetail.secondaryValue }})</span
          >
          <span
            class="text-red-600"
            >(SDA ID Not Found)</span
          >
        </div>
      </div>
    </div>
  </div>
  <div v-else class="txn-div">
    <div v-if="txnDetail">
      <div>{{ txnDetail.name }}</div>
      <div>
        <router-link
          :to="{ name: 'ViewAsset', params: { id: txnDetail.value } }"
          class="hover:text-blue-primary hover:underline"
          >{{ txnDetail.value }}
        </router-link>
        <span
          class="text-xxs text-gray-500"
          v-if="txnDetail.secondaryValue"
          >({{ txnDetail.secondaryValue }})</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppState } from "@/state/appState";
import { TransactionUtils } from "@/util/transactionUtils";
import { TransactionType } from "tsjs-xpx-chain-sdk";
import { computed, ref } from "vue";

const props = defineProps({
  txnDetail: Object,
  txnData: Object,
  toggleTransform: Boolean,
});

const formattedAssetId = ref<any>([]);
const detectError = ref(false);
const nativeTokenNamespace = AppState.nativeToken.label;
const txnType = computed(() => {
  for (let item in props.txnData) {
    if (props.txnData[item].name === "Type") {
      return props.txnData[item].secondaryValue;
    }
  }
});

const checkTxnType = (type: number) => {
  if (type == TransactionType.AGGREGATE_BONDED_V1 || type == TransactionType.AGGREGATE_COMPLETE_V1) {
    return true
  }
  else {
    return false
  }
}

const formatSdaID = async (data: any, type:number) => {
  let txn = <
    {
      amountLocking: number;
      targetIdName: string;
    }
    >{};
  if (type == TransactionType.HASH_LOCK) {
    const amount = data.secondaryValue;
    txn.amountLocking = AppState.nativeToken.divisibility
      ? amount / Math.pow(10, AppState.nativeToken.divisibility)
      : amount;
  }
  else{
    try{
      const assetId = data.value;
      const assetName = await TransactionUtils.getAssetName(assetId);
      if (assetName.names.length) {
        txn.targetIdName = assetName.names[0].name;
      }
    } catch (error) {detectError.value = true}
  }
  formattedAssetId.value.push(txn);
};

const formatCurrency = (cost: any) => {
  return cost.toString().split(".");
};

formatSdaID(props.txnDetail, txnType.value);
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

  >div {
    @apply grid grid-cols-4;

    >div {
      @apply p-2;
    }

    >div:first-child {
      @apply text-blue-primary font-bold;
    }

    >div:nth-child(2) {
      @apply break-all col-span-3;
    }
  }

  >div:nth-child(2n + 1) {
    @apply bg-gray-100;
  }
}
</style>
