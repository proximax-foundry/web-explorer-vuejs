<template>
  <div v-if="!wideScreen">
    <DataTable :value="harvesters">
      <Column class="grid grid-cols-2 gap-6">
        <template #body="{ data }">
          <div>
            <div>
              <div class="uppercase text-xs text-gray-300 font-bold mb-1">
                Key
              </div>
              <div
                class="overflow-ellipsis overflow-hidden ... text-blue-primary"
              >
                <router-link
                  :to="{
                    name: 'ViewAccount',
                    params: { accountParam: data.harvesterKey.publicKey },
                  }"
                  class="text-xs text-blue-primary hover:underline hover:text-blue-primary"
                >
                  <span v-tooltip.right="data.harvesterKey.publicKey">{{
                    data.harvesterKey.publicKey
                  }}</span>
                </router-link>
              </div>
            </div>
          </div>
          <div>
            <div class="uppercase text-xs text-gray-300 font-bold mb-1">
              Block
            </div>
            <div>
              <router-link
                :to="{
                  name: 'ViewBlock',
                  params: { blockHeight: data.lastSigningBlockHeight.lower },
                }"
                class="text-xs text-blue-primary hover:underline hover:text-blue-primary"
              >
                <span>{{ data.lastSigningBlockHeight.lower }}</span>
              </router-link>
            </div>
          </div>
          <div>
            <div class="uppercase text-xs text-gray-300 font-bold mb-1">
              Active
            </div>
            <div>{{ data.canHarvest ? "Yes" : "No" }}</div>
          </div>
          <div>
            <div>
              <div class="uppercase text-xs text-gray-300 font-bold mb-1">
                Effective Balance
              </div>
              {{ [data.effectiveBalance.higher, data.effectiveBalance.lower] }}
            </div>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
  <div v-else>
    <DataTable :value="harvesters">
      <Column header="Key" headerStyle="width:110px; text-transform:uppercase">
        <template #body="{ data }">
          <div>
            <router-link
              :to="{
                name: 'ViewAccount',
                params: { accountParam: data.harvesterKey.publicKey },
              }"
              class="text-xs text-blue-primary hover:underline hover:text-blue-primary"
            >
              <span>{{ data.harvesterKey.publicKey }}</span>
            </router-link>
          </div>
        </template>
      </Column>
      <Column
        header="Block"
        headerStyle="width:110px; text-transform:uppercase"
      >
        <template #body="{ data }">
          <div>
            <router-link
              :to="{
                name: 'ViewBlock',
                params: { blockHeight: data.lastSigningBlockHeight.lower },
              }"
              class="text-xs text-blue-primary hover:underline hover:text-blue-primary"
            >
              <span>{{ data.lastSigningBlockHeight.lower }}</span>
            </router-link>
          </div>
        </template>
      </Column>
      <Column
        header="Active"
        headerStyle="width:110px; text-transform:uppercase"
      >
        <template #body="{ data }">
          <div>{{ data.canHarvest ? "Yes" : "No" }}</div>
        </template>
      </Column>
      <Column
        header="Effective Balance"
        headerStyle="width:150px; text-transform:uppercase"
      >
        <template #body="{ data }">
          <div>
            {{ [data.effectiveBalance.higher, data.effectiveBalance.lower] }}
          </div>
        </template>
      </Column>
      <template #empty> No transaction found </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { defineProps } from "vue";
import { onMounted, onUnmounted, ref } from "vue";

const wideScreen = ref(true);

defineProps({
  harvesters: Array,
});

onUnmounted(() => {
  window.removeEventListener("resize", screenResizeHandler);
});

onMounted(() => {
  window.addEventListener("resize", screenResizeHandler);
});

const screenResizeHandler = () => {
  if (window.innerWidth < 1024) {
    wideScreen.value = false;
  } else {
    wideScreen.value = true;
  }
};

screenResizeHandler();
</script>
