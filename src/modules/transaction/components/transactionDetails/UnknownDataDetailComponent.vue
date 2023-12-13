<template>
  <div class="details">
    <div>
      <div>Unknown Data</div>
      <div>
        <pre>{{ unknownData }}</pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  txnDetail: {
    type: Object,
    required: true
  },
});

const unknownData = JSON.stringify(props.txnDetail.unknownData, undefined, 2);
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.details {
  @apply text-gray-800 text-xs bg-gray-200;
  > div {
    @apply flex items-center border-b border-gray-100 py-4;

    > div:first-child {
      @apply w-40 px-4;
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
