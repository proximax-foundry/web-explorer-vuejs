<template>
  <div class="details">
    <div>
      <div>Lock Hash</div>
      <div class="break-all">{{ txnDetail.detail.lockHash }}</div>
    </div>
    <div>
      <div>Duration</div>
      <div>{{ txnDetail.detail.duration }} blocks</div>
    </div>
    <div>
      <div>Amount</div>
      <div>
        <span class="font-bold">{{
          formatCurrency(txnDetail.detail.amountLocking)[0]
        }}</span>
        <span
          class="text-xxs"
          v-if="formatCurrency(txnDetail.detail.amountLocking)[1]"
          >.{{ formatCurrency(txnDetail.detail.amountLocking)[1] }}</span
        >
        <div class="font-bold inline-block ml-1">
          {{ nativeTokenNamespace }}
        </div>
      </div>
    </div>
    <div v-if="txnDetail.detail.isRefunded != undefined">
      <div>Refunded</div>
      <div>{{ txnDetail.detail.isRefunded ? "Yes" : "No" }}</div>
    </div>
  </div>
</template>

<script setup>
import { AppState } from "@/state/appState";

defineProps({
  txnDetail: Object,
});

const nativeTokenNamespace = AppState.nativeToken.label;

const formatCurrency = (cost) => {
  return cost.toString().split(".");
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.details {
  @apply text-gray-800 text-xs;
  > div {
    @apply flex items-center border-b border-gray-100 py-4;

    > div:first-child {
      @apply w-40 text-xs px-4;
    }

    > div:nth-child(2) {
      @apply text-xs w-full;
    }
  }

  > div:last-child {
    @apply border-none;
  }
}
</style>
