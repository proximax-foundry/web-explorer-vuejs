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
                  <div class="text-xs mb-2">
                    <router-link
                      :to="{
                        name: 'ViewBlock',
                        params: { blockHeight: data.block },
                      }"
                      class="text-blue-600 hover:text-blue-primary hover:underline"
                      >{{ data.block }}</router-link
                    >
                  </div>
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
          field="Block"
          header="Block"
          style="width: 130px; font-size: 12px"
          v-if="wideScreen"
        >
          <template #body="{ data }">
            <span class="text-xs"
              ><router-link
                :to="{
                  name: 'ViewBlock',
                  params: { blockHeight: data.block },
                }"
                class="text-blue-600 hover:text-blue-primary hover:underline"
                >{{ data.block }}</router-link
              ></span
            >
          </template>
        </Column>
        <Column
          field="Timestamp"
          header="Timestamp"
          style="width: 170px; font-size: 12px"
          v-if="wideScreen"
        >
          <template #body="{ data }">
            <span class="text-xs">{{ data.timestamp }}</span>
          </template>
        </Column>
        <Column
          field="Value"
          header="Value"
          style="width: 100px; font-size: 12px"
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
import type { MetadataHistoryObj } from "@/util/metadataUtil";

defineProps({
  metadata: {
    type: Array<MetadataHistoryObj>,
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
