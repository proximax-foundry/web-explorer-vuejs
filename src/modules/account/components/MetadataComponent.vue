<template>
<div class="border-2 border-t-0">
    <!-- <div v-if="accountNamespaces.length==0" class='text-blue-primary text-xs text-center font-semibold py-5'>No namespace available</div> -->
  <div>
    <div class="grid grid-cols-5 md:hidden bg-gray-100 text-xs font-semibold text-gray-600 px-3">
      <div class="text-left py-3 col-span-1">Target ID</div>
      <div class="text-left pl-16 py-3 col-span-2">Scoped Metadata Key </div>
      <div class="text-left pl-16 py-3 col-span-2"> Current Value</div>
      <div class="pb-2 pr-2 pt-2">
        <select v-model="filterSelection" class="border border-gray-200 px-2 py-1 focus:outline-none">
          <option value=0>ACCOUNT</option>
          <option value=1>NAMESPACE</option>
          <option value=2>ASSET</option>
        </select>
      </div>
    </div>
    
    <div class="hidden md:grid md:grid-cols-8 bg-gray-100 text-xs font-semibold text-gray-600 px-3">
      <div class="text-left px-2 py-3 col-span-2">Target ID</div>
      <div class="text-left px-2 py-3 col-span-3">Scoped Metadata Key</div>
      <div class="text-left py-3 col-span-2">Current Value</div>
      <div class="col-span-1 pt-2">
        <select v-model="filterSelection" class="border border-gray-200 px-2 py-1 focus:outline-none">
          <option value=0>ACCOUNT</option>
          <option value=1>NAMESPACE</option>
          <option value=2>ASSET</option>
        </select>
      </div>
    </div>
   
  </div>
</div>

</template>

<script>

import Tooltip from 'primevue/tooltip';
import { MetadataUtils } from '@/util/metadataUtil';
import { AccountUtils } from '@/util/accountUtil';
import { ref } from "vue"

export default {
  name:"MetadataComponent",
  props:{
    accountAddress: String,
    accountNamespaces: Array,
    accountAssets: String
  },
  directives: {
    'tooltip': Tooltip
  },
  setup(props){
    //const accountMetadata = ref<{scopedMetadataKeyUtf8:string,scopedMetadataKeyHex: string,value:string}[]>([]);
    //const namespaceMetadata = ref<{scopedMetadataKeyUtf8:string,scopedMetadataKeyHex: string, id:string,value:string}[]>([])
    //const assetMetadata = ref<{scopedMetadataKeyUtf8:string,scopedMetadataKeyHex: string,name:string,id:string,value:string}[]>([])
     
    const loadAllMetadata = async() => {
      let account = await AccountUtils.getAccountFromAddress(props.accountAddress);
      let accountMetadata = await MetadataUtils.getAccountMetadata(account.publicKey);
    console.log(props.accountAssets);
    console.log(props.accountNamespaces);
props.accountAssets.forEach
      let assetMetadata = await MetadataUtils.getAssetMetadata(props.accountAssets);
      let namespaceMetadata = await MetadataUtils.getNamespaceMetadata(props.accountNamespaces);

    console.log(accountMetadata);
        console.log(assetMetadata);
    console.log(namespaceMetadata);

    } 

    // const fetchedAccountMetadata = async() =>{

    // }

    // const fetchedAssetMetadata = async() =>{
      
    // }

    // const fetchedNamespaceMetadata = async() =>{
      
    // }
    loadAllMetadata();
    // return{
          
    // }
  }


}
</script>

<style>

</style>