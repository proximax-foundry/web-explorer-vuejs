<template>
  <div class="details">
    <div>
      <div>Drive Size</div>
      <div>{{ txnDetail.driveSize }} MB</div>
    </div>
    <div>
      <div>Replicators</div>
      <div>
        {{ txnDetail.replicatorCount }}
      </div>
    </div>
    <div>
      <div>Verification Fee</div>
      <div>
        <span class="font-bold">
          {{ verificationFee[0] }}
        </span>
        <span
          >{{ verificationFee[1] > 0 ? "." : ""
          }}<span class="text-xxs">{{ verificationFee[1] }}</span>
        </span>
        <img
          src="@/assets/img/icon-xpx.svg"
          class="ml-1 mr-2 inline-block"
          style="top: -1px; width: 14px"
        /><span class="font-bold">{{ nativeTokenNamespace }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AppState } from "@/state/appState";
import { computed } from "vue";

const nativeTokenNamespace = AppState.nativeToken.label;

const props = defineProps({
  txnDetail: {
    type: Object,
    required: true,
  },
});

const verificationFee = computed(() => {
  if (!props.txnDetail) {
    return "";
  }
  return props.txnDetail.verificationFeeAmount.toString().split(".");
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