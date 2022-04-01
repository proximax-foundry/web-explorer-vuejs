<template>
  <div class="details" v-for="offer, item in txnDetail.detail.exchangeOffers" :key="item">
    <div>
      <div>Offer Type</div>
      <div>{{ offer.type }}</div>
    </div>
    <div v-if="offer.duration">
      <div>Duration</div>
      <div>{{ offer.duration }} blocks</div>
    </div>
    <div v-if="offer.cost">
      <div>Cost</div>
      <div>
        <span class="font-bold">{{ formatCurrency(offer.cost)[0] }}</span>
        <span class="text-xxs" v-if="formatCurrency(offer.cost)[1]">.{{ formatCurrency(offer.cost)[1] }}</span>
        <span class="font-bold">{{nativeTokenNamespace}}</span>
      </div>
    </div>
    <div v-if="offer.amount">
      <div>Amount</div>
      <div>
        <span class="font-bold">{{ formatCurrency(offer.amount)[0] }}</span>
        <span class="text-xxs" v-if="formatCurrency(offer.amount)[1]">.{{ formatCurrency(offer.amount)[1] }}</span>
        <div class="text-gray-400 hover:text-gray-700 duration-300 transition-all inline-block ml-2">
          <router-link :to="{ name: 'ViewAsset', params: { id: offer.assetId }}" class="hover:text-blue-primary hover:underline">
            {{ offer.assetId }}
          </router-link>
        </div>
      </div>
    </div>
    <div v-else-if="offer.assetId">
      <div>Asset ID</div>
      <div>
        <div class="inline-block">
          <router-link :to="{ name: 'ViewAsset', params: { id: offer.assetId }}" class="hover:text-blue-primary hover:underline text-blue-600">
            {{ offer.assetId }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { AppState } from '@/state/appState';
import { Helper } from "@/util/typeHelper";
export default {
  name: 'ExchangeDetailComponent',
  props: {
    txnDetail: Object
  },
  setup(props) {
    const nativeTokenNamespace = AppState.nativeToken.label;

    const formatCurrency = (cost) => {
      return cost.toString().split('.');
    };

    return {
      Helper,
      nativeTokenNamespace,
      formatCurrency,
    }
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
