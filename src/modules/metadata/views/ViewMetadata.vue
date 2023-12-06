<template>
  <div v-if="selectedMetadataDetail">
      <div class="text-gray-500 mb-1 text-sm font-bold">
        {{ totalMetadataList[selectedMetadata] }}
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
        >
        </div>
        <div v-else class="text-xxs pt-2 pl-2 pb-2">The list is empty.</div>
        <div
          v-for="(items, index) in totalMetadataList"
          :key="index"
          class="px-2 py-3 flex cursor-pointer items-center hover:bg-gray-50 transition-all duration-300"
          @click="selectedMetadata = index, toggleSelection = !toggleSelection"
          :class="`${
            index != totalMetadataList.length - 1 ? 'border-b border-gray-200' : ''
          }`"
        >
          <div>
            <div class="text-xs font-semibold">{{ items }}</div>
          </div>
        </div>
        </div>
    </div>
    <div v-if="isShowInvalid">
      <div class="p-3 bg-yellow-100 text-yellow-700">
        Metadata is not available in {{ networkName }}
      </div>
    </div>
    <div v-else-if="!isShowInvalid  && !selectedMetadataDetail">
      <div class="flex justify-center items-center border-gray-400 mt-10 mb-20">
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
            <div class="py-4 text-xs grid grid-cols-5 border-b border-gray-100">
              <div class="font-bold col-span-2">Scoped Metadata Key</div>
              <div class="font-bold uppercase">{{ selectedMetadataDetail.scopedMetadataKeyHex }}</div>
            </div>
            <div class="py-4 text-xs grid grid-cols-5 border-b border-gray-100">
              <div class="font-bold col-span-2">Value</div>
              <div class="font-bold">{{ selectedMetadataDetail.value }}</div>
            </div>
          </div>
        </div>
        <div class="filter shadow-xl border border-gray-50 p-5 mb-15 sm:ml-2">
          <div class="text-xs font-bold mb-5 ml-2">More Info</div>
          <div class="txn-div">
            <div class="py-4 text-xs grid grid-cols-5 border-b border-gray-100">
              <div class="font-bold col-span-2">Block</div>
              <div class="col-span-3">
                {{ selectedMetadataDetail.block }}
              </div>
            </div>
            <div class="py-4 text-xs grid grid-cols-5 border-b border-gray-100">
              <div class="font-bold col-span-2">Timestamp</div>
              <div class="col-span-3">{{ selectedMetadataDetail.timestamp }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup lang="ts">
  import { computed, getCurrentInstance, ref, watch } from "vue";
  import { Helper } from "@/util/typeHelper";
  import { networkState } from "@/state/networkState";
  import { AccountMetadataTransaction, Convert, Deadline, TransactionGroupType, TransactionType } from "tsjs-xpx-chain-sdk";
  import { TransactionUtils } from "@/util/transactionUtils";
  import { AppState } from "@/state/appState";
  
  const props = defineProps({
    publicKey: String,
    scopedMetadataKeyHex: {
      type: String,
      required: true,
    },
  });

  interface MetadataObj {
    block: number;
    timestamp: string;
    scopedMetadataKeyHex: string;
    value: string;
  }
  const internalInstance = getCurrentInstance();
  const emitter = internalInstance?.appContext.config.globalProperties.emitter;
  const isShowInvalid = ref(false);
  const toggleSelection = ref(false);
  const metadataHistory = ref<AccountMetadataTransaction[]>([])
  const metadata = ref<string | null>(null)
  const selectedMetadataDetail = ref(<MetadataObj>{})
  const totalMetadataList = ref<any[]>([])
  const selectedMetadata = ref<number>(0)
  
  const networkName = computed(() => {
    return networkState.chainNetworkName;
  });

  const loadAccMetadataTxns = async () => {
    if (!AppState.isReady) {
      setTimeout(loadAccMetadataTxns, 1000);
    }
    if (!props.scopedMetadataKeyHex) {
      isShowInvalid.value = true
      return [];
    }
    let metadataTxns = []
    let txnQueryParams = Helper.createTransactionQueryParams();
    txnQueryParams.embedded = true;
    txnQueryParams.publicKey = props.publicKey
    txnQueryParams.type = [TransactionType.ACCOUNT_METADATA_V2 || TransactionType.MOSAIC_METADATA_V2]
    const searchResult = await TransactionUtils.searchTransactions(TransactionGroupType.CONFIRMED,txnQueryParams)
    for(const txn of searchResult.transactions){
       let currentTxn = txn as AccountMetadataTransaction
       if(currentTxn.scopedMetadataKey.toHex() === props.scopedMetadataKeyHex){
        metadataTxns.push(currentTxn)
       }
    }
    for(let i = 0; i < metadataTxns.length; i++){
      totalMetadataList.value.push(`Metadata ${i + 1}`)
    }
    return metadataTxns
  }

  const loadSelectedMetadataHistory = async () => {
    metadataHistory.value = await loadAccMetadataTxns()
    let selectedAccMetadataTxn = metadataHistory.value[selectedMetadata.value] as AccountMetadataTransaction
    let blockHeight = selectedAccMetadataTxn.transactionInfo!.height.compact()
    const blockInfo = await AppState.chainAPI!.blockAPI.getBlockByHeight(
      blockHeight
    );
    selectedMetadataDetail.value = {
      block: blockInfo.height.compact(),
      timestamp: Helper.convertDisplayDateTimeFormat24(new Date(blockInfo.timestamp.compact() + Deadline.timestampNemesisBlock * 1000).toISOString()),
      scopedMetadataKeyHex: selectedAccMetadataTxn.scopedMetadataKey.toHex(),
      value: await valueChangeAccMetadata()
    }
  }

  const valueChangeAccMetadata = async () => {
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

  loadSelectedMetadataHistory()

  watch(selectedMetadata, (newValue,oldValue)=>{
    if(newValue !== oldValue){
      metadata.value = null
      totalMetadataList.value = []
      loadSelectedMetadataHistory()
    }
  })

  emitter.on("CHANGE_NETWORK", (payload: boolean) => {
    if (payload) {
      isShowInvalid.value = false;
      selectedMetadata.value = 0
      metadata.value = null
      totalMetadataList.value = []
      loadSelectedMetadataHistory();
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