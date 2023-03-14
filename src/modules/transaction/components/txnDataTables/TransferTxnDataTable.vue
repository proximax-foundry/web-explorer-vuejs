<template>
  <div>
    <DataTable
      :value="transactions"
      :paginator="false"
      :rows="Number(pages)"
      scrollDirection="horizontal"
      :alwaysShowPaginator="false"
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
                {{ data.typeName }}
              </div>
              <div class="ml-2" v-if="accountAddress">
                <img
                  src="@/modules/transaction/img/icon-txn-out.svg"
                  class="inline-block"
                  v-if="
                    data.sender === Helper.createAddress(accountAddress).plain()
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
                v-if="data.recipient === '' || data.recipient === null"
              ></span>
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
            <div class="uppercase text-xs text-gray-300 font-bold mb-1">
              Timestamp
            </div>
            <div class="uppercase font-bold text-xs">
              {{ Helper.convertDisplayDateTimeFormat24(data.timestamp) }}
            </div>
          </div>
          <div>
            <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
              From
            </div>
            <div class="uppercase font-bold text-xs">
              <span v-if="data.sender === '' || data.sender === null"></span>
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
        field="In/Out"
        header="IN/OUT"
        headerStyle="width:100px"
        v-if="wideScreen && accountAddress"
      >
        <template #body="{ data }">
          <div class="ml-2">
            <img
              src="@/modules/transaction/img/icon-txn-out.svg"
              class="inline-block"
              v-if="
                Helper.createAddress(data.sender).plain() ===
                Helper.createAddress(accountAddress).plain()
              "
            />
            <img
              src="@/modules/transaction/img/icon-txn-in.svg"
              class="inline-block"
              v-else
            />
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
        field="timestamp"
        v-if="wideScreen"
        header="TIMESTAMP"
        headerStyle="width:200px"
      >
        <template #body="{ data }">
          <span class="text-xs">{{
            Helper.convertDisplayDateTimeFormat24(data.timestamp)
          }}</span>
        </template>
      </Column>
      <Column
        field="type"
        header="TYPE"
        headerStyle="width:70px"
        v-if="wideScreen"
      >
        <template #body="{ data }">
          <span class="text-xs">{{ data.typeName }}</span>
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
          <span v-if="data.sender === '' || data.sender === null"></span>
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
          <span v-if="data.recipient === '' || data.recipient === null"></span>
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
      <Column header="TX FEE" v-if="wideScreen" headerStyle="width:110px">
        <template #body="{ data }">
          <div class="text-xs">
            {{ data.fee }}
            <b v-if="data.fee == 0 || data.fee > 0">{{ nativeTokenName }}</b>
          </div>
        </template>
      </Column>
      <Column header="AMOUNT" headerStyle="width:110px" v-if="wideScreen">
        <template #body="{ data }">
          <div class="text-xs" v-if="data.amountTransfer">
            {{
              Helper.toCurrencyFormat(data.amountTransfer, currencyDivisibility)
            }}
          </div>
          <div v-if="checkOtherAsset(data.sda)">
            <div v-for="(sda, index) in displaySDAs(data.sda)" :key="index">
              {{ Helper.toCurrencyFormat(sda.amount, sda.divisibility) }}
            </div>
          </div>
        </template>
      </Column>
      <Column header="SDA" headerStyle="width:150px" v-if="wideScreen">
        <template #body="{ data }">
          <div v-if="data.amountTransfer">
            <span v-if="data.amountTransfer">
              <router-link
                :to="{
                  name: 'ViewNamespace',
                  params: {
                    namespaceParam: AppState.nativeToken.fullNamespace,
                  },
                }"
                class="text-blue-600 hover:text-blue-primary hover:underline"
                >{{ nativeTokenName }}</router-link
              >
            </span>
          </div>
          <div v-if="checkOtherAsset(data.sda)">
            <span
              v-for="(sdaName, index) in displaySDAs(data.sda)"
              :key="index"
            >
              <router-link
                :to="{ name: 'ViewAsset', params: { id: sdaName.name } }"
                class="text-blue-600 hover:text-blue-primary flex hover:underline"
                >{{ sdaName.name }}</router-link
              >
              {{ data.sda.length }}
            </span>
          </div>
        </template>
      </Column>
      <Column header="MESSAGE" headerStyle="width:40px" v-if="wideScreen">
        <template #body="{ data }">
          <div class="flex justify-center">
            <img
              src="@/modules/transaction/img/icon-message.svg"
              v-tooltip.left="
                '<tiptitle>' +
                data.messageTypeTitle +
                '</tiptitle><tiptext>' +
                data.message +
                '</tiptext>'
              "
              class="inline-block"
              v-if="data.message && data.messageType !== 1"
            />
            <div v-else class="w-full text-center">-</div>
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

const countDecimals = function (amount: number) {
  if (Math.floor(amount) === amount) return 0;
  return amount.toString().split(".")[1].length || 0;
};

const displaySDAs = (sdas: SDA[]) => {
  let sda_rows: { name: string; amount: number; divisibility: number }[] = [];
  if (sdas.length > 0) {
    for (const sda of sdas) {
      if (sda.currentAlias && sda.currentAlias.length) {
        if (sda.currentAlias[0].name) {
          sda_rows.push({
            amount: sda.amount,
            name: sda.currentAlias[0].name,
            divisibility: countDecimals(sda.amount),
          });
        }
      } else {
        sda_rows.push({
          amount: sda.amount,
          name: sda.id,
          divisibility: countDecimals(sda.amount),
        });
      }
    }
    return sda_rows;
  }
};

const checkOtherAsset = (assets: SDA[]) => {
  if (assets) {
    if (assets.length > 0) {
      return true;
    }
  }
  return false;
};

const currencyDivisibility = computed(() => {
  return AppState.nativeToken.divisibility;
});
</script>

<style lang="scss" scoped></style>
