<template>
  <div class="details">
    <div>
      <div>Action</div>
      <div>{{ txnDetail.detail.action }}</div>
    </div>
    <div>
      <div>Remote Public Key</div>
      <div>
        <router-link
          :to="{
            name: 'ViewAccount',
            params: { accountParam: txnDetail.detail.remotePublicKey },
          }"
          class="text-blue-600 hover:text-blue-primary hover:underline"
        >
          {{ txnDetail.detail.remotePublicKey }}
        </router-link>
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
