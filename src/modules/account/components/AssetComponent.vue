<template>
  <div class="border-2 border-t-0">
    <div v-if="accountAssets.length==0" class='text-blue-primary text-xs text-center font-semibold'>No asset available</div>
    <div>
      <div v-for="(asset, index) in accountAssets" :key="index" class="py-6 px-5 flex items-center" :class="`${(index != (accountAssets.length - 1))?'gray-line':''}`">
        <img v-if="displayTokenName(asset.name).name=='XPX'" src="@/modules/account/img/proximax-logo.svg" class="inline-block h-7 w-7 mr-2 border-2 rounded-3xl">
        <img v-else-if="displayTokenName(asset.name).name=='XAR'" src="@/modules/account/img/xarcade-logo.svg" class="inline-block h-7 w-7 mr-2 border-2 rounded-3xl">
        <img v-else-if="displayTokenName(asset.name).name=='METX'" src="@/modules/account/img/metx-logo.svg" class="inline-block h-7 w-7 mr-2 border-2 rounded-3xl">
        <img v-else src="@/modules/transaction/img/icon-sda.svg" class='inline-block h-6 w-6 mr-2 '>
        <div class="flex items-center">
          <div class="inline-block text-md font-bold">{{ splitBalance(asset.balance).left }}</div>
          <div class="inline-block text-md font-bold" v-if='splitBalance(asset.balance).right!=null'>.</div>
          <div class="inline-block text-xs font-bold mt-1">{{splitBalance(asset.balance).right}}</div>
          <div v-if="displayTokenName(asset.name).registered" class="inline-block text-md font-bold ml-2">{{ displayTokenName(asset.name).name }}</div>
          <div class="inline-block text-xs text-gray-400 font-semibold ml-2 mt-1 hover:text-black cursor-pointer transition-all duration-200">{{asset.id}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { watch, ref, computed, getCurrentInstance, toRefs } from "vue";
import { Helper } from '@/util/typeHelper';
import { AccountUtils } from "@/models/util/accountUtil";
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