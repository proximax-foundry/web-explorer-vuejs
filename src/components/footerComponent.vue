<template>
  <footer class="z-10 w-full">
    <div class="bg-blue-theme sm:grid-cols-2 lg:grid-cols-4 grid">
      <div class="flex p-10 col-span-2">
        <div class="mr-5"><img src="@/assets/img/proximax-logo-footer.svg" class="w-7"></div>
        <div>
          <div class="text-tsm text-white mb-5">Copyright 2022 ProximaX. All rights reserved.</div>
          <div>
            <a href="#" target=_new><font-awesome-icon :icon="['fab', 'telegram-plane']" class="w-7 text-white"></font-awesome-icon></a>
            <a href="#" target=_new><font-awesome-icon :icon="['fab', 'github']" class="w-7 text-white"></font-awesome-icon></a>
            <a href="#" target=_new><font-awesome-icon :icon="['fab', 'facebook-f']" class="w-7 text-white"></font-awesome-icon></a>
            <a href="#" target=_new><font-awesome-icon :icon="['fab', 'twitter']" class="w-7 text-white"></font-awesome-icon></a>
          </div>
          <div class="mt-4">
            <a href="#" class="text-xs underline text-gray-200">Terms & Condition</a> | 
            <a href="#" class="text-xs underline text-gray-200">Privacy Policy</a>
          </div>
        </div>
      </div>
      <div class="col-span-1 p-10">
        <div class="text-white text-tsm mb-4">For Developers</div>
        <div class="text-gray-400 text-tsm">
          <a href="#" class="block mb-1">Getting Started</a>
          <a href="#" class="block mb-1">Create Sirius Wallet Account</a>
          <a href="#" class="block mb-1">Learn More About XPX</a>
          <a href="#" class="block mb-1">Become a Node Participant</a>
        </div>
      </div>
      <div class="col-span-1 p-10">
        <div class="text-white text-tsm mb-4">Company</div>
        <div class="text-gray-400 text-tsm">
          <a href="#" class="block mb-1">Platform</a>
          <a href="#" class="block mb-1">About</a>
          <a href="#" class="block mb-1">Blog</a>
          <a href="#" class="block mb-1">Support</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { computed, defineComponent, getCurrentInstance, inject, ref, watch } from "vue";
export default defineComponent({
  components: {
  },

  name: 'footerComponent',

  setup(){


    return {
    }
  }

});
</script>

<style lang="scss">

</style>