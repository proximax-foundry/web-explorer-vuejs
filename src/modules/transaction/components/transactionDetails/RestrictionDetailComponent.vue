<template>
  <div class="details">
    <div>
      <div>Restriction Type</div>
      <div>{{ txnDetail.detail.restrictionTypeOutput }}</div>
    </div>
    <div>
      <div>Modification</div>
      <div>
        <div v-if="txnGroup==TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION">
          <div v-for="modification, item in txnDetail.detail.modification" :key="item" :class="`${ item > 0?'mt-2':'' }`">
            {{ modification.action }} {{ modification.value }}
          </div>
        </div>
        <div v-else-if="txnGroup==TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC">
          <div v-for="modification, item in txnDetail.detail.modification" :key="item" :class="`${ item > 0?'mt-2':'' }`">
            {{ modification.action }} 
            <router-link v-if="TransactionUtils.isNamespaceWithString(modification.value)" :to="{ name: 'ViewNamespace', params: { namespaceParam: modification.value } }" class="inline-block ml-1 hover:text-blue-primary hover:underline text-blue-600">
              {{ modification.value }}
            </router-link>
            <router-link v-else :to="{ name: 'ViewAsset', params: { id: modification.value } }" class="inline-block ml-1 hover:text-blue-primary hover:underline text-blue-600">
              {{ modification.value }}
            </router-link>
          </div>
        </div>
        <div v-else-if="txnGroup==TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS">
          <div v-for="modification, item in txnDetail.detail.modification" :key="item" :class="`${ item > 0?'mt-2':'' }`">
            {{ modification.action }}
            <router-link :to="{ name: 'ViewAccount', params: { accountParam: modification.value } }" class="inline-block ml-1 hover:text-blue-primary hover:underline text-blue-600">
              {{ Helper.createAddress(modification.value).pretty() }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Helper } from "@/util/typeHelper";
import { TransactionType } from 'tsjs-xpx-chain-sdk';
import { TransactionUtils } from '@/util/transactionUtils';

defineProps({
  txnDetail: Object,
  txnGroup: Number
})

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
