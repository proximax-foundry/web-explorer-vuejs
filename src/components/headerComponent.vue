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
              <input type="text" :placeholder="searchPlaceHolder" class="text-tsm sm:w-48 lg:w-96 outline-none px-2 py-1 flex-grow" @keyup.enter="search">
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
import { SearchUtils } from '@/util/searchUtil';
import { useRouter } from "vue-router";
import { defineComponent, getCurrentInstance, inject, ref, computed } from "vue";
export default {
  components: {
    selectNetwork,
    selectFilter
  },

  name: 'headerComponent',

  setup(){
    const router = useRouter();
    const searchFilter = ref('all');
    const search = async (e) => {
      let searchResult = await SearchUtils.search(e.target.value, searchFilter.value);
      if(searchResult.valid){
        switch(searchResult.searchType){
          case 'Asset':
            router.push({ name: 'ViewAsset', params: { id: searchResult.param } });
            break;
          case 'Address':
            router.push({ name: 'ViewAccount', params: { accountParam: searchResult.param } });
            break;
          case 'Block':
            router.push({ name: 'ViewBlock', params: { number: searchResult.param } });
            break;
          case 'Hash':
            router.push({ name: 'ViewTransaction', params: { hash: searchResult.param } });
            break;
          case 'Namespace':
            router.push({ name: 'ViewNamespace', params: { namespaceParam: searchResult.param } });
            break;
          case 'PublicKey':
            router.push({ name: 'ViewAccount', params: { accountParam: searchResult.param } });
            break;
        }
      }else{
        console.log('Invalid')
      }
    }

    const updateFilter = (e) => {
      searchFilter.value = e;
    }

    let placeHolderString = [
      { label: 'all', placeHolder: 'Search by Address / Txn Hash / Namespace / Asset ID' },
      { label: 'tx', placeHolder: 'Search by Transaction Hash' },
      { label: 'block', placeHolder: 'Search by Block Number' },
      { label: 'assetID', placeHolder: 'Search by Asset ID or Asset Name' },
      { label: 'namespaceID', placeHolder: 'Search by Namespace ID or Namespace Name' },
      { label: 'address', placeHolder: 'Search by Address' },
      { label: 'publicKey', placeHolder: 'Search by Public Key' }
    ]

    const searchPlaceHolder = computed(() => {
      return placeHolderString.find(type => type.label == searchFilter.value).placeHolder;
    });

    return {
      searchFilter,
      search,
      updateFilter,
      searchPlaceHolder,
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