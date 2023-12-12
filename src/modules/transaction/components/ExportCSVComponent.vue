<template>
  <button
    class="mr-10 w-32 blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto"
    @click="onExport = !onExport"
  >
    Export CSV
  </button>
  <div v-if="onExport">
    <div class="overlay">
        <div class="modal">
          <div class="py-3">Select export type</div>
          <div>
            <select
              v-model="selectedTxnType"
              @change="changeSearchTxnType"
              class="border border-gray-200 px-2 py-1 w-full focus:outline-none"
            >
              <option value="all" class="text-sm">All</option>
              <option
                v-bind:key="txnType.value"
                v-for="txnType in txnTypeList"
                :value="txnType.value"
                class="text-sm"
              >
                {{ txnType.label }}
              </option>
            </select>
          </div>
          <div v-if="accPublicKey">
            <div class="py-3">Filter by:</div>
            <div class="border border-gray-200 px-2 py-1 focus:outline-none">
              <div>{{ accPublicKey }}</div>
            </div>
          </div>
          <div class="py-3">Choose download option:</div>
          <div class="flex">
            <div class="mr-3">
              <input type="radio" id="blockNumber" value="blockNumber" class="mr-1" v-model="option" />
              <label for="blockNumber">Block Number</label>
            </div>
            <div>
              <input type="radio" id="day" value="day" class="mr-1" v-model="option" />
              <label for="date">Day</label>
            </div>
          </div>
          <div v-if="option === 'blockNumber'">
            <div class="py-3">Please enter a range:</div>
            <div class="flex">
              <div class="mr-4">
                <label for="startBlock" class="font-bold block mb-2"> Start Block</label>
                <div class="border border-gray-200 px-2 py-1 focus:outline-none">
                  <input type="number" v-model="startBlock" class="focus:outline-none" placeholder="0" min="1" oninput="validity.valid||(value='');"/>
                </div>
              </div>
              <div>
                <label for="endBlock" class="font-bold block mb-2"> End Block </label>
                <div class="border border-gray-200 px-2 py-1 focus:outline-none">
                  <input type="number" v-model="endBlock" class="focus:outline-none" placeholder="0" min="1" oninput="validity.valid||(value='');"/>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="py-3">Download latest transactions:</div>
            <div class="flex justify-center items-center">
              <div class="mr-4">
                <label for="inputDay" class="font-bold block mb-2">Days</label>
                <div class="border border-gray-200 px-2 py-1 focus:outline-none">
                  <input type="number" v-model="inputDay" class="focus:outline-none" placeholder="Enter the number of days" min="1" oninput="validity.valid||(value='');"/>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-10 text-center">
              <button @click="onExport = !onExport, clearInput()" class="text-black font-bold text-xs mr-1 sm:mr-5 mt-2 focus:outline-none disabled:opacity-50">Cancel</button>
              <button type="submit" v-if="!checkTransactions" class="default-btn focus:outline-none disabled:opacity-50" :disabled="isDisabledValidate" @click="downloadCSV">Download</button>
              <button type="button" v-if="checkTransactions" class="default-btn focus:outline-none disabled:opacity-50" >
                <div class="flex">
                  <div class="animate-spin rounded-full h-3.5 w-4 border-b-2"></div>
                </div>
              </button>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TxnExchangeOffer } from "@/models/transactions/exchangeOffer";
import type { RestrictionModification } from "@/models/transactions/restrictionModification";
import type { SDA } from "@/models/transactions/sda";
import { TransactionFilterType, TransactionFilterTypes, type TxnList } from "@/models/transactions/transaction";
import { AppState } from "@/state/appState";
import { Helper } from "@/util/typeHelper";
import { computed, ref, watch } from "vue";
import { AccountUtils } from "@/util/accountUtil";
import { TransactionUtils } from "@/util/transactionUtils";
import type { Transaction } from "tsjs-xpx-chain-sdk";
import { ChainProfileConfig } from "@/models/stores";
import { networkState } from "@/state/networkState";

const props = defineProps({
  accPublicKey: {
    type: String,
    required:false
  }
});

