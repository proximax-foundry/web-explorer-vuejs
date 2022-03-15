<template>
  <div class="border-2 border-t-0">
    <div v-if="accountNamespaces.length==0" class='text-blue-primary text-xs text-center font-semibold py-5'>No namespace available</div>
    <div>
      <div class="grid grid-cols-3 bg-gray-100 text-xs font-semibold text-gray-600 px-3">
        <div class="text-left px-2 py-3">ID</div>
        <div class="text-left px-2 py-3">Name</div>
        <div class="text-center px-2 py-3">Active</div>
      </div>
      <div v-for="(namespace, index) in accountNamespaces" :key="index" class="grid grid-cols-3 text-xs px-3" :class="`${(index != (accountNamespaces.length - 1))?'gray-line':''}`">
        <div class="px-2 py-3"><router-link :to="{ name: 'ViewNamespace', params:{ namespaceParam: namespace.id }}" class="hover:text-blue-primary hover:underline">{{ namespace.id }}</router-link></div>
        <div class="px-2 py-3">{{ namespace.name }}</div>
        <div class="px-2 py-3 text-center"><span class="material-icons md-16 text-green-600 font-bold" v-if="namespace.active">done</span><span class="material-icons md-16 text-red-700 font-bold" v-else>close</span></div>
      </div>
    </div>
  </div>
</template>

<script>

import { watch, ref, computed, getCurrentInstance, toRefs } from "vue";
import { Helper } from '@/util/typeHelper';
import { AccountUtils } from "@/util/accountUtil";
import { AppState } from '@/state/appState';
export default {
  name:"NamespaceComponent",
  props:{
    accountNamespaces: Array,
  },
  setup(props){
    return{

    }
  }
}
</script>

<style>

</style>