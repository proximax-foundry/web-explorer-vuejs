<template>
  <div>
    <p class="text-gray-500 mb-5 text-sm font-bold">Transaction Details</p>
    <div v-if="!isFetching">
      <div
        class="filter shadow-xl border border-gray-50 p-5 mb-15"
        v-if="formattedTransaction.isFound === true" >
        <div class="flex items-center mb-4 border-b border-gray-100 relative">
          <div
            class="w-32 font-bold text-xs text-center p-2 relative"
            :class="`${currentPage != 'detail' ? 'cursor-pointer' : ''}`"
            @click="currentPage = 'detail'" >
            Overview
            <div
              v-if="currentPage == 'detail'"
              class="absolute w-full border-b border-yellow-500 transition-all duration-200"
              style="bottom: -1px" >
            </div>
          </div>
          <div
            class="w-32 font-bold text-xs text-center p-2 relative"
            :class="`${currentPage != 'inner' ? 'cursor-pointer' : ''}`"
            @click="currentPage = 'inner'"
            v-if="innerTransaction">
            Inner Txns
            <div
              v-if="currentPage == 'inner'"
              class="absolute w-full border-b border-yellow-500 transition-all duration-200"
              style="bottom: -1px">
            </div>
          </div>
        </div>
        <TxnDetailComponent
          v-if="currentPage == 'detail'"
          :txnDetail="formattedTransaction"
          :txnData="allData"
          :txnType="txnType"
        />
        <InnerTxnComponent
          v-else
          :innerTxn="innerTransaction"
          :txn="txn"
          :txnData="allData"
          :txnGroup="formattedTransaction.group"
        />
      </div>
      <div
        v-else-if="formattedTransaction.isFound === 'error'"
        class="p-3 bg-yellow-100 text-yellow-700">
        Transaction not found in {{ networkName }}
      </div>
      <div v-else class="filter shadow-xl border border-gray-50 p-5 mb-15">
        <TxnFailedComponent :hash="hash" :status="failedStatus" />
      </div>
    </div>
    <div v-if="isFetching">
      <div class="flex justify-center items-center border-gray-400 mt-10">
        <div
          class="animate-spin rounded-full h-5 w-5 border-b-2 border-navy-primary mr-2"
        ></div>
        <span class="text-tsm">Fetching Transaction Details</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, ref } from "vue";
import { networkState } from "@/state/networkState";
import TxnDetailComponent from "@/modules/transaction/components/TxnDetailComponent.vue";
import InnerTxnComponent from "@/modules/transaction/components/InnerTxnComponent.vue";
import TxnFailedComponent from "@/modules/transaction/components/TxnFailedComponent.vue";
import { AppState } from "@/state/appState";
import { Helper } from "@/util/typeHelper";
import { TransactionUtils } from "@/util/transactionUtils";
import {
  Address,
  Convert,
  Deadline,
  Id,
  MessageType,
  Mosaic,
  MosaicId,
  NamespaceId,
  NetworkType,
  PublicAccount,
  Transaction,
  TransactionMapping,
  UInt64,
  AliasActionType,
  NamespaceType,
  ExchangeOfferType,
  LinkAction,
  HashType,
  MultisigCosignatoryModificationType,
  RestrictionType,
  MosaicSupplyType,
  DerivationScheme,
  MosaicNonce,
  MosaicProperties,
  MosaicLevyType,
  MosaicLevy,
TransactionVersion,
PlainMessage,
CreateLiquidityProviderTransaction,
} from "tsjs-xpx-chain-sdk";
import { ComponentNames } from "../componentEnum";
import type { RowData } from "../components/payloadDetails/IRowData";

const props = defineProps({
  hash: {
  type: String,
  required: true,
  }
});
const internalInstance = getCurrentInstance();
const emitter = internalInstance?.appContext.config.globalProperties.emitter;
const currentPage = ref("detail");
const txnType = ref(0);
const isFetching = ref(true);
const isTxnFailed = ref(false);
const failedStatus = ref("");
const failedTxnDetails = ref(<{networkName:string, txnHash:string, errMsg:string}[]>[])
const txn = ref({});
const allData = ref();
const formattedTransaction = ref<any>({});
const innerTransaction = ref({});

