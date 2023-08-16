<template>
    <template v-if="value.value && Array.isArray(value.value)">
      <div :class="[value.name === ' ' ? 'isNoNameClass-' + styleClass : styleClass]">
        <div>
          <div v-if="value.name !== ' '" class="w-40">{{ value.name }}</div>
          <div v-else class="w-0"></div>
          <div>
            <div v-for="item of value.value">
              <DisplayValue :style-class="styleClass" :toggle-resolve="toggleResolve" :value="item" :isArray="true">
              </DisplayValue>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="Array.isArray(value)">
      <template v-for="item of value">
        <DisplayValue :style-class="styleClass" :toggle-resolve="toggleResolve" :value="item" :isArray="true">
        </DisplayValue>
      </template>
    </template>
    <template v-else>
      <DisplaySimpleValue :handler-type="value.handlerType ?? ''" 
        :toggle-resolve="toggleResolve" :style-class="styleClass"
        :name="value.name" :secondary-value="value.secondaryValue ?? ''" :value="value.value ?? ''" :isArray="isArray">
      </DisplaySimpleValue>
    </template>
  </template>
  
  <script setup lang="ts">
  import type { RowData } from "../payloadDetails/IRowData";
  import DisplaySimpleValue from "./DisplaySimpleValue.vue";
  
  interface IRow {
    value: RowData,  
    styleClass: string,
    toggleResolve: boolean,
    isArray?: boolean
  }
  
  const props = withDefaults(defineProps<IRow>(),{});
  
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped lang="scss">
  .txn-div,
  .details {
    @apply text-gray-800 text-xs;
  
    > div {
      @apply flex items-center border-b border-gray-100 py-4;
  
      > div:first-child {
        @apply text-xs pl-4;
      }
  
      > div:nth-child(2) {
        @apply text-xs w-full;
      }
  
      > div:last-child {
        @apply border-none;
      }
    }
  }

  .isNoNameClass-txn-div {
    @apply text-gray-800 text-xs;

    > div {
      @apply flex items-center py-1;
  
      > div:first-child {
        @apply text-xs pl-4;
      }
  
      > div:nth-child(2) {
        @apply text-xs w-full;
      }
  
      > div:last-child {
        @apply border-none;
      }
    }

  }

  .isNoNameClass-table_div {
    @apply text-xs;

    > div {
  
      > div:first-child {
        @apply text-blue-primary font-bold;
      }
  
      > div:nth-child(2) {
        @apply col-span-3;
      }
    }
  
    > div:nth-child(2n + 1) {
      @apply bg-gray-100;
    }
  }
  
  .table_div {
    @apply text-xs;
  
    > div {
      @apply grid grid-cols-4;
  
      > div {
        @apply p-2;
      }
  
      > div:first-child {
        @apply text-blue-primary font-bold;
      }
  
      > div:nth-child(2) {
        @apply col-span-3;
      }
    }
  
    > div:nth-child(2n + 1) {
      @apply bg-gray-100;
    }
  }
  </style>