const option = ref('blockNumber')
const onExport = ref(false)
const checkTransactions = ref(false)
const isDisabledValidate = ref<boolean>(true)
const startBlock = ref<number | null>(null)
const endBlock = ref<number | null>(null)
const inputDay = ref<number | null>(null)
const transactions = ref<any[] | undefined>([]);
const totalPage = ref<number>(0);
const selectedTxnType = ref("all");
const txnTypeList = Object.entries(TransactionFilterType).map(
  ([label, value]) => ({ label, value })
);
const QueryParamsType = ref<number[] | undefined>(undefined);
const transactionGroupType = Helper.getTransactionGroupType();
const blockDescOrderSortingField = Helper.createTransactionFieldOrder(
  Helper.getTransactionSortField().BLOCK,
  Helper.getQueryParamOrder_v2().DESC
);
const nativeTokenName = computed(() => AppState.nativeToken.label);

const formatConfirmedTransaction = async (transactions: Transaction[]) => {
  let formattedTxns = [];

  switch (selectedTxnType.value) {
    case TransactionFilterType.TRANSFER:
      formattedTxns = await TransactionUtils.formatConfirmedMixedTxns(
        transactions
      );
      break;
    case TransactionFilterType.ACCOUNT:
      formattedTxns = await TransactionUtils.formatConfirmedAccountTransaction(
        transactions
      );
      break;
    case TransactionFilterType.AGGREGATE:
      formattedTxns =
        await TransactionUtils.formatConfirmedAggregateTransaction(
          transactions
        );
      break;
    case TransactionFilterType.RESTRICTION:
      formattedTxns =
        await TransactionUtils.formatConfirmedRestrictionTransaction(
          transactions
        );
      break;
    case TransactionFilterType.SECRET:
      formattedTxns = await TransactionUtils.formatConfirmedSecretTransaction(
        transactions
      );
      break;
    case TransactionFilterType.ALIAS:
      formattedTxns = await TransactionUtils.formatConfirmedAliasTransaction(
        transactions
      );
      break;
    case TransactionFilterType.ASSET:
      formattedTxns = await TransactionUtils.formatConfirmedAssetTransaction(
        transactions
      );
      break;
    case TransactionFilterType.METADATA:
      formattedTxns = await TransactionUtils.formatConfirmedMetadataTransaction(
        transactions
      );
      break;
    case TransactionFilterType.CHAIN:
      formattedTxns = await TransactionUtils.formatConfirmedChainTransaction(
        transactions
      );
      break;
    case TransactionFilterType.EXCHANGE:
      formattedTxns = await TransactionUtils.formatConfirmedExchangeTransaction(
        transactions
      );
      break;
    case TransactionFilterType.LINK:
      formattedTxns = await TransactionUtils.formatConfirmedLinkTransaction(
        transactions
      );
      break;
    case TransactionFilterType.LOCK:
      formattedTxns = await TransactionUtils.formatConfirmedLockTransaction(
        transactions
      );
      break;
    case TransactionFilterType.NAMESPACE:
      formattedTxns =
        await TransactionUtils.formatConfirmedNamespaceTransaction(
          transactions
        );
      break;
    case TransactionFilterType['SDA EXCHANGE']:
      formattedTxns =
        await TransactionUtils.formatConfirmedSdaExchangeTransaction(
          transactions
        );
      break;
    default:
      formattedTxns = await TransactionUtils.formatConfirmedMixedTxns(
        transactions
      );
      break;
  }
  return formattedTxns;
};

