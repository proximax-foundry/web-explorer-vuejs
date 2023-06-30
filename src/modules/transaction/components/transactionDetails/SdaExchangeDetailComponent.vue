<template>
  <div class="details" v-if="txnDetail.detail.sdaExchange.length > 0">
    <div>
      <div>Duration</div>
      <div class="relative">
        <div v-for="offer in txnDetail.detail.sdaExchange">
          <span>
            {{ offer.duration }} blocks
          </span>
        </div>
      </div>
    </div>
    <div v-if="checkAmountGet(txnDetail.detail.sdaExchange)">
      <div>SDA Get</div>
      <div class="relative">
        <div v-for="offer in txnDetail.detail.sdaExchange">
          <span class="font-bold">{{
            Helper.convertToCurrency(formatCurrency(offer.amountGet)[0], 0)
          }}</span>
          <span class="text-xxs" v-if="formatCurrency(offer.amountGet)[1]">.{{ formatCurrency(offer.amountGet)[1] }}</span>
          <div class="text-gray-400 hover:text-gray-700 duration-300 transition-all inline-block ml-2">
            <router-link :to="{ name: 'ViewAsset', params: { id: offer.sdaIdGet } }"
              class="hover:text-blue-primary hover:underline">
              {{ offer.sdaIdGet }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div>SDA ID Get</div>
      <div class="relative">
        <div v-for="offer in txnDetail.detail.sdaExchange">
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
    <div v-if="checkAmountGive(txnDetail.detail.sdaExchange)">
      <div>SDA Give</div>
      <div class="relative">
        <div v-for="offer in txnDetail.detail.sdaExchange">
          <span class="font-bold">{{
            Helper.convertToCurrency(formatCurrency(offer.amountGive)[0], 0)
          }}</span>
          <span class="text-xxs" v-if="formatCurrency(offer.amountGive)[1]">.{{ formatCurrency(offer.amountGive)[1] }}</span>
          <div class="text-gray-400 hover:text-gray-700 duration-300 transition-all inline-block ml-2">
            <router-link :to="{ name: 'ViewAsset', params: { id: offer.sdaIdGive } }"
              class="hover:text-blue-primary hover:underline">
              {{ offer.sdaIdGive }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div>SDA ID Give</div>
      <div class="relative">
        <div v-for="offer in txnDetail.detail.sdaExchange">
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

const checkAmountGet = (data) => {
  for(let i=0; i<data.length; i++){
    if(data[i].amountGet){
      return true
    }
    else{
      return false
    }
  }
}

const checkAmountGive = (data) => {
  for(let i=0; i<data.length; i++){
    if(data[i].amountGive){
      return true
    }
    else{
      return false
    }
  }
}
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