<template>
    <div :class="[isArray ? 'isArrayClass' : styleClass]">
      <div v-for="item in value">
        <div >{{ item.name }}</div>
        <div class="flex">
            {{ item.value }}
        </div>
      </div>
    </div>
  </template>
  
<script setup lang="ts">


interface IRow {
  value: any,
  styleClass: String,
  isArray: Boolean
}

  const props = withDefaults(defineProps<IRow>(),{});
  
  console.log(props.value)
  console.log("hi")

  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped lang="scss">
  .txn-div,
  .details {
    @apply text-gray-800 text-xs;
  
    > div {
      @apply flex items-center border-b border-gray-100 py-4;
  
      > div:first-child {
        @apply w-40 text-xs pl-4;
      }
  
      > div:nth-child(2) {
        @apply text-xs w-full;
      }
  
      > div:last-child {
        @apply border-none;
      }
    }
  }

  .isArrayClass {
    > div {
      @apply flex items-center py-1;
  
      > div:first-child {
        @apply w-40 text-xs;
      }
  
      > div:nth-child(2) {
        @apply text-xs w-full;
      }
  
      > div:last-child {
        @apply border-none;
      }
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
        @apply break-all col-span-3;
      }
    }
  
    > div:nth-child(2n + 1) {
      @apply bg-gray-100;
    }
  }
  </style>