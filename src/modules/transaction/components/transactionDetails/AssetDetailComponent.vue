<template>
  <div class="details">
    <div>
      <div>Asset ID</div>
      <div>
        <router-link :to="{ name: 'ViewAsset', params:{ id: txnDetail.detail.assetId }}" class="uppercase text-blue-600 hover:text-blue-primary hover:underline">
          {{ txnDetail.detail.assetId }}
        </router-link>
      </div>
    </div>
  </div>
  <div class="details" v-if="txnGroup == TransactionType.MOSAIC_DEFINITION">
    <div>
      <div>Divisibility</div>
      <div>{{ txnDetail.detail.divisibility }}</div>
    </div>
    <div v-if="txnDetail.detail.duration">
      <div>Duration</div>
      <div>{{ txnDetail.detail.duration }} blocks</div>
    </div>
    <div>
      <div>Transferable</div>
      <div>{{ txnDetail.detail.transferable?'Yes':'No' }}</div>
    </div>
    <div>
      <div>Supply Mutable</div>
      <div>{{ txnDetail.detail.supplyMutable?'Yes':'No' }}</div>
    </div>
    <div>
      <div>Nonce</div>
      <div>{{ txnDetail.detail.nonce }}</div>
    </div>
  </div>
  <div class="details" v-else-if="txnGroup == TransactionType.MOSAIC_SUPPLY_CHANGE">
    <div>
      <div>Supply Delta</div>
      <div>
        {{ txnDetail.detail.supplyDirection == 0 ? "Decrease: " : "Increase: " + ": " }}
        {{ txnDetail.detail.supplyDelta }}</div>
    </div>
  </div>
  <div class="details" v-else-if="txnGroup == TransactionType.MODIFY_MOSAIC_LEVY">
    <div>
      <div>Levy Asset Id</div>
      <div>{{ txnDetail.detail.levyAssetId }}</div>
    </div>
    <div>
      <div>Raw Levy Asset Amount</div>
      <div>{{ txnDetail.detail.levyAssetAmountIsRaw?'Yes':'No' }}</div>
    </div>
    <div>
      <div>Levy Type</div>
      <div>{{ txnDetail.detail.levyType }}</div>
    </div>
    <div>
      <div>Levy Recipient</div>
      <div>
        <router-link :to="{ name: 'ViewAccount', params: { accountParam: txnDetail.detail.levyRecipient }}" class="hover:text-blue-primary hover:underline text-blue-600">
          {{ Helper.createAddress(txnDetail.detail.levyRecipient).pretty() }}
        </router-link>
      </div>
    </div>
    <div v-if="txnDetail.detail.namespaceName">
      <div>Namespace</div>
      <div>{{ txnDetail.detail.namespaceName }}</div>
    </div>
    <div v-if="txnDetail.detail.levyAssetName">
      <div>Levy Asset Name</div>
      <div>
        <router-link :to="{ name: 'ViewAsset', params:{ id: txnDetail.detail.levyAssetName }}" class="text-blue-600 hover:text-blue-primary hover:underline">
          {{ txnDetail.detail.levyAssetName }}
        </router-link>
      </div>
    </div>
  </div>
  <div class="details" v-if="txnGroup == TransactionType.REMOVE_MOSAIC_LEVY">
    <div v-if="txnDetail.detail.namespaceName">
      <div>Namespace</div>
      <div>{{ txnDetail.detail.namespaceName }}</div>
    </div>
  </div>
</template>

<script>
import { AppState } from '@/state/appState';
import { Helper } from "@/util/typeHelper";
import { TransactionType } from 'tsjs-xpx-chain-sdk';
import { TransactionUtils } from '@/models/util/transactionUtils';
export default {
  name: 'AssetDetailComponent',
  props: {
    txnDetail: Object,
    txnGroup: Number
  },
  setup(props) {
    return {
      TransactionType,
      Helper,
      TransactionUtils
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
