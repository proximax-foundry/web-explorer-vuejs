<template>
  <div v-if="blockInfo">
    <p class="text-gray-500 mb-5 text-sm font-bold">Block Details</p>
    <div v-if="isShowInvalid">
      <div class="p-3 bg-yellow-100 text-yellow-700">
        Block is not available in {{ networkName }}
      </div>
    </div>
    <div v-else-if="!isShowInvalid && !blockInfo">
      <div class="flex justify-center items-center border-gray-400 mt-10 mb-20">
        <div
          class="animate-spin rounded-full h-5 w-5 border-b-2 border-navy-primary mr-2"
        ></div>
        <span class="text-tsm">Fetching Block Details</span>
      </div>
    </div>
    <div v-else>
      <div class="filter shadow-xl border border-gray-50 p-5 mb-15">
        <div class="txn-div">
          <div>
            <div>Block Height</div>
            <div>{{ blockInfo.height }}</div>
          </div>
          <div>
            <div>Timestamp</div>
            <div>{{ blockInfo.timestamp }}</div>
          </div>
          <div>
            <div>Validator</div>
            <div class="break-all flex items-center">
              <router-link
                :to="{
                  name: 'ViewAccount',
                  params: { accountParam: blockInfo.validator },
                }"
                class="text-blue-600 hover:text-blue-primary hover:underline mr-2"
                id="validatorPublicKey"
                :copyValue="blockInfo.validator"
                copySubject="Validator Public Key"
                >{{ blockInfo.validator }}</router-link
              >
              <img
                src="@/assets/img/icon-copy.svg"
                @click="copy('validatorPublicKey')"
                class="cursor-pointer"
              />
            </div>
          </div>
          <div>
            <div>Hash</div>
            <div class="break-all flex items-center">
              {{ blockInfo.hash }}
            </div>
          </div>
          <div>
            <div>Difficulty</div>
            <div>{{ blockInfo.difficulty }}</div>
          </div>
          <div>
            <div>No. of Transaction</div>
            <div>{{ blockInfo.numTransactions }}</div>
          </div>
          <div>
            <div>Total Fees</div>
            <div class="font-bold">
              {{
                TransactionUtils.convertToExactNativeAmount(blockInfo.totalFee)
              }}<img
                src="@/assets/img/icon-xpx.svg"
                class="inline-block ml-2"
                style="top:-3 width:14px;"
              />
              <span class="ml-2">{{ nativeTokenNamespace }}</span>
            </div>
          </div>
          <div>
            <div>Fee Multiplier</div>
            <div>{{ blockInfo.feeMultiplier }}</div>
          </div>
        </div>
      </div>
      <div v-if="blockInfo.numTransactions > 0">
        <p class="text-gray-500 mb-5 text-sm font-bold">Transactions</p>
        <div class="filter shadow-xl border border-gray-50 p-5 mb-15">
          <MixedTxnDataTable :transactions="transactions" :pages="pages" />
          <div
            class="sm:flex sm:justify-between my-5 mb-15"
            v-if="totalPages > 1"
          >
            <div
              class="text-xs text-gray-700 mb-3 sm:mb-0 text-center sm:text-left"
            >
              Show
              <select
                v-model="pages"
                class="border border-gray-300 rounded-md p-1"
                @change="changeRows"
              >
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
              </select>
              Records
            </div>
            <div class="sm:flex sm:items-center text-center sm:text-right">
              <div
                v-if="enableFirstPage"
                @click="naviFirst"
                class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs mx-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all"
              >
                First
              </div>
              <div
                v-else
                class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs mx-1"
              >
                First
              </div>
              <div
                v-if="enablePreviousPage"
                @click="naviPrevious"
                class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs mx-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all"
              >
                Previous
              </div>
              <div
                v-else
                class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs mx-1"
              >
                Previous
              </div>
              <div
                class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs"
              >
                Page {{ currentPage }} of {{ totalPages }}
              </div>
              <div
                v-if="enableNextPage"
                @click="naviNext"
                class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs mx-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all"
              >
                Next
              </div>
              <div
                v-else
                class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs mx-1"
              >
                Next
              </div>
              <div
                v-if="enableLastPage"
                @click="naviLast"
                class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs ml-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all"
              >
                Last
              </div>
              <div
                v-else
                class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs mx-1"
              >
                Last
              </div>
            </div>
          </div>
        </div>
      </div>
      <BlockReceipt :txn-statements="txnStatements" />
    </div>
  </div>