let loadTransactions = async () => {
  if (!AppState.isReady) {
    setTimeout(loadTransactions, 1000);
    return;
  }
  if (!AppState.chainAPI) {
    return;
  }
  checkTransactions.value = true
  let txnQueryParams = Helper.createTransactionQueryParams();

  if(props.accPublicKey){
    let isPublicKey = props.accPublicKey.length === 64;
    if (props.accPublicKey !== "" && !isPublicKey) {
      const account = await AccountUtils.getAccountFromAddress(
        props.accPublicKey
      );
      if (account) {
        txnQueryParams.publicKey = account.publicKey;
      }
    } else {
      const publicKey = props.accPublicKey;
      const address = AccountUtils.getAddressFromPublicKey(publicKey);
      if (address) {
        txnQueryParams.publicKey = publicKey;
      }
    }
  }
  if(option.value === "blockNumber"){
    if(startBlock.value && endBlock.value){
      txnQueryParams.fromHeight = startBlock.value;
      txnQueryParams.toHeight = endBlock.value;
    }
  }
  else{
    if(inputDay.value){
      const chainConfig = new ChainProfileConfig(networkState.chainNetworkName);
      chainConfig.init();
      let blockTargetTime = parseInt(chainConfig.blockGenerationTargetTime);
      let blockTargetTimeByDay = (60 * 60 * 24) / blockTargetTime;
      endBlock.value = await AppState.chainAPI.chainAPI.getBlockchainHeight()
      const calculateHeight = endBlock.value -  Math.floor(inputDay.value * blockTargetTimeByDay)
      if(calculateHeight<=0){
        txnQueryParams.fromHeight = 1
      }
      else{
        txnQueryParams.fromHeight = calculateHeight
      }
    }
  }
  if (!selectedTxnType.value || selectedTxnType.value == "all") {
    txnQueryParams.embedded = false;
  } else {
    txnQueryParams.embedded = true;
  }

  if (QueryParamsType.value) { 
    txnQueryParams.type = QueryParamsType.value;
  }
  txnQueryParams.updateFieldOrder(blockDescOrderSortingField);
  let transactionSearchResult = await TransactionUtils.searchTxns(
    transactionGroupType.CONFIRMED,
    txnQueryParams
  );
  if (transactionSearchResult.transactions.length > 0) {
    totalPage.value = transactionSearchResult.pagination.totalPages;
    if(totalPage.value >= 1){
      for(let i = 1; i<=totalPage.value;i++){
        txnQueryParams.pageNumber = i;
        let transactionSearchAllResult = await TransactionUtils.searchTxns(transactionGroupType.CONFIRMED, txnQueryParams);
        if(transactionSearchAllResult.transactions.length > 0){
          let formattedTxns = await formatConfirmedTransaction(transactionSearchAllResult.transactions);
          for(let j = 0; j<20;j++){
            if(formattedTxns[j] != undefined){
              transactions.value!.push(formattedTxns[j])
            }
          }
        }
      }
    }
  } else {
    transactions.value = []
  }
};

const changeSearchTxnType = () => {
  transactions.value = [];
  let txnFilterGroup = selectedTxnType.value;
  switch (txnFilterGroup) {
    case TransactionFilterType.TRANSFER:
      QueryParamsType.value = TransactionFilterTypes.getTransferTypes();
      break;
    case TransactionFilterType.ACCOUNT:
      QueryParamsType.value = TransactionFilterTypes.getAccountTypes();
      break;
    case TransactionFilterType.ASSET:
      QueryParamsType.value = TransactionFilterTypes.getAssetTypes();
      break;
    case TransactionFilterType.ALIAS:
      QueryParamsType.value = TransactionFilterTypes.getAliasTypes();
      break;
    case TransactionFilterType.NAMESPACE:
      QueryParamsType.value = TransactionFilterTypes.getNamespaceTypes();
      break;
    case TransactionFilterType.METADATA:
      QueryParamsType.value = TransactionFilterTypes.getMetadataTypes();
      break;
    case TransactionFilterType.CHAIN:
      QueryParamsType.value = TransactionFilterTypes.getChainTypes();
      break;
    case TransactionFilterType.EXCHANGE:
      QueryParamsType.value = TransactionFilterTypes.getExchangeTypes();
      break;
    case TransactionFilterType.AGGREGATE:
      QueryParamsType.value = TransactionFilterTypes.getAggregateTypes();
      break;
    case TransactionFilterType.LINK:
      QueryParamsType.value = TransactionFilterTypes.getLinkTypes();
      break;
    case TransactionFilterType.LOCK:
      QueryParamsType.value = TransactionFilterTypes.getLockTypes();
      break;
    case TransactionFilterType.SECRET:
      QueryParamsType.value = TransactionFilterTypes.getSecretTypes();
      break;
    case TransactionFilterType.RESTRICTION:
      QueryParamsType.value = TransactionFilterTypes.getRestrictionTypes();
      break;
    case TransactionFilterType['SDA EXCHANGE']:
      QueryParamsType.value = TransactionFilterTypes.getSdaExchangeTypes();
      break;
    default:
      QueryParamsType.value = undefined;
      break;
  }
};

const displayAssetDiv = (sda: SDA) => {
  let asset_div;
  let assetArray = [];
  assetArray.push(sda.id);

  if (sda.currentAlias && sda.currentAlias.length) {
    asset_div = sda.amount + " " + sda.currentAlias[0].name;
  } else {
    asset_div = sda.amount + " - " + sda.id;
  }
  return asset_div;
};

const displaySDAs = (sdas: SDA[]) => {
  let sda_rows = [];
  if (sdas.length > 0) {
    for (const sda of sdas) {
      let asset_div = displayAssetDiv(sda);
      sda_rows.push(asset_div);
    }
    return sda_rows.join("");
  }
};

