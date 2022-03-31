<template>
  <div class="details">
    <div>
      <div>Recipient</div>
      <div>{{ txnDetail.detail.recipient }}</div>
    </div>
    <div v-if="txnDetail.detail.amountTransfer">
      <div>Amount</div>
      <div class="relative">
        <span class="font-bold">{{ transferAmount[0] }}</span>
        {{ transferAmount[1]>0?'.':'' }}
        <span class="text-xxs">{{ transferAmount[1] }}</span>
        <span class="font-bold">{{ nativeTokenNamespace }}</span>
        <img src="@/assets/img/icon-xpx.svg" class="ml-2 inline-block absolute" style="top: -1px; width:14px;" />
      </div>
    </div>
    <div v-if="txnDetail.detail.assetAmount">
      <div>Amount</div>
      <div class="relative">
        <span class="font-bold">{{ assetAmount[0] }}</span>
        {{ assetAmount[1]>0?'.':'' }}
        <span class="text-xxs">{{ assetAmount[1] }}</span>
        <div class="inline-block text-gray-400 text-txs hover:text-gray-700 duration-300 transition-all">
          <router-link v-if="txnDetail.assetName" :to="{ name: 'ViewNamespace', params: { namespaceParam: txnDetail.assetName }}" class="hover:text-blue-primary hover:underline">{{ txnDetail.assetName }}</router-link>
          {{ txnDetail.assetName?' / ':'' }}
          <router-link :to="{ name: 'ViewAsset', params: { id: txnDetail.assetId }}" class="hover:text-blue-primary hover:underline">{{ txnDetail.assetId }}</router-link>
        </div>
      </div>
    </div>
    <div v-if="txnDetail.detail.amount">
      <div>SDA Amount</div>
      <div class="relative">
        <div v-for="sda, item in txnDetail.detail.amount" :key="item">
          <span class="font-bold">{{ sdaAmount[item][0] }}</span>
          {{ sdaAmount[item][1]>0?'.':'' }}
          <span class="text-xxs">{{ sdaAmount[item][1] }}</span>
          <div class="inline-block text-gray-400 text-txs hover:text-gray-700 duration-300 transition-all">
            <router-link v-if="sda.name" :to="{ name: 'ViewNamespace', params: { namespaceParam: sda.namespaceID }}" class="hover:text-blue-primary hover:underline">{{ sda.name }}</router-link>
            {{ sda.name?' / ':'' }}
            <router-link :to="{ name: 'ViewAsset', params: { id: sda.id }}" class="hover:text-blue-primary hover:underline">{{ sda.id }}</router-link>
          </div>
        </div>
        <div v-if="txnDetail.detail.amount.length == 0">-</div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, getCurrentInstance, inject, ref, watch } from "vue";
import { useToast } from "primevue/usetoast";
import { AppState } from '@/state/appState';
import { Helper } from "@/util/typeHelper";
import { copyToClipboard } from '@/util/functions';
import { TransactionUtils } from '@/models/util/transactionUtils';
export default {
  name: 'TransferDetailComponent',
  props: {
    txnDetail: Object
  },
  setup(props) {
    const nativeTokenNamespace = AppState.nativeToken.label;
    const transferAmount = computed(() => {
      return props.txnDetail.detail.amountTransfer.toString().split('.');
    });

    const copy = (id) =>{ 
      let stringToCopy = document.getElementById(id).getAttribute("copyValue");
      let copySubject = document.getElementById(id).getAttribute("copySubject");
      copyToClipboard(stringToCopy);
      toast.add({severity:'info', detail: copySubject + ' copied', group: 'br', life: 3000});
    };

    const assetAmount = computed(() => {
      if(props.txnDetail.detail.assetAmount){
        return props.txnDetail.detail.assetAmount.toString().split('.');
      }else{
        return '';
      }
    });

    const sdaAmount = computed(() => {
      let formattedSDA = [];
      if(props.txnDetail.detail.amount){
        props.txnDetail.detail.amount.forEach(sda => {
          formattedSDA.push(sda.amount.toString().split('.'));
        });
      }
      return formattedSDA;
    });

    return {
      nativeTokenNamespace,
      Helper,
      copy,
      transferAmount,
      sdaAmount,
      assetAmount,
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

    > div:last-child{
      @apply border-none;
    }
  }
}
</style>
