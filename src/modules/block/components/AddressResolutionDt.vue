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
      <template #body="{ data }: { data: addressResolution }">
        <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
          Namespace ID
        </div>
          <div class="flex items-center uppercase font-bold text-xs">
            <router-link
              :to="{
                name: 'ViewNamespace',
                params: { namespaceParam: data.namespaceId },
              }"
              class=" mr-2 text-blue-600 hover:underline hover:text-blue-primary"
            >
              {{ data.namespaceId }}
            </router-link>
          </div>
      </template>
    </Column>
    <Column class="lg:hidden w-[200px]">
      <template #body="{ data }: { data: addressResolution }">
        <router-link
          :to="{
            name: 'ViewAccount',
            params: { accountParam: data.address },
          }"
          v-tooltip.right="data.address"
          class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-40"
          ><span class="text-ellipsis overflow-hidden">{{ data.address }}</span>
          ...
        </router-link>
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
        <template #body="{ data }: { data: addressResolution }">
            <div class="flex items-center uppercase font-bold text-xs">
              <router-link
                :to="{
                  name: 'ViewNamespace',
                  params: { namespaceParam: data.namespaceId },
                }"
                class=" mr-2 text-blue-600 hover:underline hover:text-blue-primary"
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
      <template #body="{ data }: { data: addressResolution }">
        <router-link
          :to="{
            name: 'ViewAccount',
            params: { accountParam: data.address },
          }"
          v-tooltip.right="data.address"
          class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-40"
          ><span class="text-ellipsis overflow-hidden">{{ data.address }}</span>
          ...
        </router-link>
      </template>
      </Column>
    <!-- End of desktop width -->
  </DataTable>
</template>

<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";

export interface addressResolution {
  namespaceId: string;
  address: string;
}

defineProps<{
  data: addressResolution[];
  pages: number;
}>();

</script>
