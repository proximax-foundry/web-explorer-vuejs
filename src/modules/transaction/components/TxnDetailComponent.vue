<template>
  <div class="txn-div">
    <div>
      <div>Tx Hash</div>
      <div>{{ txnDetail.hash }}</div>
    </div>
    <div>
      <div>Status</div>
      <div>
        <div v-if="txnDetail.group=='confirmed'" class="inline-block">
          <div class="flex items-center px-2 py-1 rounded-sm border border-green-100 bg-green-100 text-green-700 text-xs"><span class="material-icons md-16">done</span>&nbsp;Success</div>
        </div>
        <div v-else class="inline-block">
          <div class="flex items-center px-2 py-1 rounded-sm border border-yellow-100 bg-yellow-100 text-yellow-700 text-xs"><span class="material-icons md-16">info</span>&nbsp;{{ txnDetail.group=='partial'?'Partial':'Unconfirmed' }}</div>
        </div>
      </div>
    </div>
    <div v-if="txnDetail.group=='partial'">
      <div>Deadline</div>
      <div>{{ txnDetail.timestamp }}</div>
    </div>
    <div v-else>
      <div>Timestamp</div>
      <div>{{ txnDetail.timestamp }}</div>
    </div>
    <div v-if="txnDetail.group=='confirmed'">
      <div>Height</div>
      <div class="text-blue-primary">{{ txnDetail.height }}</div>
    </div>
    <div>
      <div>Tx Type</div>
      <div>{{ txnDetail.type }} <span class="text-xxs text-gray-500">(Version: {{ txnDetail.version }})</span></div>
    </div>
    <div v-if="txnDetail.group=='confirmed'">>
      <div>Tx Fee</div>
      <div class="relative"><span class="font-bold">{{ maxFee[0] }}</span>{{ maxFee[1]>0?'.':'' }}<span class="text-xxs">{{ maxFee[1] }}</span> <span class="font-bold">{{ nativeTokenNamespace }}</span> <img src="@/assets/img/icon-xpx.svg" class="ml-2 inline-block absolute" style="top: -1px; width:14px;" /></div>
    </div>
    <div v-if="txnDetail.amountTransfer">
      <div>Amount</div>
      <div class="relative"><span class="font-bold">{{ transferAmount[0] }}</span>{{ transferAmount[1]>0?'.':'' }}<span class="text-xxs">{{ transferAmount[1] }}</span> <span class="font-bold">{{ nativeTokenNamespace }}</span> <img src="@/assets/img/icon-xpx.svg" class="ml-2 inline-block absolute" style="top: -1px; width:14px;" /></div>
    </div>{{txnDetail.mosaicAmount}}
    <div v-if="txnDetail.assetAmount">
      <div>Amount</div>
      <div class="relative"><span class="font-bold">{{ assetAmount[0] }}</span>{{ assetAmount[1]>0?'.':'' }}<span class="text-xxs">{{ assetAmount[1] }}</span> <span class="text-gray-400 text-txs hover:text-gray-700 duration-300 transition-all">{{ txnDetail.assetName?( txnDetail.assetName + ' / '):'' }} {{ txnDetail.assetId }} </span></div>
    </div>
    <div v-if="txnDetail.amount">
      <div>SDA Amount</div>
      <div class="relative">
        <div v-for="sda, item in txnDetail.amount" :key="item">
          <span class="font-bold">{{ sdaAmount[item][0] }}</span>{{ sdaAmount[item][1]>0?'.':'' }}<span class="text-xxs">{{ sdaAmount[item][1] }}</span> <span class="text-gray-400 text-txs hover:text-gray-700 duration-300 transition-all">{{ sda.name?(sda.name + ' / '):'' }} {{ sda.id }} </span>
        </div>
      </div>
    </div>
    <div>
      <div>Signature</div>
      <div class="break-all">{{ txnDetail.signature }}</div>
    </div>
    <div>
      <div>Signer</div>
      <div class="flex justify-start" v-if="txnDetail.signer">
        <div class="text-blue-primary mr-2" id="signerAddress" :copyValue="Helper.createAddress(txnDetail.signer).pretty()" copySubject="Signer address">{{ Helper.createAddress(txnDetail.signer).pretty() }}</div>
        <img src="@/assets/img/icon-copy.svg" @click="copy('signerAddress')" class="cursor-pointer" />
      </div>
    </div>
    <div v-if="txnDetail.cosigners.length > 0">
      <div>Cosigner{{ (txnDetail.cosigners.length>1)?'s':'' }}</div>
      <div class="flex justify-start">
        <div class="text-blue-primary mr-2" v-for="cosigner, item in txnDetail.cosigners" :key="item">{{ Helper.createAddress(cosigner.signer.address.address).pretty() }}</div>
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
export default {
  name: 'TxnDetailComponent',
  props: {
    txnDetail: Object
  },
  setup(props) {
    const toast = useToast();
    const nativeTokenNamespace = AppState.nativeToken.label;
    const maxFee = computed(() => {
      return props.txnDetail.fee.toString().split('.');
    });

    const transferAmount = computed(() => {
      return props.txnDetail.amountTransfer.toString().split('.');
    });

    const copy = (id) =>{ 
      let stringToCopy = document.getElementById(id).getAttribute("copyValue");
      let copySubject = document.getElementById(id).getAttribute("copySubject");
      copyToClipboard(stringToCopy);
      toast.add({severity:'info', detail: copySubject + ' copied', group: 'br', life: 3000});
    };

    const assetAmount = computed(() => {
      if(props.txnDetail.assetAmount){
        return props.txnDetail.assetAmount.toString().split('.');
      }else{
        return '';
      }
    });

    const sdaAmount = computed(() => {
      let formattedSDA = [];
      if(props.txnDetail.amount){
        props.txnDetail.amount.forEach(sda => {
          formattedSDA.push(sda.amount.toString().split('.'));
        });
      }
      return formattedSDA;
    });

    return {
      nativeTokenNamespace,
      maxFee,
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
.txn-div{
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
