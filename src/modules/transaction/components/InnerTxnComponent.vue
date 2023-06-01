<template>
  <div
    class="mt-3 border border-gray-200 p-3"
    v-for="(item, index) in allInnerTransactions"
    :key="index"
  >
    <div class="table_div">
      <div>
        <div>Type</div>
        <div>
          {{ item.transactionName }}
          <span class="text-xxs text-gray-500">
            (Version: {{ item.version.txnTypeVersion }})
          </span>
        </div>
      </div>
      <div>
        <div>Public Key</div>
        <div class="flex items-center">
          <router-link
            id="publicKey"
            :to="{
              name: 'ViewAccount',
              params: { accountParam: item.signer.publicKey },
            }"
            class="hover:text-blue-primary hover:underline text-blue-600"
            :copyValue="item.signer.publicKey"
            copySubject="Public Key"
          >
            {{ item.signer.publicKey }}
          </router-link>
          <img
            src="@/assets/img/icon-copy.svg"
            @click="copy('publicKey')"
            class="ml-2 w-4 h-4 cursor-pointer"
          />
        </div>
      </div>
      <div>
        <div>From</div>
        <div class="flex items-center">
          <router-link
            id="signerAddress"
            :to="{
              name: 'ViewAccount',
              params: { accountParam: item.signer.address.address },
            }"
            class="hover:text-blue-primary hover:underline text-blue-600"
            :copyValue="
              Helper.createAddress(item.signer.address.address).pretty()
            "
            copySubject="Address"
          >
            {{ Helper.createAddress(item.signer.address.address).pretty() }}
          </router-link>
          <img
            src="@/assets/img/icon-copy.svg"
            @click="copy('signerAddress')"
            class="ml-2 w-4 h-4 cursor-pointer"
          />
        </div>
      </div>
      <div>
        <div>Fully signed</div>
        <div>
          {{
            !innerSignedList[index] && innerSignedList[index] === false
              ? "No"
              : "Yes"
          }}
        </div>
      </div>
      <div v-if="item.unknownData && Object.keys(item.unknownData).length">
        <UnknownDataDetailComponent :txnDetail="item" />
      </div>
    </div>
    <div class="table_div" v-if="innerTxnExtractedData[index] != undefined">
      <div
        v-for="(info, infoListindex) in innerTxnExtractedData[index].infoList"
        :key="infoListindex"
      >
        <div>{{ info.label ? info.label : "" }}</div>
        <div v-if="info.label.toLowerCase() == 'effective height'">
          <router-link
            :to="{ name: 'ViewBlock', params: { blockHeight: info.value } }"
            class="text-xs text-blue-600 hover:text-blue-primary hover:underline"
            >{{ info.value }}</router-link
          >
        </div>
        <div v-else-if="info.label.toLowerCase() == 'namespace'">
          <div>
            <router-link
              :to="{
                name: 'ViewNamespace',
                params: {
                  namespaceParam: info.short ? info.short : info.value,
                },
              }"
              class="text-blue-600 hover:text-blue-primary hover:underline"
            >
              {{ info.short ? info.short : info.value }}
            </router-link>
          </div>
        </div>
        <div v-else-if="info.label.toLowerCase() == 'asset'">
          <router-link
            :to="{
              name: 'ViewAsset',
              params: { id: info.short ? info.short : info.value },
            }"
            class="text-blue-600 hover:text-blue-primary hover:underline"
          >
            {{ info.short ? info.short : info.value }}
          </router-link>
        </div>
        <div
          v-else-if="
            info.label.toLowerCase() == 'account' ||
            info.label.toLowerCase() == 'recipient'
          "
          class="flex items-center"
        >
          <router-link
            id="metadataAccount"
            :to="{
              name: 'ViewAccount',
              params: { accountParam: info.short ? info.short : info.value },
            }"
            class="text-blue-600 hover:text-blue-primary hover:underline"
            :copyValue="info.short ? info.short : info.value"
            copySubject="Address"
          >
            {{ info.short ? info.short : info.value }}
          </router-link>
          <img
            src="@/assets/img/icon-copy.svg"
            @click="copy('metadataAccount')"
            class="ml-2 w-4 h-4 cursor-pointer"
          />
        </div>
        <div v-else>{{ info.short ? info.short : info.value }}</div>
      </div>
      <div v-if="innerTxnExtractedData[index].infoGreenList.length > 0">
        <div
          v-if="
            innerTxnExtractedData[index].legendType ===
            InnerTxnLegendType.ADD_REMOVE
          "
        >
          Add
        </div>
        <div
          v-else-if="
            innerTxnExtractedData[index].legendType ===
            InnerTxnLegendType.TRUE_FALSE
          "
        >
          True
        </div>
        <div
          v-else-if="
            innerTxnExtractedData[index].legendType ===
            InnerTxnLegendType.BUY_SELL
          "
        >
          Buy
        </div>
        <div
          v-else-if="
            innerTxnExtractedData[index].legendType ===
            InnerTxnLegendType.ALLOW_BLOCK
          "
        >
          Allow
        </div>
        <div>
          {{
            innerTxnExtractedData[index].infoGreenList
              .map((info) => (info.short ? info.short : info.value))
              .join(", ")
          }}
        </div>
      </div>
      <div v-if="innerTxnExtractedData[index].infoRedList.length > 0">
        <div
          v-if="
            innerTxnExtractedData[index].legendType ===
            InnerTxnLegendType.ADD_REMOVE
          "
        >
          Remove
        </div>
        <div
          v-else-if="
            innerTxnExtractedData[index].legendType ===
            InnerTxnLegendType.TRUE_FALSE
          "
        >
          False
        </div>
        <div
          v-else-if="
            innerTxnExtractedData[index].legendType ===
            InnerTxnLegendType.BUY_SELL
          "
        >
          Sell
        </div>
        <div
          v-else-if="
            innerTxnExtractedData[index].legendType ===
            InnerTxnLegendType.ALLOW_BLOCK
          "
        >
          Block
        </div>
        <div>
          {{
            innerTxnExtractedData[index].infoRedList
              .map((info) => (info.short ? info.short : info.value))
              .join(", ")
          }}
        </div>
      </div>
      <div
        v-if="
          innerTxnExtractedData[index].infoInfoList.length > 0 &&
          item.type == supplyChangeTxnType ">
        <div>Supply Delta</div>
        <div>
          {{
            innerTxnExtractedData[index].infoInfoList
              .map((info) =>
                info.label == "Supply Direction" ? info.value : ""
              )
              .join("")
          }}
          {{
            innerTxnExtractedData[index].infoInfoList
              .map((info) =>
                info.label == "Supply Delta"
                  ? Helper.toCurrencyFormat(info.value, 0)
                  : ""
              )
              .join("")
          }}
        </div>
      </div>
      <div
        v-if="
          innerTxnExtractedData[index].infoInfoList.length > 0 &&
          item.type == supplyDefinitionTxnType ">
        <div>Transferable</div>
        <div>
          {{
            innerTxnExtractedData[index].infoInfoList
              .map((info) => (info.label == "Transferable" ? info.value : ""))
              .join("")
          }}
        </div>
      </div>
      <div
        v-if="
          innerTxnExtractedData[index].infoInfoList.length > 0 &&
          item.type == supplyDefinitionTxnType ">
        <div>Supply Mutable</div>
        <div>
          {{
            innerTxnExtractedData[index].infoInfoList
              .map((info) => (info.label == "Supply Mutable" ? info.value : ""))
              .join("")
          }}
        </div>
      </div>
      <div
        v-if="
          innerTxnExtractedData[index].infoInfoList.length > 0 &&
          item.type == supplyDefinitionTxnType ">
        <div>Divisibility</div>
        <div>
          {{
            innerTxnExtractedData[index].infoInfoList
              .map((info) => (info.label == "Divisibility" ? info.value : ""))
              .join("")
          }}
        </div>
      </div>
      <div v-if="innerTxnExtractedData[index].sdas.length > 0">
        <div>SDAs</div>
        <div>
          <div
            v-for="(sda, index) in innerTxnExtractedData[index].sdas"
            :key="index"
          >
            <div class="inline-block">
              <span class="font-bold text-xs">{{
                Helper.toCurrencyFormat(formatCurrency(sda.amount)[0], 0)
              }}</span>
              <span class="text-xxs">{{
                formatCurrency(sda.amount)[1]
                  ? "." + formatCurrency(sda.amount)[1]
                  : ""
              }}</span>
            </div>
            <div v-if="sda.namespace" class="inline-block ml-2">
              <img
                v-if="sda.namespace == nativeTokenNamespace"
                src="@/modules/account/img/proximax-logo.svg"
                class="inline-block h-7 w-7 mr-2 border-2 rounded-3xl"
              />
              <img
                v-else-if="sda.namespace == 'xarcade.xar'"
                src="@/modules/account/img/xarcade-logo.svg"
                class="inline-block h-7 w-7 mr-2 border-2 rounded-3xl"
              />
              <img
                v-else-if="sda.namespace == 'prx.metx'"
                src="@/modules/account/img/metx-logo.svg"
                class="inline-block h-7 w-7 mr-2 border-2 rounded-3xl"
              />
              <img
                v-else
                src="@/modules/transaction/img/proximax-logo-gray.svg"
                class="inline-block h-7 w-7 mr-2 border-2 rounded-3xl"
              />
              <router-link
                :to="{ name: 'ViewAsset', params: { id: sda.assetId } }"
                class="text-blue-600 hover:text-blue-primary hover:underline"
                >{{ sda.label }}</router-link
              >
            </div>
            <div
              v-else
              class="text-gray-400 hover:text-gray-700 duration-300 transition-all inline-block ml-2"
            >
              <router-link
                :to="{ name: 'ViewAsset', params: { id: sda.assetId } }"
                class="hover:text-blue-primary hover:underline"
              >
                {{ sda.assetId }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
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

const props = defineProps({
  innerTxn: Object,
  txn: Object,
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
const innerSignedList = ref([]);
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
        innerSignedList.value.push(isSigned);
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
        innerSignedList.value.push(
          signedSigners.includes(innerSigner.publicKey)
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
</style>
