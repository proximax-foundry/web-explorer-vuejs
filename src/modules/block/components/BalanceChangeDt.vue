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
      <template #body="{ data }: { data: balanceChange }">
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
      </template>
    </Column>
    <Column class="lg:hidden w-[200px]">
      <template #body="{ data }: { data: balanceChange }">
        <div class="uppercase text-xs text-gray-300 font-bold mb-1">
          Account
        </div>
        <div class="uppercase font-bold text-xs">
          <router-link
            :to="{
              name: 'ViewAccount',
              params: { accountParam: data.account },
            }"
            v-tooltip.right="data.account"
            class="truncate inline-flex text-blue-600 hover:text-blue-primary hover:underline w-40"
            ><span class="text-ellipsis overflow-hidden">{{
              data.account
            }}</span
            >...</router-link
          >
        </div>
        <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
          Amount
        </div>
        <div class="text-xs uppercase font-bold">
          {{ data.amount }}
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
        <template #body="{ data } : { data: balanceChange }">
          <div class="uppercase font-bold text-xs mr-2">
            {{ data.type }}
          </div>
        </template>
      </Column>
      <Column
        class="hidden lg:table-cell"
        field="account"
        header="Account"
        headerClass="uppercase"
      >
        <template #body="{ data } : { data: balanceChange }">
          <div class="uppercase font-bold text-xs">
            <router-link
              :to="{
                name: 'ViewAccount',
                params: { accountParam: data.account },
              }"
              v-tooltip.right="data.account"
              class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-40"
              ><span class="text-ellipsis overflow-hidden">{{
                data.account
              }}</span
              >...</router-link
            >
          </div>
        </template>
      </Column>
      <Column
        field="mosaicId"
        header="Asset ID"
        headerClass="uppercase"
        class="hidden lg:table-cell"
      >
        <template #body="{ data }  : { data: balanceChange }">
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
        <template #body="{ data } : { data: balanceChange }">
          <div class="text-xs uppercase font-bold">
            {{ data.amount  }}
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

export interface balanceChange {
  type: string;
  account: string;
  mosaicId: string;
  amount: number;
}

defineProps<{
  data: balanceChange[];
  pages: number;
}>();
</script>
