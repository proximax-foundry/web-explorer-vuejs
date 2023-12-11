<template>
  <div class="border-2 border-t-2">
    <div class="hidden lg:block text-xs">
      <div
        class="grid grid-cols-6 bg-gray-100 font-semibold text-gray-600 px-3"
      >
        <div class="px-2 py-3 col-span-4">Drive Key</div>
        <div class="px-2 py-3 col-span-1">Drive Size (MB)</div>
        <div class="px-2 py-3 col-span-1">Replicators</div>
      </div>
      <div
        v-for="driveInfo in bcDrivesInfo"
        class="grid grid-cols-6 px-3 py-6 gray-line"
      >
        <div class="col-span-4 px-2 py-6">
          <router-link
            :to="{
              name: 'ViewTransaction',
              params: { hash: driveInfo.multisig },
            }"
            class="text-blue-600 hover:text-blue-primary hover:underline"
          >
            {{ driveInfo.multisig }}
          </router-link>
        </div>
        <div class="col-span-1 px-2 py-6">
          {{ driveInfo.size.lower }}
        </div>
        <div class="col-span-1 px-2 py-6">
          {{ driveInfo.replicatorCount }}
        </div>
      </div>
    </div>
    <div v-for="driveInfo in bcDrivesInfo" class="lg:hidden px-5 gray-line">
      <div class="text-xs py-4">
        <div class="font-semibold text-gray-600 bg-gray-100">Drive Key</div>
        <router-link
          :to="{
            name: 'ViewTransaction',
            params: { hash: driveInfo.multisig },
          }"
          class="text-blue-600 hover:text-blue-primary hover:underline break-all"
        >
          {{ driveInfo.multisig }}
        </router-link>
      </div>
      <div class="grid grid-cols-2 text-xs pb-4">
        <div class="col-span-1">
          <div class="font-semibold text-gray-600 bg-gray-100">
            Drive Size (MB)
          </div>
          <div>{{ driveInfo.size.lower }}</div>
        </div>
        <div class="col-span-1">
          <div class="font-semibold text-gray-600 pb-1 bg-gray-100">
            Replicators
          </div>
          <div>{{ driveInfo.replicatorCount }}</div>
        </div>
      </div>
    </div>
    <div
      v-if="bcDrivesInfo.length > 10"
      class="ml-5 mr-5 sm:flex sm:justify-between my-5"
    >
      <div class="text-xs text-gray-700 mb-3 sm:mb-0 text-center sm:text-left">
        Show
        <select
          v-model="pageSize"
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
          @click="naviPage(1)"
          :class="{
            'bg-blue-100 border-blue-100 text-blue-700 cursor-pointer hover:bg-blue-200 duration-300 transition-all':
              enableFirstPage,
            'bg-gray-50 border-gray-50 text-gray-700': !enableFirstPage,
          }"
          class="inline-block border rounded-sm px-2 py-1 text-xs mx-1"
        >
          First
        </div>
        <div
          @click="naviPage(--currentPage)"
          :class="{
            'bg-blue-100 border-blue-100 text-blue-700 cursor-pointer hover:bg-blue-200 duration-300 transition-all':
              enablePreviousPage,
            'bg-gray-50 border-gray-50 text-gray-700': !enablePreviousPage,
          }"
          class="inline-block border rounded-sm px-2 py-1 text-xs mx-1"
        >
          Previous
        </div>
        <div
          class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs"
        >
          Page {{ currentPage }} of {{ totalPages }}
        </div>
        <div
          @click="naviPage(++currentPage)"
          :class="{
            'bg-blue-100 border-blue-100 text-blue-700 cursor-pointer hover:bg-blue-200 duration-300 transition-all':
              enableNextPage,
            'bg-gray-50 border-gray-50 text-gray-700': !enableNextPage,
          }"
          class="inline-block border rounded-sm px-2 py-1 text-xs mx-1"
        >
          Next
        </div>
        <div
          @click="naviPage(totalPages)"
          :class="{
            'bg-blue-100 border-blue-100 text-blue-700 ml-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all':
              enableLastPage,
            'bg-gray-50 border-gray-50 text-gray-700 mx-1': !enableLastPage,
          }"
          class="inline-block border rounded-sm px-2 py-1 text-xs"
        >
          Last
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AppState } from "@/state/appState";
import { DriveQueryParams, UInt64 } from "tsjs-xpx-chain-sdk";
import { ref, computed } from "vue";
import type { DriveInfo } from "tsjs-xpx-chain-sdk";
import { faPrescriptionBottleMedical } from "@fortawesome/free-solid-svg-icons";

const props = defineProps({
  publicKey: String,
});

const emit = defineEmits(["showAllDrives"]);

const bcDrivesInfo = ref<DriveInfo[]>([]);
const pageSize = ref(10);
const currentPage = ref(1);
const totalPages = ref(0);

const loadDriveInfo = async () => {
  if (!AppState.isReady) {
    setTimeout(loadDriveInfo, 1000);
    return;
  }
  if (!props.publicKey) {
    return;
  }
  const qp = new DriveQueryParams();
  qp.owner = props.publicKey;
  qp.pageSize = pageSize.value;
  qp.pageNumber = currentPage.value;
  await AppState.chainAPI?.storageAPI
    .searchBcDrives(qp)
    .then((bcDrives) => {
      bcDrivesInfo.value = bcDrives.drivesInfo;
      emit("showAllDrives", bcDrivesInfo.value);
      totalPages.value = bcDrives.pagination.totalPages;
    })
    .catch(() => {
      // no drives
    });
};

const changeRows = () => {
  currentPage.value = 1;
  loadDriveInfo();
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
  loadDriveInfo();
};

loadDriveInfo();
</script>
