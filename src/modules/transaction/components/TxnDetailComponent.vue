<template>
  <div v-for="data in commonTxnDetails">
    <div v-if="Array.isArray(data.value)">
      <div class="txn-div">
        <div>
          <div class="flex-none">{{ data.name }}</div>
          <div class="grow">
            <div v-for="item in data.value" class="txn-div">
              <div>
                <div class="flex-none">{{ item.name }}</div>
                <div class="grow">{{ item.value }} 
                  <span v-if="item.secondaryValue" class="text-xxs text-gray-500">
                    ({{ item.secondaryValue }})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template v-else>
      <template v-if="data.handlerType">
        <HandlerControl :label="data.name" style-class="txn-div" :secondary-value="data.secondaryValue" 
        :value="data.value" :handler-type="data.handlerType" :toggle-resolve="true" ></HandlerControl>
      </template>
      <template v-else>
        <div class="txn-div">
          <div>
            <div>{{ data.name }}</div>
            <div class="break-all">{{ data.value }} 
              <span v-if="data.secondaryValue" class="text-xxs text-gray-500">
                ({{ data.secondaryValue }})
              </span>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
  <div class="txn-div">
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
    <div v-if="Object.keys(txnDetail.unknownData).length" class="bg-gray-200">
      <div class="unknownDetails-col">Unknown Data</div>
      <div class="unknownDetails">
        <pre>{{ JSON.stringify(txnDetail.unknownData, undefined, 2) }}</pre>
      </div>
    </div>


  </div>
  <div v-for="data in txnDetails">
    <DisplayValue style-class="txn-div" :toggle-resolve="true" :value="data"></DisplayValue>
  </div>

  <ExchangeDetailComponent :txnDetail="txnDetail" v-if="txnType == TransactionType.EXCHANGE_OFFER ||
    txnType == TransactionType.ADD_EXCHANGE_OFFER ||
    txnType == TransactionType.REMOVE_EXCHANGE_OFFER
    " />
  <RestrictionDetailComponent :txnDetail="txnDetail" :txnGroup="txnType" v-if="txnType == TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS ||
    txnType == TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC ||
    txnType == TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION
    " />
  <SecretDetailComponent :txnDetail="txnDetail" :txnGroup="txnType" v-if="txnType == TransactionType.SECRET_PROOF ||
    txnType == TransactionType.SECRET_LOCK
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
import { AggregateTransaction, PublicAccount, TransactionType } from "tsjs-xpx-chain-sdk";
import { MultisigUtils } from '@/util/multisigUtils'
import HandlerControl from "./transactionDetails/HandlerControl.vue"
import DisplayValue from "./transactionDetails/DisplayValue.vue";

const props = defineProps({
  txnDetail: Object,
  txnData: Array,
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
const commonTxnDetails = ref([]);
const txnDetails = ref([]);

let txnHeaderProp = ["TX HASH", "Status", "Timestamp", "Block", "Tx Type", "TX FEE", "Signature", "From"];

const getCommonDetails = (data)=>{
  for(let i=0; i < data.length; ++i){
    if(data[i].name === "TransactionInfo"){
      let index = data.indexOf(data[i])
      let spliceData = data.splice(index, 1)
      for(let item in spliceData){
        if(spliceData[item]){
          for(let j=0; j < spliceData[item].value.length; ++j){
            data.push(spliceData[item].value[j])
          }
        }
      }
    }
  }
let filterData = data.filter((RowData)=> txnHeaderProp.includes(RowData.name))
filterData.sort(
    function(a, b){
        return txnHeaderProp.indexOf(a.name) - txnHeaderProp.indexOf(b.name);
    }
);

return filterData
}

const getTxnDetails = (data)=>{
  

return data.filter((RowData)=> !txnHeaderProp.includes(RowData.name) && RowData.name !== "InnerTransactions" && RowData.name !== "Deadline" && RowData.name !== "Public Key")
}

commonTxnDetails.value = getCommonDetails(props.txnData);
txnDetails.value = getTxnDetails(props.txnData)

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
      @apply w-40 text-xs pl-4;
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
      @apply w-40 text-xs pl-4;
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
