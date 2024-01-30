<template>
  <div class="txn-div">
    <div>
      <div>TX HASH</div>
      <div class="flex items-center break-all">
        <div class="mr-2" id="hash" :copyValue="txnDetail.hash" copySubject="Transaction hash">
          {{ txnDetail.hash }}
        </div>
        <img src="@/assets/img/icon-copy.svg" @click="copy('hash')" class="cursor-pointer" />
      </div>
    </div>
    <div>
      <div>Status</div>
      <div>
        <div v-if="txnDetail.group == 'confirmed'" class="inline-block">
          <div class="flex items-center px-2 py-1 rounded-sm border border-green-100 bg-green-100 text-green-700 text-xs">
            <span class="material-icons md-16">done</span>&nbsp;Success
          </div>
        </div>
        <div v-else class="inline-block">
          <div
            class="flex items-center px-2 py-1 rounded-sm border border-yellow-100 bg-yellow-100 text-yellow-700 text-xs">
            <span class="material-icons md-16">info</span>&nbsp;
            <span v-if="txnDetail.group == 'partial'">Partial</span>
            <span v-else-if="txnDetail.group == 'unconfirmed'">Unconfirmed</span>
            <span v-else-if="txnDetail.group == 'failed'">Failed</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="txnDetail.group == 'partial' || txnDetail.group == 'unconfirmed'">
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
        <router-link :to="{ name: 'ViewBlock', params: { blockHeight: txnDetail.height } }"
          class="text-blue-600 hover:text-blue-primary hover:underline">{{ txnDetail.height }}</router-link>
      </div>
    </div>
    <div>
      <div>Tx Type</div>
      <div>
        {{ txnDetail.typeName }}
        <span class="text-xxs text-gray-500">
          (Version: {{ txnDetail.version.txnTypeVersion }})
        </span>
      </div>
    </div>
    <div v-if="txnDetail.group == 'confirmed'">
      <div>TX FEE</div>
      <div class="relative">
        <span class="font-bold">{{ maxFee[0] }}</span>{{ maxFee[1] > 0 ? "." : ""
        }}<span class="text-xxs">{{ maxFee[1] }}</span>
        <img src="@/assets/img/icon-xpx.svg" class="ml-1 mr-2 inline-block" style="top: -1px; width: 14px" /><span
          class="font-bold">{{ nativeTokenNamespace }}</span>
      </div>
    </div>
    <div>
      <div>Signature</div>
      <div class="break-all">{{ txnDetail.signature }}</div>
    </div>
    <div>
      <div
        v-if="
          txnType == TransactionType.AGGREGATE_BONDED_V1 ||
          txnType == TransactionType.AGGREGATE_COMPLETE_V1
        "
      >
        Signer
      </div>
      <div v-else>From</div>
      <div class="flex justify-start" v-if="txnDetail.signer">
        <router-link :to="{
          name: 'ViewAccount',
          params: {
            accountParam: Helper.createAddress(txnDetail.signer).pretty(),
          },
        }" class="text-blue-600 hover:text-blue-primary hover:underline mr-2" id="signerAddress"
          :copyValue="Helper.createAddress(txnDetail.signer).pretty()" copySubject="Signer address">{{
            Helper.createAddress(txnDetail.signer).pretty() }}</router-link>
        <img src="@/assets/img/icon-copy.svg" @click="copy('signerAddress')" class="cursor-pointer" />
      </div>
    </div>
    <div v-if="txnDetail.cosigners.length > 0">
      <div>Cosigner{{ txnDetail.cosigners.length > 1 ? "s" : "" }}</div>
      <div>
        <div v-for="(cosigner, item) in txnDetail.cosigners" :key="item" class="flex items-center mb-3">
          <router-link :to="{
            name: 'ViewAccount',
            params: {
              accountParam: Helper.createAddress(
                cosigner.signer.address.address
              ).pretty(),
            },
          }" class="text-blue-600 hover:text-blue-primary hover:underline mr-2" :id="'cosigner' + item" :copyValue="Helper.createAddress(cosigner.signer.address.address).pretty()
  " copySubject="Cosigner address">{{
    Helper.createAddress(cosigner.signer.address.address).pretty()
  }}</router-link>
          <img src="@/assets/img/icon-copy.svg" @click="copy('cosigner' + item)" class="cursor-pointer" />
        </div>
      </div>
    </div>
  </div>

  <TransferDetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.TRANSFER" />
  <AliasDetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.ADDRESS_ALIAS ||
    txnType == TransactionType.MOSAIC_ALIAS
    " />
  <AggregateDetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.AGGREGATE_BONDED_V1 ||
    txnType == TransactionType.AGGREGATE_COMPLETE_V1
    " />
  <NamespaceDetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.REGISTER_NAMESPACE" />
  <ExchangeDetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.EXCHANGE_OFFER ||
    txnType == TransactionType.ADD_EXCHANGE_OFFER ||
    txnType == TransactionType.REMOVE_EXCHANGE_OFFER
    " />
  <LockDetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.HASH_LOCK" />
  <LinkAccountDetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.LINK_ACCOUNT" />
  <RestrictionDetailComponent :txnDetail="txnDetail" :txnGroup="txnType" v-if="txnType == TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS ||
    txnType == TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC ||
    txnType == TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION
    " />
  <SecretDetailComponent :txnDetail="txnDetail" :txnGroup="txnType" v-if="txnType == TransactionType.SECRET_PROOF ||
    txnType == TransactionType.SECRET_LOCK
    " />
  <AssetDetailComponent :txnDetail="txnDetail" :txnGroup="txnType" v-if="txnType == TransactionType.MOSAIC_DEFINITION ||
    txnType == TransactionType.MOSAIC_SUPPLY_CHANGE ||
    txnType == TransactionType.MODIFY_MOSAIC_LEVY ||
    txnType == TransactionType.REMOVE_MOSAIC_LEVY
    " />
  <ChainDetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.MOSAIC_DEFINITION ||
    txnType == TransactionType.MOSAIC_SUPPLY_CHANGE ||
    txnType == TransactionType.CHAIN_CONFIGURE ||
    txnType == TransactionType.CHAIN_UPGRADE
    " />
  <AccountDetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.MODIFY_MULTISIG_ACCOUNT" />
  <MetadataDetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.MOSAIC_METADATA_V2 ||
    txnType == TransactionType.NAMESPACE_METADATA_V2 ||
    txnType == TransactionType.CHAIN_CONFIGURE ||
    txnType == TransactionType.ACCOUNT_METADATA_V2
    " />
  <SdaExchangeDetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.PLACE_SDA_EXCHANGE_OFFER ||
    txnType == TransactionType.REMOVE_SDA_EXCHANGE_OFFER" />
  <PrepareBcDriveDetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.Prepare_Bc_Drive"/>
  <DriveClosureDetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.Drive_Closure"/>
  <DataModificationDetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.Data_Modification"/>
  <DownloadDetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.Download"/>
  <FinishDownloadDetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.Finish_Download"/>
  <DownloadApprovalDetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.Download_Approval"/>
  <ReplicatorOnboardingDetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.Replicator_Onboarding"/>
  <DataModificationSingleApprovalDetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.Data_Modification_Single_Approval"/>
  <DataModificationApprovalDetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.Data_Modification_Approval"/>
  <EndDriveVerificationV2DetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.End_Drive_Verification_V2"/>
  <div v-if="Object.keys(txnDetail.unknownData).length">
    <DataModificationCancelDetailComponent v-if="txnType == TransactionType.Data_Modification_Cancel" :txnDetail="txnDetail"/>
    <UnknownDataDetailComponent v-else :txnDetail="txnDetail" />
  </div>
  <div class="cosignerDetails " v-if="txnDetail.group == 'partial'">
    <div>
      <div>Cosigner List</div>
      <div>
        <div v-for="(cosigner, index) in allCosigners" :key="index" class="py-1 break-all">
          <div v-if="pendingCosigners.includes(cosigner)" class="text-red-500">{{ cosigner }} (Pending) </div>
          <div v-if="signedSigners.includes(cosigner)" class="text-green-500">{{ cosigner }} (Signed)</div>
        </div>
      </div>
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
import { computed, onMounted, ref } from "vue";
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
import SdaExchangeDetailComponent from "@/modules/transaction/components/transactionDetails/SdaExchangeDetailComponent.vue";
import UnknownDataDetailComponent from "@/modules/transaction/components/transactionDetails/UnknownDataDetailComponent.vue";
import DataModificationDetailComponent from "@/modules/transaction/components/transactionDetails/DataModificationDetailComponent.vue";
import DownloadDetailComponent from "./transactionDetails/DownloadDetailComponent.vue";
import PrepareBcDriveDetailComponent from "./transactionDetails/PrepareBcDriveDetailComponent.vue";
import FinishDownloadDetailComponent from "./transactionDetails/FinishDownloadDetailComponent.vue";
import DriveClosureDetailComponent from "./transactionDetails/DriveClosureDetailComponent.vue"
import DownloadApprovalDetailComponent from "./transactionDetails/DownloadApprovalDetailComponent.vue";
import ReplicatorOnboardingDetailComponent from "./transactionDetails/ReplicatorOnboardingDetailComponent.vue";
import DataModificationApprovalDetailComponent from "./transactionDetails/DataModificationApprovalDetailComponent.vue";
import DataModificationSingleApprovalDetailComponent from "./transactionDetails/DataModificationSingleApprovalDetailComponent.vue";
import DataModificationCancelDetailComponent from "./transactionDetails/DataModificationCancelDetailComponent.vue";
import EndDriveVerificationV2DetailComponent from "./transactionDetails/EndDriveVerificationV2DetailComponent.vue";
import { AggregateTransaction, PublicAccount, TransactionType } from "tsjs-xpx-chain-sdk";
import { MultisigUtils } from '@/util/multisigUtils'

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