let ignoreList = [
  "transactionName",
  "version.signatureDScheme",
  "innerTransactions.transactionName",
  "innerTransactions.version.signatureDScheme",
  "innerTransactions.deadline",
  "innerTransactions.maxFee",
  "mosaicProperties.flags",
  "innerTransactions.mosaicProperties.flags",
  "transactionInfo",
  "version",
  "fee",
  "cosignatures",
  "namespaceName",
  "innerTransactions.valueSize",
  "innerTransactions.valueSizeDelta",
  "innerTransactions.value",
  "innerTransactions.oldValue",
  "innerTransactions.transactionInfo",
  "innerTransactions.version",
  "innerTransactions.namespaceId",
  "innerTransactions.mosaicNonce",
  "innerTransactions.valueDifferences",
  "detail.hash",
  "detail.type",
  "detail.typeName",
  "detail.timestamp",
  "detail.signerName",
  "detail.signerAddress",
  "detail.signer",
  "detail.maxFee",
  "detail.deadline",
  "detail.unknownData",
  "detail.block",
  "detail.fee",
  "detail.groupType",
  "detail.lockHash",
  "detail.duration",
  "detail.amountLocking",
  "detail.sda",
  "detail.sender",
  "detail.recipient",
  "detail.amountTransfer",
  "detail.messageTypeTitle",
  "detail.message",
  "detail.aggregateLength",
  "detail.txnList",
  "detail.cosigners",
  "detail.aliasName",
  "detail.aliasTypeName",
  "detail.assetId",
  "detail.aliasType",
  "detail.address",
  "detail.divisibility",
  "detail.supplyMutable",
  "detail.nonce",
  "detail.supplyDelta",
  "detail.supplyDirection",
  "detail.namespaceId",
  "detail.namespaceName",
  "detail.registerType",
  "detail.registerTypeName",
  "detail.parentId",
  "detail.parentName",
  "detail.action",
  "detail.remotePublicKey",
  "detail.sdaExchange",
  "unknownPayload",
];

