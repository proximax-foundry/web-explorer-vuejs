<template>
    <div :class="styleClass">
      <div>
        <div>{{ label }}</div>
        <div class="flex">
          <router-link
            :to="{
              name: 'ViewAccount',
              params: { accountParam: value },
            }"
            id="account" 
            :copyValue="value" 
            copySubject="account"
            class="hover:text-blue-primary hover:underline text-blue-600 mr-2"
            >{{ value }}
          </router-link>
          <img src="@/assets/img/icon-copy.svg" @click="copy('account')" class="cursor-pointer" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { copyToClipboard } from '@/util/functions';
  import { useToast } from 'primevue/usetoast';

  const toast = useToast();
  
  const props = defineProps({
    label: String,
    value: String,
    styleClass: String
  });

  const copy = (id: any) => {
  let element = document.getElementById(id);
  if (element) {
    let stringToCopy = element.getAttribute("copyValue");
    let copySubject = element.getAttribute("copySubject");
    if (stringToCopy) {
      copyToClipboard(stringToCopy);
      toast.add({
        severity: "info",
        detail: copySubject + " copied",
        group: "br",
        life: 3000,
      });
    }
  }
};
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