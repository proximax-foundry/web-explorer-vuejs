<template>
  <div v-for="(data, index) of innerTxns" class="mt-3 border border-gray-200 p-3">
    <div v-for="item of data" > 
      <DisplayValue style-class="table_div" :toggle-resolve="true" :value="item"></DisplayValue>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { PublicAccount, TransactionType } from "tsjs-xpx-chain-sdk";
import {
  TransactionUtils,
  MsgType,
  InnerTxnLegendType,
} from "@/util/transactionUtils";
import { TransactionUtils as TxnUtils } from "@/util/transactionUtils";
import { Helper } from "@/util/typeHelper";
import { CosignUtils } from "@/util/cosignUtils";
import { copyToClipboard } from "@/util/functions";
import { useToast } from "primevue/usetoast";
import { AppState } from "@/state/appState";
import UnknownDataDetailComponent from "@/modules/transaction/components/transactionDetails/UnknownDataDetailComponent.vue";
import DisplayValue from "./transactionDetails/DisplayValue.vue";
import { string } from "mathjs";

const props = defineProps({
  innerTxn: Object,
  txn: Object,
  txnData: Array,
  txnGroup: String,
});

const supplyChangeTxnType = TransactionType.MOSAIC_SUPPLY_CHANGE;
const supplyDefinitionTxnType = TransactionType.MOSAIC_DEFINITION;
const toast = useToast();
const nativeTokenNamespace = AppState.nativeToken.fullNamespace;
const copy = (id) => {
  let stringToCopy = document.getElementById(id).getAttribute("copyValue");
  let copySubject = document.getElementById(id).getAttribute("copySubject");
  copyToClipboard(stringToCopy);

  toast.add({
    severity: "info",
    detail: copySubject + " copied",
    group: "br",
    life: 3000,
  });
};

const formatCurrency = (cost) => {
  return cost.toString().split(".");
};

let allCosigners = []; // hold all the final cosigners public Keys
let cosignedSigner = []; // all the cosigned final signers, include multisig account (calculated)
let oriSignedSigners = []; // all the cosigned final signers + initiator
let signedSigners = []; // all the cosigned final signers + initiator, include multisig account (calculated)
const innerSignedList = ref({});
let currentInnerSigners = [];

const allInnerTransactions = ref(props.innerTxn);
const innerTxnExtractedData = ref([
  {
    infoInfoList: {},
    infoGreenList: {},
    infoRedList: {},
    sdas: {},
  },
]);

const innerTxns = ref([]);
const innerTxnsCount = ref(0);
let txnHeaderProp = ["Type", "Public Key", "Signer", "Fully signed"];

const getInnerTxns = (data) => {
  
  innerTxnsCount.value = 0;
  let temp = data.find((r)=> r.name === "InnerTransactions") ? data.find((r)=> r.name === "InnerTransactions").value: [];
  console.log(temp);
  return temp;
};

innerTxns.value = getInnerTxns(props.txnData);

