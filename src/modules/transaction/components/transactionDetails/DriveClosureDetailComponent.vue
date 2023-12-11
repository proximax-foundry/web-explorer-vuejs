<template>
  <div class="details">
    <div>
      <div>Drive Key</div>
      <div>
        <router-link
          :to="{
            name: 'ViewTransaction',
            params: { hash: txnDetail.driveKey },
          }"
          class="text-blue-600 hover:text-blue-primary hover:underline"
        >
          {{ txnDetail.driveKey }}
        </router-link>
      </div>
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
      @apply w-full break-all;
    }
  }

  > div:last-child {
    @apply border-none;
  }
}
</style>
