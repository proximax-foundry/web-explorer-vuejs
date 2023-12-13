<template>
  <div class="details">
    <div>
      <div>Drive Key</div>
      <div>
        <router-link
          :to="{
            name: 'ViewAccount',
            params: { accountParam: txnDetail.signer },
          }"
          class="text-blue-600 hover:text-blue-primary hover:underline"
        >
          {{ txnDetail.driveKey }}
        </router-link>
      </div>
    </div>
    <div>
      <div>Verification Trigger</div>
      <div>{{ txnDetail.verificationTrigger }}</div>
    </div>
    <div>
      <div>Opinions</div>
      <div>{{ txnDetail.opinions }}</div>
    </div>
    <div>
      <div>Shard ID</div>
      <div>{{ txnDetail.shardId }}</div>
    </div>
    <div>
      <div>Public Keys</div>
      <div>
        <div
          class="py-1 text-blue-600 hover:text-blue-primary hover:underline"
          v-for="pk in txnDetail.keys"
        >
          <router-link
            :to="{
              name: 'ViewAccount',
              params: { accountParam: pk.publicKey },
            }"
          >
            {{ pk.publicKey }}
          </router-link>
        </div>
      </div>
    </div>
    <div>
      <div>Signatures</div>
      <div>
        <div class="py-1" v-for="signature in txnDetail.signatures">
          {{ signature }}
        </div>
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
      @apply w-full flex flex-wrap break-all;
    }
  }

  > div:last-child {
    @apply border-none;
  }
}
</style>
