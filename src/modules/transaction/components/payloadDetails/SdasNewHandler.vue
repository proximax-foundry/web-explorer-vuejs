<template>
  <div v-if="toggleTransform">
    <div v-if="!detectError">
      <div v-for="item in formattedAssetId">
        <div :class="[checkTxnType(txnType) ? 'table_div' : 'txn-div']">
          <div v-if="item.amount">
            <div>Amount</div>
            <div>
              <span class="font-bold">{{
                formatCurrency(item.amount)[0]
              }}</span>
              <span class="text-xxs" v-if="formatCurrency(item.amount)[1]"
                >.{{ formatCurrency(item.amount)[1] }}</span
              >
              <div v-if="item.targetIdName" class="font-bold inline-block ml-1">
                {{ item.targetIdName }}
              </div>
              <div v-else class="font-bold inline-block ml-1">
                {{ nativeTokenNamespace }}
              </div>
            </div>
          </div>
          <div v-else-if="item.targetIdName && txnDetail && !(txnType == TransactionType.MOSAIC_ALIAS)">
            <div>Asset Name</div>
            <div>
              <router-link
                :to="{ name: 'ViewAsset', params: { id: txnDetail.value } }"
                class="hover:text-blue-primary hover:underline text-blue-600"
                >{{ item.targetIdName }}
              </router-link>
              <span
                class="text-xxs text-gray-500"
                v-if="txnDetail.secondaryValue"
                >({{ txnDetail.secondaryValue }})</span
              >
            </div>
          </div>
          <div v-else>
            <div>{{ txnDetail!.name }}</div>
            <div>
              <router-link
                :to="{ name: 'ViewAsset', params: { id: txnDetail!.value } }"
                class="hover:text-blue-primary hover:underline text-blue-600"
                >{{ txnDetail?.value }}
              </router-link>
              <span
                class="text-xxs text-gray-500"
                v-if="txnDetail!.secondaryValue"
                >({{ txnDetail!.secondaryValue }})</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else :class="[checkTxnType(txnType) ? 'table_div' : 'txn-div']">
      <div v-if="txnDetail">
        <div>{{ txnDetail.name }}</div>
        <div>
          <router-link
            :to="{ name: 'ViewAsset', params: { id: txnDetail.value } }"
            class="hover:text-blue-primary hover:underline text-blue-600"
            >{{ txnDetail.value }}
          </router-link>
          <span class="text-xxs text-gray-500" v-if="txnDetail.secondaryValue"
            >({{ txnDetail.secondaryValue }})</span
          >
          <span class="text-red-600 pl-2">(SDA Name Not Found)</span>
        </div>
      </div>
    </div>
  </div>
  <div v-else :class="[checkTxnType(txnType) ? 'table_div' : 'txn-div']">
    <div v-if="txnDetail">
      <div>{{ txnDetail.name }}</div>
      <div>
        <router-link
          :to="{ name: 'ViewAsset', params: { id: txnDetail.value } }"
          class="hover:text-blue-primary hover:underline text-blue-600"
          >{{ txnDetail.value }}
        </router-link>
        <span class="text-xxs text-gray-500" v-if="txnDetail.secondaryValue"
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
import { ref } from "vue";

const props = defineProps({
  txnDetail: Object,
  toggleTransform: Boolean,
  txnType: Number,
});

const formattedAssetId = ref<any>([]);
const detectError = ref(false);
const nativeTokenNamespace = AppState.nativeToken.label;

const checkTxnType = (type: any) => {
  if (
    type == TransactionType.AGGREGATE_BONDED_V1 ||
    type == TransactionType.AGGREGATE_COMPLETE_V1
  ) {
    return true;
  } else {
    return false;
  }
};

const formatSdaID = async (data: any, type: any) => {
  let txn = <
    {
      amount: number;
      targetIdName: string;
    }
  >{};
  if (type == TransactionType.HASH_LOCK || TransactionType.SECRET_LOCK) {
    const amount = data.secondaryValue;
    txn.amount = AppState.nativeToken.divisibility
      ? amount / Math.pow(10, AppState.nativeToken.divisibility)
      : amount;
  }
  try {
    const assetId = data.value;
    const assetName = await TransactionUtils.getAssetName(assetId);
    if (assetName.names.length) {
      txn.targetIdName = assetName.names[0].name;
    }
  } catch (error) {
    detectError.value = true;
  }
  formattedAssetId.value.push(txn);
};

const formatCurrency = (cost: any) => {
  return cost.toString().split(".");
};

formatSdaID(props.txnDetail, props.txnType);
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
