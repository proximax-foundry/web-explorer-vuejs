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
      <div>Data Modification ID</div>
      <div>
        <router-link
          :to="{
            name: 'ViewTransaction',
            params: { hash: txnDetail.dataModificationId },
          }"
          class="text-blue-600 hover:text-blue-primary hover:underline"
        >
          {{ txnDetail.dataModificationId }}
        </router-link>
      </div>
    </div>
    <div>
      <div>File Structure CDI</div>
      <div>{{ txnDetail.fileStructureCdi }}</div>
    </div>
    <div>
      <div>File Structure Size</div>
      <div>{{ txnDetail.fileStructureSizeBytes }} Bytes</div>
    </div>
    <div>
      <div>Meta Files Size</div>
      <div>{{ txnDetail.metaFilesSizeBytes }} Bytes</div>
    </div>
    <div>
      <div>Used Drive Size</div>
      <div>{{ txnDetail.usedDriveSizeBytes }} Bytes</div>
    </div>
    <div>
      <div>Judged Keys</div>
      <div>{{ txnDetail.judgedKeysCount }}</div>
    </div>
    <div>
      <div>Judging Keys</div>
      <div>{{ txnDetail.judgingKeysCount }}</div>
    </div>
    <div>
      <div>Modification Status</div>
      <div>{{ txnDetail.modificationStatus }}</div>
    </div>
    <div>
      <div>Overlapping Keys</div>
      <div>{{ txnDetail.overlappingKeysCount }}</div>
    </div>
    <div>
      <div>Opinions</div>
      <div class="inline-flex">
        <div v-for="(opinion, i) in txnDetail.opinions">
          {{ opinion.toBigInt()
          }}<span v-if="i < txnDetail.opinions.length - 1">,</span>
        </div>
      </div>
    </div>
    <div>
      <div>Present Opinions</div>
      <div class="inline-flex">
        <div v-for="(opinion, i) in txnDetail.presentOpinions">
          {{ opinion
          }}<span v-if="i < txnDetail.presentOpinions.length - 1">,</span>
        </div>
      </div>
    </div>
    <div>
      <div>Public Keys</div>
      <div>
        <div
          class="py-1 text-blue-600 hover:text-blue-primary hover:underline"
          v-for="pk in txnDetail.publicKeys"
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
