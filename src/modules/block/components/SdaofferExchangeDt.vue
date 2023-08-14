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
      <template #body="{ data }: { data: sdaOfferExchange }">
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
          Offered Asset Id (Give)
        </div>
        <router-link
          :to="{ name: 'ViewAsset', params: { id: data.mosaicIdGive } }"
          class="uppercase font-bold text-xs mr-2 text-blue-600 hover:underline hover:text-blue-primary"
        >
          {{ data.mosaicIdGive }}
        </router-link>
        <div v-for="(details, index) of data.exchangeDetails" :key="index">
          <div v-if="index%2!=0">
            <div class="mt-5 uppercase font-bold text-gray-300 mb-1">
              Exchange Offer (Recipient/give/get) ({{ index + 1 }})
            </div>
            <div class="bg-blue-100 rounded-md p-2 flex flex-col gap-2">
              <router-link
                :to="{
                  name: 'ViewAccount',
                  params: { accountParam: details.recipient },
                }"
                v-tooltip.right="details.recipient"
                class="truncate text-xs text-blue-600 hover:text-blue-primary hover:underline w-40"
                ><span class="text-ellipsis overflow-hidden font-bold">{{
                  details.recipient
                }}</span
                >...</router-link
              >
              <div class="flex gap-2">
                <div class="font-bold">{{ details.mosaicAmountGive }}</div>
                <router-link
                  :to="{ name: 'ViewAsset', params: { id: data.mosaicIdGive } }"
                  class="uppercase font-bold text-xs mr-2 text-blue-600 hover:underline hover:text-blue-primary"
                >
                  {{ data.mosaicIdGive }}
                </router-link>
              </div>
              <div class="flex gap-2">
                <div class="font-bold">{{ details.mosaicAmountGet }}</div>
                <router-link
                  :to="{ name: 'ViewAsset', params: { id: data.mosaicIdGet } }"
                  class="uppercase font-bold text-xs mr-2 text-blue-600 hover:underline hover:text-blue-primary"
                >
                  {{ data.mosaicIdGet }}
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Column>
    <Column class="lg:hidden w-[200px]">
      <template #body="{ data }: { data: sdaOfferExchange }">
        <div class="mt-5 uppercase font-bold text-gray-300 mb-1">
          Offered Asset Id (Get)
        </div>
        <router-link
          :to="{ name: 'ViewAsset', params: { id: data.mosaicIdGet } }"
          class="uppercase font-bold text-xs mr-2 text-blue-600 hover:underline hover:text-blue-primary"
        >
          {{ data.mosaicIdGet }}
        </router-link>
        <div v-for="(details, index) of data.exchangeDetails" :key="index">
          <div v-if="index%2==0">
            <div class="mt-5 uppercase font-bold text-gray-300 mb-1">
              Exchange Offer (Recipient/give/get) ({{ index + 1 }})
            </div>
            <div class="bg-blue-100 rounded-md p-2 flex flex-col gap-2">
              <router-link
                :to="{
                  name: 'ViewAccount',
                  params: { accountParam: details.recipient },
                }"
                v-tooltip.right="details.recipient"
                class="truncate text-xs text-blue-600 hover:text-blue-primary hover:underline w-40"
                ><span class="text-ellipsis overflow-hidden font-bold">{{
                  details.recipient
                }}</span
                >...</router-link
              >
              <div class="flex gap-2">
                <div class="font-bold">{{ details.mosaicAmountGive }}</div>
                <router-link
                  :to="{ name: 'ViewAsset', params: { id: data.mosaicIdGive } }"
                  class="uppercase font-bold text-xs mr-2 text-blue-600 hover:underline hover:text-blue-primary"
                >
                  {{ data.mosaicIdGive }}
                </router-link>
              </div>
              <div class="flex gap-2">
                <div class="font-bold">{{ details.mosaicAmountGet }}</div>
                <router-link
                  :to="{ name: 'ViewAsset', params: { id: data.mosaicIdGet } }"
                  class="uppercase font-bold text-xs mr-2 text-blue-600 hover:underline hover:text-blue-primary"
                >
                  {{ data.mosaicIdGet }}
                </router-link>
              </div>
            </div>
          </div>
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
      <template #body="{ data }: { data: sdaOfferExchange }">
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
      header="Offered Asset ID (Give)"
      headerClass="uppercase"
      class="hidden lg:table-cell"
    >
      <template #body="{ data }: { data: sdaOfferExchange }">
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
      header="Offered Asset ID (Get)"
      headerClass="uppercase"
      class="hidden lg:table-cell"
    >
      <template #body="{ data }: { data: sdaOfferExchange }">
        <router-link
          :to="{ name: 'ViewAsset', params: { id: data.mosaicIdGet } }"
          class="uppercase font-bold text-xs mr-2 text-blue-600 hover:underline hover:text-blue-primary"
        >
          {{ data.mosaicIdGet }}
        </router-link>
      </template>
    </Column>
    <Column
      header="Exchange Details (recipient/give/get)"
      headerClass="uppercase"
      class="hidden lg:table-cell"
    >
      <template #body="{ data }: { data: sdaOfferExchange }">
        <div v-for="(details, index) of data.exchangeDetails" :key="index">
            <div class="bg-blue-100 rounded-md p-2 flex flex-col gap-2">
              <router-link
                :to="{
                  name: 'ViewAccount',
                  params: { accountParam: details.recipient },
                }"
                v-tooltip.right="details.recipient"
                class="truncate text-xs text-blue-600 hover:text-blue-primary hover:underline w-40"
                ><span class="text-ellipsis overflow-hidden font-bold">{{
                  details.recipient
                }}</span
                >...</router-link
              >
              <div class="flex gap-2">
                <div class="font-bold">{{ details.mosaicAmountGive }}</div>
                <router-link
                  :to="{ name: 'ViewAsset', params: { id: data.mosaicIdGive } }"
                  class="uppercase font-bold text-xs mr-2 text-blue-600 hover:underline hover:text-blue-primary"
                >
                  {{ data.mosaicIdGive }}
                </router-link>
              </div>
              <div class="flex gap-2">
                <div class="font-bold">{{ details.mosaicAmountGet }}</div>
                <router-link
                  :to="{ name: 'ViewAsset', params: { id: data.mosaicIdGet } }"
                  class="uppercase font-bold text-xs mr-2 text-blue-600 hover:underline hover:text-blue-primary"
                >
                  {{ data.mosaicIdGet }}
                </router-link>
              </div>
            </div>
        </div>
        
      </template>
    </Column>

    <!-- End of desktop width -->
  </DataTable>
</template>

<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";

export interface sdaOfferExchange {
  sender: string;
  mosaicIdGive: string;
  mosaicIdGet: string;
  exchangeDetails: {
    recipient: string;
    mosaicIdGive: string;
    mosaicIdGet: string;
    mosaicAmountGive: number;
    mosaicAmountGet: number;
  }[];
}

defineProps<{
  data: sdaOfferExchange[];
  pages: number;
}>();
</script>