onBeforeMount(() => {
  if (props.innerTxn.length > 0) {
    let castedAggregateTxn = TxnUtils.castToAggregate(props.txn);

    props.innerTxn.forEach(async (txn, index) => {
      allCosigners.push(castedAggregateTxn.signer.publicKey);
      cosignedSigner = castedAggregateTxn.cosignatures.map(
        (cosigner) => cosigner.signer.publicKey
      );
      oriSignedSigners = cosignedSigner.concat([txn.signer.publicKey]);
      signedSigners = [...oriSignedSigners];

      let extractedData = await TransactionUtils.extractInnerTransaction(
        txn,
        props.txnGroup
      );

      if(extractedData){
        extractedData.infoInfoList = extractedData.infos.filter(
          (info) => info.label && info.type === MsgType.INFO
        );
        extractedData.infoGreenList = extractedData.infos.filter(
          (info) => !info.label && info.type === MsgType.GREEN
        );
        extractedData.infoRedList = extractedData.infos.filter(
          (info) => !info.label && info.type === MsgType.RED
        );
        extractedData.infoList = extractedData.infos.filter(
          (info) => info.type === MsgType.NONE
        );

        innerTxnExtractedData.value[index] = extractedData;
      }
      
      let innerSigner = txn.signer;
      if (txn.type === TransactionType.MODIFY_MULTISIG_ACCOUNT) {
        let allDeepCosigners =
          await CosignUtils.getAllDeepModifyMultisigCosigners(txn);
        currentInnerSigners = allDeepCosigners;
        let flatCosigners = await CosignUtils.getAllFlatModifyMultisigCosigners(
          txn
        );

        for (let a = 0; a < flatCosigners.length; ++a) {
          try {
            let accountMultisigGraphInfo =
              await AppState.chainAPI.accountAPI.getMultisigAccountGraphInfo(
                PublicAccount.createFromPublicKey(
                  flatCosigners[a],
                  AppState.networkType
                ).address
              );

            let allMultisigKey = accountMultisigGraphInfo.multisigAccounts
              .keys()
              .sort((a, b) => {
                return a - b;
              }); // ascending keys

            for (let y = 0; y < allMultisigKey.length; ++y) {
              const level = allMultisigKey[y];
              const multisigAccountsInfo =
                accountMultisigGraphInfo.multisigAccounts.get(level);

              for (let x = 0; x < multisigAccountsInfo.length; ++x) {
                if (
                  CosignUtils.isFulllySigned(
                    multisigAccountsInfo[x],
                    signedSigners
                  )
                ) {
                  signedSigners.push(multisigAccountsInfo[x].account.publicKey);
                }
              }
            }
          } catch (error) {
            //console.log(error);
          }
        }
        signedSigners = Array.from(new Set(signedSigners));
        let isSigned = flatCosigners.every((val) =>
          signedSigners.includes(val)
        );
        innerSignedList.value = {
          name: 'Fully signed',
          value: isSigned ? 'Yes' : 'No'
        };
      } else {
        try {
          let accountMultisigGraphInfo =
            await AppState.chainAPI.accountAPI.getMultisigAccountGraphInfo(
              innerSigner.address
            );

          let allMultisigKey = Array.from(
            accountMultisigGraphInfo.multisigAccounts.keys()
          ).sort((a, b) => {
            return a - b;
          }); // ascending keys

          for (let y = 0; y < allMultisigKey.length; ++y) {
            const level = allMultisigKey[y];
            const multisigAccountsInfo =
              accountMultisigGraphInfo.multisigAccounts.get(level);

            let cosigners = CosignUtils.findCosigners(multisigAccountsInfo);
            currentInnerSigners = currentInnerSigners.concat(cosigners);

            for (let x = 0; x < multisigAccountsInfo.length; ++x) {
              if (
                CosignUtils.isFulllySigned(
                  multisigAccountsInfo[x],
                  signedSigners
                )
              ) {
                signedSigners.push(multisigAccountsInfo[x].account.publicKey);
              }
            }
          }

          signedSigners = Array.from(new Set(signedSigners));
          currentInnerSigners = Array.from(new Set(currentInnerSigners));
        } catch (error) {
          currentInnerSigners = [innerSigner.publicKey];
          //console.log(error);
        }
        innerSignedList.value = {
          name: 'Fully signed',
          value: signedSigners.includes(innerSigner.publicKey) ? 'Yes' : 'No'
        };
      }
        for(let i=0; i<innerTxns.value.length; ++i){
          if(innerSignedList.value){
            innerTxns.value[i].push(innerSignedList.value)
          }
          let filterCommonData = innerTxns.value[i].filter((RowData)=> txnHeaderProp.includes(RowData.name))
          console.log(filterCommonData)
          let filterDataDetail = innerTxns.value[i].filter((RowData)=> !txnHeaderProp.includes(RowData.name))
          console.log(filterDataDetail)
            filterCommonData.sort(
                function(a, b){
                    if(a.name == b.name){
                        return a.name.value.name.localeCompare(b.name.value.name);
                    }
                    else{
                        return txnHeaderProp.indexOf(a.name) - txnHeaderProp.indexOf(b.name);
                    }
                }
            );
          let innerDetailData = filterCommonData.concat(filterDataDetail)
          innerTxns.value[i] = innerDetailData
          innerTxns.value[i] = innerTxns.value[i].filter((obj, index) =>
            innerTxns.value[i].findIndex((item) => item.name === obj.name) === index
          );
        }
    });
  }
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.table_div {
  @apply text-xs;

  > div {
    @apply grid grid-cols-4;

    > div {
      @apply p-2;
    }

    > div:first-child {
      @apply text-blue-primary font-bold;
    }

    > div:nth-child(2) {
      @apply break-all col-span-3;
    }
  }

  > div:nth-child(2n + 1) {
    @apply bg-gray-100;
  }
}

.text-muted{
  color: #6c757d;
}
</style>
