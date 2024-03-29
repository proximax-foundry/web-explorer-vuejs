<template>
  <div>
    <p class="text-gray-500 mb-5 text-sm font-bold">
      Common Transaction Details
    </p>
    <div class="filter shadow-xl border border-gray-50 p-5 mb-15">
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
              :value="data.value" :handler-type="data.handlerType" :toggle-resolve="toggleResolve" ></HandlerControl>
            </template>
            <template v-else>
              <div class="txn-div">
                <div>
                  <div class="flex-none">{{ data.name }}</div>
                  <div class="grow">{{ data.value }} 
                    <span v-if="data.secondaryValue" class="text-xxs text-gray-500">
                      ({{ data.secondaryValue }})
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </template>
      </div>
      <div v-if="isSignedTransaction">
        <div class="txn-div">
            <div>
              <div>Signature</div>
              <div class="overflow-hidden">
                {{ signature }}
              </div>
            </div>
          </div>
      </div>
      <div v-if="isSignedTransaction">
        <HandlerControl label="Signer" style-class="txn-div" :value="signer" :handler-type="ComponentNames.publicKey" ></HandlerControl>
      </div>
    </div>

    <div class="flex">
      <p class="text-gray-500 mb-5 text-sm font-bold w-1/2">
        Transaction Details
      </p>
      <div class="w-1/2">
        <div class="flex justify-end text-xs py-2">Resolve data in this network</div>
        <div class="flex justify-end"><InputSwitch v-model="toggleResolve" /></div>
      </div>
      
    </div>

    <div>
      <div class="filter shadow-xl border border-gray-50 p-5 mb-15">

        <div v-for="(data, index) of innerTxns" class="mt-3 border border-gray-200 p-3">
          <div>Transaction {{ index + 1 }}</div>
          <div v-for="item of data" > 
            <DisplayValue style-class="table_div" :toggle-resolve="toggleResolve" :value="item"></DisplayValue>
          </div>
        </div>

        <div v-for="data in txnDetails">
          <DisplayValue style-class="txn-div" :toggle-resolve="toggleResolve" :value="data"></DisplayValue>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  MosaicLevy
} from "tsjs-xpx-chain-sdk";
import { computed, ref, toRefs, watch } from "vue";
import InputSwitch from 'primevue/inputswitch';
import "primevue/resources/themes/lara-light-blue/theme.css";
import HandlerControl from "../components/payloadDetails/HandlerControl.vue";
import {ComponentNames} from "../componentEnum";
import { TransactionUtils } from "@/util/transactionUtils";
import type { RowData } from "../../transaction/components/payloadDetails/IRowData";
import DisplayValue from "../../transaction/components/payloadDetails/DisplayValue.vue";
import { useRoute } from 'vue-router'

const route = useRoute()
const initialToggleResolveValue = route.query["resolveData"] ? 
                          route.query["resolveData"] as string : '';
const initialToggleResolve = initialToggleResolveValue.trim().toLowerCase() === "true";

const props = defineProps({
  payload: {
    type: String,
    required: true,
  },
});

const innerTxns = ref(<RowData[][]>[]);
const txnDetails = ref(<RowData[]>[]);
const commonTxnDetails = ref(<RowData[]>[]);
const innerTxnType = ref();
const toggleResolve = ref(initialToggleResolve);
const payloadNamespaceId = ref();
const isSignedTransaction = ref(false);
const signature = ref("");
const signer = ref("");
const innerTxnsCount = ref(0);

const {payload} = toRefs(props);

type configData = {
  key: string;
  value: any;
};

let populateInnerTransactionConfig = (config: any) => {
  let originConfigData: configData[] = [];

  for (const key in config) {
    if (Object.prototype.hasOwnProperty.call(config, key)) {
      const configData = config[key];

      originConfigData.push({ key, value: configData });
    }
  }

  for (const data of originConfigData) {
    config["innerTransactions." + data.key] = data.value;
  }
};

let txnHeaderProp = ["Type", "Deadline", "MaxFee", "Version"];
let ignoreList = [
  "transactionName",
  "version.signatureDScheme",
  "innerTransactions.transactionName",
  "innerTransactions.version.signatureDScheme",
  "innerTransactions.deadline",
  "innerTransactions.maxFee",
  "mosaicProperties.flags",
  "innerTransactions.mosaicProperties.flags"
];

