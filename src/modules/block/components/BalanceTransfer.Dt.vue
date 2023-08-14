<template>
  <DataTable
    :value="data"
    :paginator="false"
    :rows="pages"
    scrollDirection="horizontal"
    :alwaysShowPaginator="false"
    responsiveLayout="scroll"
    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
    currentPageReportTemplate=""
  >
    <!-- Start of mobile width -->
    <Column class="lg:hidden w-[200px]">
      <template #body="{ data }: { data: balanceTransfer }">
        <div class="uppercase text-xs text-gray-300 font-bold mb-1 break-all">
          Receipt Type
        </div>
        <span class="uppercase font-bold text-xs mr-2">{{ data.type }}</span>
        <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
          Asset ID
        </div>
        <div class="flex items-center">
          <router-link
            :to="{ name: 'ViewAsset', params: { id: data.mosaicId } }"
            class="uppercase font-bold text-xs mr-2 text-blue-600 hover:underline hover:text-blue-primary"
          >
            {{ data.mosaicId }}
          </router-link>
        </div>
        <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
          Amount
        </div>
        <div class="text-xs uppercase font-bold">
          {{ data.amount }}
          <b>{{ AppState.nativeToken.label }}</b>
        </div>
      </template>
    </Column>
    <Column class="lg:hidden w-[200px]">
      <template #body="{ data }: { data: balanceTransfer }">
        <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
          Sender
        </div>
        <div class="uppercase font-bold text-xs">
          <router-link
            :to="{
              name: 'ViewAccount',
              params: { accountParam: data.sender },
            }"
            v-tooltip.right="data.sender"
            class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-40"
            ><span class="text-ellipsis overflow-hidden">{{ data.sender }}</span
            >...</router-link
          >
        </div>
        <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
          Recipient
        </div>
        <div class="uppercase font-bold text-xs">
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
            class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-40"
            ><span class="text-ellipsis overflow-hidden">{{
              data.recipient
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
    <!-- End of mobile width -->

    <!-- Start of desktop width -->
    <Column
      field="type"
      header="Receipt Type"
      headerClass="uppercase"
      class="hidden lg:table-cell"
    >
      <template #body="{ data }: { data: balanceTransfer }">
        <div class="uppercase font-bold text-xs mr-2">
          {{ data.type }}
        </div>
      </template>
    </Column>
    <Column
      field="mosaicId"
      header="Asset ID"
      headerClass="uppercase"
      class="hidden lg:table-cell"
    >
      <template #body="{ data }: { data: balanceTransfer }">
        <router-link
          :to="{ name: 'ViewAsset', params: { id: data.mosaicId } }"
          class="uppercase font-bold text-xs mr-2 text-blue-600 hover:underline hover:text-blue-primary"
        >
          {{ data.mosaicId }}
        </router-link>
      </template>
    </Column>
    <Column
      class="hidden lg:table-cell"
      field="amount"
      header="Amount"
      headerClass="uppercase"
    >
      <template #body="{ data }: { data: balanceTransfer }">
        <div class="text-xs uppercase font-bold">
          {{ data.amount }}
          <b>{{ AppState.nativeToken.label }}</b>
        </div>
      </template>
    </Column>
    <Column
        class="hidden lg:table-cell"
        field="sender"
        header="Sender"
        headerClass="uppercase"
      >
      <template #body="{ data }: { data: balanceTransfer }">
          <div class="uppercase font-bold text-xs">
            <router-link
              :to="{
                name: 'ViewAccount',
                params: { accountParam: data.sender },
              }"
              v-tooltip.right="data.sender"
              class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-40"
              ><span class="text-ellipsis overflow-hidden">{{
                data.sender
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
      >
        <template #body="{ data }: { data: balanceTransfer }">
          <div class="uppercase font-bold text-xs">
            <router-link
              :to="{
                name: TransactionUtils.isNamespaceWithString(data.recipient)
                  ? 'ViewNamespace'
                  : 'ViewAccount',
                params: TransactionUtils.isNamespaceWithString(data.recipient)
                  ? { namespaceParam: data.recipient }
                  : { accountParam: data.recipient },
              }"
              v-tooltip.right="data.recipient"
              class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-40"
              ><span class="text-ellipsis overflow-hidden">{{
                data.recipient
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
    <!-- End of desktop width -->
  </DataTable>
</template>

<script setup lang="ts">
import { AppState } from "@/state/appState";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { TransactionUtils } from "@/util/transactionUtils";

export interface balanceTransfer {
  type: string;
  mosaicId: string;
  amount: number;
  sender: string;
  recipient: string;
}

defineProps<{
  data: balanceTransfer[];
  pages: number;
}>();
</script>
