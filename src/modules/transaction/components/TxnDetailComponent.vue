<template>
  <div class="txn-div">
    <div>
      <div>Tx Hash</div>
      <div class="flex items-center"><div class="mr-2" id="hash" :copyValue="txnDetail.hash" copySubject="Transaction hash">{{ txnDetail.hash }}</div><img src="@/assets/img/icon-copy.svg" @click="copy('hash')" class="cursor-pointer" /></div>
    </div>
    <div>
      <div>Status</div>
      <div>
        <div v-if="txnDetail.group=='confirmed'" class="inline-block">
          <div class="flex items-center px-2 py-1 rounded-sm border border-green-100 bg-green-100 text-green-700 text-xs"><span class="material-icons md-16">done</span>&nbsp;Success</div>
        </div>
        <div v-else class="inline-block">
          <div class="flex items-center px-2 py-1 rounded-sm border border-yellow-100 bg-yellow-100 text-yellow-700 text-xs"><span class="material-icons md-16">info</span>&nbsp;
            <span v-if="txnDetail.group=='partial'">Partial</span>
            <span v-else-if="txnDetail.group=='unconfirmed'">Unconfirmed</span>
            <span v-else-if="txnDetail.group=='failed'">Failed</span>
          </div>
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
      <div><router-link :to="{ name: 'ViewBlock', params: { blockHeight: txnDetail.height}}" class="text-blue-600 hover:text-blue-primary hover:underline">{{ txnDetail.height }}</router-link></div>
    </div>
    <div>
      <div>Tx Type</div>
      <div>{{ txnDetail.type }} <span class="text-xxs text-gray-500">(Version: {{ txnDetail.version }})</span></div>
    </div>
    <div v-if="txnDetail.group=='confirmed'">
      <div>Tx Fee</div>
      <div class="relative"><span class="font-bold">{{ maxFee[0] }}</span>{{ maxFee[1]>0?'.':'' }}<span class="text-xxs">{{ maxFee[1] }}</span> <span class="font-bold">{{ nativeTokenNamespace }}</span> <img src="@/assets/img/icon-xpx.svg" class="ml-2 inline-block absolute" style="top: -1px; width:14px;" /></div>
    </div>
    <div>
      <div>Signature</div>
      <div class="break-all">{{ txnDetail.signature }}</div>
    </div>
    <div>
      <div>Signer</div>
      <div class="flex justify-start" v-if="txnDetail.signer">
        <router-link :to="{ name: 'ViewAccount', params:{ accountParam: Helper.createAddress(txnDetail.signer).pretty() }}" class="text-blue-600 hover:text-blue-primary hover:underline mr-2" id="signerAddress" :copyValue="Helper.createAddress(txnDetail.signer).pretty()" copySubject="Signer address">{{ Helper.createAddress(txnDetail.signer).pretty() }}</router-link>
        <img src="@/assets/img/icon-copy.svg" @click="copy('signerAddress')" class="cursor-pointer" />
      </div>
    </div>
    <div v-if="txnDetail.cosigners.length > 0">
      <div>Cosigner{{ (txnDetail.cosigners.length>1)?'s':'' }}</div>
      <div>
        <div v-for="cosigner, item in txnDetail.cosigners" :key="item" class="flex items-center mb-3">
          <router-link :to="{ name: 'ViewAccount', params:{ accountParam: Helper.createAddress(cosigner.signer.address.address).pretty() }}" class="text-blue-600 hover:text-blue-primary hover:underline mr-2" :id="'cosigner'+item" :copyValue="Helper.createAddress(cosigner.signer.address.address).pretty()" copySubject="Cosigner address">{{ Helper.createAddress(cosigner.signer.address.address).pretty() }}</router-link>
          <img src="@/assets/img/icon-copy.svg" @click="copy('cosigner' + item)" class="cursor-pointer" />
        </div>
      </div>
    </div>
  </div>
  <TransferDetailComponent :txnDetail="txnDetail" v-if="txnDetail.type == 'Transfer'" />
</template>

<script>
import { computed, defineComponent, getCurrentInstance, inject, ref, watch } from "vue";
import { useToast } from "primevue/usetoast";
import { AppState } from '@/state/appState';
import { Helper } from "@/util/typeHelper";
import { copyToClipboard } from '@/util/functions';
import { TransactionUtils } from '@/models/util/transactionUtils';
import TransferDetailComponent from '@/modules/transaction/components/transactionDetails/TransferDetailComponent';
export default {
  name: 'TxnDetailComponent',
  props: {
    txnDetail: Object
  },
  components: {
    TransferDetailComponent,
  },
  setup(props) {
    console.log(props.txnDetail)
    const toast = useToast();
    const nativeTokenNamespace = AppState.nativeToken.label;
    const maxFee = computed(() => {
      return props.txnDetail.fee.toString().split('.');
    });

    const copy = (id) =>{ 
      let stringToCopy = document.getElementById(id).getAttribute("copyValue");
      let copySubject = document.getElementById(id).getAttribute("copySubject");
      copyToClipboard(stringToCopy);
      toast.add({severity:'info', detail: copySubject + ' copied', group: 'br', life: 3000});
    };

    return {
      nativeTokenNamespace,
      maxFee,
      Helper,
      copy,
      TransactionUtils
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.txn-div, .details{
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
