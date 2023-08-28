<template>
    <div :class="[isArray ? isOffers ? 'offerClass-' +  styleClass : 'isArrayClass-' +  styleClass : styleClass]">
      <div>
        <div>{{ label }}</div>
        <div>
          <router-link
            :to="{
              name: 'ViewAsset',
              params: { id: displayValue },
            }"
            class="hover:text-blue-primary hover:underline text-blue-600"
            >{{ displayValue.toUpperCase()  }} 
          </router-link>

          <span v-if="alias && label !== 'Asset ID'"> 
          (alias of 
          <router-link
          :to="{
            name: 'ViewNamespace',
            params: { namespaceParam: alias },
          }"
          class="hover:text-blue-primary hover:underline text-blue-600"
          >{{ alias }}
          </router-link>
          )
        </span>

          <div v-if="isResolving" class="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-navy-primary mr-2"></div>
          <span class="text-sm text-red-300" v-if="errorMsg"></span></div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  import { AppState } from "@/state/appState";
  import { MosaicId } from "tsjs-xpx-chain-sdk";
  
  const displayValue = ref("");
  const errorMsg = ref("");
  const alias = ref("");
  const isResolving = ref(false);
  
  const props = defineProps({
    label: String,
    value: String,
    styleClass: String,
    toggleResolve: Boolean,
    isArray: Boolean,
    isOffers: Boolean,
  });

  const initAssign = ()=>{
    displayValue.value = props.value || "";
    alias.value = "";
  }
  
  initAssign();
  
  const resolve = async ()=>{
  
    if(displayValue.value !== ""){
  
      isResolving.value = true;
      errorMsg.value = "";
  
      try {
        let sdaId = new MosaicId(displayValue.value);
  
        let names = await AppState.chainAPI!.assetAPI.getMosaicsNames([sdaId]);

        if(names.length){
          alias.value = names[0].names[0].name;
        }
        else{
          alias.value = "";
        }
        
      } catch (error) {
        errorMsg.value = "unable to resolve";
      }
    }
    isResolving.value = false;
  }
  
  if(props.toggleResolve){
    resolve();
  }
  
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
    @apply text-gray-800 text-xs;

    > div {
      @apply flex items-center py-4;
  
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
        @apply overflow-hidden col-span-3;
      }
    }

    > div:nth-child(2n + 1) {
      @apply bg-gray-100;
    }
  }

  .offerClass-txn-div{
    @apply text-gray-800 text-xs pl-4;

    > div {
      @apply flex items-center py-4;

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
  .offerClass-table_div{
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
      @apply overflow-hidden col-span-3;
    }
    }

    > div:nth-child(2n + 1) {
      @apply bg-blue-100;
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