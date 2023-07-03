<template>
  <div class="details">
    <div>
      <div>Offers</div>
      <div>
        <div
          v-for="(offer, index) in txnDetail.detail.sdaExchange"
          :key="index"
          class="bg-blue-100 font-bold text-xs w-48 py-1 px-2 my-1 mx-1 rounded"
        >
          <div v-if="offer.amountGet">
            <div>
              <div>
                <span class="text-orange-400 text-xxs">Get: </span>
                <span class="font-bold">{{
                  Helper.convertToCurrency(
                    formatCurrency(offer.amountGet)[0],
                    0
                  )
                }}</span>
                <span class="text-xxs" v-if="formatCurrency(offer.amountGet)[1]"
                  >.{{ formatCurrency(offer.amountGet)[1] }}</span
                >
                <div
                  v-if="offer.sdaGetNamespace"
                  class="text-gray-400 hover:text-gray-700 duration-300 transition-all inline-block ml-2"
                >
                  <router-link
                    :to="{
                      name: 'ViewAsset',
                      params: { id: offer.sdaGetNamespace },
                    }"
                    class="hover:text-blue-primary hover:underline"
                  >
                    {{ offer.sdaGetNamespace }}
                  </router-link>
                </div>
                <div v-else
                  class="text-gray-400 hover:text-gray-700 duration-300 transition-all inline-block ml-2"
                >
                  <router-link
                    :to="{ name: 'ViewAsset', params: { id: offer.sdaIdGet } }"
                    class="hover:text-blue-primary hover:underline"
                  >
                    {{ offer.sdaIdGet }}
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <div>
              <div>
                <span class="text-orange-400 text-xxs">SDA ID Get:</span>
                <div class="inline-block">
                  <router-link
                    :to="{ name: 'ViewAsset', params: { id: offer.sdaIdGet } }"
                    class="hover:text-blue-primary hover:underline text-blue-600"
                  >
                    {{ offer.sdaIdGet }}
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          <div v-if="offer.amountGive">
            <div>
              <div>
                <span class="text-orange-400 text-xxs">Give: </span>
                <span class="font-bold">{{
                  Helper.convertToCurrency(
                    formatCurrency(offer.amountGive)[0],
                    0
                  )
                }}</span>
                <span
                  class="text-xxs"
                  v-if="formatCurrency(offer.amountGive)[1]"
                  >.{{ formatCurrency(offer.amountGive)[1] }}</span
                >
                <div v-if="offer.sdaGiveNamespace"
                  class="text-gray-400 hover:text-gray-700 duration-300 transition-all inline-block ml-2"
                >
                  <router-link
                    :to="{
                      name: 'ViewAsset',
                      params: { id: offer.sdaGiveNamespace },
                    }"
                    class="hover:text-blue-primary hover:underline"
                  >
                    {{ offer.sdaGiveNamespace }}
                  </router-link>
                </div>
                <div v-else
                  class="text-gray-400 hover:text-gray-700 duration-300 transition-all inline-block ml-2"
                >
                  <router-link
                    :to="{ name: 'ViewAsset', params: { id: offer.sdaIdGive } }"
                    class="hover:text-blue-primary hover:underline"
                  >
                    {{ offer.sdaIdGive }}
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <div>
              <div>
                <span class="text-orange-400 text-xxs">SDA ID Give:</span>
                <div class="inline-block">
                  <router-link
                    :to="{ name: 'ViewAsset', params: { id: offer.sdaIdGive } }"
                    class="hover:text-blue-primary hover:underline text-blue-600"
                  >
                    {{ offer.sdaIdGive }}
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          <div>
            <span class="text-orange-400 text-xxs"> Duration: </span>
            <span>{{ offer.duration }} blocks</span>
          </div>
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
