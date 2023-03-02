<template>
  <div class="w-32 bg-gray-50">
    <div
      @click="toggleSelection = !toggleSelection"
      class="ml-auto mr-auto py-2 px-2 cursor-pointer current-search-filter"
    >
      <div class="flex justify-between items-center">
        <div class="flex flex-col ml-2 text-left mr-5">
          <div class="mt-1 text-xs">{{ selectedFilterTerm }}</div>
        </div>
        <img
          src="@/assets/img/icon-caret-down-black.svg"
          class="ml-2 transition-all duration-200"
          :class="`${toggleSelection ? 'rotate-180 transform' : ''}`"
        />
      </div>
    </div>

    <div class="relative" v-if="toggleSelection">
      <div
        class="absolute w-full z-50 bg-white max-h-60 overflow-auto px-1 filter drop-shodow-xl pb-2 border border-gray-300 search-filter"
      >
        <div
          v-for="(item, index) in filterOptions"
          :key="index"
          class="py-3 flex cursor-pointer items-center hover:bg-gray-50 transition-all duration-300"
          @click="selectFilter(item.val)"
        >
          <div class="text-xs ml-2 font-semibold">{{ item.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

const props = defineProps(["selected"]);
const emit = defineEmits(["selected-filter"]);
const toggleSelection = ref(false);

const filterOptions = ref([
  { label: "All Filters", val: "all" },
  { label: "Tx Hash", val: "tx" },
  { label: "Block", val: "block" },
  { label: "Asset ID", val: "assetID" },
  { label: "Namespace", val: "namespaceID" },
  { label: "Address", val: "address" },
  { label: "Public Key", val: "publicKey" },
]);

const selectedFilter = ref(props.selected);

const selectedFilterTerm = computed(() => {
  const findOption = filterOptions.value.find(
    (filter) => filter.val == props.selected
  );
  return findOption ? findOption.label : "All Filters";
});

const selectFilter = (filterValue: string) => {
  selectedFilter.value = filterValue;
  emit("selected-filter", filterValue);
  toggleSelection.value = false;
};
</script>
