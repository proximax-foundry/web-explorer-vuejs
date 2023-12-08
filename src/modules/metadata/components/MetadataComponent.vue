<template>
    <div>
    <div v-if="metadata.length == 0" class="ml-10 text-tsm">
      No record found
    </div>
    <div v-else>
      <DataTable
        :value="metadata"
        :paginator="false"
        :rows="20"
        responsiveLayout="scroll"
        scrollDirection="horizontal"
        :alwaysShowPaginator="false"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate=""
        tableStyle=""
        class="w-full"
      >
        <Column style="width: 300px" v-if="!wideScreen">
          <template #body="{ data }">
            <div class="mb-2">
              <div class="grid grid-cols-3">
                <div class="grid-cols-1">
                  <div class="uppercase text-xs text-gray-300 font-bold mb-2">
                    Block
                  </div>
                  <div class="text-xs mb-2">{{ data.block }}</div>
                </div>
                <div class="grid-cols-1">
                  <div class="uppercase text-xs text-gray-300 font-bold mb-2">
                    Timestamp
                  </div>
                  <div class="text-xs mb-2">{{ data.timestamp }}</div>
                </div>
                <div class="grid-cols-1">
                  <div class="uppercase text-xs text-gray-300 font-bold mb-2">
                     Value
                  </div>
                  <div class="text-xs mb-2">{{ data.value }}</div>
                </div>
              </div>
            </div>
          </template>
        </Column>
        <Column style="width: 10px" v-if="wideScreen"> </Column>
        <Column
          field="Scoped Metadata Key"
          header="Scoped Metadata Key"
          style="width: 250px; font-size: 12px;"
          v-if="wideScreen"
        >
          <template #body="{ data }">
            <div class="text-xs" v-if="data.scopedMetadataKeyHex">
              {{ data.scopedMetadataKeyHex }}
              <div class="inline-block ml-2 font-semibold text-gray-400">
                hex
              </div>
            </div>
            <div class="mt-1 text-xs" v-if="data.scopedMetadataKeyUtf8">
              {{ data.scopedMetadataKeyUtf8 }}
              <div class="inline-block ml-2 font-semibold text-gray-400">
                utf-8
              </div>
            </div>
          </template>
        </Column>
        <Column
          field="Creation Block"
          header="Creation Block"
          style="width: 130px; font-size: 12px;"
          v-if="wideScreen"
        >
          <template #body="{ data }">
            <span class="text-xs">{{ data.block }}</span>
          </template>
        </Column>
        <Column
          field="Creation Timestamp"
          header="Creation Timestamp"
          style="width: 200px; font-size: 12px;"
          v-if="wideScreen"
        >
          <template #body="{ data }">
            <span class="text-xs">{{ data.timestamp }}</span>
          </template>
        </Column>
        <Column
          field="Account Public Key"
          header="Account Public Key"
          style="width: 700px; font-size: 12px;"
          v-if="wideScreen"
        >
          <template #body="{ data }">
            <span class="text-xs">{{ data.accPublicKey }}</span>
          </template>
        </Column>
        <Column
          field="Asset ID"
          header="Asset ID"
          style="width: 200px; font-size: 12px;"
          v-if="wideScreen && isAsset"
        >
          <template #body="{ data }">
            <span class="text-xs">{{ data.assetId }}</span>
          </template>
        </Column>
        <Column
          field="Namespace"
          header="Namespace"
          style="width: 200px; font-size: 12px;"
          v-if="wideScreen && isNamespace"
        >
          <template #body="{ data }">
            <span class="text-xs">{{ data.namespace }}</span>
          </template>
        </Column>
        <Column
          field="Metadata Type"
          header="Metadata Type"
          style="width: 100px; font-size: 12px;"
          v-if="wideScreen"
        >
          <template #body="{ data }">
            <span class="text-xs">{{ data.type }}</span>
          </template>
        </Column>
        <Column
          field="Creation Value"
          header="Creation Value"
          style="width: 100px; font-size: 12px;"
          v-if="wideScreen"
        >
          <template #body="{ data }">
            <span class="text-xs">{{ data.value }}</span>
          </template>
        </Column>
      </DataTable>
    </div>
    </div>
</template>

<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { ref, onMounted, onUnmounted } from "vue";
import type { MetadataObj } from "../views/ViewMetadata.vue";

defineProps({
  metadata: {
    type: Array<MetadataObj>,
    required: true,
  },
  isAsset: Boolean,
  isNamespace: Boolean,
});
const wideScreen = ref(false);
const screenResizeHandler = () => {
  if (window.innerWidth < 1024) {
    wideScreen.value = false;
  } else {
    wideScreen.value = true;
  }
};
screenResizeHandler();

onMounted(() => {
  window.addEventListener("resize", screenResizeHandler);
});

onUnmounted(() => {
  window.removeEventListener("resize", screenResizeHandler);
});
</script>