let globalConfig = {
  "version.networkType": { value: (data: any) => NetworkType[data], secondaryValue: (data: any) => data.toString() },
  "version.txnTypeVersion": { value: (data: any) => data.toString() },
  "message.type": { value: (data: any) => MessageType[data] },
  "offers.type": { value: (data: any) => ExchangeOfferType[data] },
  "offers.offerType": { value: (data: any) => ExchangeOfferType[data] },
  "offers.mosaicId": { name: "SDA ID", handlerType: ComponentNames.assetID },
  "offers.cost": { handlerType: ComponentNames.fee },
  actionType: { value: (data: any) => AliasActionType[data] },
  linkAction: { value: (data: any) => LinkAction[data] },
  namespaceType: { value: (data: any) => NamespaceType[data] },
  hashType: { value: (data: any) => HashType[data] },
  mosaics: { name: "SDAs" },
  mosaicId: { name: "SDA ID", handlerType: ComponentNames.assetID },
  "modifications.type": { value: (data: any) => MultisigCosignatoryModificationType[data] },
  restrictionType: { value: (data: any) => RestrictionType[data] },
  direction: { value: (data: any) => MosaicSupplyType[data] },
  signatureDScheme: { value: (data: any) => DerivationScheme[data] },
  "cosignatures.signatureDScheme": { value: (data: any) => DerivationScheme[data] },
  "mosaicLevy.type": { value: (data: any) => MosaicLevyType[data] }
};

populateInnerTransactionConfig(globalConfig);

// console.log(globalConfig);

let extractTxnDataBasedOnClass = (data: any, key: string): RowData | null => {
  let classType = data.constructor.name;
  let typeOfData = typeof data;

  let finalData: string = "";
  let handlerType: string = "";

  // let displayData: RowData;

  if (classType === UInt64.name) {
    let d = data as UInt64;
    // finalData = d.toHex();
    finalData = BigInt("0x" + d.toHex()).toString();

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
    finalData = d.publicKey;
    handlerType = ComponentNames.publicKey;

    return {
      name: key,
      value: finalData,
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
    payloadNamespaceId.value = d;
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
      handlerType: handlerType
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
    let d = data as number;
    secondaryValue = d.toString();
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
    fullKey === "innerTransactions.offers.mosaicAmountGive"
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
    fullKey === "offers.mosaicAmountGet" ||
    fullKey === "innerTransactions.offers.mosaicAmountGet"
  ) {
    let refAssetId = wholeData.mosaicIdGet as MosaicId;
    let d = data as UInt64;

    return {
      name: key,
      value: d.toBigInt().toString(),
      secondaryValue: refAssetId.toHex(),
      handlerType: ComponentNames.assetAmount
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
    fullKey === "innerTransactions.mosaicProperties.duration"
  ) {
    let value = data as UInt64;
    if(!value || value.toBigInt() === BigInt(0)){
      return null;
    }else{
      return {
        name: key,
        value: `${value.toBigInt().toString()} blocks`
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

      if (data !== undefined) {
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

const getInnerTxns = (data: any[]) => {
  
  innerTxnsCount.value = 0;
  let temp = data.find((r)=> r.name === "InnerTransactions") ? data.find((r)=> r.name === "InnerTransactions").value: [];
  // console.log(temp);
  return temp;
};

const getTxnDetails = (data: RowData[])=>{

  return data.filter((RowData)=> !txnHeaderProp.includes(RowData.name) && RowData.name !== "InnerTransactions")
}

const getCommonDetails = (data: RowData[])=>{

return data.filter((RowData)=> txnHeaderProp.includes(RowData.name))
}

// const txnType = computed<any>(() => {
//   for (let item in allData) {
//     if (allData[item].name === "Type") {
//       return allData[item].secondaryValue;
//     }
//   }
// });

const decodePayload = (payload: string)=>{

  if (payload) {
    let txn= TransactionMapping.createFromPayload(payload);

    signature.value = payload.substring(8, 136);
    signer.value = payload.substring(136, 200);

    if(signature.value !== "0".repeat(128) && signer.value !== "0".repeat(64)){
      isSignedTransaction.value = true;
    }
    else{
      isSignedTransaction.value = false;
    }

    let allData = getData(txn, "", globalConfig);
    // console.log(allData);

    commonTxnDetails.value = getCommonDetails(allData);
    innerTxns.value = getInnerTxns(allData);
    txnDetails.value = getTxnDetails(allData);

    // console.log(txnDetails.value);
  }
}

decodePayload(payload.value);

watch(
  () => payload.value,
  (payload) => {
    decodePayload(payload);
  }
)

</script>

<style scoped lang="scss">
.txn-div,
.details {
  @apply text-gray-800 text-xs;

  > div {
    @apply flex items-center border-b border-gray-100 py-4;

    > div:first-child {
      @apply w-40 text-xs pl-4 flex-none;
    }

    > div:nth-child(2) {
      @apply text-xs grow;
    }

    > div:last-child {
      @apply border-none;
    }
  }
}

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
      @apply col-span-3;
    }
  }

  > div:nth-child(2n + 1) {
    @apply bg-gray-100;
  }
}

</style>

<style lang="scss">
.p-inputswitch .p-hidden-accessible{ 
  > input{
    transform: scale(0) !important;
  }
}
</style>