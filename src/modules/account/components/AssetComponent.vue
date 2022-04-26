<template>
  <div class="border-2 border-t-0">
    <div v-if="accountAssets.length==0" class='text-blue-primary text-xs text-center font-semibold py-5'>No asset available</div>
    <div v-else>
      <div class="grid grid-cols-4 md:hidden bg-gray-100 text-xs font-semibold text-gray-600 px-3">
        <div class="text-left px-2 py-3 col-span-1">ID</div>
        <div class="text-left pl-16 py-3 col-span-1">Namespace</div>
        <div class="text-left pl-16 py-3 col-span-1">Balance</div> 
      </div>
      <div class="hidden md:grid md:grid-cols-8 bg-gray-100 text-xs font-semibold text-gray-600 px-3">
        <div class="text-left px-2 py-3 col-span-2">ID</div>
        <div class="text-left px-2 py-3 col-span-3">Namespace</div>
        <div class="text-left py-3 col-span-2">Balance</div>
        <div class="text-left py-3">Creator</div>
      </div>
      <div v-for="(asset, index) in accountAssets" :key="index" class="grid grid-cols-5 text-xs md:hidden py-6 px-3 items-center" :class="`${(index != (accountAssets.length - 1))?'gray-line':''}`">
        <div class="px-2 py-3 col-span-2">
          <router-link :to="{ name: 'ViewAsset', params:{ id: asset.id }}" class="uppercase text-blue-600 hover:text-blue-primary hover:underline">{{ asset.id }}</router-link>
          <div class="flex items-center mt-5"><div class="w-14 text-txs">Creator:</div>        
          <div class="text-xs" v-if="asset.isOwner">Yes</div>
          <div class="text-xs" v-else>No</div>
        </div>
        </div>
        <div class="py-3 col-span-1">
          <div class="flex items-center">
            <div class="inline-block mr-2" v-if="displayTokenName(asset.name).name">
              <img v-if="displayTokenName(asset.name).name=='XPX'" src="@/modules/account/img/proximax-logo.svg" class="inline-block h-7 w-7 mr-2 border-2 rounded-3xl">
              <img v-else-if="displayTokenName(asset.name).name=='XAR'" src="@/modules/account/img/xarcade-logo.svg" class="inline-block h-7 w-7 mr-2 border-2 rounded-3xl">
              <img v-else-if="displayTokenName(asset.name).name=='METX'" src="@/modules/account/img/metx-logo.svg" class="inline-block h-7 w-7 mr-2 border-2 rounded-3xl">
              <img v-else src="@/modules/transaction/img/icon-sda.svg" class='inline-block h-6 w-6 mr-2 '>
            </div>
            <div v-if="asset.namespaceId">
              <router-link :to="{ name: 'ViewNamespace', params:{ namespaceParam: asset.namespaceId }}" class="text-blue-600 hover:text-blue-primary break-all hover:underline">{{ displayTokenName(asset.name).name }}</router-link>
            </div>
          </div>
        </div>
        <div class="py-3 pl-6 flex items-left w-12">
          <div class="inline-block text-xs font-bold">{{ splitBalance(asset.balance).left }}</div>
          <div class="inline-block text-xs font-bold" v-if='splitBalance(asset.balance).right!=null'>.</div>
          <div class="inline-block text-txs font-bold">{{splitBalance(asset.balance).right}}</div>
        </div>
      </div>
      <div v-for="(asset, index) in accountAssets" :key="index" class="hidden md:grid md:grid-cols-8 py-6 px-3 items-center text-xs" :class="`${(index != (accountAssets.length - 1))?'gray-line':''}`">
        <router-link :to="{ name: 'ViewAsset', params:{ id: asset.id }}" class="uppercase text-blue-600 hover:text-blue-primary hover:underline mx-2 my-3 col-span-2">{{ asset.id }}</router-link>
        <div class="px-2 py-3 col-span-3 flex items-center">
          <div class="inline-block mr-2" v-if="displayTokenName(asset.name).name">
            <img v-if="displayTokenName(asset.name).name=='XPX'" src="@/modules/account/img/proximax-logo.svg" class="inline-block h-7 w-7 mr-2 border-2 rounded-3xl">
            <img v-else-if="displayTokenName(asset.name).name=='XAR'" src="@/modules/account/img/xarcade-logo.svg" class="inline-block h-7 w-7 mr-2 border-2 rounded-3xl">
            <img v-else-if="displayTokenName(asset.name).name=='METX'" src="@/modules/account/img/metx-logo.svg" class="inline-block h-7 w-7 mr-2 border-2 rounded-3xl">
            <img v-else src="@/modules/transaction/img/icon-sda.svg" class='inline-block h-6 w-6 mr-2 '>
          </div>
          <div v-if="asset.namespaceId">
            <router-link :to="{ name: 'ViewNamespace', params:{ namespaceParam: asset.namespaceId }}" class="text-blue-600 hover:text-blue-primary hover:underline">{{ displayTokenName(asset.name).name }}</router-link>
          </div>
          
        </div>
        <div class="py-3 col-span-2 flex items-center">
          <div class="inline-block text-xs font-bold">{{ splitBalance(asset.balance).left }}</div>
          <div class="inline-block text-xs font-bold" v-if='splitBalance(asset.balance).right!=null'>.</div>
          <div class="inline-block text-txs font-bold">{{splitBalance(asset.balance).right}}</div>
        </div>
        <div class="py-3 text-left"><div v-if="asset.isOwner">Yes</div><div v-else>No</div></div>
      </div>
    </div>
  </div>
</template>

<script>

import { AppState } from '@/state/appState';
export default {
  name:"AssetComponent",
  props:{
    accountAssets: Array,
  },
  setup(props){
    // const accountAssets = ref({});

    // const loadAsset = async() => {
    //   if(!AppState.isReady){
    //     setTimeout(loadAsset, 1000);
    //   }
    //   let account = await AccountUtils.getAccountFromAddress(props.address);
    //   accountAssets.value = await AccountUtils.formatAccountAsset(account.mosaics);
    // }
    // loadAsset();

    const splitBalance = (balance) => {
      let split = balance.toString().split(".")
      if (split[1] != undefined){
        return { left: split[0], right: split[1] }
      }else{
        return { left: split[0], right: null }
      }
      return balance;
    }

    const displayTokenName = (name) => {
      if(name==AppState.nativeToken.fullNamespace){
        return { name: AppState.nativeToken.label, registered: true };
      }else{
        if(AppState.registeredToken.length > 0){
          AppState.registeredToken.forEach(token => {
            if(token.fullNamespace == name){
              return { name: token.label, registered: true };
            }
          });
        }
        return { name: name, registered: false };
      }
    }

    return{
      splitBalance,
      displayTokenName,
    }
  }
}
</script>

<style>

</style>