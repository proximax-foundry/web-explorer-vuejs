<template>
  <div>
    <p class="text-gray-500 mb-5 text-sm font-bold">Common Transaction Details</p>
    <div class="filter shadow-xl border border-gray-50 p-5 mb-15">
      <div v-for="data in allData">
        <div v-if="txnHeaderProp.includes(data.name)">
          <div v-if="(data.value instanceof Array)">
            <div v-for="item in data.value" class="txn-div">
              <div>
                <div>{{ item.name }}</div>
                <div>{{ item.value }}</div>
              </div>
            </div>
          </div>
          <div v-else class="txn-div">
            <div v-if="data.name === 'Type'">
              <div>{{ data.name }}</div>
              <div>
                {{ data.value }}
                <span class="text-xxs text-gray-500">({{ data.secondaryValue }})</span>
              </div>
            </div>
            <div v-else>
              <div>{{ data.name }}</div>
              <div>{{ data.value }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex">
      <p class="text-gray-500 mb-5 text-sm font-bold w-full">Extra Transaction Details</p>
      <button class="bg-blue-500 hover:bg-blue-70 font-bold py-2 px-4 rounded-full"
        @click="toggleConvert = !toggleConvert">Convert</button>
    </div>

    <div>
      <div class="filter shadow-xl border border-gray-50 p-5 mb-15">
        <div v-for="data in allData">
          <div v-if="!txnHeaderProp.includes(data.name)">
            <div v-if="(data.value instanceof Array)">
              <div v-if="data.name === 'Message'" class="txn-div">
                <div v-if="messagePayload[1] !== ''">
                  <div>{{ messagePayload[0] }}</div>
                  <div>{{ messagePayload[1] }}</div>
                </div>
              </div>
              <div v-else-if="data.name === 'SDAs'" class="txn-div">
                <div v-if="!toggleConvert">
                  <div>{{ data.name }}</div>
                  <div class="relative">
                    <div v-for="item in data.value">
                      <router-link :to="{ name: 'ViewAsset', params: { id: item.value.toString() } }"
                        class="hover:text-blue-primary hover:underline">{{ item.value }}</router-link>
                      <span class="text-xxs text-gray-500">({{ item.secondaryValue }})</span>
                    </div>
                  </div>
                </div>
                <div v-else-if="toggleConvert">
                  <SdasHandler :txnDetail="data" />
                </div>
              </div>
              <div v-else-if="data.name === 'InnerTransactions'">
                <div v-for="(n, index) in innerTxns" class="mt-3 border border-gray-200 p-3">
                  <div v-for="item in innerTxns[index]">
                    <div v-if="(item.value instanceof Array)">
                      <div v-if="item.name === 'Message'" class="table_div">
                        <div v-if="messagePayload[1] !== ''">
                          <div>{{ messagePayload[0] }}</div>
                          <div>{{ messagePayload[1] }}</div>
                        </div>
                      </div>
                      <div v-else-if="item.name === 'SDAs'" class="table_div">
                        <div>
                          <div>{{ item.name }}</div>
                          <div class="relative">
                            <div v-for="childItem in item.value">
                              <router-link :to="{ name: 'ViewAsset', params: { id: childItem.value.toString() } }"
                                class="hover:text-blue-primary hover:underline">{{ childItem.value }}</router-link>
                              <span class="text-xxs text-gray-500">({{ childItem.secondaryValue }})</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-else>
                        <div v-for="childItem in item.value" class="table_div">
                          <div>
                            <div>{{ childItem.name }}</div>
                            <div>{{ childItem.value }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else class="table_div">
                      <div v-if="item.name === 'Type'">
                        <div>{{ item.name }}</div>
                        <div>
                          {{ item.value }}
                          <span class="text-xxs text-gray-500">({{ item.secondaryValue }})</span>
                        </div>
                      </div>
                      <div v-else-if="item.name === 'SDA'">
                        <div>{{ item.name }}</div>
                        <div>
                          <router-link :to="{ name: 'ViewAsset', params: { id: item.value } }"
                            class="hover:text-blue-primary hover:underline">{{ item.value }}
                          </router-link>
                          <span class="text-xxs text-gray-500" v-if="item.secondaryValue">({{ item.secondaryValue
                          }})</span>
                        </div>
                      </div>
                      <div
                        v-else-if="item.name === 'Signer' || item.name === 'Recipient' || item.name === 'TargetPublicKey'">
                        <div>{{ item.name }}</div>
                        <div>
                          <router-link id="account" :to="{
                            name: 'ViewAccount',
                            params: { accountParam: item.value },
                          }" class="hover:text-blue-primary hover:underline text-blue-600">
                            {{ item.value }}
                          </router-link>
                        </div>
                      </div>
                      <div v-else>
                        <div>{{ item.name }}</div>
                        <div>{{ item.value }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <div v-for="item in data.value" class="txn-div">
                  <div>
                    <div>{{ item.name }}</div>
                    <div>{{ item.value }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="txn-div">
              <div v-if="data.name === 'Type'">
                <div>{{ data.name }}</div>
                <div>
                  {{ data.value }}
                  <span class="text-xxs text-gray-500">({{ data.secondaryValue }})</span>
                </div>
              </div>
              <div v-else-if="data.name === 'SDA'">
                <div>{{ data.name }}</div>
                <div>
                  <router-link :to="{ name: 'ViewAsset', params: { id: data.value } }"
                    class="hover:text-blue-primary hover:underline">{{ data.value }}
                  </router-link>
                  <span class="text-xxs text-gray-500" v-if="data.secondaryValue">({{ data.secondaryValue }})</span>
                </div>
              </div>
              <div v-else-if="data.name === 'Recipient' || data.name === 'TargetPublicKey' || data.name === 'Address'">
                <div>{{ data.name }}</div>
                <div>
                  <router-link id="account" :to="{
                    name: 'ViewAccount',
                    params: { accountParam: data.value },
                  }" class="hover:text-blue-primary hover:underline text-blue-600">
                    {{ data.value }}
                  </router-link>
                </div>
              </div>
              <div v-else-if="data.name === 'NamespaceName'">
                <div>{{ data.name }}</div>
                <div>
                  <router-link :to="{
                    name: 'ViewNamespace',
                    params: { namespaceParam: data.value },
                  }" class="text-blue-600 hover:text-blue-primary hover:underline">
                    {{ data.value }}
                  </router-link>
                </div>
              </div>
              <div v-else>
                <div>{{ data.name }}</div>
                <div>{{ data.value }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { TransactionUtils } from '@/util/transactionUtils';
import { Address, Convert, Deadline, Id, MessageType, TransactionType, Mosaic, MosaicId, NamespaceId, NetworkType, PublicAccount, Transaction, TransactionMapping, UInt64, AliasActionType, NamespaceType } from 'tsjs-xpx-chain-sdk';
import { ref } from 'vue';
import SdasHandler from '../components/payloadDetails/SdasHandler.vue';

const props = defineProps({
  payload: {
    type: Uint8Array,
    required: true,
  }
});

const txn = ref();
const innerTxns = ref();
const messagePayload = ref()
const toggleConvert = ref(false);
const txnDetail = ref<any>({});

const convertPayload = Convert.uint8ArrayToHex(props.payload)

if (convertPayload) {
  txn.value = TransactionMapping.createFromPayload(convertPayload)
}

type configData = {
  key: string;
  value: any
}

let populateInnerTransactionConfig = (config: any) => {

  let originConfigData: configData[] = [];

  for (const key in config) {
    if (Object.prototype.hasOwnProperty.call(config, key)) {

      const configData = config[key];

      originConfigData.push({ key, value: configData });
    }
  }

  for (const data of originConfigData) {
    config["innerTransactions." + data.key] = data.value
  }
}

interface rowData {
  name: string;
  value: string | rowData[];
  secondaryValue?: string;
  handlerType?: string;
}


let txnHeaderProp = ["Type", "Deadline", "MaxFee", "Version"];
let ignoreList = ["transactionName", "version.dScheme",
  "innerTransactions.transactionName",
  "innerTransactions.version.dScheme",
  "innerTransactions.deadline", "innerTransactions.maxFee"];

let globalConfig = {
  "version.networkType": { value: (data: any) => NetworkType[data] },
  "message.type": { value: (data: any) => MessageType[data] },
  "mosaics": { name: "SDAs", handlerType: "assets" },
  "mosaicId": { name: "SDA", handlerType: "assetID" },
};

populateInnerTransactionConfig(globalConfig);

// console.log(globalConfig);

let extractTxnDataBasedOnClass = (data: any, key: string): rowData | null => {

  let classType = data.constructor.name;
  let typeOfData = typeof data;

  let finalData: string = "";
  let handlerType: string = "";

  // let displayData: rowData;

  if (classType === UInt64.name) {
    let d = data as UInt64;
    // finalData = d.toHex();
    finalData = BigInt("0x" + d.toHex()).toString();

    return {
      name: key,
      value: finalData
    };
  }
  else if (classType === Id.name) {
    let d = data as Id;
    finalData = d.toHex();

    return {
      name: key,
      value: finalData
    };
  }
  else if (classType === Deadline.name) {
    let d = data as Deadline;
    finalData = new Date(d.value!.toJSON()).toJSON();

    return {
      name: key,
      value: finalData
    };
  }
  else if (classType === PublicAccount.name) {
    let d = data as PublicAccount;
    finalData = d.publicKey;
    handlerType = "publicKey";

    return {
      name: key,
      value: finalData
    };
  }
  else if (classType === Address.name) {
    let d = data as Address;
    finalData = d.pretty();
    handlerType = "address";

    return {
      name: key,
      value: finalData
    };
  }
  else if (classType === NamespaceId.name) {
    let d = data as NamespaceId;
    finalData = d.toHex();
    handlerType = "namespace";

    return {
      name: key,
      value: finalData
    };
  }
  else if (classType === MosaicId.name) {
    let d = data as MosaicId;
    finalData = d.toHex();
    handlerType = "asset";

    return {
      name: key,
      value: finalData
    };
  }
  else if (classType === Uint8Array.name) {
    let d = data as Uint8Array;
    finalData = "0x" + Convert.uint8ArrayToHex(d);

    return {
      name: key,
      value: finalData
    };
  }
  else if (classType === Mosaic.name) {
    let d = data as Mosaic;
    finalData = d.id.toHex();

    return {
      name: "SDA",
      value: finalData,
      secondaryValue: BigInt("0x" + d.amount.toHex()).toString(),
      handlerType: "asset"
    };
  }

  return null;
}

let getPropData = (data: any, key: string, fullKey: string, wholeData: Transaction): rowData | null => {

  let finalData: string = "";
  let secondaryValue: string = "";

  if (fullKey === "type" || fullKey === "innerTransactions.type") {
    let d = data as number;
    secondaryValue = d.toString();
    finalData = wholeData.transactionName;

    return {
      name: key,
      value: finalData,
      secondaryValue: secondaryValue
    };
  }
  else if (fullKey === "maxFee") {
    let d = data as UInt64;
    finalData = BigInt("0x" + d.toHex()).toString();

    return {
      name: key,
      value: finalData,
      handlerType: "fee_amount"
    };
  }
  else if (fullKey === "scopedMetadataKey" || fullKey === "innerTransactions.scopedMetadataKey") {
    let d = data as UInt64;
    finalData = "0x" + d.toHex();

    return {
      name: key,
      value: finalData
    };
  }

  return null;
}

let getData = (classData: any, parent: string = "", globalConfig: any): rowData[] => {

  let displayData: rowData[] = [];
  // console.log("Parent: " + parent);

  for (const key in classData) {
    if (Object.prototype.hasOwnProperty.call(classData, key)) {

      const data = classData[key];
      const currentPropString = parent ? parent + "." + key : key;

      if (ignoreList.includes(currentPropString)) {
        continue;
      }

      let keyName = key.charAt(0).toUpperCase() + key.slice(1);

      if (globalConfig[currentPropString] && globalConfig[currentPropString].name) {
        keyName = globalConfig[currentPropString].name;
      }

      if (data !== undefined) {
        let rowInnerData = getPropData(data, keyName, currentPropString, classData);

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

          let groupedPropData: rowData[] = [];

          for (let innerData of data) {

            let row = extractTxnDataBasedOnClass(innerData, keyName);

            if (row) {
              groupedPropData = groupedPropData.concat(row);

              continue;
            }

            let groupedData = getData(innerData, currentPropString, globalConfig);

            if (groupedData) {

              groupedPropData = groupedPropData.concat(groupedData);

              continue;
            }
          }

          let handlerType = key == "innerTransactions" ? "innerTxns" : "";

          if (!handlerType) {
            handlerType = (globalConfig[currentPropString] && globalConfig[currentPropString].handlerType) ? globalConfig[currentPropString].handlerType : "";
          }

          let row: rowData = {
            name: keyName,
            value: groupedPropData,
            handlerType: handlerType
          };

          displayData.push(row);

          continue;
        }
        else if (typeOfData === "object") {

          let row = extractTxnDataBasedOnClass(data, keyName);

          if (row) {
            // let row: rowData = {
            //     name: keyName,
            //     value: finalData,
            //     handlerType: handlerType
            // };

            displayData.push(row);

            continue;
          }

          let groupedData = getData(data, currentPropString, globalConfig);

          row = {
            name: keyName,
            value: groupedData
          };

          displayData.push(row);
        }
        else {
          let row: rowData = {
            name: keyName,
            value: data
          };

          if (globalConfig[currentPropString] && typeof globalConfig[currentPropString].value === "function") {
            row.value = globalConfig[currentPropString].value(row.value);
          }

          displayData.push(row);
        }
      }

    }
  }

  return displayData;
}

let allData = getData(txn.value, "", globalConfig);


const getMessage = (data: any) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].name === "Message") {
      let messageArray = data[i].value.map((x: { value: any; }) => x.value)
      return messageArray
    }
    else if (data[i].name === "InnerTransactions") {
      for (let item in data[i].value) {
        if (data[i].value[item].name === "Message") {
          let messageArray = data[i].value[item].value.map((x: { value: any; }) => x.value)
          return messageArray
        }
      }
    }
  }
}

