<template>
  <div class="details">
    <div>
      <div>Transactions</div>
      <div>
        <div
          v-for="(tx, item) in txnDetail.detail.txnList"
          :key="item"
          class="py-1"
        >
          {{ tx.name }} ( {{ tx.total }} )
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  txnDetail: Object,
});
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
      @apply text-xs w-full;
    }
  }

  > div:last-child {
    @apply border-none;
  }
}
</style>
