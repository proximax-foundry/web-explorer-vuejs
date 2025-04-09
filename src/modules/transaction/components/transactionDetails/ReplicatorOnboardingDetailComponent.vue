<template>
  <div class="details">
    <div>
      <div>Capacity</div>
      <div>{{ txnDetail.capacity }} MB</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  txnDetail: {
    type: Object,
    required: true,
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.details {
  @apply text-gray-800 text-xs;
  > div {
    @apply flex items-center border-b border-gray-100 py-4;

    > div:first-child {
      @apply w-40 px-4 break-words;
    }

    > div:nth-child(2) {
      @apply w-full;
    }
  }

  > div:last-child {
    @apply border-none;
  }
}
</style>
