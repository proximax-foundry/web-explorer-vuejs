<template>
  <div class="w-32 bg-gray-50">
    <div @click='toggleSelection = !toggleSelection' class= "ml-auto mr-auto py-3 px-2 cursor-pointer">
      <div class="flex justify-between items-center">
        <div class="flex flex-col ml-2 text-left mr-5">
          <div class='mt-1 text-xs'>{{ selectedFilterTerm }}</div>
        </div>
        <img src="@/assets/img/icon-caret-down-black.svg" class="ml-2 transition-all duration-200" :class="`${toggleSelection?'rotate-180 transform':''}`">
      </div>
    </div>

    <div class="relative" v-if='toggleSelection'>
      <div class="absolute w-full z-50 bg-white max-h-60 overflow-auto px-1 filter drop-shodow-xl pb-2 border border-gray-300">
        <div v-for='(item, index) in filterOptions' :key="index" class="py-3 flex cursor-pointer items-center hover:bg-gray-50 transition-all duration-300" @click="selectFilter(item.val);$emit('update:modelValue');">
          <div class='text-xs ml-2 font-semibold'>{{item.label}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { string } from 'mathjs';
import { computed, defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'selectFilter',
  props:{
    modelValue: string
  },
  setup(props, {emit}){
    const toggleSelection = ref(false);

    const filterOptions = ref([
      { label:'All Filters', val: 'all' },
      { label:'Tx Hash', val: 'tx' },
      { label:'Block', val: 'block' },
      { label:'Asset ID', val: 'assetID' },
      { label:'Namespace', val: 'namespaceID' },
      { label:'Address', val: 'address' }
    ]);

    const selectedFilter = ref(props.modelValue);

    const selectedFilterTerm = computed(() => {
      return filterOptions.value.find(filter => filter.val == selectedFilter.value).label;
    });

    const selectFilter = (filterValue) => {
      selectedFilter.value = filterValue;
      emit('selected-filter', filterValue)
      toggleSelection.value = false;
    }

    return {
      filterOptions,
      toggleSelection,
      selectFilter,
      selectedFilterTerm
    };
  }
})
</script>

