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
      <div
        class="text-gray-500 mb-5 text-sm font-bold"
        v-if="Object.entries(txnStatements).length"
      >
        Block Receipts
      </div>
      <div class="flex gap-4 flex-wrap">
        <div
          v-for="(value, index) in Object.entries(txnStatements)"
          :key="index"
          class="mb-6"
        >
          <div
            @click="tabIndex = index"
            :class="
              tabIndex == index ? 'border-b-2 w-fit border-blue-primary' : ''
            "
          >
            {{ value[0] }}
          </div>
        </div>
      </div>

      <DataTable
        :value="( Object.entries(txnStatements)[tabIndex][1] as [])"
        :paginator="true"
        :rows="10"
        dataKey="id"
        class="mb-10"
        :rowsPerPageOptions="[10, 20, 30, 40, 50]"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink  RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        responsiveLayout="scroll"
      >
        <template #empty> No assets found. </template>

        <Column field="mosaicId" header="Asset ID" headerClass="uppercase">
          <template #body="{ data }">
            <div
              class="text-blue-primary uppercase w-min-max text-xs mt-1.5 cursor-pointertext-blue-primary pr-7"
            >
              {{ data?.mosaicId }}
            </div>
          </template>
        </Column>
        <Column field="namespaceId" header="Namespace ID" headerClass="uppercase" v-if=" Object.entries(txnStatements)[tabIndex][0] ==('Asset Resolution Statement' || 'Address Resolution Statement' )" >
          <template #body="{ data }">
            <div
              class="text-blue-primary uppercase w-min-max text-xs mt-1.5 cursor-pointertext-blue-primary pr-7"
            >
              {{ data?.namespaceId }}
            </div>
          </template>
        </Column>
        <Column field="account" header="Account" headerClass="uppercase" v-if=" Object.entries(txnStatements)[tabIndex][0] !=('Asset Resolution Statement' || 'Address Resolution Statement' )"  >
          <template #body="{ data }">
            <div
              class="text-blue-primary uppercase w-min-max text-xs mt-1.5 cursor-pointertext-blue-primary pr-7"
            >
              {{ data?.account }}
            </div>
          </template>
        </Column>
        <Column field="amount" header="Amount" headerClass="uppercase" v-if=" Object.entries(txnStatements)[tabIndex][0] !=('Asset Resolution Statement' || 'Address Resolution Statement' )" >
          <template #body="{ data }">
            <div
              class="text-blue-primary uppercase w-min-max text-xs mt-1.5 cursor-pointertext-blue-primary pr-7"
            >
              {{ data?.amount }}
            </div>
          </template>
        </Column>
        <Column field="sender" header="Sender" headerClass="uppercase" v-if=" Object.entries(txnStatements)[tabIndex][0] !=('Asset Resolution Statement' || 'Address Resolution Statement' )" >
          <template #body="{ data }">
            <div
              class="text-blue-primary uppercase w-min-max text-xs mt-1.5 cursor-pointertext-blue-primary pr-7"
            >
              {{ data?.sender }}
            </div>
          </template>
        </Column>
        <Column field="recipient" header="Recipient" headerClass="uppercase" v-if=" Object.entries(txnStatements)[tabIndex][0] !=('Asset Resolution Statement' || 'Address Resolution Statement' )" >
          <template #body="{ data }">
            <div
              class="text-blue-primary uppercase w-min-max text-xs mt-1.5 cursor-pointertext-blue-primary pr-7"
            >
              {{ data?.recipient }}
            </div>
          </template>
        </Column>
        <Column field="artifactId" header="Artifact Id" headerClass="uppercase" v-if=" Object.entries(txnStatements)[tabIndex][0] !=('Asset Resolution Statement' || 'Address Resolution Statement' )" >
          <template #body="{ data }">
            <div
              class="text-blue-primary uppercase w-min-max text-xs mt-1.5 cursor-pointertext-blue-primary pr-7"
            >
              {{ data?.artifactId }}
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, ref } from "vue";
import { BlockUtils, type BlockObj } from "@/util/blockUtil";
import { AppState } from "@/state/appState";
import { networkState } from "@/state/networkState";
import MixedTxnDataTable from "@/modules/transaction/components/txnDataTables/MixedTxnDataTable.vue";
import { TransactionUtils } from "@/util/transactionUtils";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import {
  Address,
  AddressAlias,
  ArtifactExpiryReceipt,
  BalanceChangeReceipt,
  BalanceTransferReceipt,
  InflationReceipt,
  MosaicAlias,
  MosaicId,
  NamespaceId,
  ReceiptType,
  TransactionGroupType,
  TransactionQueryParams,
} from "tsjs-xpx-chain-sdk";
import { copyToClipboard } from "@/util/functions";
import { useToast } from "primevue/usetoast";
import type { ConfirmedTransferTransaction } from "@/models/transactions/transaction";

