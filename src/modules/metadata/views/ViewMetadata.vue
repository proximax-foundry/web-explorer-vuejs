<template>
  <div v-if="isShowInvalid">
    <div class="p-3 bg-yellow-100 text-yellow-700">
      Metadata is not available in {{ networkName }}
    </div>
  </div>
  <div v-else>
    <div class="text-gray-500 mb-1 text-sm font-bold">Metadata History</div>
    <div v-if="!isShowInvalid && !latestMetadataDetail">
      <div class="flex justify-center items-center border-gray-400 mt-10 mb-20">
        <div
          class="animate-spin rounded-full h-5 w-5 border-b-2 border-navy-primary mr-2"
        ></div>
        <span class="text-tsm">Fetching Metadata Details</span>
      </div>
    </div>
    <div v-else-if="latestMetadataDetail" class="mt-3">
      <div class="md:grid md:grid-cols-2">
        <div class="filter shadow-xl border border-gray-50 p-5 mb-15 md:mr-2">
          <div class="text-xs font-bold mb-5 ml-2">Overview</div>
          <div class="txn-div">
            <div class="py-4 text-xs grid grid-cols-5 border-b border-gray-100">
              <div class="font-bold col-span-2">Owner's Public Key</div>
              <div class="break-all col-span-3">
                {{ latestMetadataDetail.accPublicKey }}
              </div>
            </div>
            <div
              v-if="isAssetId"
              class="py-4 text-xs grid grid-cols-5 border-b border-gray-100"
            >
              <div class="font-bold col-span-2">Asset Id</div>
              <div class="col-span-3">
                {{ latestMetadataDetail.assetId }}
              </div>
            </div>
            <div
              v-if="isNamespace"
              class="py-4 text-xs grid grid-cols-5 border-b border-gray-100"
            >
              <div class="font-bold col-span-2">Namespace</div>
              <div class="col-span-3">
                {{ latestMetadataDetail.namespace }}
              </div>
            </div>
            <div class="py-4 text-xs grid grid-cols-5 border-b border-gray-100">
              <div class="font-bold col-span-2">Scoped Metadata Key</div>
              <div class="flex flex-col">
                <div class="flex flex-row">
                  <div class="uppercase">
                    {{ latestMetadataDetail.scopedMetadataKeyHex }}
                  </div>
                  <div class="inline-block ml-2 font-semibold text-gray-400">
                    hex
                  </div>
                </div>
                <div>
                  {{ latestMetadataDetail.scopedMetadataKeyUtf8 }}
                  <div class="inline-block ml-2 font-semibold text-gray-400">
                    utf-8
                  </div>
                </div>
              </div>
            </div>
            <div class="py-4 text-xs grid grid-cols-5 border-b border-gray-100">
              <div class="font-bold col-span-2">Metadata Type</div>
              <div>{{ latestMetadataDetail.type }}</div>
            </div>
            <div class="py-4 text-xs grid grid-cols-5 border-b border-gray-100">
              <div class="font-bold col-span-2">Current Value</div>
              <div>{{ latestMetadataDetail.value }}</div>
            </div>
          </div>
        </div>
        <div class="filter shadow-xl border border-gray-50 p-5 mb-15 sm:ml-2">
          <div class="text-xs font-bold mb-5 ml-2">More Info</div>
          <div class="txn-div">
            <div class="py-4 text-xs grid grid-cols-5 border-b border-gray-100">
              <div class="font-bold col-span-2">Creation Block</div>
              <div class="col-span-3">
                {{ latestMetadataDetail.block }}
              </div>
            </div>
            <div class="py-4 text-xs grid grid-cols-5 border-b border-gray-100">
              <div class="font-bold col-span-2">Creation Timestamp</div>
              <div class="col-span-3">
                {{ latestMetadataDetail.timestamp }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="filter shadow-xl border border-gray-50 p-5 mb-15">
      <MetadataComponent :metadata="displayMetadataTable" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, ref } from "vue";
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
const isShowInvalid = ref(false);
const metadataHistory = ref<any[]>([]);
const metadata = ref<string | null>(null);
const allMetadata = ref<string | null>(null);
const displayMetadataTable = ref<MetadataHistoryObj[]>([]);
const latestMetadataDetail = ref<MetadataHistoryObj | null>(null);
const metadataHistoryType = ref<string>("");
const isAssetId = ref<boolean>(false);
const isNamespace = ref<boolean>(false);

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
  } else {
    isShowInvalid.value = true;
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
      metadataHistoryType.value = "Asset";
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
    return getMetadataTxns;
  } else {
    return [];
  }
};

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
  latestMetadataDetail.value =
    displayMetadataTable.value[displayMetadataTable.value.length - 1];
  isShowInvalid.value = false;
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
  loadAllMetadataHistory();
};

init();

emitter.on("CHANGE_NETWORK", (payload: boolean) => {
  if (payload) {
    isShowInvalid.value = true;
    metadata.value = null;
    allMetadata.value = null;
    metadataHistory.value = [];
    displayMetadataTable.value = [];
    latestMetadataDetail.value = null;
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
