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
              <div class="grid grid-cols-2">
                <div class="grid-cols-1">
                  <div class="uppercase text-xs text-gray-300 font-bold mb-2">
                    Scoped Metadata Key
                  </div>
                  <div class="text-xs" v-if="data.scopedMetadataKeyHex">
                    <router-link
                    :to="{
                      name: 'ViewMetadata',
                      params: { compositeHash: data.compositeHash },
                    }"
                    class="text-blue-600 hover:text-blue-primary uppercase hover:underline"
                    >{{ data.scopedMetadataKeyHex }}
                  </router-link>
                    <div class="inline-block ml-2 font-semibold text-gray-400">
                      utf-8
                    </div>
                  </div>
                  <div class="mt-1 text-xs" v-if="data.scopedMetadataKeyUtf8">
                    {{ data.scopedMetadataKeyUtf8 }}
                    <div class="inline-block ml-2 font-semibold text-gray-400">
                      utf-8
                    </div>
                  </div>
                </div>
                <div class="grid-cols-1">
                  <div class="uppercase text-xs text-gray-300 font-bold mb-2">
                    Current Value
                  </div>
                  <div class="text-xs mb-2">{{ data.value }}</div>
                </div>
              </div>
            </div>
          </template>
        </Column>
        <Column style="width: 10px" v-if="wideScreen"> </Column>
        <Column
          field="SCOPED METADATA KEY"
          header="SCOPED METADATA KEY"
          style="width: 250px"
          v-if="wideScreen"
        >
          <template #body="{ data }">
            <div class="text-xs" v-if="data.scopedMetadataKeyHex">
              <router-link
                    :to="{
                      name: 'ViewMetadata',
                      params: { compositeHash: data.compositeHash},
                    }"
                    class="text-blue-600 hover:text-blue-primary uppercase hover:underline"
                    >{{ data.scopedMetadataKeyHex }}
                  </router-link>
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
            <!-- <div class="uppercase text-xs pt-1" v-if="data.scopedMetadataKeyUtf8">{{data.scopedMetadataKeyUtf8 + "  (utf-8)"}}</div> -->
          </template>
        </Column>
        <Column
          field="CURRENT VALUE"
          header="CURRENT VALUE"
          style="width: 150px"
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
import type { MetadataObj } from "@/util/metadataUtil";

defineProps({
  metadata: {
    type: Array<MetadataObj>,
    required: true,
  },
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
