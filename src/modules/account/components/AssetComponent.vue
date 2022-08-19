<template>
  <div class="border-2 border-t-2">
    <div v-if="accountAssets.length==0 && isFetching==false" class='text-blue-primary text-xs text-center font-semibold py-5'>No asset available</div>
    <div v-else-if="isFetching">
      <div class="flex justify-center items-center border-gray-400 mt-5 mb-5">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-navy-primary mr-2"></div>
        <span class="text-tsm">Fetching Assets</span>
      </div>
    </div>
    <div v-else-if="accountAssets.length>0 && isFetching == false">
      <div class="grid grid-cols-4 md:hidden bg-gray-100 text-xs font-semibold text-gray-600 px-3">
        <div class="text-left px-2 py-3 col-span-1">ID</div>
        <div class="text-left pl-16 py-3 col-span-1">Alias</div>
        <div class="text-left pl-16 py-3 col-span-1">Balance</div> 
      </div>
      <div class="hidden md:grid md:grid-cols-8 bg-gray-100 text-xs font-semibold text-gray-600 px-3">
        <div class="text-left px-2 py-3 col-span-2">ID</div>
        <div class="text-left px-2 py-3 col-span-4">Alias</div>
        <div class="text-left py-3 col-span-2">Balance</div>
      </div>
      <div v-for="(asset, index) in accountAssets" :key="index" class="grid grid-cols-5 text-xs md:hidden py-6 px-3 items-center" :class="`${(index != (accountAssets.length - 1))?'gray-line':''}`">
        <div class="px-2 py-3 col-span-2">
          <router-link :to="{ name: 'ViewAsset', params:{ id: asset.id }}" class="uppercase text-blue-600 hover:text-blue-primary hover:underline">{{ asset.id }}</router-link>
        </div>
        <div class="py-3 col-span-1">
          <div class="items-center">
            <div class="inline-block mr-2" v-if="asset.name.length!=0">
              <img v-if="displayTokenName(asset.name[0].name).name=='XPX'" src="@/modules/account/img/proximax-logo.svg" class="inline-block h-7 w-7 mr-2 border-2 rounded-3xl">
              <img v-else-if="displayTokenName(asset.name[0].name).name=='XAR'" src="@/modules/account/img/xarcade-logo.svg" class="inline-block h-7 w-7 mr-2 border-2 rounded-3xl">
              <img v-else-if="displayTokenName(asset.name[0].name).name=='METX'" src="@/modules/account/img/metx-logo.svg" class="inline-block h-7 w-7 mr-2 border-2 rounded-3xl">
              <img v-else src="@/modules/transaction/img/proximax-logo-gray.svg" class='inline-block h-6 w-6 mr-2 '>
            </div>
            <div v-for="(namespaceAlias, modifier) in asset.name" :key="modifier" class="py-3 col-span-4 flex items-center">
              <!-- <div v-if="namespaceAlias.namespaceId"> -->
              <router-link :to="{ name: 'ViewNamespace', params:{ namespaceParam: namespaceAlias.name }}" class="text-blue-600 hover:text-blue-primary hover:underline">{{ namespaceAlias.name }}</router-link>
              <span v-if="asset.name.length >1 && modifier != asset.name.length -1 " class="text-black mr-1 ml-1">{{ "/" }}</span> 
              <!-- </div> -->
            </div>
          </div>
        </div>
        <div class="py-3 pl-6 flex items-left w-12">
          <div class="inline-block text-xs font-bold">{{ splitBalance(asset.balance).left }}</div>
          <div class="inline-block text-xs font-bold" v-if='splitBalance(asset.balance).right!=null'>.</div>
          <div class="inline-block text-txs font-bold">{{splitBalance(asset.balance).right}}</div>
        </div>
      </div>
      <div v-for="(asset, index) in accountAssets" :key="index" class="hidden md:grid md:grid-cols-8 py-6 px-3 items-center text-xs gray-line">
        <router-link :to="{ name: 'ViewAsset', params:{ id: asset.id }}" class="uppercase text-blue-600 hover:text-blue-primary hover:underline mx-2 my-3 col-span-2">{{ asset.id }}</router-link>
        <div v-if="asset.name.length==0" class="py-3 col-span-4 flex items-center">
        </div>
        <div v-else class="py-3 col-span-4 flex items-center ml-2">
          <!-- <div v-for="(namespaceAlias, modifier) in asset.name" :key="modifier" class="py-3 col-span-3 flex items-center"> -->
            <div class="inline-block mr-2" v-if="asset.name[0].name &&asset.name.length!=0">
              <img v-if="displayTokenName(asset.name[0].name).name=='XPX'" src="@/modules/account/img/proximax-logo.svg" class="inline-block h-7 w-7 mr-2 border-2 rounded-3xl">
              <img v-else-if="displayTokenName(asset.name[0].name).name=='XAR'" src="@/modules/account/img/xarcade-logo.svg" class="inline-block h-7 w-7 mr-2 border-2 rounded-3xl">
              <img v-else-if="displayTokenName(asset.name[0].name).name=='METX'" src="@/modules/account/img/metx-logo.svg" class="inline-block h-7 w-7 mr-2 border-2 rounded-3xl">
              <img v-else src="@/modules/transaction/img/proximax-logo-gray.svg" class='inline-block h-6 w-6 mr-2 '>
            </div>
            <div v-else> 
             <img src="@/modules/transaction/img/proximax-logo-gray.svg" class='inline-block h-6 w-6 mr-2 '>
             <!-- <img v-else> -->
            </div>

          <div v-for="(namespaceAlias, modifier) in asset.name" :key="modifier" class="py-3 col-span-3 flex items-center">
            <!-- <div v-if="namespaceAlias.namespaceId" > -->
              <router-link :to="{ name: 'ViewNamespace', params:{ namespaceParam: namespaceAlias.name }}" class="text-blue-600 hover:text-blue-primary hover:underline">{{ displayTokenName(namespaceAlias.name).name }}</router-link>
            <!-- </div> -->
              <span v-if="asset.name.length >1 && modifier != asset.name.length -1 " class="text-black mr-1 ml-1">{{ "/" }}</span> 
          </div>
        </div>
        <div class="py-3 col-span-2 flex items-center">
          <div class="inline-block text-xs font-bold">{{ splitBalance(asset.balance).left }}</div>
          <div class="inline-block text-xs font-bold" v-if='splitBalance(asset.balance).right!=null'>.</div>
          <div class="inline-block text-txs font-bold">{{splitBalance(asset.balance).right}}</div>
        </div>        
      </div>
        <div v-if="isPagination" class="ml-5 mr-5 sm:flex sm:justify-between my-5">
        <div class="text-xs text-gray-700 mb-3 sm:mb-0 text-center sm:text-left">Show
          <select v-model="pages" class="border border-gray-300 rounded-md p-1" @change="changeRows">
            <option value=10>10</option>
            <option value=20>20</option>
            <option value=30>30</option>
            <option value=40>40</option>
            <option value=50>50</option>
          </select>
          Records
        </div>
        <div  class="sm:flex sm:items-center text-center sm:text-right">
          <div v-if="enableFirstPage" @click="naviFirst" class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs mx-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all">First</div><div v-else class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs mx-1">First</div>
          <div v-if="enablePreviousPage" @click="naviPrevious" class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs mx-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all">Previous</div><div v-else class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs mx-1">Previous</div>
          <div class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs">Page {{ currentPage }} of {{ totalPages }}</div>
          <div v-if="enableNextPage" @click="naviNext" class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs mx-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all">Next</div><div v-else class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs mx-1">Next</div>
          <div v-if="enableLastPage" @click="naviLast" class="bg-blue-100 inline-block border border-blue-100 rounded-sm px-2 py-1 text-blue-700 text-xs ml-1 cursor-pointer hover:bg-blue-200 duration-300 transition-all">Last</div><div v-else class="bg-gray-50 inline-block border border-gray-50 rounded-sm px-2 py-1 text-gray-700 text-xs mx-1">Last</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Helper } from "@/util/typeHelper";
