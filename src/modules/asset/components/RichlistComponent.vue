<template>
  <div>
    <div v-if="!transactions.length" class="ml-10 text-tsm">
      No record found
    </div>
    <div v-else>
      <DataTable
        :value="transactions"
        :paginator="true"
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
              <div class="uppercase text-xs text-gray-300 font-bold mb-2">
                ADDRESS
              </div>
              <router-link
                :to="{
                  name: 'ViewAccount',
                  params: { accountParam: data.address.pretty() },
                }"
                class="mb-6 uppercase font-bold text-xs text-blue-600 hover:text-blue-primary hover:underline truncate inline-flex w-80"
                ><span
                  class="text-ellipsis overflow-hidden"
                  v-tooltip.bottom="data.address.pretty()"
                  >{{ data.address.pretty() }}</span
                >...</router-link
              >
              <div class="grid grid-cols-2">
                <div class="grid-cols-1">
                  <div class="uppercase text-xs text-gray-300 font-bold mb-2">
                    BALANCE
                  </div>
                  <div class="uppercase font-bold text-xs mb-4">
                    {{ getCurrency(data.amount.compact()) }}
                  </div>
                </div>
                <div class="grid-cols-1">
                  <div class="uppercase text-xs text-gray-300 font-bold mb-2">
                    PERCENTAGE
                  </div>
                  <div class="uppercase font-bold text-xs mb-2">
                    {{ getPercentage(data.amount.compact()) }}%
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Column>
        <Column style="width: 30px" v-if="wideScreen"> </Column>
        <Column
          field="ADDRESS"
          header="ADDRESS"
          style="width: 450px"
          v-if="wideScreen"
        >
          <template #body="{ data }">
            <span
              ><router-link
                :to="{
                  name: 'ViewAccount',
                  params: { accountParam: data.address.pretty() },
                }"
                class="uppercase text-blue-600 hover:text-blue-primary hover:underline inline-flex"
                >{{ data.address.pretty() }}</router-link
              ></span
            >
          </template>
        </Column>
        <Column
          field="BALANCE"
          header="BALANCE"
          style="width: 250px"
          v-if="wideScreen"
        >
          <template #body="{ data }">
            <span class="uppercase text-xs">{{
              getCurrency(data.amount.compact())
            }}</span>
          </template>
        </Column>
        <Column
          field="PERCENTAGE"
          header="PERCENTAGE"
          style="width: 150px"
          v-if="wideScreen"
        >
          <template #body="{ data }">
            <span class="uppercase font-bold text-xs"
              >{{ getPercentage(data.amount.compact()) }}%</span
            >
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
import { Helper } from "@/util/typeHelper";

const p = defineProps({
  transactions: {
    type: Array,
    required: true,
  },
  supply: {
    type: Number,
    required: true,
  },
  divisibility: {
    type: Number,
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

const getCurrency = (amount: number) => {
  return Helper.convertToCurrency(amount, p.divisibility);
};

const getPercentage = (amount: number) => {
  return ((amount / Math.pow(10, p.divisibility) / p.supply) * 100).toFixed(
    p.divisibility
  );
};
</script>