const displayAggregateTxn = (txns: TxnList[]) => {
  let txn_rows;
  for (const txn of txns) {
    txn_rows = txn.name + " (" + txn.total + ")";
  }
  return txn_rows;
};

const displayExchangeOffer = (offer: TxnExchangeOffer[]) => {
  let offer_rows;
  if (offer.length > 0) {
    offer.forEach((exchangeOffer) => {
      offer_rows = exchangeOffer.type + "-";
      if (exchangeOffer.amount) {
        offer_rows +=
          exchangeOffer.amount > 0 ? " Amount: " + exchangeOffer.amount : "";
      }
      offer_rows += exchangeOffer.assetNamespace
        ? " Asset Namespace: " + exchangeOffer.assetNamespace
        : " Asset: " + exchangeOffer.assetId;
      if (exchangeOffer.cost) {
        offer_rows +=
          exchangeOffer.cost > 0
            ? " Cost: " + exchangeOffer.cost + " " + nativeTokenName.value
            : "";
      }
    });
    return offer_rows;
  }
};

const displayModification = (data: RestrictionModification[]) => {
  let modification_rows = [];

  for (const restrictMod of data) {
    let test =
      restrictMod.action === "Add"
        ? restrictMod.action +
          ": " +
          (restrictMod.name ? restrictMod.name : restrictMod.value)
        : restrictMod.action +
          ": " +
          (restrictMod.name ? restrictMod.name : restrictMod.value);
    modification_rows.push(test);
  }
  return modification_rows.join("  ");
};

const clearInput = () => {
  onExport.value = false
  checkTransactions.value = false
  startBlock.value = null
  endBlock.value = null
  inputDay.value = null
  transactions.value = []
}

const downloadCSV = async () => {
  let objArray = await exportValue();
  const array = typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
  let str = "";
  let csvData = "";
  let header = [];
  for (let i = array.length - 1; i >= 0; i--) {
    let line = "";
    for (const index in array[i]) {
      header.push(index);
      if (line !== "") line += ",";
      line += array[i][index];
    }
    str += line + "\r\n";
  }
  let uniqueChars = [...new Set(header)];
  csvData += uniqueChars.join(",") + "\r\n";
  csvData += str;
  const exportedFilenmae = selectedTxnType.value + '.csv' || 'export.csv'; // eslint-disable-line
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportedFilenmae);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
  clearInput()
};

