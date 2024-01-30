<template>
  <div class="details">
    <div>
      <div>Drive Key</div>
      <div>
        <router-link
          :to="{
            name: 'ViewAccount',
            params: { accountParam: txnDetail.unknownData.driveKey },
          }"
          class="text-blue-600 hover:text-blue-primary hover:underline break-all"
        >
          {{ txnDetail.unknownData.driveKey }}
        </router-link>
      </div>
    </div>
    <div>
      <div>Data Modification ID</div>
      <div>
        <router-link
          :to="{
            name: 'ViewTransaction',
            params: { hash: txnDetail.unknownData.dataModificationId },
          }"
          class="text-blue-600 hover:text-blue-primary hover:underline break-all"
        >
          {{ txnDetail.unknownData.dataModificationId }}
        </router-link>
      </div>
    </div>
    <div>
      <div>Data Size</div>
      <div>{{ txnDetail.unknownData.size }}</div>
    </div>
    <div v-if="txnDetail.unknownPayload">
      <div>Payload</div>
      <div>{{ txnDetail.unknownPayload }}</div>
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
      @apply w-full flex flex-wrap;
    }
  }

  > div:last-child {
    @apply border-none;
  }
}
</style>
