<template>
  <div class="txn-div">
    <div>
      <div>TX HASH</div>
      <div class="flex items-center break-all">
        <div
          class="mr-2"
          id="hash"
          :copyValue="txnDetail.hash"
          copySubject="Transaction hash"
        >
          {{ txnDetail.hash }}
        </div>
        <img
          src="@/assets/img/icon-copy.svg"
          @click="copy('hash')"
          class="cursor-pointer"
        />
      </div>
    </div>
    <div>
      <div>Status</div>
      <div>
        <div v-if="txnDetail.group == 'confirmed'" class="inline-block">
          <div
            class="flex items-center px-2 py-1 rounded-sm border border-green-100 bg-green-100 text-green-700 text-xs"
          >
            <span class="material-icons md-16">done</span>&nbsp;Success
          </div>
        </div>
        <div v-else class="inline-block">
          <div
            class="flex items-center px-2 py-1 rounded-sm border border-yellow-100 bg-yellow-100 text-yellow-700 text-xs"
          >
            <span class="material-icons md-16">info</span>&nbsp;
            <span v-if="txnDetail.group == 'partial'">Partial</span>
            <span v-else-if="txnDetail.group == 'unconfirmed'"
              >Unconfirmed</span
            >
            <span v-else-if="txnDetail.group == 'failed'">Failed</span>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="txnDetail.group == 'partial' || txnDetail.group == 'unconfirmed'"
    >
      <div>Deadline</div>
      <div>{{ txnDetail.timestamp }}</div>
    </div>
    <div v-else>
      <div>Timestamp</div>
      <div>{{ txnDetail.timestamp }}</div>
    </div>
    <div v-if="txnDetail.group == 'confirmed'">
      <div>Block</div>
      <div>
        <router-link
          :to="{ name: 'ViewBlock', params: { blockHeight: txnDetail.height } }"
          class="text-blue-600 hover:text-blue-primary hover:underline"
          >{{ txnDetail.height }}</router-link
        >
      </div>
    </div>
    <div>
      <div>Tx Type</div>
      <div>
        {{ txnDetail.type }}
        <span class="text-xxs text-gray-500"
          >(Version: {{ txnDetail.version }})</span
        >
      </div>
    </div>
    <div v-if="txnDetail.group == 'confirmed'">
      <div>TX FEE</div>
      <div class="relative">
        <span class="font-bold">{{ maxFee[0] }}</span
        >{{ maxFee[1] > 0 ? "." : ""
        }}<span class="text-xxs">{{ maxFee[1] }}</span>
        <img
          src="@/assets/img/icon-xpx.svg"
          class="ml-1 mr-2 inline-block"
          style="top: -1px; width: 14px"
        /><span class="font-bold">{{ nativeTokenNamespace }}</span>
      </div>
    </div>
    <div>
      <div>Signature</div>
      <div class="break-all">{{ txnDetail.signature }}</div>
    </div>
    <div>
      <div
        v-if="
          txnType == TransactionType.AGGREGATE_BONDED ||
          txnType == TransactionType.AGGREGATE_COMPLETE
        "
      >
        Signer
      </div>
      <div v-else>From</div>
      <div class="flex justify-start" v-if="txnDetail.signer">
        <router-link
          :to="{
            name: 'ViewAccount',
            params: {
              accountParam: Helper.createAddress(txnDetail.signer).pretty(),
            },
          }"
          class="text-blue-600 hover:text-blue-primary hover:underline mr-2"
          id="signerAddress"
          :copyValue="Helper.createAddress(txnDetail.signer).pretty()"
          copySubject="Signer address"
          >{{ Helper.createAddress(txnDetail.signer).pretty() }}</router-link
        >
        <img
          src="@/assets/img/icon-copy.svg"
          @click="copy('signerAddress')"
          class="cursor-pointer"
        />
      </div>
    </div>
    <div v-if="txnDetail.cosigners.length > 0">
      <div>Cosigner{{ txnDetail.cosigners.length > 1 ? "s" : "" }}</div>
      <div>
        <div
          v-for="(cosigner, item) in txnDetail.cosigners"
          :key="item"
          class="flex items-center mb-3"
        >
          <router-link
            :to="{
              name: 'ViewAccount',
              params: {
                accountParam: Helper.createAddress(
                  cosigner.signer.address.address
                ).pretty(),
              },
            }"
            class="text-blue-600 hover:text-blue-primary hover:underline mr-2"
            :id="'cosigner' + item"
            :copyValue="
              Helper.createAddress(cosigner.signer.address.address).pretty()
            "
            copySubject="Cosigner address"
            >{{
              Helper.createAddress(cosigner.signer.address.address).pretty()
            }}</router-link
          >
          <img
            src="@/assets/img/icon-copy.svg"
            @click="copy('cosigner' + item)"
            class="cursor-pointer"
          />
        </div>
      </div>
    </div>
  </div>
  <TransferDetailComponent
    :txnDetail="txnDetail"
    v-if="txnType == TransactionType.TRANSFER"
  />
  <AliasDetailComponent
    :txnDetail="txnDetail"
    v-if="
      txnType == TransactionType.ADDRESS_ALIAS ||
      txnType == TransactionType.MOSAIC_ALIAS
    "
  />
  <AggregateDetailComponent
    :txnDetail="txnDetail"
    v-if="
      txnType == TransactionType.AGGREGATE_BONDED ||
      txnType == TransactionType.AGGREGATE_COMPLETE
    "
  />
  <NamespaceDetailComponent
    :txnDetail="txnDetail"
    v-if="txnType == TransactionType.REGISTER_NAMESPACE"
  />
  <ExchangeDetailComponent
    :txnDetail="txnDetail"
    v-if="
      txnType == TransactionType.EXCHANGE_OFFER ||
      txnType == TransactionType.ADD_EXCHANGE_OFFER ||
      txnType == TransactionType.REMOVE_EXCHANGE_OFFER
    "
  />
  <LockDetailComponent
    :txnDetail="txnDetail"
    v-if="txnType == TransactionType.LOCK"
  />
  <LinkAccountDetailComponent
    :txnDetail="txnDetail"
    v-if="txnType == TransactionType.LINK_ACCOUNT"
  />
  <RestrictionDetailComponent
    :txnDetail="txnDetail"
    :txnGroup="txnType"
    v-if="
      txnType == TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS ||
      txnType == TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC ||
      txnType == TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION
    "
  />
  <SecretDetailComponent
    :txnDetail="txnDetail"
    :txnGroup="txnType"
    v-if="
      txnType == TransactionType.SECRET_PROOF ||
      txnType == TransactionType.SECRET_LOCK
    "
  />
  <AssetDetailComponent
    :txnDetail="txnDetail"
    :txnGroup="txnType"
    v-if="
      txnType == TransactionType.MOSAIC_DEFINITION ||
      txnType == TransactionType.MOSAIC_SUPPLY_CHANGE ||
      txnType == TransactionType.MODIFY_MOSAIC_LEVY ||
      txnType == TransactionType.REMOVE_MOSAIC_LEVY
    "
  />
  <ChainDetailComponent
    :txnDetail="txnDetail"
    v-if="
      txnType == TransactionType.MOSAIC_DEFINITION ||
      txnType == TransactionType.MOSAIC_SUPPLY_CHANGE ||
      txnType == TransactionType.CHAIN_CONFIGURE ||
      txnType == TransactionType.CHAIN_UPGRADE
    "
  />
  <AccountDetailComponent
    :txnDetail="txnDetail"
    v-if="txnType == TransactionType.MODIFY_MULTISIG_ACCOUNT"
  />
  <MetadataDetailComponent
    :txnDetail="txnDetail"
    v-if="
      txnType == TransactionType.MOSAIC_METADATA_V2 ||
      txnType == TransactionType.NAMESPACE_METADATA_V2 ||
      txnType == TransactionType.CHAIN_CONFIGURE ||
      txnType == TransactionType.ACCOUNT_METADATA_V2
    "
  />
  <div v-if="txnDetail.type === 'UNKNOWN'"  class="txn-div">
    <div class="bg-gray-400">
      <div>Unknown Data</div>
        <span>
            <pre id="unknown"></pre>
        </span>
    </div>
  </div>
