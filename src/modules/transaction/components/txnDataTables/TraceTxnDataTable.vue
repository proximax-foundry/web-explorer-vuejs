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
                :to="{ name: 'ViewTransaction', params: { hash: data.transactionInfo.hash } }"
              >
                <span
                  class="text-xs truncate inline-flex break-all hover:underline hover:text-blue-primary text-ellipsis overflow-hidden w-44"
                  v-tooltip.right="data.transactionInfo.hash"
                  >{{ data.transactionInfo.hash }}</span
                >...
              </router-link>
            </div>
            <div>
              <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
                Type
              </div>
              <div class="flex items-center">
                <div class="uppercase font-bold text-xs mr-2">
                  {{ formatTypeWord(TransactionType[data.type]) }}
                </div>
                <div class="ml-2" v-if="accountAddress">
                  <img
                    src="@/modules/transaction/img/icon-txn-out.svg"
                    class="inline-block"
                    v-if="
                      data.signer.address.address.plain() === Helper.createAddress(accountAddress).plain()
                    "
                  />
                  <img
                    src="@/modules/transaction/img/icon-txn-in.svg"
                    class="inline-block"
                    v-else
                  />
                </div>
              </div>
            </div>
            <div>
              <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
                Recipient
              </div>
              <div class="uppercase font-bold text-xs">
                <span
                  v-if="data.recipient.address === '' || data.recipient.address === null"
                >-</span>
                <router-link
                  :to="{
                    name: 'ViewAccount',
                    params: { accountParam: data.recipient.address },
                  }"
                  v-tooltip.right="Helper.createAddress(data.recipient.address).pretty()"
                  v-else
                  class="truncate inline-flex text-xs break-all text-blue-600 hover:text-blue-primary hover:underline w-44"
                  ><span class="text-ellipsis overflow-hidden">{{
                    Helper.createAddress(data.recipient.address).pretty()
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
                <span v-if="data.signer.address.address === '' || data.signer.address.address === null">-</span>
                <router-link
                  :to="{
                    name: 'ViewAccount',
                    params: { accountParam: data.signer.address.address },
                  }"
                  v-else
                  v-tooltip.bottom="Helper.createAddress(data.signer.address.address).pretty()"
                  class="truncate inline-flex w-44 text-xs break-all text-blue-600 hover:text-blue-primary hover:underline"
                  ><span class="text-ellipsis overflow-hidden">{{
                    Helper.createAddress(data.signer.address.address).pretty()
                  }}</span
                  >...</router-link
                >
              </div>
            </div>
            <div>
              <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
                Tx Amount
              </div>
              <div class="text-xs uppercase font-bold">
                {{
                  data.amountTransfer
                    ? Helper.toCurrencyFormat(
                        data.amountTransfer,
                        currencyDivisibility
                      )
                    : "-"
                }}
                <b v-if="data.amountTransfer">{{ nativeTokenName }}</b>
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
              :to="{ name: 'ViewTransaction', params: { hash: data.transactionInfo.hash } }"
              class="text-xs text-blue-600 hover:text-blue-primary hover:underline inline-flex"
              v-tooltip.bottom="data.transactionInfo.hash"
              ><span class="text-ellipsis overflow-hidden w-20">{{
                data.transactionInfo.hash
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
            <span class="text-xs">{{ formatTypeWord(TransactionType[data.type]) }}</span>
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
              :to="{ name: 'ViewBlock', params: { blockHeight: data.transactionInfo.height.compact() } }"
              class="text-blue-600 hover:text-blue-primary hover:underline text-xs"
              >{{ data.transactionInfo.height.compact() }}</router-link
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
            <span v-if="data.signer.address.address === '' || data.signer.address.address === null">-</span>
            <router-link
              :to="{ name: 'ViewAccount', params: { accountParam: data.signer.address.address } }"
              v-else
              v-tooltip.bottom="Helper.createAddress(data.signer.address.address).pretty()"
              class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-32"
              ><span class="text-ellipsis overflow-hidden"
                >{{ Helper.createAddress(data.signer.address.address).pretty() }} </span
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
            <span v-if="data.recipient.address === '' || data.recipient.address === null">-</span>
            <router-link
              :to="{
                name: 'ViewAccount',
                params: { accountParam: data.recipient.address },
              }"
              v-tooltip.bottom="Helper.createAddress(data.recipient.address).pretty()"
              v-else
              class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-32"
            >
              <span class="text-ellipsis overflow-hidden">{{
                Helper.createAddress(data.recipient.address).pretty()
              }}</span
              >...
            </router-link>
          </template>
        </Column>
        <Column :header="'AMOUNT(' + nativeTokenName + ')'" headerStyle="width:10px" v-if="wideScreen">
          <template #body="{ data }">
            <div v-if="data.signer.address.address === Helper.createAddress(accountAddress!).plain()" class="inline-block font-bold py-1 px-2 my-1 mx-1 rounded bg-red-200 text-red-700">{{ data.transactionInfo.size* }}</div>
            <div v-for="mosaic of data.mosaics">
              <div v-if="mosaic.id.toHex().toUpperCase() === '13BFC518E40549D7' || mosaic.id.toHex().toUpperCase() === 'BFFB42A19116BDF6'"  class="inline-block font-bold py-1 px-2 my-1 mx-1 rounded" :class="data.signer.address.address === Helper.createAddress(accountAddress!).plain() ? 'bg-red-200 text-red-700' : 'bg-green-200 text-green-700'">
                {{ TransactionUtils.convertToExactNativeAmount(mosaic.amount.compact()) }}
              </div>
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
  import type { SDA } from "@/models/transactions/sda";
  import { TransactionUtils } from "@/util/transactionUtils";
  import { TransactionType, MosaicId, NamespaceId } from "tsjs-xpx-chain-sdk";
  
  defineProps({
    transactions: Array,
    accountAddress: String,
    pages: Number,
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
  const nativeTokenName = computed(() => AppState.nativeToken.label);
  
  const currencyDivisibility = computed(() => {
    return AppState.nativeToken.divisibility;
  });

  const  formatTypeWord = (txnType: string) => {
  return txnType.replace(/_/g, ' ').replace(/\b\w+\b/g, type => {
    return type.charAt(0) + type.slice(1).toLowerCase();
  });
}
  </script>
  
  <style lang="scss" scoped></style>