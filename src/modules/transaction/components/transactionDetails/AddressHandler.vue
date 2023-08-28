<template>
    <div :class="[isArray ? 'isArrayClass-' + styleClass : styleClass]">
      <div>
        <div>{{ label }}</div>
        <div v-if="isValidAddress" class="flex justify-start overflow-hidden">
          <router-link
            :to="{
              name: 'ViewAccount',
              params: { accountParam: value },
            }"
            class="hover:text-blue-primary hover:underline text-blue-600 mr-2"
            id="signerAddress"
            :copyValue="Helper.createAddress(value!).pretty()" 
            copySubject="Signer address"
            >{{ value }}
          </router-link>
          <img src="@/assets/img/icon-copy.svg" @click="copy('signerAddress')" class="cursor-pointer" />
        </div>
        <div v-else class="overflow-hidden">
          {{ value }} <span class="text-sm text-red-300" >Invalid address</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  import { AppState } from "@/state/appState";
  import { Helper } from "@/util/typeHelper";
  import { Address } from "tsjs-xpx-chain-sdk";
  import { copyToClipboard } from "@/util/functions";
  import { useToast } from "primevue/usetoast";
  
  const toast = useToast();
  const isValidAddress = ref(false);
  
  const props = defineProps({
    label: String,
    value: String,
    styleClass: String,
    isArray: Boolean
  });
  
  const checkValidAddress = (addressString: string)=>{
  
    try {
      const address = Address.createFromRawAddress(addressString);
  
      if(address.networkType === AppState.networkType){
        isValidAddress.value = true;
      }
      else{
        isValidAddress.value = false;
      }
    } catch (error) {
      isValidAddress.value = false;
    }
  }
  
  checkValidAddress(props.value || "");

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

  .isArrayClass-txn-div {
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

  .isArrayClass-table_div{
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