</template>

<script setup>
/*

Modify Account Metadata
Modify SDA Metadata
Modify Namespace Metadata
Account Metadata
SDA Metadata
Namespace Metadata

*/
import { computed } from "vue";
import { useToast } from "primevue/usetoast";
import { AppState } from "@/state/appState";
import { Helper } from "@/util/typeHelper";
import { copyToClipboard } from "@/util/functions";
import TransferDetailComponent from "@/modules/transaction/components/transactionDetails/TransferDetailComponent.vue";
import AliasDetailComponent from "@/modules/transaction/components/transactionDetails/AliasDetailComponent.vue";
import AggregateDetailComponent from "@/modules/transaction/components/transactionDetails/AggregateDetailComponent.vue";
import NamespaceDetailComponent from "@/modules/transaction/components/transactionDetails/NamespaceDetailComponent.vue";
import ExchangeDetailComponent from "@/modules/transaction/components/transactionDetails/ExchangeDetailComponent.vue";
import LockDetailComponent from "@/modules/transaction/components/transactionDetails/LockDetailComponent.vue";
import LinkAccountDetailComponent from "@/modules/transaction/components/transactionDetails/LinkAccountDetailComponent.vue";
import RestrictionDetailComponent from "@/modules/transaction/components/transactionDetails/RestrictionDetailComponent.vue";
import SecretDetailComponent from "@/modules/transaction/components/transactionDetails/SecretDetailComponent.vue";
import AssetDetailComponent from "@/modules/transaction/components/transactionDetails/AssetDetailComponent.vue";
import ChainDetailComponent from "@/modules/transaction/components/transactionDetails/ChainDetailComponent.vue";
import AccountDetailComponent from "@/modules/transaction/components/transactionDetails/AccountDetailComponent.vue";
import MetadataDetailComponent from "@/modules/transaction/components/transactionDetails/MetadataDetailComponent.vue";
import { TransactionType } from "tsjs-xpx-chain-sdk";
import { onMounted } from "vue";

const props = defineProps({
  txnDetail: Object,
  txnType: Number,
});
const toast = useToast();
const nativeTokenNamespace = AppState.nativeToken.label;
const maxFee = computed(() => {
  if (!props.txnDetail) {
    return "";
  }
  return props.txnDetail.fee.toString().split(".");
});

const copy = (id) => {
  let element = document.getElementById(id);
  if (element) {
    let stringToCopy = element.getAttribute("copyValue");
    let copySubject = element.getAttribute("copySubject");
    if (stringToCopy) {
      copyToClipboard(stringToCopy);
      toast.add({
        severity: "info",
        detail: copySubject + " copied",
        group: "br",
        life: 3000,
      });
    }
  }
};

onMounted(() => {
  if(props.txnDetail.type === 'UNKNOWN')
    document.getElementById("unknown").innerHTML = JSON.stringify(props.txnDetail.unknownData, undefined, 2);
})

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.txn-div,
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

    > div:last-child {
      @apply border-none;
    }
  }
}
</style>