let globalConfig = {
  "version.networkType": { value: (data: any) => NetworkType[data], secondaryValue: (data: any) => data.toString() },
  "version.txnTypeVersion": { value: (data: any) => data.toString() },
  "message.type": { value: (data: any) => MessageType[data] },
  "offers.type": { value: (data: any) => ExchangeOfferType[data] },
  "offers.offerType": { value: (data: any) => ExchangeOfferType[data] },
  "offers.mosaicId": { name: "SDA ID", handlerType: ComponentNames.assetID },
  "offers.cost": { handlerType: ComponentNames.fee },
  actionType: { name: "Alias Type", value: (data: any) => AliasActionType[data] },
  linkAction: { name: "Action", value: (data: any) => LinkAction[data] },
  hashType: { value: (data: any) => HashType[data] },
  mosaics: { name: "SDAs" },
  mosaicId: { name: "Asset ID", handlerType: ComponentNames.assetID },
  "modifications.type": { value: (data: any) => MultisigCosignatoryModificationType[data] },
  restrictionType: { value: (data: any) => RestrictionType[data] },
  direction: { name: "Action", value: (data: any) => MosaicSupplyType[data] },
  delta: { name: "Supply Delta"},
  signatureDScheme: { value: (data: any) => DerivationScheme[data] },
  "cosignatures.signatureDScheme": { value: (data: any) => DerivationScheme[data] },
  "mosaicLevy.type": { value: (data: any) => MosaicLevyType[data] },
  "transactionInfo.hash" : { name: "TX HASH" },
  "transactionInfo.height" : { name: "Block" },
  type : { name: "Tx Type" },
  maxFee : { name: "TX FEE" },
  namespaceId : { name: "Namespace" },
  parentId : { name: "Parent" },
  hash : { name: "Lock Hash" },
  remoteAccountKey : { name: "Remote Public Key" },
  mosaicNonce: { name: "Nonce" },
  mosaicProperties : { name: " " },
  "mosaicProperties.supplyMutable" : { name: "Supply Mutable", value: (data: any) => data ? 'Yes' : 'No'},
  "mosaicProperties.transferable" : { name: "Transferable", value: (data: any) => data ? 'Yes' : 'No'},
  "innerTransactions.mosaicProperties" : { name: " " },
  "innerTransactions.mosaicProperties.supplyMutable" : { name: "Supply Mutable", value: (data: any) => data ? 'Yes' : 'No'},
  "innerTransactions.mosaicProperties.transferable" : { name: "Transferable", value: (data: any) => data ? 'Yes' : 'No'},
  "innerTransactions.mosaicId": { name: "Asset ID", handlerType: ComponentNames.assetID },
  "innerTransactions.delta": { name: "Supply Delta" },
  "innerTransactions.direction": { name: "Action", value: (data: any) => MosaicSupplyType[data] },
  "innerTransactions.targetMosaicId": { name: "Asset", handlerType: ComponentNames.assetID },
  "innerTransactions.targetPublicKey": { name: "Account" },
  "innerTransactions.mosaics": { name: "SDAs" },
  "innerTransactions.namespaceType" : { name: "Namespace Type", value: (data: any) => data === 0? " (Extend)" : " (Register)"},
  "innerTransactions.namespaceName" : { name: "Namespace Name" },
  "innerTransactions.scopedMetadataKey" : { name: "Scoped Metadata Key" },
  "offers.mosaicIdGive" : { name: "Asset ID Give" },
  "offers.mosaicIdGet" : { name: "Asset ID Get" },
  "offers.mosaicAmountGive" : { name: "Give Amount" },
  "offers.mosaicAmountGet" : { name: "Get Amount" },
  "innerTransactions.offers.mosaicIdGive" : { name: "Asset ID Give" },
  "innerTransactions.offers.mosaicIdGet" : { name: "Asset ID Get" },
  "innerTransactions.offers.mosaicAmountGive" : { name: "Give Amount" },
  "innerTransactions.offers.mosaicAmountGet" : { name: "Get Amount" },
  "innerTransactions.minApprovalDelta" : { name: "Minimum Approval" },
  "innerTransactions.minRemovalDelta" : { name: "Minimum Removal" },
  "innerTransactions.modifications" : { name: " " },
  "innerTransactions.modifications.type" : { value: (data: any) => MultisigCosignatoryModificationType[data] },
  "innerTransactions.modifications.cosignatoryPublicAccount" : { name: "Cosignatory Address" },
   detail : { name: " " },
  "detail.isRefunded" : { name: "Refunded", value: (data: any) =>  data ? "Yes" : "No"},
};

const aliceMosaicId = new MosaicId([3205233868, 173793843]);
const publicAccount = PublicAccount.createFromPublicKey(
    '73472A2E9DCEA5C2A36EB7F6A34A634010391EC89E883D67360DB16F28B9443C', 
    NetworkType.TEST_NET
  );

const createLiquidityProviderTxn = CreateLiquidityProviderTransaction.create(
    Deadline.create(),
    aliceMosaicId,
    UInt64.fromUint(100),
    UInt64.fromUint(100),
    1000,
    64,
    publicAccount,
    5,
    4,
    NetworkType.TEST_NET,
  )

const networkName = computed(() => {
  return networkState.chainNetworkName;
});

