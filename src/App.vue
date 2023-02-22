<template>
  <loading
    v-model:active="isLoading"
    :can-cancel="false"
    :is-full-page="true"
  />
  <div class="flex flex-col justify-between min-h-screen bg-white">
    <Toast position="top-left" group="tl" />
    <Toast position="top-right" group="tr" />
    <Toast position="center" group="center" />
    <Toast position="bottom-left" group="bl" />
    <Toast position="bottom-right" group="br" style="word-break: break-all" />
    <Toast position="bottom-right" group="brt">
      <template #message="slotProps">
        <div style="width: 100%" class="grid grid-cols-12">
          <div class="col-span-2">
            <i class="pi pi-exclamation-triangle" style="font-size: 2.5rem"></i>
          </div>
          <div class="col-span-10">
            <h3>{{ slotProps.message.summary }}</h3>
            <p>{{ slotProps.message.detail }}</p>
            <p>{{ slotProps.message.detail2 }}</p>
          </div>
        </div>
      </template>
    </Toast>
    <headerComponent class="flex-grow-0" />
    <router-view
      class="flex-grow md:container pt-48 sm:pt-40 mx-3 md:mx-auto"
      :key="$route.path"
    ></router-view>
    <footerComponent class="flex-grow-0" />
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import Toast from "primevue/toast";
import headerComponent from "./components/headerComponent.vue";
import footerComponent from "./components/footerComponent.vue";
import { AppState } from "@/state/appState";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";

const isLoading = computed(() => {
  return !AppState.isReady;
});
</script>
