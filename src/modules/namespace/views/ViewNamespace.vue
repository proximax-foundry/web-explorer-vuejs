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
            <div class="uppercase col-span-3">{{ namespaceIdHex }}</div>
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
            <div class="font-bold col-span-2">Start Block</div>
            <div class="uppercase col-span-3">{{ namespaceInfo.start }}</div>
          </div>
          <div class="py-4 text-xs grid grid-cols-5">
            <div class="font-bold col-span-2">End Block</div>
            <div class="uppercase col-span-3">{{ namespaceInfo.end }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="filter shadow-xl border border-gray-50 p-5 mb-15">
      <div class="flex items-center mb-4 border-b border-gray-100 relative">
        <div class="w-32 font-bold text-xs text-center p-2 relative" :class="`${ (currentComponent == 'details')?'':'cursor-pointer' }`" @click="setCurrentComponent('details')">Alias/Levels<div v-if="currentComponent == 'details'" class="absolute w-full border-b border-yellow-500 transition-all duration-200" style="bottom: -1px;"></div></div>
        <div class="w-32 font-bold text-xs text-center p-2 relative" :class="`${ (currentComponent == 'metadata')?'':'cursor-pointer' }`" @click="setCurrentComponent('metadata')">Metadata<div v-if="currentComponent == 'metadata'" class="absolute w-full border-b border-yellow-500 transition-all duration-200" style="bottom: -1px;"></div></div>
      </div>
      
      <div v-if="currentComponent == 'details'" class="mt-10">
        <div v-if="(namespaceInfo.alias || namespaceInfo.levels)" class="px-3">
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
              <div v-if="level.name.toUpperCase() === namespaceInfo.name.toUpperCase()">
               {{level.id}}
              </div>
              <div v-else><router-link v-if="level.id" class="text-blue-600 hover:text-blue-primary hover:underline" :to="{ name: 'ViewNamespace', params: { namespaceParam: level.id } }">{{ level.id }}</router-link></div>
              <div>{{ level.name }}</div>
            </div>
          </div>
        </div>
      </div>
      <MetadataComponent :metadata="metadata" v-else-if="currentComponent == 'metadata'" class="mt-1 px-3" />
    
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, getCurrentInstance, inject, ref, watch } from "vue";
import { networkState } from '@/state/networkState';
import { AppState } from '@/state/appState';
import { Helper } from "@/util/typeHelper";
import { NamespaceUtils } from '@/util/namespaceUtil';
import { MetadataUtils } from '@/util/metadataUtil';
import MetadataComponent from '@/modules/namespace/components/MetadataComponent.vue';

export default {
  name: 'ViewNamespace',
  props: {
    namespaceParam: String
  },
  components: {
    MetadataComponent
  },
  setup(props){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const isShowInvalid = ref(false);
    const isFetching = ref(true);
    const metadata = ref([]);
    const namespaceInfo = ref({});
    const namespaceIdHex = ref("");
    const currentComponent = ref('details');
    const setCurrentComponent = (page) => {
      currentComponent.value = page;
    };

    const fetchNamespaceDetail = async () => {
      if(!AppState.isReady){
        setTimeout(fetchNamespaceDetail, 1000);
        return;
      }

      let validNamespaceData = NamespaceUtils.isValidNamespaceString(props.namespaceParam);
    
      if(!validNamespaceData.valid){
        isShowInvalid.value = true;
        return;
      }

      namespaceIdHex.value = validNamespaceData.namespaceIdHex;

      let fetchInfo = await NamespaceUtils.fetchNamespaceInfo(validNamespaceData.namespaceIdHex);

      isFetching.value = false;

      if(fetchInfo != false){
        const namespaceMetadata = await MetadataUtils.getNamespaceMetadata(fetchInfo.name);
        metadata.value = namespaceMetadata;
        namespaceInfo.value = fetchInfo;
        isShowInvalid.value = false;
      }else{
        isShowInvalid.value = true;
        return;
      }
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
      isShowInvalid,
      namespaceIdHex,
      currentComponent,
      setCurrentComponent,
      metadata
    }
  }
}
</script>