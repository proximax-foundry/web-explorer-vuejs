<template>
  <div class="details">
    <div>
      <div>Metadata Type</div>
      <div>
        {{ txnDetail.detail.metadataType }}
      </div>
    </div>
    <div>
      <div>Metadata Type Name</div>
      <div>
        {{ txnDetail.detail.metadataTypeName }}
      </div>
    </div>
    <div>
      <div>Scoped Metadata Key</div>
      <div>
        {{ txnDetail.detail.scopedMetadataKey }}
      </div>
    </div>
  </div>
  <div class="details" v-if="txnGroup == TransactionType.MOSAIC_METADATA_V2">
    <div>
      <div>Target Id</div>
      <div>
        <router-link
          :to="{ name: 'ViewAsset', params: { id: txnDetail.detail.targetId } }"
          class="text-blue-600 hover:text-blue-primary hover:underline"
          >{{
            txnDetail.detail.targetIdName
              ? txnDetail.detail.targetIdName
              : txnDetail.detail.targetId
          }}</router-link
        >
      </div>
    </div>
    <div>
      <div>Target Public Key</div>
      <div>{{ txnDetail.detail.targetPublicKey }}</div>
    </div>
    <div>
      <div>Size Changed</div>
      <div>{{ txnDetail.detail.sizeChanged }}</div>
    </div>
    <div v-if="txnDetail.detail.valueChange">
      <div>Value Change</div>
      <div>{{ txnDetail.detail.valueChange }}</div>
    </div>
    <div v-if="txnDetail.detail.oldValue">
      <div>Old Value</div>
      <div>{{ txnDetail.detail.oldValue }}</div>
    </div>
    <div v-if="txnDetail.detail.newValue">
      <div>New Value</div>
      <div>{{ txnDetail.detail.newValue }}</div>
    </div>
  </div>
  <div class="details" v-if="txnGroup == TransactionType.NAMESPACE_METADATA_V2">
    <div>
      <div>Target Id</div>
      <div>
        <router-link
          :to="{
            name: 'ViewNamespace',
            params: { namespaceParam: txnDetail.detail.targetId },
          }"
          class="text-blue-600 hover:text-blue-primary hover:underline"
          >{{
            txnDetail.detail.targetIdName
              ? txnDetail.detail.targetIdName
              : txnDetail.detail.targetId
          }}</router-link
        >
      </div>
    </div>
    <div>
      <div>Target Public Key</div>
      <div>{{ txnDetail.detail.targetPublicKey }}</div>
    </div>
    <div>
      <div>Size Changed</div>
      <div>{{ txnDetail.detail.sizeChanged }}</div>
    </div>
    <div v-if="txnDetail.detail.valueChange">
      <div>Value Change</div>
      <div>{{ txnDetail.detail.valueChange }}</div>
    </div>
    <div v-if="txnDetail.detail.oldValue">
      <div>Old Value</div>
      <div>{{ txnDetail.detail.oldValue }}</div>
    </div>
    <div v-if="txnDetail.detail.newValue">
      <div>New Value</div>
      <div>{{ txnDetail.detail.newValue }}</div>
    </div>
  </div>
  <div
    class="details"
    v-else-if="txnGroup == TransactionType.ACCOUNT_METADATA_V2"
  >
    <div>
      <div>Target Public Key</div>
      <div>{{ txnDetail.detail.targetPublicKey }}</div>
    </div>
    <div>
      <div>Size Changed</div>
      <div>{{ txnDetail.detail.sizeChanged }}</div>
    </div>
    <div v-if="txnDetail.detail.valueChange">
      <div>Value Change</div>
      <div>{{ txnDetail.detail.valueChange }}</div>
    </div>
    <div v-if="txnDetail.detail.oldValue">
      <div>Old Value</div>
      <div>{{ txnDetail.detail.oldValue }}</div>
    </div>
    <div v-if="txnDetail.detail.newValue">
      <div>New Value</div>
      <div>{{ txnDetail.detail.newValue }}</div>
    </div>
  </div>
</template>

<script setup>
import { TransactionType } from "tsjs-xpx-chain-sdk";

defineProps({
  txnDetail: Object,
  txnGroup: Number,
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