import { AccountUtils } from "@/util/accountUtil";
import { computed, ref} from "vue";
import { AppState } from '@/state/appState';
import { MosaicSearch } from "tsjs-xpx-chain-sdk";

export default {
  name:"AssetComponent",
  props:{
    accountAsset: Array,
    accountPublicKey: String

  },
  setup(prop){
    const pages = ref(10);
    const currentPage = ref(1)
    const totalPages = ref(0);
    const isFetching = ref(true);
    const isPagination = ref(false);
    const accountAssets = ref([]);
     
    


    // let pagination = (blocks)=>{
    //   let blockValue = blocks.slice((currentPage.value-1) * pages.value, currentPage.value * pages.value);
    //   return blockValue;
    // }
   //   console.log(accountAssets.value);

   
    
    const enableFirstPage = computed(() => {
      return currentPage.value > 1;
    });

    const enablePreviousPage = computed(() => {
      return currentPage.value > 1;
    });

    const enableNextPage = computed(() => {
      return (totalPages.value - currentPage.value) > 0;
    });

    const enableLastPage = computed(() => {
      return currentPage.value < totalPages.value;
    });

    const naviFirst = () => {
      currentPage.value = 1;
      isFetching.value = true;
      loadAsset();
    }

    const naviPrevious = () => {
      --currentPage.value;
      isFetching.value = true;
      loadAsset();
    }

    const naviNext = () => {
      ++currentPage.value;
      isFetching.value = true;
      loadAsset();
    }

    const naviLast = () => {
      currentPage.value = totalPages.value;
      isFetching.value = true;

      loadAsset();

     // loadRecentBlock();
    }

    const changeRows = () => {
      currentPage.value = 1;
      isFetching.value = true;
      loadAsset();
      //loadRecentBlock();
    }
    const splitBalance = (balance) => {
      let split = balance.toString().split(".")
      if (split[1] != undefined){
        return { left: split[0], right: split[1] }
      }else{
        return { left: split[0], right: null }
      }
    }
    const loadAsset = async() => {
      if(!AppState.isReady){
        setTimeout(loadAsset, 1000);
      }      
      let mosaics_list = [];
      if(prop.accountAsset.length > 10){
        isPagination.value = true;
        mosaics_list = prop.accountAsset.slice((currentPage.value-1) * pages.value, currentPage.value * pages.value);
      }else{
        mosaics_list = prop.accountAsset;
      }
      console.log(mosaics_list);

      let AssetList =  await AccountUtils.formatAccountAsset(mosaics_list, prop.accountPublicKey);
      accountAssets.value = AssetList;
            console.log(pages.value);

            console.log(currentPage.value);

      totalPages.value = Math.ceil(prop.accountAsset.length / pages.value); 
      isFetching.value = false;
      console.log(totalPages.value);
      console.log(prop.accountAsset.length);

    }
    loadAsset();
    
    const displayTokenName = (name) => {

      if(name === ""){
        return { name: name, registered: false };
      }

      if(name==AppState.nativeToken.fullNamespace){
        return { name: AppState.nativeToken.label, registered: true };
      }else{
        let foundToken = AppState.registeredToken.find(x => x.fullNamespace === name);
        
        if(foundToken){
          return { name: foundToken.label, registered: true };
        }
        return { name: name, registered: false };
      }
    }

    return{
      splitBalance,
      displayTokenName,
      pages,
      currentPage,
      totalPages,
      enableFirstPage,
      enablePreviousPage,
      enableNextPage,
      enableLastPage,
      naviFirst,
      naviPrevious,
      naviNext,
      naviLast,
      changeRows,
      accountAssets,
      isFetching,
      isPagination
    }
  }
}
</script>

<style>

</style>