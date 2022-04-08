<template>
  <div v-if="isShowInvalid">
    <p class="text-gray-500 mb-5 text-sm font-bold">Namespace Details</p>
    <div class="p-3 bg-yellow-100 text-yellow-700">Namespace ID is not available in {{ networkName }}</div>
  </div>
  <div v-else>
    <div class="text-gray-500 mb-5 font-bold">
      <div class="text-blue-primary text-md font-bold uppercase">{{ namespaceInfo.name }}</div>
      <div class="text-txs text-gray-400 font-normal mt-1">Namespace</div>
    </div>
    <div class="md:grid md:grid-cols-2">
      <div class="filter shadow-xl border border-gray-50 p-5 mb-5 md:mb-15 md:mr-2">
        <div class="text-sm font-bold mb-5">Overview</div>
        <div class="txn-div">
          <div class="py-4 text-xs grid grid-cols-5 border-b border-gray-100">
            <div class="font-bold col-span-2">Namespace ID</div>
            <div class="uppercase col-span-3">{{ namespaceParam }}</div>
          </div>
          <div class="py-4 text-xs grid grid-cols-5 border-b border-gray-100" v-if="namespaceInfo.levels">
            <div class="font-bold col-span-2">Levels</div>
            <div class="col-span-3">{{ namespaceInfo.levels.length }}</div>
          </div>
          <div class="py-4 text-xs grid grid-cols-5 border-b border-gray-100">
            <div class="font-bold col-span-2">Depth</div>
            <div class="col-span-3">{{ namespaceInfo.depth }}</div>
          </div>
          <div class="py-4 text-xs grid grid-cols-5 border-b border-gray-100">
            <div class="font-bold col-span-2">Type</div>
            <div class="uppercase col-span-3">{{ namespaceInfo.type?'Root':'Sub' }}</div>
          </div>
          <div class="py-4 text-xs grid grid-cols-5">
            <div class="font-bold col-span-2">Parent ID</div>
            <div class="uppercase col-span-3"><router-link v-if="namespaceInfo.parentId" class="text-blue-600 hover:text-blue-primary hover:underline" :to="{ name: 'ViewNamespace', params: { namespaceParam: namespaceInfo.parentId } }">{{ namespaceInfo.parentId }}</router-link><span v-else>No parent ID</span></div>
          </div>
        </div>
      </div>
      <div class="filter shadow-xl border border-gray-50 p-5 mb-5 md:mb-15 sm:ml-2">
        <div class="text-sm font-bold mb-5">More Info</div>
        <div class="txn-div">
          <div class="py-4 text-xs grid grid-cols-5 border-b border-gray-100">
            <div class="font-bold col-span-2">Owner Address</div>
            <div class="break-all uppercase col-span-3"><router-link v-if="namespaceInfo.ownerAddress" class="text-blue-600 hover:text-blue-primary hover:underline" :to="{ name: 'ViewAccount', params: { accountParam: namespaceInfo.ownerAddress } }">{{ namespaceInfo.ownerAddress }}</router-link></div>
          </div>
          <div class="py-4 text-xs grid grid-cols-5 border-b border-gray-100">
            <div class="font-bold col-span-2">Owner Public Key</div>
            <div class="break-all uppercase col-span-3"><router-link v-if="namespaceInfo.ownerPublicKey" class="text-blue-600 hover:text-blue-primary hover:underline" :to="{ name: 'ViewAccount', params: { accountParam: namespaceInfo.ownerPublicKey } }">{{ namespaceInfo.ownerPublicKey }}</router-link></div>
          </div>
          <div class="py-4 text-xs grid grid-cols-5 border-b border-gray-100">
            <div class="font-bold col-span-2">Start height</div>
            <div class="uppercase col-span-3">{{ namespaceInfo.start }}</div>
          </div>
          <div class="py-4 text-xs grid grid-cols-5">
            <div class="font-bold col-span-2">End height</div>
            <div class="uppercase col-span-3">{{ namespaceInfo.end }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="namespaceInfo.alias || namespaceInfo.levels" class="filter shadow-xl border border-gray-50 p-5 mb-10 md:mb-15">
      <div v-if="namespaceInfo.alias">
        <div class="text-sm font-bold mb-4">Alias</div>
        <div class="py-3 text-xs">
          <div class="py-3 grid grid-cols-2 font-bold border-b border-gray-100">
            <div v-if="!namespaceInfo.alias.type==0">{{ (namespaceInfo.alias.type==1)?'Asset ID':'Address' }}</div>
            <div v-else> Asset ID / Address</div>
          <div>Type</div>
          </div>
          <div class="py-3 grid grid-cols-2">
            <div>
              <div v-if="namespaceInfo.alias.type==1">
                <router-link  class="uppercase text-blue-600 hover:text-blue-primary hover:underline" :to="{ name: 'ViewAsset', params:{ id:namespaceInfo.alias.id }}" >
                  {{ namespaceInfo.alias.id }}
                </router-link>
              </div>
                <!-- {{ namespaceInfo.alias.id }} -->
              <div v-else-if="namespaceInfo.alias.type==2">
                <router-link  class="uppercase text-blue-600 hover:text-blue-primary hover:underline" :to="{ name: 'ViewAccount', params: { accountParam: namespaceInfo.alias.id }}">
                  {{ namespaceInfo.alias.id }}
                </router-link>
              </div>
              <div v-else> No linked Asset / Address
              </div>
            </div>
            <div v-if="!namespaceInfo.alias.type==0">{{ namespaceInfo.alias.type==1?"Asset":"Address" }}</div>
            <div v-else> - </div>
          </div>
        </div>
      </div>
      <div v-if="namespaceInfo.levels" class="mt-5">
        <div class="text-sm font-bold mb-4">Levels</div>
        <div class="py-3 text-xs grid grid-cols-2 font-bold border-b border-gray-100">
          <div>Namespace ID</div>
          <div>Name</div>
        </div>
        <div v-for="level, index in namespaceInfo.levels" :key="index" class="py-3 text-xs grid grid-cols-2 uppercase" :class="`${ index<(namespaceInfo.levels.length-1)?'border-b border-gray-100':'' }`">
          <div><router-link v-if="level.id" class="text-blue-600 hover:text-blue-primary hover:underline" :to="{ name: 'ViewNamespace', params: { namespaceParam: level.id } }">{{ level.id }}</router-link></div>
          <div>{{ level.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, getCurrentInstance, inject, ref, watch } from "vue";
import { networkState } from '@/state/networkState';
import { AppState } from '@/state/appState';
import { Helper } from "@/util/typeHelper";
import { NamespaceUtils } from '@/util/namespaceUtil';
export default {
  name: 'ViewNamespace',
  props: {
    namespaceParam: String
  },
  setup(props){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const isShowInvalid = ref(false);
    const isFetching = ref(true);
    const namespaceInfo = ref({});

    const fetchNamespaceDetail = async () => {
      if(!AppState.isReady){
        setTimeout(fetchNamespaceDetail, 1000);
      }
    
      let fetchInfo = await NamespaceUtils.fetchNamespaceInfo(props.namespaceParam);
      if(fetchInfo != false){
        namespaceInfo.value = fetchInfo;
        isShowInvalid.value = false;
      }else{
        isShowInvalid.value = true;
        return;
      }
      isFetching.value = false;
    }
    fetchNamespaceDetail();

    const networkName = computed(() => {
      return networkState.chainNetworkName;
    });

    emitter.on('CHANGE_NETWORK', payload => {
      if(payload){
        fetchNamespaceDetail();
      }
    });

    return {
      namespaceInfo,
      networkName,
      isFetching,
      isShowInvalid
    }
  }
}
</script>