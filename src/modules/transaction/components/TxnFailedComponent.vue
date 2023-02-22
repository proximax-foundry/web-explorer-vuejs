<template>
  <div class="txn-div">
    <div>
      <div>TX HASH</div>
      <div class="break-all">{{ hash }}</div>
    </div>
    <div>
      <div>Status</div>
      <div>
        <div class="inline-block">
          <div class="flex items-center px-2 py-1 rounded-sm border border-red-100 bg-red-100 text-red-700 text-xs"><span
              class="material-icons md-16">close</span>&nbsp;Failed</div>
        </div>
      </div>
    </div>
    <div>
      <div>Error</div>
      <div class="break-all">{{ status }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">

defineProps({
  hash: String,
  status: String,
})

</script>

<style scoped lang="scss">
.txn-div {
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

  >div:last-child {
    @apply border-none;
  }
}</style>