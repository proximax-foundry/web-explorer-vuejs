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
      <template #body="{ data }: { data: artifactExpiry }">
        <div class="uppercase text-xs text-gray-300 font-bold mb-1 break-all">
          Receipt Type
        </div>
        <span class="uppercase font-bold text-xs mr-2">{{ data.type }}</span>
      </template>
    </Column>
    <Column class="lg:hidden w-[200px]">
      <template #body="{ data }: { data: artifactExpiry }">
        <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
          Artifact ID
        </div>
        <div class="uppercase font-bold text-xs">
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
            class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-40"
            ><span class="text-ellipsis overflow-hidden">{{
              data.artifactId
            }}</span></router-link
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
      <template #body="{ data }: { data: artifactExpiry }">
        <div class="uppercase font-bold text-xs mr-2">
          {{ data.type }}
        </div>
      </template>
    </Column>
    <Column
      class="hidden lg:table-cell"
      field="artifactId"
      header="Artifact Id"
      headerClass="uppercase"
    >
      <template #body="{ data }: { data: artifactExpiry }">
        <div class="uppercase font-bold text-xs">
          <router-link
            :to="{
                name: TransactionUtils.isNamespaceWithString(data.artifactId!)
                  ? 'ViewNamespace'
                  : 'ViewAsset',
                params: TransactionUtils.isNamespaceWithString(data.artifactId!)
                  ? { namespaceParam: data.artifactId }
                  : { id: data.artifactId },
              }"
            v-tooltip.right="data.artifactId"
            class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-40"
            ><span class="text-ellipsis overflow-hidden">{{
              data.artifactId
            }}</span></router-link
          >
        </div>
      </template>
    </Column>
    <!-- End of desktop width -->
  </DataTable>
</template>

<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { TransactionUtils } from "@/util/transactionUtils";

export interface artifactExpiry {
  type: string;
  artifactId: string;
}

defineProps<{
  data: artifactExpiry[];
  pages: number;
}>();
</script>
