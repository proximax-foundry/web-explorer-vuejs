<template>
  <div class="flex flex-col justify-between min-h-screen">
    <headerComponent class=" flex-grow-0" />
    <router-view class="flex-grow container mx-2 sm:mx-auto pt-48 sm:pt-40"></router-view>
    <footerComponent class=" flex-grow-0" />
  </div>
</template>

<script>

import headerComponent from '@/components/headerComponent.vue'
import footerComponent from '@/components/footerComponent.vue'
export default {
  name: 'App',
  components: {
    headerComponent,
    footerComponent,
  }
}
</script>

<style>

</style>