const exportValue = async () => {
  await loadTransactions()
  let export_Value: any[] = [];
  if (!transactions.value) {
    return "";
  }
  transactions.value.forEach((data) => {
    switch (selectedTxnType.value) {
      case "Transfer":
        export_Value.push({
          TxHash: data.hash,
          Timestamp: Helper.convertDisplayDateTimeFormat24(
            data.timestamp
          ).replace(",", ""),
          Type: data.typeName,
          Block: data.block,
          Signer: Helper.createAddress(data.signerAddress).pretty(),
          Recipient: data.recipient
            ? Helper.createAddress(data.recipient).pretty()
            : "-",
          TxFee: (data.fee ? data.fee : 0) + " " + nativeTokenName.value,
          Amount:
            (data.amountTransfer ? data.amountTransfer : 0) +
            " " +
            nativeTokenName.value,
          SDA: displaySDAs(data.sda) ? displaySDAs(data.sda) : "-",
          Message: data.namespaceName
            ? data.amount + " " + data.namespaceName
            : data.assetId
            ? data.assetId + " - " + data.amount
            : "-",
        });
        break;
      case "Account":
        export_Value.push({
          TxHash: data.hash,
          Type: data.typeName,
          Account: data.block,
          ApprovalDelta: data.oldApprovalNumber
            ? data.oldApprovalNumber
            : "" +
              " " +
              (data.approvalDelta > 0
                ? " +" + data.approvalDelta
                : data.approvalDelta),
          RemovalDelta: data.oldApprovalNumber
            ? data.oldApprovalNumber
            : "" +
              " " +
              (data.removalDelta > 0
                ? " +" + data.removalDelta
                : data.removalDelta),
          Info:
            (data.addedCosigner.length != 0
              ? "Adding account: " + data.addedCosigner.join("  ") + "  "
              : "") +
            (data.removedCosigner.length != 0
              ? "Removing account: " + data.removedCosigner.join("  ")
              : "-"),
        });

        break;
      case "Aggregate":
        export_Value.push({
          TxHash: data.hash,
          Timestamp: Helper.convertDisplayDateTimeFormat24(
            data.timestamp
          ).replace(",", ""),
          Type: data.typeName,
          Block: data.block,
          TxFee: (data.fee ? data.fee : 0) + " " + nativeTokenName.value,
          Transaction: displayAggregateTxn(data.txnList),
        });
        break;
      case "Alias":
        export_Value.push({
          TxHash: data.hash,
          Timestamp: Helper.convertDisplayDateTimeFormat24(
            data.timestamp
          ).replace(",", ""),
          Type: data.typeName,
          Block: data.block,
          TxFee: (data.fee ? data.fee : 0) + " " + nativeTokenName.value,
          Info:
            data.aliasTypeName === "Link"
              ? data.assetId
                ? data.aliasName + " link with " + data.assetId
                : data.aliasName + " link with " + data.address
              : data.assetId
              ? data.aliasName + " unlink with " + data.assetId
              : data.aliasName + " unlink with " + data.address,
        });
        break;
      case "Asset":
        export_Value.push({
          TxHash: data.hash,
          Timestamp: Helper.convertDisplayDateTimeFormat24(
            data.timestamp
          ).replace(",", ""),
          Type: data.typeName,
          Block: data.block,
          TxFee: (data.fee ? data.fee : 0) + " " + nativeTokenName.value,
          AssetID:
            data.assetId + (data.namespaceName ? " " + data.namespaceName : ""),
          Info:
            (data.nonce ? "Nonce: " + " +" + data.nonce + "  " : "") +
            (data.divisibility !== null
              ? "Divisibility: " + data.divisibility + "  "
              : "") +
            (data.transferable !== null
              ? "Transferable: " +
                (data.transferable == true ? "Yes" : "No") +
                "  "
              : "") +
            (data.supplyMutable !== null
              ? "Supply Mutable: " +
                (data.supplyMutable == true ? "Yes" : "No") +
                "  "
              : "") +
            (data.duration > 0 ? "Duration: " + data.duration + "  " : "") +
            (data.supplyDelta
              ? "Supply: " + " +" + data.supplyDelta + "  "
              : "") +
            (data.levyAssetId ? "  Levy: " + data.levyAssetId + "  " : "") +
            (data.levyAssetName ? " " + data.levyAssetName + "  " : "") +
            (data.levyAssetAmount
              ? "Levy Amount: " + data.levyAssetAmount + "  "
              : "") +
            (data.levyRecipient
              ? "Levy Recipient: " + data.levyRecipient + "  "
              : ""),
        });
        break;
      case "Namespace":
        export_Value.push({
          TxHash: data.hash,
          Timestamp: Helper.convertDisplayDateTimeFormat24(
            data.timestamp
          ).replace(",", ""),
          Type: data.typeName,
          Block: data.block,
          TxFee: (data.fee ? data.fee : 0) + " " + nativeTokenName.value,
          RegisterType: data.registerTypeName,
          Namespace: data.namespaceName,
          ParentNamespace: data.parentName ? data.parentName : "-",
          Duration: data.duration
            ? data.duration + " Block" + (data.duration > 1 ? "s" : "")
            : "-",
        });
        break;
      case "Metadata":
        export_Value.push({
          TxHash: data.hash,
          Timestamp: Helper.convertDisplayDateTimeFormat24(
            data.timestamp
          ).replace(",", ""),
          Type: data.typeName,
          Block: data.block,
          TxFee: (data.fee ? data.fee : 0) + " " + nativeTokenName.value,
          ScopedMetadataKey: data.scopedMetadataKey,
          Target:
            (data.targetId ? data.targetId : data.targetIdName) +
            (data.targetIdName ? " (" + data.targetIdName + ")" : ""),
        });
        break;
      case "Exchange":
        export_Value.push({
          TxHash: data.hash,
          Timestamp: Helper.convertDisplayDateTimeFormat24(
            data.timestamp
          ).replace(",", ""),
          Type: data.typeName,
          Block: data.block,
          TxFee: (data.fee ? data.fee : 0) + " " + nativeTokenName.value,
          Offer: displayExchangeOffer(data.exchangeOffers),
        });
        break;
      case "Lock":
        export_Value.push({
          TxHash: data.hash,
          Timestamp: Helper.convertDisplayDateTimeFormat24(
            data.timestamp
          ).replace(",", ""),
          Type: data.typeName,
          Block: data.block,
          TxFee: (data.fee ? data.fee : 0) + " " + nativeTokenName.value,
          LockHash: data.lockHash,
          Duration: data.duration
            ? data.duration + " Block" + (data.duration > 1 ? "s" : "")
            : "-",
          Refunded: data.isRefunded ? "Yes" : "No",
        });
        break;
      case "Link":
        export_Value.push({
          TxHash: data.hash,
          Timestamp: Helper.convertDisplayDateTimeFormat24(
            data.timestamp
          ).replace(",", ""),
          Type: data.typeName,
          Block: data.block,
          TxFee: (data.fee ? data.fee : 0) + " " + nativeTokenName.value,
          RemotePublicKey: data.remotePublicKey,
          Info: data.action === "Link" ? "Linked" : "Unlinked",
        });
        break;
      case "Restriction":
        export_Value.push({
          TxHash: data.hash,
          Timestamp: Helper.convertDisplayDateTimeFormat24(
            data.timestamp
          ).replace(",", ""),
          Type: data.typeName,
          Block: data.block,
          TxFee: (data.fee ? data.fee : 0) + " " + nativeTokenName.value,
          RestrictionType: data.restrictionTypeOutput,
          Modification: displayModification(data.modification),
        });
        break;
      case "Secret":
        export_Value.push({
          TxHash: data.hash,
          Timestamp: Helper.convertDisplayDateTimeFormat24(
            data.timestamp
          ).replace(",", ""),
          Type: data.typeName,
          Block: data.block,
          Recipient: data.recipient
            ? Helper.createAddress(data.recipient).pretty()
            : "-",
          TxFee: (data.fee ? data.fee : 0) + " " + nativeTokenName.value,
          HashType: data.hashType,
          Secret: data.secret ? data.secret : "-",
          Proof: data.proof ? data.proof : "-",
          SDA: data.namespaceName
            ? data.amount + " " + data.namespaceName
            : data.assetId
            ? data.assetId + " - " + data.amount
            : "-",
          Info: data.duration
            ? "Duration: " +
              data.duration +
              " block" +
              (data.duration > 1 ? "s" : "")
            : "-",
        });
        break;
      case "Chain":
        export_Value.push({
          TxHash: data.hash,
          Timestamp: Helper.convertDisplayDateTimeFormat24(
            data.timestamp
          ).replace(",", ""),
          Type: data.typeName,
          Block: data.block,
          TxFee: (data.fee ? data.fee : 0) + " " + nativeTokenName.value,
          Info:
            (data.applyHeightDelta > 0
              ? "Apply Height Delta: " + data.applyHeightDelta + "  "
              : "") +
            (data.newVersion > 0
              ? "New Version: " + data.newVersion + "  "
              : "") +
            (data.upgradePeriod > 0
              ? "Upgrade Period: " + data.upgradePeriod + "  "
              : ""),
        });
        break;
      default:
        export_Value.push({
          TxHash: data.hash,
          Timestamp: Helper.convertDisplayDateTimeFormat24(
            data.timestamp
          ).replace(",", ""),
          Type: data.typeName,
          Block: data.block,
          Signer: Helper.createAddress(data.signerAddress).pretty(),
          Recipient: data.recipient
            ? Helper.createAddress(data.recipient).pretty()
            : "-",
          TxFee: (data.fee ? data.fee : 0) + " " + nativeTokenName.value,
          Amount:
            (data.amountTransfer > 0 ? data.amountTransfer : 0) +
            " " +
            nativeTokenName.value,
          SDA: displaySDAs(data.sda) ? displaySDAs(data.sda) : "-",
          Message:
            data.message && data.messageType !== 1
              ? data.messageTypeTitle + ": " + data.message
              : "-",
        });
        break;
    }
  });
  let export_Json = JSON.stringify(export_Value);
  return export_Json;
};

watch([startBlock, endBlock], async ([newStartBlock, newEndBlock]) => {
  if(!newStartBlock || !newEndBlock){
    isDisabledValidate.value = true
  }
  else if(newStartBlock > newEndBlock){
    isDisabledValidate.value = true
  }
  else{
    isDisabledValidate.value = false
  }
})

watch(inputDay, (newInputDay) => {
  if(!newInputDay){
    isDisabledValidate.value = true
  }
  else{
    isDisabledValidate.value = false
  }
})
</script>

<style scoped lang="scss">
.overlay {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
}
.modal {
  position: relative;
  width: 550px;
  z-index: 9999;
  margin: 102px auto;
  padding: 20px 30px;
  background-color: #fff;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>