</template>

<script setup lang="ts">
import BlockReceipt from "@/modules/block/components/BlockReceipt.vue";
import { computed, getCurrentInstance, ref } from "vue";
import { BlockUtils, type BlockObj } from "@/util/blockUtil";
import { AppState } from "@/state/appState";
import { networkState } from "@/state/networkState";
import MixedTxnDataTable from "@/modules/transaction/components/txnDataTables/MixedTxnDataTable.vue";
import { TransactionUtils } from "@/util/transactionUtils";

import {
  Address,
  AddressAlias,
  ArtifactExpiryReceipt,
  BalanceChangeReceipt,
  BalanceTransferReceipt,
  MosaicAlias,
  MosaicId,
  NamespaceId,
  OfferCreationReceipt,
  OfferExchangeReceipt,
  OfferRemovalReceipt,
  ReceiptType,
  TransactionGroupType,
  TransactionQueryParams,
} from "tsjs-xpx-chain-sdk";
import { copyToClipboard } from "@/util/functions";
import { useToast } from "primevue/usetoast";
import type { ConfirmedTransferTransaction } from "@/models/transactions/transaction";

interface blockReceipt {
  class?: string;
  type?: string;
  namespaceId?: string;
  mosaicId?: string;
  account?: string;
  amount?: number;
  recipient?: string;
  sender?: string;
  artifactId?: string;
  mosaicIdGive?: string;
  mosaicIdGet?: string;
  mosaicIdGiveAmount?: number;
  mosaicIdGetAmount?: number;
  mosaicAmountGiveReturned?: number;
  address?: string
}

const p = defineProps({
  blockHeight: String,
});

const networkName = computed(() => {
  return networkState.chainNetworkName;
});


