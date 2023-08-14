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
      <template #body="{ data }: { data: assetResolution }">
        <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
          Namespace ID
        </div>
        <div class="flex items-center uppercase font-bold text-xs">
          <router-link
            :to="{
              name: 'ViewNamespace',
              params: { namespaceParam: data.namespaceId },
            }"
            class="mr-2 text-blue-600 hover:underline hover:text-blue-primary"
          >
            {{ data.namespaceId }}
          </router-link>
        </div>
      </template>
    </Column>
    <Column class="lg:hidden w-[200px]">
      <template #body="{ data }: { data: assetResolution }">
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
    <!-- End of mobile width -->

    <!-- Start of desktop width -->
    <Column
      class="hidden lg:table-cell"
      field="namespaceId"
      header="Namespace ID"
      headerClass="uppercase"
    >
      <template #body="{ data }: { data: assetResolution }">
        <div class="flex items-center uppercase font-bold text-xs">
          <router-link
            :to="{
              name: 'ViewNamespace',
              params: { namespaceParam: data.namespaceId },
            }"
            class="mr-2 text-blue-600 hover:underline hover:text-blue-primary"
          >
            {{ data.namespaceId }}
          </router-link>
        </div>
      </template>
    </Column>
    <Column
      class="hidden lg:table-cell"
      field="address"
      header="Address"
      headerClass="uppercase"
    >
      <template #body="{ data }: { data: assetResolution }">
        <router-link
          :to="{ name: 'ViewAsset', params: { id: data.mosaicId } }"
          class="uppercase font-bold text-xs mr-2 text-blue-600 hover:underline hover:text-blue-primary"
        >
          {{ data.mosaicId }}
        </router-link>
      </template>
    </Column>
    <!-- End of desktop width -->
  </DataTable>
</template>

<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";

export interface assetResolution {
  namespaceId: string;
  mosaicId: string;
}

defineProps<{
  data: assetResolution[];
  pages: number;
}>();
</script>
