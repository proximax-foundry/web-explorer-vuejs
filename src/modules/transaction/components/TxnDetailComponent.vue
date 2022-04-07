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
  <TransferDetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.TRANSFER" />
  <AliasDetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.ADDRESS_ALIAS || txnType == TransactionType.MOSAIC_ALIAS" />
  <AggregateDetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.AGGREGATE_BONDED || txnType == TransactionType.AGGREGATE_COMPLETE" />
  <NamespaceDetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.REGISTER_NAMESPACE" />
  <ExchangeDetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.EXCHANGE_OFFER || txnType == TransactionType.ADD_EXCHANGE_OFFER || txnType == TransactionType.REMOVE_EXCHANGE_OFFER" />
  <LockDetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.LOCK" />
  <LinkAccountDetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.LINK_ACCOUNT" />
  <RestrictionDetailComponent :txnDetail="txnDetail" :txnGroup="txnType" v-if="txnType == TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS || txnType == TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC || txnType == TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION" />
  <SecretDetailComponent :txnDetail="txnDetail" :txnGroup="txnType" v-if="txnType == TransactionType.SECRET_PROOF || txnType == TransactionType.SECRET_LOCK" />
  <AssetDetailComponent :txnDetail="txnDetail" :txnGroup="txnType" v-if="txnType == TransactionType.MOSAIC_DEFINITION || txnType == TransactionType.MOSAIC_SUPPLY_CHANGE || txnType == TransactionType.MODIFY_MOSAIC_LEVY || txnType == TransactionType.REMOVE_MOSAIC_LEVY" />
  <ChainDetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.MOSAIC_DEFINITION || txnType == TransactionType.MOSAIC_SUPPLY_CHANGE || txnType == TransactionType.CHAIN_CONFIGURE || txnType == TransactionType.CHAIN_UPGRADE" />
  <AccountDetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.MODIFY_MULTISIG_ACCOUNT" />
  <MetadataDetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.MOSAIC_METADATA_V2 || txnType == TransactionType.NAMESPACE_METADATA_V2 || txnType == TransactionType.CHAIN_CONFIGURE || txnType == TransactionType.ACCOUNT_METADATA_V2" />
</template>

<script>
/*

Modify Account Metadata
Modify SDA Metadata
Modify Namespace Metadata
Account Metadata
SDA Metadata
Namespace Metadata

*/
import { computed, defineComponent, getCurrentInstance, inject, ref, watch } from "vue";
import { useToast } from "primevue/usetoast";
import { AppState } from '@/state/appState';
import { Helper } from "@/util/typeHelper";
import { copyToClipboard } from '@/util/functions';
import { TransactionUtils } from '@/models/util/transactionUtils';
import TransferDetailComponent from '@/modules/transaction/components/transactionDetails/TransferDetailComponent';
import AliasDetailComponent from '@/modules/transaction/components/transactionDetails/AliasDetailComponent';
import AggregateDetailComponent from '@/modules/transaction/components/transactionDetails/AggregateDetailComponent';
import NamespaceDetailComponent from '@/modules/transaction/components/transactionDetails/NamespaceDetailComponent';
import ExchangeDetailComponent from '@/modules/transaction/components/transactionDetails/ExchangeDetailComponent';
import LockDetailComponent from '@/modules/transaction/components/transactionDetails/LockDetailComponent';
import LinkAccountDetailComponent from '@/modules/transaction/components/transactionDetails/LinkAccountDetailComponent';
import RestrictionDetailComponent from '@/modules/transaction/components/transactionDetails/RestrictionDetailComponent';
import SecretDetailComponent from '@/modules/transaction/components/transactionDetails/SecretDetailComponent';
import AssetDetailComponent from '@/modules/transaction/components/transactionDetails/AssetDetailComponent';
import ChainDetailComponent from '@/modules/transaction/components/transactionDetails/ChainDetailComponent';
import AccountDetailComponent from '@/modules/transaction/components/transactionDetails/AccountDetailComponent';
import MetadataDetailComponent from '@/modules/transaction/components/transactionDetails/MetadataDetailComponent';
import { TransactionType } from 'tsjs-xpx-chain-sdk'
export default {
  name: 'TxnDetailComponent',
  props: {
    txnDetail: Object,
    txnType: Number,
  },
  components: {
    TransferDetailComponent,
    AliasDetailComponent,
    AggregateDetailComponent,
    NamespaceDetailComponent,
    ExchangeDetailComponent,
    LockDetailComponent,
    LinkAccountDetailComponent,
    RestrictionDetailComponent,
    SecretDetailComponent,
    AssetDetailComponent,
    ChainDetailComponent,
    AccountDetailComponent,
    MetadataDetailComponent,
  },
  setup(props) {
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
      TransactionUtils,
      TransactionType
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
