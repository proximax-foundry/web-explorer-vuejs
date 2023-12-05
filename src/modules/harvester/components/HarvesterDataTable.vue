<template>
  <DataTable :value="harvesters">
    <Column class="lg:hidden grid grid-cols-2 gap-6">
      <template #body="{ data }: { data: HarvesterMetaInfo }">
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
            <div class="flex gap-1">
              <div>
                {{
                  data.effectiveBalance.compact() /
                  Math.pow(10, AppState.nativeToken.divisibility)
                }}
              </div>

              <div class="font-semibold">{{ AppState.nativeToken.label }}</div>
            </div>
          </div>
        </div>
      </template>
    </Column>
    <Column
      header="Key"
      class="hidden lg:table-cell"
      headerStyle="width:110px; text-transform:uppercase"
    >
      <template #body="{ data }: { data: HarvesterMetaInfo }">
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
      class="hidden lg:table-cell"
      headerStyle="width:110px; text-transform:uppercase"
    >
      <template #body="{ data }: { data: HarvesterMetaInfo }">
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
      class="hidden lg:table-cell"
      header="Active"
      headerStyle="width:110px; text-transform:uppercase"
    >
      <template #body="{ data }: { data: HarvesterMetaInfo }">
        <div>{{ data.canHarvest ? "Yes" : "No" }}</div>
      </template>
    </Column>
    <Column
      class="hidden lg:table-cell"
      header="Effective Balance"
      headerStyle="width:150px; text-transform:uppercase"
    >
      <template #body="{ data }: { data: HarvesterMetaInfo }">
        <div class="flex gap-1">
          <div>
            {{
              data.effectiveBalance.compact() /
              Math.pow(10, AppState.nativeToken.divisibility)
            }}
          </div>

          <div class="font-semibold">{{ AppState.nativeToken.label }}</div>
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { defineProps } from "vue";
import type { HarvesterMetaInfo } from "tsjs-xpx-chain-sdk";
import { AppState } from "@/state/appState";

defineProps<{
  harvesters: HarvesterMetaInfo[];
}>();
</script>