const p = defineProps({
  blockHeight: String,
});

const txnStatements = ref<any>({});
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

const tabIndex = ref(0);

const loadBlock = async () => {
  if (!p.blockHeight) {
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

  const addressStatement = addressResolutionStatements.map((x) => {
    const unresolved = x.unresolved as NamespaceId
    return x.resolutionEntries.map((y) => {

          const addressAlias = y.resolved as AddressAlias;
          return {
            namespaceId: unresolved.toHex(),
            address: addressAlias.address.pretty(),
          };
    });
  }).flat();

  const formatAddressStatement = addressStatement.length? {
    'Address Resolution Statement': addressStatement
  }: {}

  const mosaicStatement = mosaicResolutionStatements.map((x) => {
    const unresolved = x.unresolved as NamespaceId
    return x.resolutionEntries.map((y) => {
          const mosaicAlias = y.resolved as MosaicAlias;
          return {
            namespaceId: unresolved.toHex(),
            mosaicId: mosaicAlias.toHex(),
          };
    });
  }).flat();

  const formatMosaicStatement = mosaicStatement.length? {
    'Asset Resolution Statement': mosaicStatement
  }:{}

  const txnStatement = transactionStatements
    .map((statement) => {
      return statement.receipts.map((receipt) => {
        if (receipt instanceof BalanceChangeReceipt) {
          const { type, version, size, ...val } = receipt;
          return {
            type: ReceiptType[type],
            account: val.account.address.pretty(),
            mosaicId: val.mosaicId.toHex(),
            amount: val.amount.compact(),
          };
        } else if (receipt instanceof BalanceTransferReceipt) {
          const { type, version, size, ...val } = receipt;
          return {
            type: ReceiptType[type],
            mosaicId: val.mosaicId.toHex(),
            amount: val.amount.compact(),
            sender: val.sender.address.pretty(),
            recipient:
              val.recipient instanceof Address
                ? val.recipient.pretty()
                : val.recipient?.fullName ?? val.recipient.toHex() + "/",
          };
        } else if (receipt instanceof InflationReceipt) {
          const { type, version, size, ...val } = receipt;
          return {
            type: ReceiptType[type],
            mosaicId: val.mosaicId.toHex(),
            amount: val.amount.compact(),
          };
          //pending sdk: add support for sda exchange receipt
        } else {
          const artifactExpiryReceipt = receipt as ArtifactExpiryReceipt;
          const { type, artifactId } = artifactExpiryReceipt;
          return {
            type: ReceiptType[type],
            artifactId:
              artifactId instanceof MosaicId
                ? artifactId.toHex()
                : artifactId?.fullName ?? artifactId.toHex() + "/",
          };
        }
      });
    })
    .flat();

  for (let i = 0; i < txnStatement.length; i++) {
    if (txnStatement[i].mosaicId) {
      const { divisibility } = await AppState.chainAPI!.assetAPI.getMosaic(
        new MosaicId(txnStatement[i].mosaicId!)
      );
      txnStatement[i].amount! =
        txnStatement[i].amount! / Math.pow(10, divisibility);
    }

    if (txnStatement[i].recipient?.includes("/")) {
      const namespaceName =
        await AppState.chainAPI!.namespaceAPI.getNamespacesName([
          new NamespaceId(txnStatement[i].recipient!.replace("/", "")),
        ]);
      txnStatement[i].recipient = namespaceName[0].name;
    }
    if (txnStatement[i].artifactId?.includes("/")) {
      const namespaceName =
        await AppState.chainAPI!.namespaceAPI.getNamespacesName([
          new NamespaceId(txnStatement[i].recipient!.replace("/", "")),
        ]);
      txnStatement[i].artifactId = namespaceName[0].name;
    }
  }

  const groupedStatements: { [key: string]: Omit<typeof txnStatement[0], 'type'>[] } = {};

  // Create an object to store the grouped arrays dynamically
  txnStatement.forEach((statement) => {
  const { type, ...statementWithoutType } = statement;
  if (!groupedStatements[type]) {
    groupedStatements[type] = [];
  }
  groupedStatements[type].push(statementWithoutType);
});

  txnStatements.value = { ...groupedStatements, ...formatAddressStatement,...formatMosaicStatement };

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

const networkName = computed(() => {
  return networkState.chainNetworkName;
});

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
getTransactions();
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
