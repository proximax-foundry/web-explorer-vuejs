<template>
  <header class="z-10 fixed w-full">
    <div class="bg-blue-theme">
      <div class="container mx-auto py-2">
        <div class="md:flex md:justify-between">
          <div class="flex items-center justify-center mb-3 md:mb-0">
            <router-link :to="{name: 'Home'}"><img src="@/assets/img/proximax-logo.svg" class="w-40 mr-7"></router-link>
          </div>
          <div class="mx-3 md:mx-0">
            <div class="border border-gray-300 my-1 searchbar flex bg-white">
              <selectFilter :selected="searchFilter" class="inline-block border-r border-gray-300" @selected-filter="updateFilter" />
              <input type="text" placeholder="Search by Address / Txn Hash / Namespace / Asset ID" class="text-tsm sm:w-48 lg:w-96 outline-none px-2 py-1 flex-grow" @keyup.enter="search">
              <div class="hover:bg-blue-100 cursor-pointer flex justify-center items-center w-10">
                <img src="@/assets/img/icon-search.svg" class="w-4 inline-block">
              </div>
            </div>
            <div class="flex items-center justify-end">
              <router-link :to="{name : 'Home'}"><img src="@/assets/img/icon-home.svg" class="h-5 w-5 mr-4"></router-link>
              <div class="header-links">
                <a href="#">Blocks</a>
                <router-link :to="{name: 'ViewTransactionList'}">Transactions</router-link>
                <!-- <a href="#">Accounts</a> -->
              </div>
              <selectNetwork class="ml-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import selectNetwork from '@/components/selectNetwork.vue';
import selectFilter from '@/components/selectFilter.vue';
import { defineComponent, getCurrentInstance, inject, ref, watch } from "vue";
export default {
  components: {
    selectNetwork,
    selectFilter
  },

  name: 'headerComponent',

  setup(){
    const searchFilter = ref('all');
    const search = () => {
      console.log('hello');
    }

    const updateFilter = (e) => {
      searchFilter.value = e;
    }

    return {
      searchFilter,
      search,
      updateFilter
    }
  }

}
</script>

<style lang="scss">
.header-links{
  @apply my-2;
  a{
    @apply mr-4 hover:text-white duration-200 transition-all text-xs text-gray-200
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