const txnStatements = ref<Record<string, blockReceipt[]>>({});
const toast = useToast();
const internalInstance = getCurrentInstance();
const emitter = internalInstance?.appContext.config.globalProperties.emitter;
const blockInfo = ref<BlockObj | null>(null);
const transactions = ref<ConfirmedTransferTransaction[]>([]);
const isShowInvalid = ref(false);
const nativeTokenNamespace = AppState.nativeToken.label;
const copy = (id: string) => {
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

const loadBlock = async () => {
  if (!p.blockHeight) {
    return;
  }
  if (!AppState.isReady || !networkName.value) {
    setTimeout(loadBlock, 1000);
    return;
  }
  const block = await BlockUtils.getBlockByHeight(parseInt(p.blockHeight));
  const blockReceipts = await AppState.chainAPI!.blockAPI.getBlockReceipts(
    parseInt(p.blockHeight)
  );
  const {
    transactionStatements,
    addressResolutionStatements,
    mosaicResolutionStatements,
  } = blockReceipts;

  const addressStatement = addressResolutionStatements
    .map((x) => {
      const unresolved = x.unresolved as NamespaceId;
      return x.resolutionEntries.map((y) => {
        const addressAlias = y.resolved as AddressAlias;
        return {
          namespaceId: unresolved.toHex(),
          address: addressAlias.address.pretty(),
        };
      });
    })
    .flat();

  const formatAddressStatement: Record<
    string,
    { namespaceId: string; address: string }[]
  > = addressStatement.length
    ? {
        "Address Resolution Statement": addressStatement,
      }
    : {};

  const mosaicStatement = mosaicResolutionStatements
    .map((x) => {
      const unresolved = x.unresolved as NamespaceId;
      return x.resolutionEntries.map((y) => {
        const mosaicAlias = y.resolved as MosaicAlias;
        return {
          namespaceId: unresolved.toHex(),
          mosaicId: mosaicAlias.toHex(),
        };
      });
    })
    .flat();

  const formatMosaicStatement: Record<
    string,
    { namespaceId: string; mosaicId: string }[]
  > = mosaicStatement.length
    ? {
        "Asset Resolution Statement": mosaicStatement,
      }
    : {};

  const txnStatement = transactionStatements
    .map((statement) => {
      return statement.receipts.map((receipt) => {
        if (receipt instanceof BalanceChangeReceipt) {
          const { type, version, size, ...val } = receipt;
          return {
            class: "Balance Change",
            type: ReceiptType[type],
            account: val.account.address.pretty(),
            mosaicId: val.mosaicId.toHex(),
            amount: val.amount.compact(),
          };
        } else if (receipt instanceof BalanceTransferReceipt) {
          const { type, version, size, ...val } = receipt;
          return {
            class: "Balance Transfer",
            type: ReceiptType[type],
            mosaicId: val.mosaicId.toHex(),
            amount: val.amount.compact(),
            sender: val.sender.address.pretty(),
            recipient:
              val.recipient instanceof Address
                ? val.recipient.pretty()
                : val.recipient?.fullName ?? val.recipient.toHex(),
          };
        } 
         else if (receipt instanceof ArtifactExpiryReceipt) {
          const { type, artifactId } = receipt;
          return {
            class: "Artifact Expiry",
            type: ReceiptType[type],
            artifactId:
              artifactId instanceof MosaicId
                ? artifactId.toHex()
                : artifactId?.fullName ?? artifactId.toHex(),
          };
        } else if (receipt instanceof OfferCreationReceipt) {
          const { type, version, size, ...val } = receipt;
          return {
            class: "SDA Offer Creation",
            type: ReceiptType[type],
            sender: val.sender.address.pretty(),
            mosaicIdGive: val.mosaicIdGive.toHex(),
            mosaicIdGet: val.mosaicIdGet.toHex(),
            mosaicIdGiveAmount: val.mosaicAmountGive.compact(),
            mosaicIdGetAmount: val.mosaicAmountGet.compact(),
          };
        } else if (receipt instanceof OfferExchangeReceipt) {
          const { type, version, size, ...val } = receipt;
          console.log(val)
          return {
            class: "SDA Offer Exchange",
            type: ReceiptType[type],
            sender: val.sender.address.pretty(),
            mosaicIdGive: val.mosaicIdGive.toHex(),
            mosaicIdGet: val.mosaicIdGet.toHex(),
            exchangeDetails: val.exchangeDetails.map((z) => {
              return {
                recipient: z.recipient.pretty(),
                mosaicIdGive: z.mosaicIdGive.toHex(),
                mosaicIdGet: z.mosaicIdGet.toHex(),
                mosaicAmountGive: z.mosaicAmountGive.compact(),
                mosaicAmountGet: z.mosaicAmountGet.compact(),
              };
            }),
          };
        } else if (receipt instanceof OfferRemovalReceipt) {
          const { type, version, size, ...val } = receipt;
          return {
            class: "SDA Offer Removal",
            type: ReceiptType[type],
            sender: val.sender.address.pretty(),
            mosaicIdGive: val.mosaicIdGive.toHex(),
            mosaicIdGet: val.mosaicIdGet.toHex(),
            mosaicAmountGiveReturned: val.mosaicAmountGiveReturned.compact(),
          };
        } else {
          return {
            class: "Unknown",
            type: "Unknown",
          };
        }
      });
    })
    .flat();

  for (let i = 0; i < txnStatement.length; i++) {
 
    if (txnStatement[i].mosaicIdGet) {
      const { divisibility } = await AppState.chainAPI!.assetAPI.getMosaic(
        new MosaicId(txnStatement[i].mosaicIdGet!)
      );
      if(txnStatement[i].mosaicIdGetAmount){

        txnStatement[i].mosaicIdGetAmount! =
          txnStatement[i].mosaicIdGetAmount! / Math.pow(10, divisibility);
      }
    }

    if (txnStatement[i].mosaicIdGive) {
      const { divisibility } = await AppState.chainAPI!.assetAPI.getMosaic(
        new MosaicId(txnStatement[i].mosaicIdGive!)
      );
      if(txnStatement[i].mosaicIdGiveAmount){

        txnStatement[i].mosaicIdGiveAmount! =
          txnStatement[i].mosaicIdGiveAmount! / Math.pow(10, divisibility);
      }
      if(txnStatement[i].mosaicAmountGiveReturned){
        txnStatement[i].mosaicAmountGiveReturned! =
          txnStatement[i].mosaicAmountGiveReturned! / Math.pow(10, divisibility);
      }
    }

    if(txnStatement[i].exchangeDetails?.length){
      for (let j = 0; j < txnStatement[i].exchangeDetails!.length; j++) {
        const getMosaicInfo = await AppState.chainAPI!.assetAPI.getMosaic(
          new MosaicId(txnStatement[i].exchangeDetails![j].mosaicIdGet )
        );
        const giveMosaicInfo = await AppState.chainAPI!.assetAPI.getMosaic(
          new MosaicId(txnStatement[i].exchangeDetails![j].mosaicIdGive )
        );

        txnStatement[i].exchangeDetails![j].mosaicAmountGet = txnStatement[i].exchangeDetails![j].mosaicAmountGet / Math.pow(10,getMosaicInfo.divisibility)
        txnStatement[i].exchangeDetails![j].mosaicAmountGive = txnStatement[i].exchangeDetails![j].mosaicAmountGive / Math.pow(10,giveMosaicInfo.divisibility)
      }
    }


    if (txnStatement[i].mosaicId) {
      const { divisibility } = await AppState.chainAPI!.assetAPI.getMosaic(
        new MosaicId(txnStatement[i].mosaicId!)
      );
      txnStatement[i].amount! =
        txnStatement[i].amount! / Math.pow(10, divisibility);
    }

    if (
      TransactionUtils.isNamespaceWithString(txnStatement[i].recipient ?? "")
    ) {
      const namespaceName =
        await AppState.chainAPI!.namespaceAPI.getNamespacesName([
          new NamespaceId(txnStatement[i].recipient!.replace("/", "")),
        ]);
      txnStatement[i].recipient = namespaceName[0].name;
    }
    if (
      TransactionUtils.isNamespaceWithString(txnStatement[i].artifactId ?? "")
    ) {
      const namespaceName =
        await AppState.chainAPI!.namespaceAPI.getNamespacesName([
          new NamespaceId(txnStatement[i].recipient!.replace("/", "")),
        ]);
      txnStatement[i].artifactId = namespaceName[0].name;
    }
  }

  const groupedStatements: {
    [key: string]: Omit<(typeof txnStatement)[0], "class">[];
  } = {};

  // Create an object to store the grouped arrays dynamically
  txnStatement.forEach((statement) => {
    const { class: statementClass, ...statementWithoutClass } = statement;
    if (!groupedStatements[statementClass]) {
      groupedStatements[statementClass] = [];
    }
    groupedStatements[statementClass].push(statementWithoutClass);
  });
  txnStatements.value = {
    ...groupedStatements,
    ...formatAddressStatement,
    ...formatMosaicStatement,
  };

  if (!AppState.isReady) {
    setTimeout(loadBlock, 1000);
    return;
  }

  if (block) {
    blockInfo.value = block;
    isShowInvalid.value = false;
  } else {
    isShowInvalid.value = true;
  }
  getTransactions();
};
loadBlock();

const pages = ref(20);
const currentPage = ref(1);
const totalPages = ref(0);

const enableFirstPage = computed(() => {
  return currentPage.value > 1;
});

const enablePreviousPage = computed(() => {
  return currentPage.value > 1;
});

const enableNextPage = computed(() => {
  return totalPages.value - currentPage.value > 0;
});

const enableLastPage = computed(() => {
  return currentPage.value < totalPages.value;
});

const naviFirst = () => {
  currentPage.value = 1;
  getTransactions();
};

const naviPrevious = () => {
  --currentPage.value;
  getTransactions();
};

const naviNext = () => {
  ++currentPage.value;
  getTransactions();
};

const naviLast = () => {
  currentPage.value = totalPages.value;
  getTransactions();
};

const changeRows = () => {
  currentPage.value = 1;
  getTransactions();
};

emitter.on("CHANGE_NETWORK", (payload: boolean) => {
  if (payload) {
    loadBlock();
  }
});

const getTransactions = async () => {
  if (p.blockHeight != null) {
    let txnQueryParams = new TransactionQueryParams();
    txnQueryParams.height = parseInt(p.blockHeight);
    txnQueryParams.pageSize = pages.value;
    txnQueryParams.pageNumber = currentPage.value;
    let txns = await TransactionUtils.searchTxns(
      TransactionGroupType.CONFIRMED,
      txnQueryParams
    );
    if (txns.transactions.length > 0) {
      let transactionSearchResult =
        await TransactionUtils.formatConfirmedMixedTxns(txns.transactions);
      transactions.value = transactionSearchResult;
      totalPages.value = txns.pagination.totalPages;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.txn-div {
  @apply text-gray-800 text-xs;
  > div {
    @apply flex items-center border-b border-gray-100 py-4;

    > div:first-child {
      @apply w-56 text-xs pl-4 font-bold;
    }

    > div:nth-child(2) {
      @apply text-xs w-full;
    }

    > div:last-child {
      @apply border-none;
    }
  }
}
</style>