const allCosigners = ref([])
const pendingCosigners = ref([])
const signedSigners = ref([])

onMounted(async () => {
  if (props.txnDetail.group == 'partial') {

    let txn = await AppState.chainAPI.transactionAPI.getPartialTransaction(
      props.txnDetail.hash
    );
    //total signers , signed signers, unsigned signers

    allCosigners.value.push(txn.signer.publicKey)
    let cosignedSigner = txn.cosignatures.map(cosigner => cosigner.signer.publicKey);
    let oriSignedSigners = cosignedSigner.concat([txn.signer.publicKey]);
    signedSigners.value = [...oriSignedSigners]
    let innerOriginSigners = []

    for (let i = 0; i < txn.innerTransactions.length; ++i) {

      let innerSigner = txn.innerTransactions[i].signer;
      innerOriginSigners.push(innerSigner.publicKey);
      let currentInnerSigners = [];
      if (txn.innerTransactions[i].type === TransactionType.MODIFY_MULTISIG_ACCOUNT) {

        let transaction = txn.innerTransactions[i];
        let allDeepCosigners = await MultisigUtils.getAllDeepModifyMultisigCosigners(transaction);
        currentInnerSigners = allDeepCosigners;
        let flatCosigners = await MultisigUtils.getAllFlatModifyMultisigCosigners(transaction);
        for (let a = 0; a < flatCosigners.length; ++a) {
          try {
            let accountMultisigGraphInfo = await AppState.chainAPI.accountAPI.getMultisigAccountGraphInfo(PublicAccount.createFromPublicKey(flatCosigners[a], AppState.networkType).address);
            let allMultisigKey = Array.from(accountMultisigGraphInfo.multisigAccounts.keys()).sort((a, b) => { return a - b }); // ascending keys
            for (let y = 0; y < allMultisigKey.length; ++y) {
              const level = allMultisigKey[y];
              const multisigAccountsInfo = accountMultisigGraphInfo.multisigAccounts.get(level);
              for (let x = 0; x < multisigAccountsInfo.length; ++x) {
                if (MultisigUtils.isFullySigned(multisigAccountsInfo[x], signedSigners.value)) {
                  signedSigners.value.push(multisigAccountsInfo[x].account.publicKey);
                }
              }
            }
          } catch (error) {
            //console.log(error);
          }

        }
        signedSigners.value = Array.from(new Set(signedSigners.value));

      } else if (txn.innerTransactions[i].type === TransactionType.ACCOUNT_METADATA_V2 || txn.innerTransactions[i].type === TransactionType.MOSAIC_METADATA_V2 || txn.innerTransactions[i].type === TransactionType.NAMESPACE_METADATA_V2) {

        let innerTransaction = txn.innerTransactions[i];

        currentInnerSigner = innerTransaction.targetPublicKey;
        try {
          let accountMultisigGraphInfo = await AppState.chainAPI.accountAPI.getMultisigAccountGraphInfo(currentInnerSigner.address);
          let allMultisigKey = Array.from(accountMultisigGraphInfo.multisigAccounts.keys()).sort((a, b) => { return a - b }); // ascending keys
          for (let y = 0; y < allMultisigKey.length; ++y) {
            const level = allMultisigKey[y];
            const multisigAccountsInfo = accountMultisigGraphInfo.multisigAccounts.get(level);
            let cosigners = MultisigUtils.findCosigners(multisigAccountsInfo);
            currentInnerSigners = currentInnerSigners.concat(cosigners);
            for (let x = 0; x < multisigAccountsInfo.length; ++x) {
              if (MultisigUtils.isFullySigned(multisigAccountsInfo[x], signedSigners.value)) {
                signedSigners.value.push(multisigAccountsInfo[x].account.publicKey);
              }
            }
          }
        } catch (error) {
          //console.log(error);
        }

        signedSigners.value = Array.from(new Set(signedSigners.value));

      }

      else {

        try {
          let accountMultisigGraphInfo = await AppState.chainAPI.accountAPI.getMultisigAccountGraphInfo(innerSigner.address);
          let allMultisigKey = Array.from(accountMultisigGraphInfo.multisigAccounts.keys()).sort((a, b) => { return a - b }); // ascending keys
          for (let y = 0; y < allMultisigKey.length; ++y) {
            const level = allMultisigKey[y];
            const multisigAccountsInfo = accountMultisigGraphInfo.multisigAccounts.get(level);
            let cosigners = MultisigUtils.findCosigners(multisigAccountsInfo);
            currentInnerSigners = currentInnerSigners.concat(cosigners);
            for (let x = 0; x < multisigAccountsInfo.length; ++x) {
              if (MultisigUtils.isFullySigned(multisigAccountsInfo[x], signedSigners.value)) {
                signedSigners.value.push(multisigAccountsInfo[x].account.publicKey);
              }
            }
          }

          signedSigners.value = Array.from(new Set(signedSigners.value));
          currentInnerSigners = Array.from(new Set(currentInnerSigners));
        } catch (error) {
          currentInnerSigners = [innerSigner.publicKey];
        }

      }
      allCosigners.value = allCosigners.value.concat(currentInnerSigners);
    }
    allCosigners.value = Array.from(new Set(allCosigners.value));
    // remove those not signed
    pendingCosigners.value = allCosigners.value.filter(pk => !signedSigners.value.includes(pk));

  }
})

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

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.txn-div,
.details {
  @apply text-gray-800 text-xs;

  >div {
    @apply flex items-center border-b border-gray-100 py-4;

    >div:first-child {
      @apply w-40 text-xs px-4;
    }

    >div:nth-child(2) {
      @apply text-xs w-full;
    }

    >div:last-child {
      @apply border-none;
    }
  }



  .unknownDetails-col {
    @apply flex items-center;
  }

  .unknownDetails {
    @apply text-gray-800 text-xs flex items-center;
  }

  // .unknown-col{
  //   @apply flex items-center bg-gray-200;

  //   div.details-col {
  //     @apply w-40 text-xs pl-4;
  //   }

  //   div.raw-details {
  //     @apply text-gray-800 text-xs flex items-center w-full;
  //   }

  // .details-col{
  //   @apply w-40 text-xs pl-4;
  // }

  // .raw-details {
  //   @apply text-gray-800 text-xs flex items-center w-full;
  // }
  // }
}

.cosignerDetails {
  @apply text-gray-800 text-xs;

  >div {
    @apply flex items-center border-t border-gray-100 py-4;

    >div:first-child {
      @apply w-40 text-xs px-4;
    }

    >div:nth-child(2) {
      @apply text-xs w-full;
    }

    >div:last-child {
      @apply border-none;
    }
  }



  .unknownDetails-col {
    @apply flex items-center;
  }

  .unknownDetails {
    @apply text-gray-800 text-xs flex items-center;
  }

  // .unknown-col{
  //   @apply flex items-center bg-gray-200;

  //   div.details-col {
  //     @apply w-40 text-xs pl-4;
  //   }

  //   div.raw-details {
  //     @apply text-gray-800 text-xs flex items-center w-full;
  //   }

  // .details-col{
  //   @apply w-40 text-xs pl-4;
  // }

  // .raw-details {
  //   @apply text-gray-800 text-xs flex items-center w-full;
  // }
  // }
}
</style>