const loadTxn = async () => {
  if (!AppState.isReady) {
    setTimeout(loadTxn, 1000);
    return;
  }
  if (!props.hash) {
    return;
  }
  const data = sessionStorage.getItem("storeFailedTxnDetails")
    if(data){
      let getFailedTxns: Array<{networkName:string, txnHash:string, errMsg:string}> = JSON.parse(data)
      failedTxnDetails.value = getFailedTxns
    }
    
  if(failedTxnDetails.value){
    let findFailedTxn = failedTxnDetails.value.find(x => x.networkName === networkName.value && x.txnHash === props.hash)
    if(findFailedTxn){
      failedStatus.value = findFailedTxn.errMsg
      isTxnFailed.value = true
      isFetching.value = false;
      return;
    }
  }

  if(isTxnFailed.value === false){
  let transaction = await TransactionUtils.getTransaction(props.hash);
  console.log(transaction)
  allData.value = getData(createLiquidityProviderTxn, "", globalConfig);
  console.log(allData.value);
  if (transaction.isFound == "error") {
    formattedTransaction.value = transaction;
    isFetching.value = false;
    return;
  } else {
    if(transaction.txnStatus.group == "failed") {
      let failedTxnHashs = failedTxnDetails.value.map((x)=> x.txnHash)
      failedStatus.value = transaction.txnStatus.status;
      if(!failedTxnHashs.includes(props.hash)){
        failedTxnDetails.value.push({networkName: networkName.value, txnHash: props.hash, errMsg: failedStatus.value})
        sessionStorage.setItem("storeFailedTxnDetails",JSON.stringify(failedTxnDetails.value))
      }
    } else {
      txn.value = transaction.txn;
      if (transaction.isFound == true) {
        formattedTransaction.value = {
          hash: props.hash,
          status: transaction.txnStatus.status
            ? transaction.txnStatus.status
            : "",
          timestamp: transaction.txn.timestamp,
          height: transaction.txn.transactionInfo.height.compact(),
          type: transaction.txn.type,
          typeName: transaction.txn.transactionName,
          fee: Helper.convertToExact(
            transaction.txn.fee,
            AppState.nativeToken.divisibility
          ),
          signature: transaction.txn.signature,
          signer: transaction.txn.signer.address.address,
          version: transaction.txn.version,
          isMissingSignature: transaction.txn.hasMissingSignatures(),
          detail: transaction.txn.detail,
          group: transaction.txnStatus.group,
          isFound: transaction.isFound,
          unknownData: transaction.txn.unknownData ? transaction.txn.unknownData: {} 
        };
        
        if (transaction.txn.cosignatures != undefined) {
          formattedTransaction.value.cosigners = transaction.txn.cosignatures;
        } else {
          formattedTransaction.value.cosigners = {};
        }

        txnType.value = transaction.txn.type;

        // if(transaction.txn.amountTransfer!=undefined){
        //   formattedTransaction.value.amountTransfer = transaction.txn.amountTransfer;
        // }

        if (transaction.txn.mosaic != undefined) {
          formattedTransaction.value.assetAmount = Helper.convertToExact(
            transaction.txn.mosaic.amount.compact(),
            AppState.nativeToken.divisibility
          );
          formattedTransaction.value.assetId =
            transaction.txn.mosaic.id.toHex();
          let isNamespace = TransactionUtils.isNamespace(
            transaction.txn.mosaic.id
          );
          if (isNamespace) {
            let namespaceId = Helper.createNamespaceId(
              transaction.txn.mosaic.id.toDTO().id
            );
            let nsNames = await TransactionUtils.getNamespacesName([
              namespaceId,
            ]);
            formattedTransaction.value.assetName = nsNames[0].name;
          }
        }

        // if(transaction.txn.amount!=undefined){
        //   formattedTransaction.value.amount = transaction.txn.amount;
        // }

        innerTransaction.value = transaction.txn.innerTransactions;
      } else {
        formattedTransaction.value = transaction;
      }
    }
  }
}
  isFetching.value = false;
};
loadTxn();

