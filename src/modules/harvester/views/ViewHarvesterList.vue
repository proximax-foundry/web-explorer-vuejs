<template>
  <div>
    <p class="text-gray-500 mb-5 text-sm font-bold">Harvesters</p>
    <div v-if="isFetching">
      <div class="flex justify-center items-center border-gray-400 mt-15">
        <div
          class="animate-spin rounded-full h-5 w-5 border-b-2 border-navy-primary mr-2"
        ></div>
        <span class="text-tsm">Fetching transactions</span>
      </div>
    </div>
    <div v-else :class="{ 'mb-15': totalPages == 1 }">
      <HarvesterDataTable :harvesters="harvesters"></HarvesterDataTable>
      <div class="sm:flex sm:justify-between my-5 mb-15" v-if="totalPages > 1">
        <div
          class="text-xs text-gray-700 mb-3 sm:mb-0 text-center sm:text-left"
        >
          Show
          <select
            v-model="pages"
            class="border border-gray-300 rounded-md p-1"
            @change="changeRows"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
          </select>
          Records
        </div>
        <div class="sm:flex sm:items-center text-center sm:text-right">
          <div
            v-if="enableFirstPage"
            @click="naviPage(1)"
            class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs mx-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all"
          >
            First
          </div>
          <div
            v-else
            class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs mx-1"
          >
            First
          </div>
          <div
            v-if="enablePreviousPage"
            @click="naviPage(--currentPage)"
            class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs mx-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all"
          >
            Previous
          </div>
          <div
            v-else
            class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs mx-1"
          >
            Previous
          </div>
          <div
            class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs"
          >
            Page {{ currentPage }} of {{ totalPages }}
          </div>
          <div
            v-if="enableNextPage"
            @click="naviPage(++currentPage)"
            class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs mx-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all"
          >
            Next
          </div>
          <div
            v-else
            class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs mx-1"
          >
            Next
          </div>
          <div
            v-if="enableLastPage"
            @click="naviPage(totalPages)"
            class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs ml-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all"
          >
            Last
          </div>
          <div
            v-else
            class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs mx-1"
          >
            Last
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import HarvesterDataTable from "@/modules/harvester/components/HarvesterDataTable.vue";
import { AppState } from "@/state/appState";
import { PaginationQueryParams } from "tsjs-xpx-chain-sdk";
import { ref, watch, computed, getCurrentInstance } from "vue";

const harvesters = ref<any[]>([]);
const isFetching = ref(true);
const pages = ref(20);
const currentPage = ref(1);
const totalPages = ref(0);
const internalInstance = getCurrentInstance();
const emitter = internalInstance?.appContext.config.globalProperties.emitter;

const loadHarvestersInfo = async () => {
  isFetching.value = true;

  const pq = new PaginationQueryParams();
  pq.pageSize = pages.value;
  pq.pageNumber = currentPage.value;
  await AppState.chainAPI!.harvesterAPI.searchHarvesters(pq)
    .then(({ harvestersMetaInfo, pagination }) => {
      harvesters.value = harvestersMetaInfo;
      totalPages.value = pagination.totalPages;
      isFetching.value = false;
    })
    .catch(() => {
      harvesters.value = [];
      totalPages.value = 0;
      isFetching.value = false;
    });
};

const changeRows = () => {
  currentPage.value = 1;
  loadHarvestersInfo();
};

const enableFirstPage = computed(() => {
  return currentPage.value > 1;
});

const enablePreviousPage = computed(() => {
  return currentPage.value > 1;
});

const enableNextPage = computed(() => {
  return totalPages.value - currentPage.value > 0;
});

const enableLastPage = computed(() => {
  return currentPage.value < totalPages.value;
});

const naviPage = (pageNo: number) => {
  currentPage.value = pageNo;
  loadHarvestersInfo();
};

const stopWatch = watch(
  [() => AppState.isReady, () => AppState.chainAPI],
  async (n) => {
    if (n[0] && n[1]) {
      await loadHarvestersInfo();
      stopWatch();
    }
  },
  { immediate: true }
);

emitter.on("CHANGE_NETWORK", (payload: boolean) => {
  isFetching.value = true;
  if (payload) {
    currentPage.value = 1;
    loadHarvestersInfo();
  }
});
</script>
