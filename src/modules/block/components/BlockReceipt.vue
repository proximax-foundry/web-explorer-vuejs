<template>
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
        class="cursor-pointer"
        :class="tabIndex == index ? 'border-b-2 w-fit border-blue-primary' : 'hover-underline-animation '"
      >
        {{ value[0] }}
      </div>
    </div>
  </div>
  <div class="filter shadow-xl border border-gray-50 p-5 mb-15">
    <DataTable
      :value="selectedTabData"
      :paginator="false"
      :rows="Number(pages)"
      scrollDirection="horizontal"
      :alwaysShowPaginator="false"
      responsiveLayout="scroll"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate=""
    >
      <template #empty> No assets found. </template>

      <Column class="lg:hidden w-[200px]">
        <template #body="{ data }">
          <div
            v-if="
              selectedTabName !=
              ('Asset Resolution Statement' || 'Address Resolution Statement')
            "
          >
            <div
              class="uppercase text-xs text-gray-300 font-bold mb-1 break-all"
            >
              Receipt Type
            </div>
            <span class="uppercase font-bold text-xs mr-2">{{
              data?.type
            }}</span>
          </div>
          <div>
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
              Asset ID
            </div>
            <div class="flex items-center">
              <span v-if="!data?.mosaicId">-</span>
              <router-link
                v-else
                :to="{ name: 'ViewAsset', params: { id: data.mosaicId } }"
                class="uppercase font-bold text-xs mr-2 text-blue-600 hover:underline hover:text-blue-primary"
              >
                {{ data?.mosaicId ?? "-" }}
              </router-link>
            </div>
          </div>
          <div
            v-if="
              selectedTabName !=
              ('Asset Resolution Statement' || 'Address Resolution Statement')
            "
          >
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
              Sender
            </div>
            <div class="uppercase font-bold text-xs">
              <span v-if="!data?.sender">-</span>
              <router-link
                :to="{
                  name: 'ViewAccount',
                  params: { accountParam: data.sender },
                }"
                v-tooltip.right="data?.sender"
                v-else
                class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-40"
                ><span class="text-ellipsis overflow-hidden">{{
                  data?.sender
                }}</span
                >...</router-link
              >
            </div>
          </div>
          <div
            v-if="
              selectedTabName !=
              ('Asset Resolution Statement' || 'Address Resolution Statement')
            "
          >
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
              Recipient
            </div>
            <div class="uppercase font-bold text-xs">
              <span v-if="!data?.recipient">-</span>
              <router-link
                :to="{
                  name: TransactionUtils.isNamespaceWithString(data.recipient)
                    ? 'ViewNamespace'
                    : 'ViewAccount',
                  params: TransactionUtils.isNamespaceWithString(data.recipient)
                    ? { namespaceParam: data.recipient }
                    : { accountParam: data.recipient },
                }"
                v-tooltip.right="data?.recipient"
                v-else
                class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-40"
                ><span class="text-ellipsis overflow-hidden">{{
                  data?.recipient
                }}</span
                >{{
                  TransactionUtils.isNamespaceWithString(data.recipient)
                    ? "..."
                    : ""
                }}</router-link
              >
            </div>
          </div>
        </template>
      </Column>
      <Column class="lg:hidden w-[200px]">
        <template #body="{ data }">
          <div
            v-if="
              selectedTabName !=
              ('Asset Resolution Statement' || 'Address Resolution Statement')
            "
          >
            <div class="uppercase text-xs text-gray-300 font-bold mb-1">
              Account
            </div>
            <div class="uppercase font-bold text-xs">
              <span v-if="!data?.account">-</span>
              <router-link
                :to="{
                  name: 'ViewAccount',
                  params: { accountParam: data.account },
                }"
                v-tooltip.right="data?.account"
                v-else
                class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-40"
                ><span class="text-ellipsis overflow-hidden">{{
                  data?.account
                }}</span
                >...</router-link
              >
            </div>
          </div>
          <div
            v-if="
              selectedTabName ==
              ('Asset Resolution Statement' || 'Address Resolution Statement')
            "
          >
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
              Namespace ID
            </div>
            <div class="uppercase font-bold text-xs">
              <div class="flex items-center">
                <span v-if="!data?.namespaceId">-</span>
                <router-link
                  v-else
                  :to="{
                    name: 'ViewNamespace',
                    params: { namespaceParam: data.namespaceId },
                  }"
                  class="uppercase font-bold text-xs mr-2 text-blue-600 hover:underline hover:text-blue-primary"
                >
                  {{ data?.namespaceId }}
                </router-link>
              </div>
            </div>
          </div>
          <div
            v-if="
              selectedTabName !=
              ('Asset Resolution Statement' || 'Address Resolution Statement')
            "
          >
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
              Amount
            </div>
            <div class="text-xs uppercase font-bold">
              {{ data?.amount ?? "-" }}
              <b v-if="data?.amount">{{ AppState.nativeToken.label }}</b>
            </div>
          </div>
          <div
            v-if="
              selectedTabName !=
              ('Asset Resolution Statement' || 'Address Resolution Statement')
            "
          >
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
              Artifact ID
            </div>
            <div class="uppercase font-bold text-xs">
              <span v-if="!data?.recipient">-</span>
              <router-link
                :to="{
                  name: TransactionUtils.isNamespaceWithString(data.artifactId)
                    ? 'ViewNamespace'
                    : 'ViewAsset',
                  params: TransactionUtils.isNamespaceWithString(
                    data.artifactId
                  )
                    ? { namespaceParam: data.artifactId }
                    : { id: data.artifactId },
                }"
                v-tooltip.right="data?.artifactId"
                v-else
                class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-40"
                ><span class="text-ellipsis overflow-hidden">{{
                  data?.artifactId
                }}</span></router-link
              >
            </div>
          </div>
        </template>
      </Column>

      <Column
        field="type"
        header="Receipt Type"
        headerClass="uppercase"
        class="hidden lg:table-cell"
        v-if="
          selectedTabName !=
          ('Asset Resolution Statement' || 'Address Resolution Statement')
        "
      >
        <template #body="{ data }">
          <div class="uppercase font-bold text-xs mr-2">
            {{ data?.type }}
          </div>
        </template>
      </Column>
      <Column
        field="mosaicId"
        header="Asset ID"
        headerClass="uppercase"
        class="hidden lg:table-cell"
      >
        <template #body="{ data }">
          <span v-if="!data?.mosaicId">-</span>
          <router-link
            v-else
            :to="{ name: 'ViewAsset', params: { id: data.mosaicId } }"
            class="uppercase font-bold text-xs mr-2 text-blue-600 hover:underline hover:text-blue-primary"
          >
            {{ data?.mosaicId ?? "-" }}
          </router-link>
        </template>
      </Column>
      <Column
        class="hidden lg:table-cell"
        field="namespaceId"
        header="Namespace ID"
        headerClass="uppercase"
        v-if="
          selectedTabName ==
          ('Asset Resolution Statement' || 'Address Resolution Statement')
        "
      >
        <template #body="{ data }">
          <div class="uppercase font-bold text-xs">
            <div class="flex items-center">
              <span v-if="!data?.namespaceId">-</span>
              <router-link
                v-else
                :to="{
                  name: 'ViewNamespace',
                  params: { namespaceParam: data.namespaceId },
                }"
                class="uppercase font-bold text-xs mr-2 text-blue-600 hover:underline hover:text-blue-primary"
              >
                {{ data?.namespaceId }}
              </router-link>
            </div>
          </div>
        </template>
      </Column>
      <Column
        class="hidden lg:table-cell"
        field="account"
        header="Account"
        headerClass="uppercase"
        v-if="
          selectedTabName !=
          ('Asset Resolution Statement' || 'Address Resolution Statement')
        "
      >
        <template #body="{ data }">
          <div class="uppercase font-bold text-xs">
            <span v-if="!data?.account">-</span>
            <router-link
              :to="{
                name: 'ViewAccount',
                params: { accountParam: data.account },
              }"
              v-tooltip.right="data?.account"
              v-else
              class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-40"
              ><span class="text-ellipsis overflow-hidden">{{
                data?.account
              }}</span
              >...</router-link
            >
          </div>
        </template>
      </Column>
      <Column
        class="hidden lg:table-cell"
        field="amount"
        header="Amount"
        headerClass="uppercase"
        v-if="
          selectedTabName !=
          ('Asset Resolution Statement' || 'Address Resolution Statement')
        "
      >
        <template #body="{ data }">
          <div class="text-xs uppercase font-bold">
            {{ data?.amount ?? "-" }}
            <b v-if="data?.amount">{{ AppState.nativeToken.label }}</b>
          </div>
        </template>
      </Column>
      <Column
        class="hidden lg:table-cell"
        field="sender"
        header="Sender"
        headerClass="uppercase"
        v-if="
          selectedTabName !=
          ('Asset Resolution Statement' || 'Address Resolution Statement')
        "
      >
        <template #body="{ data }">
          <div class="uppercase font-bold text-xs">
            <span v-if="!data?.sender">-</span>
            <router-link
              :to="{
                name: 'ViewAccount',
                params: { accountParam: data.sender },
              }"
              v-tooltip.right="data?.sender"
              v-else
              class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-40"
              ><span class="text-ellipsis overflow-hidden">{{
                data?.sender
              }}</span
              >...</router-link
            >
          </div>
        </template>
      </Column>
      <Column
        class="hidden lg:table-cell"
        field="recipient"
        header="Recipient"
        headerClass="uppercase"
        v-if="
          selectedTabName !=
          ('Asset Resolution Statement' || 'Address Resolution Statement')
        "
      >
        <template #body="{ data }">
          <div class="uppercase font-bold text-xs">
            <span v-if="!data?.recipient">-</span>
            <router-link
              :to="{
                name: TransactionUtils.isNamespaceWithString(data.recipient)
                  ? 'ViewNamespace'
                  : 'ViewAccount',
                params: TransactionUtils.isNamespaceWithString(data.recipient)
                  ? { namespaceParam: data.recipient }
                  : { accountParam: data.recipient },
              }"
              v-tooltip.right="data?.recipient"
              v-else
              class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-40"
              ><span class="text-ellipsis overflow-hidden">{{
                data?.recipient
              }}</span
              >{{
                TransactionUtils.isNamespaceWithString(data.recipient)
                  ? "..."
                  : ""
              }}</router-link
            >
          </div>
        </template>
      </Column>
      <Column
        class="hidden lg:table-cell"
        field="artifactId"
        header="Artifact Id"
        headerClass="uppercase"
        v-if="
          selectedTabName !=
          ('Asset Resolution Statement' || 'Address Resolution Statement')
        "
      >
        <template #body="{ data }">
          <div class="uppercase font-bold text-xs">
            <span v-if="!data?.recipient">-</span>
            <router-link
              :to="{
                name: TransactionUtils.isNamespaceWithString(data.artifactId)
                  ? 'ViewNamespace'
                  : 'ViewAsset',
                params: TransactionUtils.isNamespaceWithString(data.artifactId)
                  ? { namespaceParam: data.artifactId }
                  : { id: data.artifactId },
              }"
              v-tooltip.right="data?.artifactId"
              v-else
              class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-40"
              ><span class="text-ellipsis overflow-hidden">{{
                data?.artifactId
              }}</span></router-link
            >
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
  <div class="sm:flex sm:justify-between my-5 mb-15" v-if="totalPages > 1">
    <div class="text-xs text-gray-700 mb-3 sm:mb-0 text-center sm:text-left">
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
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { AppState } from "@/state/appState";
import { TransactionUtils } from "@/util/transactionUtils";

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
}

const { txnStatements } = defineProps<{
  txnStatements: Record<string, blockReceipt[]>;
}>();

const selectedTabName = computed(
  () => Object.entries(txnStatements)[tabIndex.value][0]
);

const selectedTabData = computed(
  () => Object.entries(txnStatements)[tabIndex.value][1]
);


const tabIndex = ref(0);

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
};

const naviPrevious = () => {
  --currentPage.value;
};

const naviNext = () => {
  ++currentPage.value;
};

const naviLast = () => {
  currentPage.value = totalPages.value;
};

const changeRows = () => {
  currentPage.value = 1;
};
</script>


<style>
.hover-underline-animation {
  position: relative;
}

.hover-underline-animation:after {
  content: '';
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: #007cff;
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
}

.hover-underline-animation:hover:after {
  transform: scaleX(1);
  transform-origin: bottom left;
}
</style>