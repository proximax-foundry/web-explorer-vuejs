<template>
    <div :class="styleClass">
      <div>
        <div>{{ label }}</div>
        <div>
          <div v-if="value == 'confirmed'" class="inline-block">
            <div class="flex items-center px-2 py-1 rounded-sm border border-green-100 bg-green-100 text-green-700 text-xs">
              <span class="material-icons md-16">done</span>&nbsp;Success
            </div>
          </div>
          <div v-else class="inline-block">
          <div
            class="flex items-center px-2 py-1 rounded-sm border border-yellow-100 bg-yellow-100 text-yellow-700 text-xs">
            <span class="material-icons md-16">info</span>&nbsp;
            <span v-if="value == 'partial'">Partial</span>
            <span v-else-if="value == 'unconfirmed'">Unconfirmed</span>
            <span v-else-if="value == 'failed'">Failed</span>
          </div>
        </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  
  const props = defineProps({
    label: String,
    value: String,
    styleClass: String
  });

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