const getInnerTxns = (data: any) => {
  let innerTxnArray: any[] = []
  let tempArray = []
  for (let i = 0; i < data.length; i++) {
    if (data[i].name === "InnerTransactions") {
      for (let item in data[i].value) {
        if (tempArray[0]?.name === data[i].value[item].name) {
          innerTxnArray.push(tempArray)
          tempArray = []
        }
        tempArray.push(data[i].value[item])
      }
    }
  }
  innerTxnArray.push(tempArray)
  return innerTxnArray
}

const getAliasTxn = async (data: any, type: number) => {
  let txn = <{
    address: string,
    aliasType: number,
    aliasTypeName: string,
    aliasName: string,
    assetId: string
  }>{}
  if (type === TransactionType.ADDRESS_ALIAS) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].name === "Address") {
        txn.address = data[i].value;
      }
      else if (data[i].name === "ActionType") {
        txn.aliasType = data[i].value;
        txn.aliasTypeName =
          data[i].value === AliasActionType.Link ? "Link" : "Unlink";
      }
      else if (data[i].name === "NamespaceId") {
        const nsId = data[i].value;
        try {
          const nsName = await TransactionUtils.getNamespacesName([nsId]);
          console.log(nsName)
          txn.aliasName = nsName[0].name;
        } catch (error) { }
      }
    }
  }
  else if (type === TransactionType.MOSAIC_ALIAS) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].name === "SDA") {
        txn.assetId = data[i].value;
      }
      else if (data[i].name === "ActionType") {
        txn.aliasType = data[i].value;
        txn.aliasTypeName =
          data[i].value === AliasActionType.Link ? "Link" : "Unlink";
      }
      else if (data[i].name === "NamespaceId") {
        const namespaceId: NamespaceId = data[i].value
        const nsId = namespaceId;
        try {
          const nsName = await TransactionUtils.getNamespacesName([nsId]);
          console.log(nsName)
          txn.aliasName = nsName[0].name;
        } catch (error) { console.log(error) }
      }
    }
  }
  return txn
}

