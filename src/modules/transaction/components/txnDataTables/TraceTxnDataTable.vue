<template>
    <div>
      <DataTable
        :value="transactions"
        scrollDirection="horizontal"
        responsiveLayout="scroll"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate=""
        :globalFilterFields="['recipient', 'sender', 'signerAddress', 'type']"
      >
        <Column style="width: 200px" v-if="!wideScreen">
          <template #body="{ data }">
            <div>
              <div
                class="uppercase text-xs text-gray-300 font-bold mb-1 break-all"
              >
                TX HASH
              </div>
              <router-link
                class="uppercase font-bold text-xs block text-blue-600 hover:text-blue-primary hover:underline"
                :to="{ name: 'ViewTransaction', params: { hash: data.hash } }"
              >
                <span
                  class="text-xs truncate inline-flex break-all hover:underline hover:text-blue-primary text-ellipsis overflow-hidden w-44"
                  v-tooltip.right="data.hash"
                  >{{ data.hash }}</span
                >...
              </router-link>
            </div>
            <div>
              <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
                Type
              </div>
              <div class="flex items-center">
                <div class="uppercase font-bold text-xs mr-2">
                  {{ data.type }}
                </div>
              </div>
            </div>
            <div>
              <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
                Recipient
              </div>
              <div class="uppercase font-bold text-xs">
                <span
                  v-if="data.recipient === '' || data.recipient === null"
                >-</span>
                <router-link
                  :to="{
                    name: 'ViewAccount',
                    params: { accountParam: data.recipient },
                  }"
                  v-tooltip.right="Helper.createAddress(data.recipient).pretty()"
                  v-else
                  class="truncate inline-flex text-xs break-all text-blue-600 hover:text-blue-primary hover:underline w-44"
                  ><span class="text-ellipsis overflow-hidden">{{
                    Helper.createAddress(data.recipient).pretty()
                  }}</span
                  >...</router-link
                >
              </div>
            </div>
          </template>
        </Column>
        <Column style="width: 200px" v-if="!wideScreen">
          <template #body="{ data }">
            <div>
              <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
                From
              </div>
              <div class="uppercase font-bold text-xs">
                <span v-if="data.sender === '' || data.sender === null">-</span>
                <router-link
                  :to="{
                    name: 'ViewAccount',
                    params: { accountParam: data.sender },
                  }"
                  v-else
                  v-tooltip.bottom="Helper.createAddress(data.sender).pretty()"
                  class="truncate inline-flex w-44 text-xs break-all text-blue-600 hover:text-blue-primary hover:underline"
                  ><span class="text-ellipsis overflow-hidden">{{
                    Helper.createAddress(data.sender).pretty()
                  }}</span
                  >...</router-link
                >
              </div>
            </div>
            <div>
              <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
                AMOUNT{{(nativeToken.label)}}
              </div>
              <div v-if="data.sender === Helper.createAddress(accountAddress!).plain() && data.amount.fee" class="inline-block text-xs font-bold py-1 px-2 my-1 mx-1 rounded bg-red-200 text-red-700">{{ data.amount.fee }} (fee)</div>
              <div v-if="data.amount.xpx">
                <div v-if="data.type === 'Place Sda Exchange Offer' || data.type === 'Remove Exchange Offer'" class="inline-block text-xs font-bold py-1 px-2 my-1 mx-1 rounded" :class="data.getXpxOffer ? 'bg-red-200 text-red-700' : 'bg-green-200 text-green-700'">
                  {{ data.amount.xpx }}
                </div>
                <div v-else class="inline-block text-xs font-bold py-1 px-2 my-1 mx-1 rounded" :class="data.sender === Helper.createAddress(accountAddress!).plain() ? 'bg-red-200 text-red-700' : 'bg-green-200 text-green-700'">
                  {{ data.amount.xpx }}
                </div>
              </div>
            </div>
          </template>
        </Column>
        <Column
          field="hash"
          header="TX HASH"
          headerStyle="width:50px"
          v-if="wideScreen"
        >
          <template #body="{ data }">
            <router-link
              :to="{ name: 'ViewTransaction', params: { hash: data.hash } }"
              class="text-xs text-blue-600 hover:text-blue-primary hover:underline inline-flex"
              v-tooltip.bottom="data.hash"
              ><span class="text-ellipsis overflow-hidden w-20">{{
                data.hash
              }}</span
              >...
            </router-link>
          </template>
        </Column>
        <Column
          field="type"
          header="TYPE"
          headerStyle="width:70px"
          v-if="wideScreen"
        >
          <template #body="{ data }">
            <span class="text-xs">{{ data.type }}</span>
          </template>
        </Column>
        <Column
          field="block"
          v-if="wideScreen"
          header="BLOCK"
          headerStyle="width:70px"
        >
          <template #body="{ data }">
            <router-link
              :to="{ name: 'ViewBlock', params: { blockHeight: data.block } }"
              class="text-blue-600 hover:text-blue-primary hover:underline text-xs"
              >{{ data.block }}</router-link
            >
          </template>
        </Column>
        <Column
          field="signer"
          header="FROM"
          headerStyle="width:130px"
          v-if="wideScreen"
        >
          <template #body="{ data }">
            <span v-if="data.sender === '' || data.sender === null">-</span>
            <router-link
              :to="{ name: 'ViewAccount', params: { accountParam: data.sender } }"
              v-else
              v-tooltip.bottom="Helper.createAddress(data.sender).pretty()"
              class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-32"
              ><span class="text-ellipsis overflow-hidden"
                >{{ Helper.createAddress(data.sender).pretty() }} </span
              >...
            </router-link>
          </template>
        </Column>
        <Column
          field="recipient"
          header="RECIPIENT"
          headerStyle="width:130px"
          v-if="wideScreen"
        >
          <template #body="{ data }">
            <span v-if="data.recipient === '' || data.recipient === null">-</span>
            <router-link
              :to="{
                name: 'ViewAccount',
                params: { accountParam: data.recipient },
              }"
              v-tooltip.bottom="Helper.createAddress(data.recipient).pretty()"
              v-else
              class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-32"
            >
              <span class="text-ellipsis overflow-hidden">{{
                Helper.createAddress(data.recipient).pretty()
              }}</span
              >...
            </router-link>
          </template>
        </Column>
        <Column :header="'AMOUNT(' + nativeToken.label + ')'" headerStyle="width:10px" v-if="wideScreen">
          <template #body="{ data }">
            <div v-if="data.sender === Helper.createAddress(accountAddress!).plain() && data.amount.fee" class="inline-block font-bold py-1 px-2 my-1 mx-1 rounded bg-red-200 text-red-700">{{ data.amount.fee }} (fee)</div>
            <div v-if="data.amount.xpx" class="inline-block font-bold py-1 px-2 my-1 mx-1 rounded" :class="data.sender === Helper.createAddress(accountAddress!).plain() ? 'bg-red-200 text-red-700' : 'bg-green-200 text-green-700'">
              {{ data.amount.xpx }}
            </div>
          </template>
        </Column>
        <template #empty> No transaction found </template>
        <template #loading> Fetching transactions </template>
      </DataTable>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from "vue";
  import DataTable from "primevue/datatable";
  import Column from "primevue/column";
  import { Helper } from "@/util/typeHelper";
  import { AppState } from "@/state/appState";
  
  defineProps({
    transactions: Array,
    accountAddress: String,
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
  
  onUnmounted(() => {
    window.removeEventListener("resize", screenResizeHandler);
  });
  
  onMounted(() => {
    window.addEventListener("resize", screenResizeHandler);
  });
  const nativeToken = computed(() => AppState.nativeToken);

  </script>
  
  <style lang="scss" scoped></style>