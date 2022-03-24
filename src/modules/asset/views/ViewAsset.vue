<template>
<div>
    <p class="text-gray-500 mb-5 text-sm font-bold">
        Asset <span class="text-blue-primary font-bold">{{assetname}}</span>
    </p>
    <div v-if="isShowInvalid">
  
      <div class="p-3 bg-yellow-100 text-yellow-700">Asset is not available in {{ networkName }}</div>
    </div>
    <div v-else>
    <div class="md:grid md:grid-cols-2">
      <div class="filter shadow-xl border border-gray-50 p-5 mb-15 md:mr-2">
        <div class="text-xs font-bold mb-5">Overview</div>
          <div class="txn-div">
            <div>
              <div>Total Supply </div>
              <div>{{Helper.toCurrencyFormat(assets.supply,assets.divisibility)}}</div>
            </div>
            <div>
              <div>Decimals</div>
              <div>{{assets.divisibility}}</div>
            </div>
          </div>
        </div>
      <div class="filter shadow-xl border border-gray-50 p-5 mb-15 sm:ml-2">
        <div class="text-xs font-bold mb-5">More Info</div>
        <div class="txn-div">
          <div>
            <div>Creator</div>
            <div class="ml-8"> {{assets.owner}} at height {{assets.height}}</div>
          </div>
          <div>
            <div>Asset ID</div>
            <div class="font-bold">{{assets.assetId}}</div>
          </div>
          <div>
            <div>Expiry</div>
            <div class="font-bold">{{assets.expiry==0?'NIL':assets.expiry}}</div>
          </div>
          <div>
            <div>Supply Mutable</div>
            <div class="font-bold text-green-600">{{assets.supplyMutable}}</div>
            <div>Transferable</div>
            <div class="font-bold text-green-600">{{assets.transferable}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="filter shadow-xl border border-gray-50 p-5 mb-15">
      <div class="flex items-center mb-4 border-b border-gray-100 relative">
        <div class="w-32 font-bold text-xs text-center p-2 relative" :class="`${ (currentComponent == 'rich')?'cursor-pointer':'' }`" @click="setCurrentComponent('rich')">Richlist<div v-if="currentComponent == 'rich'" class="absolute w-full border-b border-yellow-500 transition-all duration-200" style="bottom: -1px;"></div></div>
        <div class="w-32 font-bold text-xs text-center p-2 relative" :class="`${ (currentComponent == 'metadata')?'cursor-pointer':'' }`" @click="setCurrentComponent('metadata')">Metadata<div v-if="currentComponent == 'metadata'" class="absolute w-full border-b border-yellow-500 transition-all duration-200" style="bottom: -1px;"></div></div>
      </div>
      <transition name="slide">
        <RichlistComponent v-if="currentComponent == 'rich'" :transactions="richList" :supply="assets.supply"  :divisibility="assets.divisibility" />
        <!-- <InnerTxnComponent v-else-if="currentComponent == 'metadata'" /> -->
      </transition>
    </div>
  </div>
</div>
</template>

<script>
import { computed, getCurrentInstance, ref, watch } from "vue";
import RichlistComponent from '@/modules/asset/components/RichlistComponent.vue';
import { AppState } from '@/state/appState';
import { AssetUtils } from '@/util/assetUtil';
import { Helper } from '@/util/typeHelper';
import { networkState } from '@/state/networkState';

export default {
  name: 'ViewAsset',
  components: {
    RichlistComponent
  },
  props: {
    id: String
  },
  setup(props){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const currentComponent = ref('rich');
    const isShowInvalid = ref(false);
    const richList = ref([]);
    const assetname = ref(null);
    const assets = ref([]);

    const setCurrentComponent = (page) => {
      currentComponent.value = page;
    };

    const networkName = computed(() => {
      return networkState.chainNetworkName;
    });

    const loadAsset = async() => {
      const asset = await AssetUtils.getAssetProperties(props.id);     
      const richlist = await AssetUtils.getRichList(props.id);
      const assetName = await AssetUtils.getAssetName(props.id);
       
      if(asset!=false){
        assets.value = asset;
        if(assetName!=false){
          if(assetName.names[0]!=undefined){
            assetname.value = assetName.names[0].name;
          }
        }else{
          assetname.value = null;
        }
        richList.value = richlist;
      }else{
        isShowInvalid.value = true;
      }
    };

    if(AppState.isReady){
      loadAsset();
    }else{
      let readyWatcher = watch(AppState, (value) => {
        if(value.isReady){
          loadAsset();
          readyWatcher();
        }
      });
    }

    emitter.on('CHANGE_NETWORK', payload => {
      if(payload){
        loadAsset();
      }
    });
    
    return {
      currentComponent,
      loadAsset,
      assets,
      richList,
      Helper,
      setCurrentComponent,
      assetname,
      isShowInvalid,
      networkName
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">


.txn-div{
  @apply text-gray-800 text-xs;
  > div{
    @apply flex justify-start items-center border-b border-gray-100 py-4;

    > div:first-child{
      @apply w-40 text-xs pl-4 font-bold;
    }

    > div:nth-child(2){
      @apply text-xs;
    }

    > div:nth-child(3){
      @apply ml-7 w-36 text-xs pl-4 font-bold;
    }

    > div:last-child{
      @apply border-none;
    }
  }
}
</style>
