<template>
  <div class="details">
    <div v-if="txnDetail.detail.applyHeightDelta">
      <div>Apply Height Delta</div>
      <div>{{ txnDetail.detail.applyHeightDelta }}</div>
    </div>
    <div v-if="txnDetail.detail.upgradePeriod">
      <div>Upgrade Period</div>
      <div>{{ txnDetail.detail.upgradePeriod }}</div>
    </div>
    <div v-if="txnDetail.detail.newVersion">
      <div>New Version</div>
      <div>{{ txnDetail.detail.newVersion }}</div>
    </div>
  </div>
</template>

<script>
import { AppState } from '@/state/appState';
import { Helper } from "@/util/typeHelper";
export default {
  name: 'ChainDetailComponent',
  props: {
    txnDetail: Object
  },
  setup(props) {
    return {}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.details{
  @apply text-gray-800 text-xs;
  > div{
    @apply flex items-center border-b border-gray-100 py-4;

    > div:first-child{
      @apply w-40 text-xs pl-4;
    }

    > div:nth-child(2){
      @apply text-xs w-full;
    }
  }

  > div:last-child{
    @apply border-none;
  }
}
</style>