let extractTxnDataBasedOnClass = (data: any, key: string): RowData | null => {
  let classType = data.constructor.name;
  let typeOfData = typeof data;

  let finalData: string = "";
  let handlerType: string = "";

  // let displayData: RowData;

  if (classType === UInt64.name) {
    let d = data as UInt64;
    // finalData = d.toHex();
    finalData = BigInt("0x" +d.toHex()).toString();

    return {
      name: key,
      value: finalData,
    };
  } else if (classType === Id.name) {
    let d = data as Id;
    finalData = d.toHex();

    return {
      name: key,
      value: finalData,
    };
  } else if (classType === Deadline.name) {
    let d = data as Deadline;
    finalData = new Date(d.value!.toJSON()).toJSON();

    return {
      name: key,
      value: finalData,
    };
  } else if (classType === PublicAccount.name) {
    let d = data as PublicAccount;
    handlerType = ComponentNames.publicKey;

    return {
      name: key,
      value: d.publicKey,
      handlerType: handlerType
    };
  } else if (classType === Address.name) {
    let d = data as Address;
    finalData = d.pretty();
    handlerType = ComponentNames.address;

    return {
      name: key,
      value: finalData,
      handlerType: ComponentNames.address
    };
  } else if (classType === NamespaceId.name) {
    let d = data as NamespaceId;
    finalData = d.toHex();
    handlerType = ComponentNames.namespace;

    return {
      name: key,
      value: finalData,
      handlerType: handlerType
    };
  } else if (classType === MosaicId.name) {
    let d = data as MosaicId;
    finalData = d.toHex();
    handlerType = ComponentNames.assetID;

    if(TransactionUtils.isNamespaceWithString(finalData)){
      handlerType = ComponentNames.namespace;
    }

    return {
      name: key,
      value: finalData,
      handlerType: handlerType,
    };
  } else if (classType === Uint8Array.name) {
    let d = data as Uint8Array;
    finalData = "0x" + Convert.uint8ArrayToHex(d);

    return {
      name: key,
      value: finalData,
    };
  } else if (classType === Mosaic.name) {
    let d = data as Mosaic;
    finalData = d.id.toHex();

    return {
      name: "SDA",
      value: finalData,
      secondaryValue: BigInt("0x" + d.amount.toHex()).toString(),
      handlerType: ComponentNames.asset,
    };
  } else if (classType === MosaicNonce.name) {
    let d = data as MosaicNonce;

    return {
      name: key,
      value: d.toNumber().toString()
    };
  }

  return null;
};

