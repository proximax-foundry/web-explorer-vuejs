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
        <template #body="{ data }: { data: sdaOfferRemoval }">
          <div class="mt-5 uppercase font-bold text-gray-300 mb-1">Sender</div>
          <router-link
            :to="{
              name: 'ViewAccount',
              params: { accountParam: data.sender },
            }"
            v-tooltip.right="data.sender"
            class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-40"
            ><span class="text-ellipsis overflow-hidden uppercase font-bold">{{
              data.sender
            }}</span></router-link
          >
          <div class="mt-5 uppercase font-bold text-gray-300 mb-1">
            Asset Id (Give)
          </div>
          <router-link
            :to="{ name: 'ViewAsset', params: { id: data.mosaicIdGive } }"
            class="uppercase font-bold text-xs mr-2 text-blue-600 hover:underline hover:text-blue-primary"
          >
            {{ data.mosaicIdGive }}
          </router-link>
        </template>
      </Column>
      <Column class="lg:hidden w-[200px]">
        <template #body="{ data }: { data: sdaOfferRemoval }">
          <div class="mt-5 uppercase font-bold text-gray-300 mb-1">
            Asset Id (Get)
          </div>
          <router-link
            :to="{ name: 'ViewAsset', params: { id: data.mosaicIdGet } }"
            class="uppercase font-bold text-xs mr-2 text-blue-600 hover:underline hover:text-blue-primary"
          >
            {{ data.mosaicIdGet }}
          </router-link>
          <div class="mt-5 uppercase font-bold text-gray-300 mb-1">
            Returned Amount (Give)
          </div>
          <div class="text-xs uppercase font-bold">
            {{ data.mosaicAmountGiveReturned }}
          </div>
        </template>
      </Column>
      <!-- End of mobile width -->
  
      <!-- Start of desktop width -->
      <Column
        class="hidden lg:table-cell"
        field="sender"
        header="Sender"
        headerClass="uppercase"
      >
        <template #body="{ data }: { data: sdaOfferRemoval }">
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
        </template>
      </Column>
      <Column
        field="mosaicIdGive"
        header="Asset ID (Give)"
        headerClass="uppercase"
        class="hidden lg:table-cell"
      >
        <template #body="{ data }: { data: sdaOfferRemoval }">
          <router-link
            :to="{ name: 'ViewAsset', params: { id: data.mosaicIdGive } }"
            class="uppercase font-bold text-xs mr-2 text-blue-600 hover:underline hover:text-blue-primary"
          >
            {{ data.mosaicIdGive }}
          </router-link>
        </template>
      </Column>
      <Column
        field="mosaicIdGet"
        header="Asset ID (Get)"
        headerClass="uppercase"
        class="hidden lg:table-cell"
      >
        <template #body="{ data }: { data: sdaOfferRemoval }">
          <router-link
            :to="{ name: 'ViewAsset', params: { id: data.mosaicIdGet } }"
            class="uppercase font-bold text-xs mr-2 text-blue-600 hover:underline hover:text-blue-primary"
          >
            {{ data.mosaicIdGet }}
          </router-link>
        </template>
      </Column>
      <Column
        class="hidden lg:table-cell"
        field="mosaicAmountGiveReturned"
        header="Returned Amount (Give)"
        headerClass="uppercase"
      >
        <template #body="{ data }: { data: sdaOfferRemoval }">
          <div class="text-xs uppercase font-bold">
            {{ data.mosaicAmountGiveReturned }}
          </div>
        </template>
      </Column>
     
  
      <!-- End of desktop width -->
    </DataTable>
  </template>
  
  <script setup lang="ts">
  import DataTable from "primevue/datatable";
  import Column from "primevue/column";
  
  export interface sdaOfferRemoval {
    sender: string;
    mosaicIdGive: string;
    mosaicIdGet: string;
    mosaicAmountGiveReturned: number
  }
  
  defineProps<{
    data: sdaOfferRemoval[];
    pages: number;
  }>();
  </script>
  