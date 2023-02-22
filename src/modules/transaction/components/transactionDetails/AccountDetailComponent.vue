<template>
  <div class="details">
    <div>
      <div>Approval Delta</div>
      <div>
        {{ txnDetail.detail.oldApprovalNumber ? txnDetail.detail.oldApprovalNumber + " " : '' }}{{
          txnDetail.detail.approvalDelta > 0 ? `+${txnDetail.detail.approvalDelta}` : txnDetail.detail.approvalDelta }}
      </div>
    </div>
    <div>
      <div>Removal Delta</div>
      <div>
        {{ txnDetail.detail.oldRemovalNumber ? txnDetail.detail.oldRemovalNumber + " " : '' }}{{
          txnDetail.detail.removalDelta > 0 ? `+${txnDetail.detail.removalDelta}` : txnDetail.detail.removalDelta }}
      </div>
    </div>
    <div>
      <div>Info</div>
      <div>
        <span v-bind:key="cosigner" v-tooltip.bottom="'Adding account:<br><br>' + cosigner"
          v-for="cosigner in txnDetail.detail.addedCosigner"
          class="inline-block bg-green-200 font-bold text-green-700 text-xs rounded py-1 px-2 my-1 mx-1">
          {{ cosigner.toString() }}
        </span>
        <span v-bind:key="cosigner" v-tooltip.bottom="'Removing account:<br><br>' + cosigner"
          v-for="cosigner in txnDetail.detail.removedCosigner"
          class="inline-block bg-red-200 font-bold text-red-700 text-xs rounded py-1 px-1 my-1 mx-1">
          {{ cosigner.toString() }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup >

defineProps({
  txnDetail: Object
})

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.details {
  @apply text-gray-800 text-xs;

  >div {
    @apply flex items-center border-b border-gray-100 py-4;

    >div:first-child {
      @apply w-40 text-xs pl-4;
    }

    >div:nth-child(2) {
      @apply text-xs w-full;
    }
  }

  >div:last-child {
    @apply border-none;
  }
}</style>
