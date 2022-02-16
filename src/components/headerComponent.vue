<template>
  <header class="z-10 fixed w-full">
    <div class="bg-blue-theme">
      <div class="container px-2 mx-auto py-2">
        <div class="flex justify-between">
          <div class="flex items-center">
            <router-link :to="{name: 'Home'}"><img src="@/assets/img/proximax-logo.svg" class="w-40 mr-7"></router-link>
            <router-link :to="{name : 'Home'}"><img src="@/assets/img/icon-home.svg" class="h-5 w-5"></router-link>
            <selectNetwork class="ml-5" />
          </div>
          <div class="hidden sm:flex">
            <button class="gray-default-btn my-2 mr-2">Create Wallet</button>
            <button class="default-btn my-2">Get XPX</button>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-gray-50">
      <div class="container px-2 mx-auto">
        <div class="sm:flex sm:justify-between sm:items-center my-2 sm:m-0">
          <div class="header-links">
            <a href="#">Blocks</a>
            <a href="#">Transactions</a>
            <a href="#">Accounts</a>
          </div>
          <div class="border border-gray-300 my-2 searchbar flex">
            <selectFilter v-model="searchFilter" class="inline-block border-r border-gray-300" />
            <input type="text" placeholder="Search by Address / Txn Hash / Namespace / Asset ID" class="text-tsm sm:w-48 lg:w-96 outline-none p-2 flex-grow">
            <img src="@/assets/img/icon-search.svg" class="ml-2 w-4 inline-block mr-2">
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import selectNetwork from '@/components/selectNetwork.vue';
import selectFilter from '@/components/selectFilter.vue';
import { computed, defineComponent, getCurrentInstance, inject, ref, watch } from "vue";
export default defineComponent({
  components: {
    selectNetwork,
    selectFilter
  },

  name: 'headerComponent',

  setup(){
    const searchFilter = ref('all');

    return {
      searchFilter
    }
  }

});
</script>

<style lang="scss">
.header-links{
  @apply my-2;
  a{
    @apply mr-4 hover:opacity-20 duration-200 transition-all md:text-sm sm:text-tsm text-xs
  }
}

.searchbar{
    @apply w-full;
  }

@screen lg {
  .searchbar{
    width: 550px;
  }
}


</style>