let getPropData = (
  data: any,
  key: string,
  fullKey: string,
  wholeData: any
): RowData | null => {
  let finalData: string = "";
  let secondaryValue: string = "";

  if (fullKey === "type" || fullKey === "innerTransactions.type") {
    secondaryValue = "Version: " + wholeData.version.txnTypeVersion;
    finalData = wholeData.transactionName;

    return {
      name: key,
      value: finalData,
      secondaryValue: secondaryValue,
    };
  } else if (fullKey === "maxFee") {
    let d = data as UInt64;
    finalData = BigInt("0x" + d.toHex()).toString();

    return {
      name: key,
      value: finalData,
      handlerType: "fee",
    };
  } else if (fullKey === "status") {
    finalData = data;

    return {
      name: key,
      value: finalData,
      handlerType: ComponentNames.status,
    };
  } else if (fullKey === "transactionInfo.hash") {
    finalData = data;

    return {
      name: key,
      value: finalData,
      handlerType: ComponentNames.transactionHash,
    };
  } else if (fullKey === "transactionInfo.height") {
    let d = data as UInt64;
    finalData = d.compact().toString();

    return {
      name: key,
      value: finalData,
      handlerType: ComponentNames.block,
    };
  } else if (
    fullKey === "message" || 
    fullKey === "innerTransactions.message"
    ) {
    let d = data as PlainMessage;
    finalData = d.message;
    switch(d.type) {
      case MessageType.PlainMessage:
        key = "Plain Message"
        break;
      case MessageType.EncryptedMessage:
        key = "Encrypted Message"
        break;
      case MessageType.HexadecimalMessage:
        key = "Hexadecimal Message"
        break;
      default:
    }

    return {
      name: key,
      value: finalData,
    };
  } else if (fullKey === "namespaceType") {
    let d = data as NamespaceType;
    switch(d){
      case NamespaceType.RootNamespace:
      finalData = "Root Namespace"
        break;
      case NamespaceType.SubNamespace:
      finalData = "Sub Namespace"
        break;
      default:
    }

    return {
      name: "Namespace Type",
      value: finalData,
    };
  } else if (fullKey === "remoteAccountKey") {
    finalData = data;

    return {
      name: key,
      value: finalData,
      handlerType: ComponentNames.publicKey,
    };
  } else if (
    fullKey === "scopedMetadataKey" ||
    fullKey === "innerTransactions.scopedMetadataKey"
  ) {
    let d = data as UInt64;
    finalData = "0x" + d.toHex();

    return {
      name: key,
      value: finalData,
    };
  } else if (
    fullKey === "delta" ||
    fullKey === "innerTransactions.delta"
  ) {
    let d = data as UInt64
    finalData = d.compact().toLocaleString()

    return {
      name: key,
      value: finalData,
    };
  } else if (
    fullKey === "mosaicProperties.divisibility" ||
    fullKey === "innerTransactions.mosaicProperties.divisibility"
  ) {

    return {
      name: key,
      value: data.toString(),
    };
  } else if(
    fullKey === "offers.mosaicAmount" ||
    fullKey === "innerTransactions.offers.mosaicAmount"
  ) {
    let refAssetId = wholeData.mosaicId as MosaicId;
    let d = data as UInt64;

    return {
      name: key,
      value: d.toBigInt().toString(),
      secondaryValue: refAssetId.toHex(),
      handlerType: ComponentNames.assetAmount
    };
  } else if(
    fullKey === "offers.mosaicAmountGive" ||
    fullKey === "offers.mosaicAmountGet" ||
    fullKey === "innerTransactions.offers.mosaicAmountGive" ||
    fullKey === "innerTransactions.offers.mosaicAmountGet"
  ) {
    let refAssetId = wholeData.mosaicIdGive as MosaicId;
    let d = data as UInt64;

    return {
      name: key,
      value: d.toBigInt().toString(),
      secondaryValue: refAssetId.toHex(),
      handlerType: ComponentNames.assetAmount
    };
  } else if(
    fullKey === "innerTransactions.targetPublicKey" ||
    fullKey === "innerTransactions.modifications.cosignatoryPublicAccount" 
  ) {
    let d = data as PublicAccount
    finalData = d.address.pretty();

    return {
      name: key,
      value: finalData,
      handlerType: ComponentNames.address
    };
  } else if(
    fullKey === "valueDifferences" ||
    fullKey === "innerTransactions.valueDifferences"
  ) {
    let refData = "";
    if(wholeData.targetMosaicId){
      let refAssetId = wholeData.targetMosaicId as MosaicId;
      refData = refAssetId.toHex();
    }else if(wholeData.targetNamespaceId){
      let refNsId = wholeData.targetNamespaceId as NamespaceId;
      refData = refNsId.toHex();
    }
    else{
      let refPublicAccount = wholeData.targetPublicKey as PublicAccount;
      refData = refPublicAccount.publicKey;
    }
    let d = data as Uint8Array;
    let scopedKey = wholeData.scopedMetadataKey as UInt64;

    return {
      name: key,
      value: Convert.uint8ArrayToHex(d),
      secondaryValue: refData + "," + scopedKey.toHex(),
      handlerType: ComponentNames.metadata
    };
  } else if(
    fullKey === "mosaicProperties.duration" ||
    fullKey === "innerTransactions.mosaicProperties.duration" || 
    fullKey === "duration" || 
    fullKey === "innerTransactions.duration" ||
    fullKey === "offers.duration"
  ) {
    let value = data as UInt64;
    if(!value || value.toBigInt() === BigInt(0)){
      return null;
    }else{
      return {
        name: key,
        value: `${value.toBigInt().toString()} Blocks`
      };
    }
  } else if(
    fullKey === "mosaicLevy.fee" ||
    fullKey === "innerTransactions.mosaicLevy.fee"
  ) {
    let value = data as UInt64;
    let ml = wholeData as MosaicLevy;
    let optionalHandler = "";
    let bigIntValue = value.toBigInt();
    let valueString = bigIntValue.toString();

    if(ml.type === MosaicLevyType.LevyAbsoluteFee){
      optionalHandler = ComponentNames.assetAmount;
      finalData = valueString;
    }
    else if(ml.type === MosaicLevyType.LevyPercentileFee){
      let divider = MosaicLevy.DefaultMosaicLevyEffectiveValue;

      // to do, wait SDK update, fix toBigint
      let quotient = BigInt(valueString)/ BigInt(divider);
      let remainder = valueString.slice(-5);
      
      let remainderInteger = parseInt(remainder);

      let amountWithDecimal = remainderInteger ? remainderInteger / divider: 0;
      let adjustedDecimalAmount = remainderInteger ? amountWithDecimal.toString().split(".")[1].toString(): "";

      finalData = quotient.toString() + (remainderInteger ? "." + adjustedDecimalAmount :"") + " %";
    }

    return {
      name: key,
      value: finalData,
      secondaryValue: ml.mosaicId.toHex(),
      handlerType: optionalHandler
    };
  }

  return null;
};

