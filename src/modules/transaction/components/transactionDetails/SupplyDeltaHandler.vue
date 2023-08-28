<template>
    <div :class="styleClass">
      <div>
        <div>
            {{ secondaryValue }}:
            {{ value }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  
  const props = defineProps({
    label: String,
    value: String,
    secondaryValue: {
        type: String,
        required: true
    },
    styleClass: String
  });

  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped lang="scss">
  .txn-div,
  .details {
    @apply text-gray-800 text-xs;
  
    > div {
      @apply flex items-center py-1;
  
      > div:first-child {
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