const getNamespaceTxn = async (data: any) => {
  let txn = <{
    namespaceName: string,
    namespaceId: string,
    duration: number,
    registerType: number,
    registerTypeName: string,
    parentId: string,
    parentName: string
  }>{}
  for (let i = 0; i < data.length; i++) {
    if (data[i].name === "NamespaceName") {
      txn.namespaceName = data[i].value;
    }
    else if (data[i].name === "NamespaceId") {
      txn.namespaceId = data[i].value;
    }
    else if (data[i].name === "NamespaceType") {
      if (data[i].value === NamespaceType.RootNamespace) {
        txn.registerType = NamespaceType.RootNamespace;
        txn.registerTypeName = "Root namespace";
      }
    }
    else if (data[i].name === "Duration") {
      txn.duration = data[i].value;
    }
    /*
    if (registerTxn.parentId) {
      txn.registerType = NamespaceType.SubNamespace;
      txn.registerTypeName = "Sub namespace";
      txn.parentId = registerTxn.parentId.toHex();
      const namespaceName = await TransactionUtils.getNamespacesName([
        registerTxn.parentId,
      ]);
      txn.parentName = namespaceName[0].name;
    }*/
  }
  return txn
}

console.log(allData)

messagePayload.value = getMessage(allData)

const loadFormatTransaction = async (data: any) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].name === "Type") {
      const txnType = Number(data[i].secondaryValue)
      switch (txnType) {
        case TransactionType.TRANSFER:
          break;
        case TransactionType.ADDRESS_ALIAS:
        case TransactionType.MOSAIC_ALIAS:
          txnDetail.value = {
            detail: await getAliasTxn(data, txnType)
          };
          break;
        case TransactionType.REGISTER_NAMESPACE:
          txnDetail.value = {
            detail: await getNamespaceTxn(data)
          };
          break;
      }
      break;
    }
  }
  console.log(txnDetail.value.detail)
}

loadFormatTransaction(allData)

innerTxns.value = getInnerTxns(allData)
</script>

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
      @apply text-xs;
    }

    >div:last-child {
      @apply border-none;
    }
  }
}

.table_div {
  @apply text-xs;

  >div {
    @apply grid grid-cols-4;

    >div {
      @apply p-2;
    }

    >div:first-child {
      @apply text-blue-primary font-bold;
    }

    >div:nth-child(2) {
      @apply break-all col-span-3;
    }
  }

  >div:nth-child(2n + 1) {
    @apply bg-gray-100;
  }
}
</style>