let getData = (
  classData: any,
  parent: string = "",
  globalConfig: any
): RowData[] => {
  let displayData: RowData[] = [];
  // console.log("Parent: " + parent);

  for (const key in classData) {
    if (Object.prototype.hasOwnProperty.call(classData, key)) {
      const data = classData[key];
      const currentPropString = parent ? parent + "." + key : key;

      if (ignoreList.includes(currentPropString)) {
        continue;
      }

      let keyName = key.charAt(0).toUpperCase() + key.slice(1);

      if (
        globalConfig[currentPropString] &&
        globalConfig[currentPropString].name
      ) {
        keyName = globalConfig[currentPropString].name;
      }

      if (data !== undefined && data !== null) {
        let rowInnerData = getPropData(
          data,
          keyName,
          currentPropString,
          classData
        );

        if (rowInnerData) {
          displayData.push(rowInnerData);
          continue;
        }

        let classType = data.constructor.name;
        let typeOfData = typeof data;

        // console.log(classType);
        // console.log(typeOfData);
        // console.log(key);

        if (Array.isArray(data)) {
          if (data.length === 0) {
            continue;
          }

          let allGroupedPropData: any[] = [];

          for (let innerData of data) {

            let groupedPropData: RowData[] = [];

            let row = extractTxnDataBasedOnClass(innerData, keyName);

            if (row) {
              groupedPropData = groupedPropData.concat(row);
              allGroupedPropData.push(groupedPropData);
              continue;
            }

            let groupedData = getData(
              innerData,
              currentPropString,
              globalConfig
            );

            if (groupedData) {
              groupedPropData = groupedPropData.concat(groupedData);
              allGroupedPropData.push(groupedPropData);
              continue;
            }
          }

          let handlerType =
              globalConfig[currentPropString] &&
              globalConfig[currentPropString].handlerType
                ? globalConfig[currentPropString].handlerType : "";

          let row: RowData = {
            name: keyName,
            value: allGroupedPropData,
            handlerType: handlerType,
          };

          displayData.push(row);

          continue;
        } else if (typeOfData === "object") {
          let row = extractTxnDataBasedOnClass(data, keyName);

          if (row) {

            displayData.push(row);

            continue;
          }

          let groupedData = getData(data, currentPropString, globalConfig);

          row = {
            name: keyName,
            value: groupedData,
          };

          displayData.push(row);
        } else {
          let row: RowData = {
            name: keyName,
            value: data,
          };

          if (
            globalConfig[currentPropString] && globalConfig[currentPropString].secondaryValue &&
            typeof globalConfig[currentPropString].secondaryValue === "function"
          ) {
            row.secondaryValue = globalConfig[currentPropString].secondaryValue(row.value);
          }

          if (
            globalConfig[currentPropString] &&
            typeof globalConfig[currentPropString].value === "function"
          ) {
            row.value = globalConfig[currentPropString].value(row.value);
          }

          displayData.push(row);
        }
      }
    }
  }

  return displayData;
};

emitter.on("CHANGE_NETWORK", (payload: boolean) => {
  if (payload) {
    formattedTransaction.value = {}
    isFetching.value = true;
    isTxnFailed.value = false;
    loadTxn();
  }
});
</script>
