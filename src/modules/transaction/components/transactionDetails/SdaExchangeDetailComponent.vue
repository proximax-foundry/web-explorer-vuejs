<template>
  <div class="details" v-for="(offer, item) in txnDetail.detail.sdaExchange" :key="item">
    <div v-if="offer.duration">
      <div>Duration</div>
      <div>{{ offer.duration }} blocks</div>
    </div>
    <div v-if="offer.amountGet">
      <div>SDA Get</div>
      <div>
        <span class="font-bold">{{
          Helper.convertToCurrency(formatCurrency(offer.amountGet)[0], 0)
        }}</span>
        <span class="text-xxs" v-if="formatCurrency(offer.amountGet)[1]">.{{ formatCurrency(offer.amountGet)[1] }}</span>
        <div class="text-gray-400 hover:text-gray-700 duration-300 transition-all inline-block ml-2">
          <router-link :to="{ name: 'ViewAsset', params: { id: offer.assetIdGet } }"
            class="hover:text-blue-primary hover:underline">
            {{ offer.assetIdGet }}
          </router-link>
        </div>
      </div>
    </div>
    <div v-else-if="offer.assetIdGet">
      <div>Asset ID Get</div>
      <div>
        <div class="inline-block">
          <router-link
            :to="{ name: 'ViewAsset', params: { id: offer.assetIdGet } }"
            class="hover:text-blue-primary hover:underline text-blue-600"
          >
            {{ offer.assetIdGet }}
          </router-link>
        </div>
      </div>
    </div>
    <div v-if="offer.amountGive">
      <div>SDA Give</div>
      <div>
        <span class="font-bold">{{
          Helper.convertToCurrency(formatCurrency(offer.amountGive)[0], 0)
        }}</span>
        <span class="text-xxs" v-if="formatCurrency(offer.amountGive)[1]">.{{ formatCurrency(offer.amountGive)[1] }}</span>
        <div class="text-gray-400 hover:text-gray-700 duration-300 transition-all inline-block ml-2">
          <router-link :to="{ name: 'ViewAsset', params: { id: offer.assetIdGive } }"
            class="hover:text-blue-primary hover:underline">
            {{ offer.assetIdGive }}
          </router-link>
        </div>
      </div>
    </div>
    <div v-else-if="offer.assetIdGive">
      <div>Asset ID Give</div>
      <div>
        <div class="inline-block">
          <router-link
            :to="{ name: 'ViewAsset', params: { id: offer.assetIdGive } }"
            class="hover:text-blue-primary hover:underline text-blue-600"
          >
            {{ offer.assetIdGive }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { Helper } from "@/util/typeHelper";

defineProps({
  txnDetail: Object,
});

const formatCurrency = (amount) => {
  return amount.toString().split(".");
};
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
}
</style>