<template>
  <div v-if="isShowInvalid">
    <div class="p-3 bg-yellow-100 text-yellow-700">
      Metadata is not available in {{ networkName }}
    </div>
  </div>
  <div v-else-if="selectedMetadataDetail">
    <div class="text-gray-500 mb-1 text-sm font-bold">
      Metadata History
    </div>
    <div
      @click="toggleSelection = !toggleSelection"
      class="text-txs text-gray-400 font-normal mt-1"
    >
      <div class="flex">
        <div class="text-tsm font-bold">Select Metadata Record</div>
        <img
          src="@/assets/img/icon-caret-down-black.svg"
          class="ml-2 transition-all duration-200"
          :class="`${toggleSelection ? 'rotate-180 transform' : ''}`"
        />
      </div>
    </div>
    <div class="relative">
      <div
        v-if="toggleSelection"
        class="absolute border border-t-0 z-50 bg-white max-h-52 overflow-auto px-1 filter drop-shadow-xl pb-2"
      >
        <div
          v-if="totalMetadataList.length > 0"
          class="pl-2 pt-4 text-xxs text-gray-400"
        ></div>
        <div v-else class="text-xxs pt-2 pl-2 pb-2">The list is empty.</div>
        <div
          v-for="(items, index) in totalMetadataList"
          :key="index"
          class="px-2 py-3 flex cursor-pointer items-center hover:bg-gray-50 transition-all duration-300"
          @click="
            (selectedMetadata = index), (toggleSelection = !toggleSelection)
          "
          :class="`${
            index != totalMetadataList.length - 1
              ? 'border-b border-gray-200'
              : ''
          }`"
        >
          <div>
            <div class="text-xs font-semibold">{{ items }}</div>
          </div>
        </div>
      </div>
      <div v-if="!isShowInvalid && !selectedMetadataDetail">
        <div
          class="flex justify-center items-center border-gray-400 mt-10 mb-20"
        >
          <div
            class="animate-spin rounded-full h-5 w-5 border-b-2 border-navy-primary mr-2"
          ></div>
          <span class="text-tsm">Fetching Metadata Details</span>
        </div>
      </div>
      <div v-else class="mt-3">
        <div class="md:grid md:grid-cols-2">
          <div class="filter shadow-xl border border-gray-50 p-5 mb-15 md:mr-2">
            <div class="text-xs font-bold mb-5 ml-2">Overview</div>
            <div class="txn-div">
              <div
                class="py-4 text-xs grid grid-cols-5 border-b border-gray-100"
              >
                <div class="font-bold col-span-2">Scoped Metadata Key</div>
                <div class="flex flex-col">
                  <div class="uppercase">
                    {{ selectedMetadataDetail.scopedMetadataKeyHex }}
                    <div class="inline-block ml-2 font-semibold text-gray-400">
                      hex
                    </div>
                  </div>
                  <div>
                    {{ selectedMetadataDetail.scopedMetadataKeyUtf8 }}
                    <div class="inline-block ml-2 font-semibold text-gray-400">
                      utf-8
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="py-4 text-xs grid grid-cols-5 border-b border-gray-100"
              >
                <div class="font-bold col-span-2">Metadata Type</div>
                <div>{{ selectedMetadataDetail.type }}</div>
              </div>
              <div
                class="py-4 text-xs grid grid-cols-5 border-b border-gray-100"
              >
                <div class="font-bold col-span-2">Creation Value</div>
                <div>{{ selectedMetadataDetail.value }}</div>
              </div>
            </div>
          </div>
          <div class="filter shadow-xl border border-gray-50 p-5 mb-15 sm:ml-2">
            <div class="text-xs font-bold mb-5 ml-2">More Info</div>
            <div class="txn-div">
              <div
                class="py-4 text-xs grid grid-cols-5 border-b border-gray-100"
              >
                <div class="font-bold col-span-2">Owner's Public Key</div>
                <div class="break-all col-span-3">
                  {{ selectedMetadataDetail.accPublicKey }}
                </div>
              </div>
              <div v-if="isAssetId"
                class="py-4 text-xs grid grid-cols-5 border-b border-gray-100"
              >
                <div class="font-bold col-span-2">Asset Id</div>
                <div class="col-span-3">
                  {{ selectedMetadataDetail.assetId }}
                </div>
              </div>
              <div v-if="isNamespace"
                class="py-4 text-xs grid grid-cols-5 border-b border-gray-100"
              >
                <div class="font-bold col-span-2">Namespace</div>
                <div class="col-span-3">
                  {{ selectedMetadataDetail.namespace }}
                </div>
              </div>
              <div
                class="py-4 text-xs grid grid-cols-5 border-b border-gray-100"
              >
                <div class="font-bold col-span-2">Creation Block</div>
                <div class="col-span-3">
                  {{ selectedMetadataDetail.block }}
                </div>
              </div>
              <div
                class="py-4 text-xs grid grid-cols-5 border-b border-gray-100"
              >
                <div class="font-bold col-span-2">Creation Timestamp</div>
                <div class="col-span-3">
                  {{ selectedMetadataDetail.timestamp }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="filter shadow-xl border border-gray-50 p-5 mb-15">
        <MetadataComponent
          :metadata="displayMetadataTable"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, ref, watch } from "vue";
import { Helper } from "@/util/typeHelper";
import { networkState } from "@/state/networkState";
import {
  AccountMetadataTransaction,
  Convert,
  Deadline,
  MetadataEntry,
  MetadataType,
  MosaicMetadataTransaction,
  NamespaceMetadataTransaction,
  TransactionGroupType,
  TransactionType,
} from "tsjs-xpx-chain-sdk";
import { TransactionUtils } from "@/util/transactionUtils";
import { AppState } from "@/state/appState";
import MetadataComponent from "@/modules/metadata/components/MetadataComponent.vue";
import { MetadataUtils, type MetadataHistoryObj } from "@/util/metadataUtil";

const props = defineProps({
  compositeHash: {
    type: String,
    required: true,
  },
});

const internalInstance = getCurrentInstance();
const emitter = internalInstance?.appContext.config.globalProperties.emitter;
const isShowInvalid = ref(true);
const toggleSelection = ref(false);
const metadataHistory = ref<any[]>([]);
const metadata = ref<string | null>(null);
const allMetadata = ref<string | null>(null);
const displayMetadataTable = ref<MetadataHistoryObj[]>([]);
const selectedMetadataDetail = ref<MetadataHistoryObj | null>(null)
const totalMetadataList = ref<any[]>([])
const selectedMetadata = ref<number>(0)
const metadataHistoryType = ref<string>("");
const isAssetId = ref<boolean>(false);
const isNamespace = ref<boolean>(false);

const handleScroll = () => {
    toggleSelection.value = false
};

const networkName = computed(() => {
  return networkState.chainNetworkName;
});

const checkMetadataDetail = async () => {
  if (!AppState.isReady) {
    setTimeout(checkMetadataDetail, 1000);
  }
  if (!props.compositeHash) {
    isShowInvalid.value = true;
    return;
  }
  let metadataDetail = await AppState.chainAPI?.metadataAPI.getMetadata(
    props.compositeHash
  );
  if (metadataDetail) {
    return metadataDetail;
  }
};

const fetchMetadataTxns = async (metadata: MetadataEntry) => {
  let metadataTxns = [];
  let txnQueryParams = Helper.createTransactionQueryParams();
  txnQueryParams.embedded = true;
  txnQueryParams.publicKey = metadata.targetKey;
  switch (metadata.metadataType) {
    case MetadataType.ACCOUNT:
      txnQueryParams.type = [TransactionType.ACCOUNT_METADATA_V2];
      metadataHistoryType.value = "Account";
      break;
    case MetadataType.MOSAIC:
      txnQueryParams.type = [TransactionType.MOSAIC_METADATA_V2];
      metadataHistoryType.value = "Mosaic";
      break;
    case MetadataType.NAMESPACE:
      txnQueryParams.type = [TransactionType.NAMESPACE_METADATA_V2];
      metadataHistoryType.value = "Namespace";
      break;
    default:
      txnQueryParams.type = undefined;
      break;
  }
  const searchResult = await TransactionUtils.searchTransactions(
    TransactionGroupType.CONFIRMED,
    txnQueryParams
  );
  for (const txn of searchResult.transactions) {
    let currentTxn = null;
    switch (txn.type) {
      case TransactionType.ACCOUNT_METADATA_V2:
        currentTxn = txn as AccountMetadataTransaction;
        break;
      case TransactionType.MOSAIC_METADATA_V2:
        currentTxn = txn as MosaicMetadataTransaction;
        break;
      case TransactionType.NAMESPACE_METADATA_V2:
        currentTxn = txn as NamespaceMetadataTransaction;
        break;
      default:
        currentTxn = null;
        break;
    }
    if (currentTxn) {
      if (
        currentTxn.scopedMetadataKey.toHex() ===
        metadata.scopedMetadataKey.toHex()
      ) {
        metadataTxns.push(currentTxn);
      }
    }
  }
  return metadataTxns;
};

const loadMetadataTxns = async () => {
  let metadataResult = await checkMetadataDetail();
  if (metadataResult) {
    let getMetadataTxns = await fetchMetadataTxns(metadataResult);
    for(let i = 0; i < getMetadataTxns.length; i++){
      totalMetadataList.value.push(`Metadata ${i + 1}`)
    }
    isShowInvalid.value = false;
    return getMetadataTxns;
  } else {
    return [];
  }
};

const loadSelectedMetadataHistory = async () => {
    let selectedMetadataTxn = metadataHistory.value[selectedMetadata.value]
    let blockHeight = selectedMetadataTxn.transactionInfo!.height.compact()
    const blockInfo = await AppState.chainAPI!.blockAPI.getBlockByHeight(
      blockHeight
    );
    selectedMetadataDetail.value = {
      block: blockInfo.height.compact(),
      timestamp: Helper.convertDisplayDateTimeFormat24(new Date(blockInfo.timestamp.compact() + Deadline.timestampNemesisBlock * 1000).toISOString()),
      scopedMetadataKeyHex: selectedMetadataTxn.scopedMetadataKey.toHex(),
      scopedMetadataKeyUtf8: MetadataUtils.convertUtf8(
        selectedMetadataTxn.scopedMetadataKey.toHex()
      ),
      accPublicKey: selectedMetadataTxn.targetPublicKey.publicKey,
      assetId: getMetadataAssetId(selectedMetadataTxn),
      namespace: await getMetadataNamespace(selectedMetadataTxn),
      type: metadataHistoryType.value,
      value: await selectedValueChangeMetadata()
    }
  }

const loadAllMetadataHistory = async () => {
  let allMetadataTxn = metadataHistory.value;
  for (const metadataTxn of allMetadataTxn) {
    let blockHeight = metadataTxn.transactionInfo!.height.compact();
    const blockInfo = await AppState.chainAPI!.blockAPI.getBlockByHeight(
      blockHeight
    );
    displayMetadataTable.value.push({
      block: blockInfo.height.compact(),
      timestamp: Helper.convertDisplayDateTimeFormat24(
        new Date(
          blockInfo.timestamp.compact() + Deadline.timestampNemesisBlock * 1000
        ).toISOString()
      ),
      scopedMetadataKeyHex: metadataTxn.scopedMetadataKey.toHex(),
      scopedMetadataKeyUtf8: MetadataUtils.convertUtf8(
        metadataTxn.scopedMetadataKey.toHex()
      ),
      accPublicKey: metadataTxn.targetPublicKey.publicKey,
      assetId: getMetadataAssetId(metadataTxn),
      namespace: await getMetadataNamespace(metadataTxn),
      type: metadataHistoryType.value,
      value: await allValueChangeMetadata(metadataTxn),
    });
  }
};

const getMetadataAssetId = (metadataTxn: any) => {
  if (metadataTxn.targetMosaicId) {
    isAssetId.value = true;
    return metadataTxn.targetMosaicId.toHex();
  } else {
    return null;
  }
};

const getMetadataNamespace = async (metadataTxn: any) => {
  if (metadataTxn.targetNamespaceId) {
    isNamespace.value = true;
    const nsName = await AppState.chainAPI!.namespaceAPI.getNamespacesName([
      metadataTxn.targetNamespaceId,
    ]);
    return nsName[0].name;
  } else {
    return null;
  }
};

const selectedValueChangeMetadata = async () => {
  let txns = metadataHistory.value
  for(let i = 0; i<= selectedMetadata.value; i++){
    if (!metadata.value) {
      const newValue = TransactionUtils.applyValueChange(
        "",
        Convert.uint8ArrayToHex(
          txns[i].valueDifferences
        ),
        txns[i].valueSizeDelta
      );
      metadata.value = newValue
    }
    else{
      const newValue = TransactionUtils.applyValueChange(
        metadata.value,
        Convert.uint8ArrayToHex(
          txns[i].valueDifferences
        ),
        txns[i].valueSizeDelta
      );
      metadata.value = newValue
    }
  }
  return metadata.value? metadata.value : ""
}

const allValueChangeMetadata = async (metadataTxn: any) => {
  if (!allMetadata.value) {
    const newValue = TransactionUtils.applyValueChange(
      "",
      Convert.uint8ArrayToHex(metadataTxn.valueDifferences),
      metadataTxn.valueSizeDelta
    );
    allMetadata.value = newValue;
  } else {
    const newValue = TransactionUtils.applyValueChange(
      allMetadata.value,
      Convert.uint8ArrayToHex(metadataTxn.valueDifferences),
      metadataTxn.valueSizeDelta
    );
    allMetadata.value = newValue;
  }
  return allMetadata.value ? allMetadata.value : "";
};

const init = async () => {
  metadataHistory.value = await loadMetadataTxns();
  loadSelectedMetadataHistory()
  loadAllMetadataHistory();
};

init();

watch(selectedMetadata, (newValue,oldValue)=>{
    if(newValue !== oldValue){
      metadata.value = null
      loadSelectedMetadataHistory()
    }
  })
  window.addEventListener('scroll', handleScroll);

emitter.on("CHANGE_NETWORK", (payload: boolean) => {
  if (payload) {
    isShowInvalid.value = true;
    selectedMetadata.value = 0
    metadata.value = null;
    allMetadata.value = null;
    totalMetadataList.value = []
    metadataHistory.value = [];
    displayMetadataTable.value = [];
    selectedMetadataDetail.value = null
    init();
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.txn-div {
  @apply text-gray-800 text-xs;

  > div {
    @apply flex justify-start items-center border-b border-gray-100 py-4;

    > div:first-child {
      @apply w-36 text-xs pl-2 pr-6 font-bold;
    }

    > div:nth-child(2) {
      @apply text-xs;
    }

    > div:nth-child(3) {
      @apply pl-4 w-32 text-xs font-bold;
    }

    > div:last-child {
      @apply border-none;
    }
  }
}
</style>
