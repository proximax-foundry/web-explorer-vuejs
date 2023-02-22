<template>
  <div v-if="assets">
    <div class="text-gray-500 mb-5 font-bold" v-if="assets.name">
      <div class="text-blue-primary text-md font-bold uppercase">
        {{ assets.name }}
      </div>
      <div class="text-txs text-gray-400 font-normal mt-1">Asset</div>
    </div>
    <div v-else>
      <p class="text-gray-500 mb-5 text-sm font-bold">Asset Details</p>
    </div>
    <div v-if="isShowInvalid">
      <div class="p-3 bg-yellow-100 text-yellow-700">
        Asset is not available in {{ networkName }}
      </div>
    </div>
    <div v-else-if="isShowInvalid == false">
      <div class="flex justify-center items-center border-gray-400 mt-10 mb-20">
        <div
          class="animate-spin rounded-full h-5 w-5 border-b-2 border-navy-primary mr-2"
        ></div>
        <span class="text-tsm">Fetching Asset Details</span>
      </div>
    </div>
    <div v-else>
      <div class="md:grid md:grid-cols-2">
        <div class="filter shadow-xl border border-gray-50 p-5 mb-15 md:mr-2">
          <div class="text-xs font-bold mb-5 ml-2">Overview</div>
          <div class="txn-div">
            <div class="py-4 text-xs grid grid-cols-5 border-b border-gray-100">
              <div class="font-bold col-span-2">Asset ID</div>
              <div class="font-bold uppercase">{{ assets.assetId }}</div>
            </div>
            <div class="py-4 text-xs grid grid-cols-5 border-b border-gray-100">
              <div class="font-bold col-span-2">Alias</div>
              <div
                class="font-bold uppercase"
                v-if="assets.namespaceId.length > 0"
              >
                <div
                  v-for="(item, index) in assets.namespaceId"
                  :key="index"
                  class="inline-block"
                >
                  <router-link
                    :to="{
                      name: 'ViewNamespace',
                      params: { namespaceParam: item.name },
                    }"
                    class="text-xs font-semibold text-blue-600 col-span-3 hover:text-blue-primary uppercase hover:underline"
                    >{{ item.name }}
                  </router-link>
                  <span
                    v-if="
                      assets.namespaceId.length > 1 &&
                      index != assets.namespaceId.length - 1
                    "
                    class="text-black mr-1 ml-1"
                    >{{ "/" }}</span
                  >
                  <span v-else class="text-black mr-1 ml-1">{{ "" }}</span>
                </div>
              </div>
              <div class="font-bold col-span-2" v-else>-</div>
            </div>
            <div class="py-4 text-xs grid grid-cols-5 border-b border-gray-100">
              <div class="font-bold col-span-2">Total Supply</div>
              <div>
                {{
                  Helper.toCurrencyFormat(assets.supply, assets.divisibility) ==
                  "NaN"
                    ? ""
                    : Helper.toCurrencyFormat(
                        assets.supply,
                        assets.divisibility
                      )
                }}
              </div>
            </div>
            <div class="py-4 text-xs grid grid-cols-5 border-b border-gray-100">
              <div class="font-bold col-span-2">Decimals</div>
              <div>{{ assets.divisibility }}</div>
            </div>
          </div>
        </div>
        <div class="filter shadow-xl border border-gray-50 p-5 mb-15 sm:ml-2">
          <div class="text-xs font-bold mb-5 ml-2">More Info</div>
          <div class="txn-div">
            <div class="py-4 text-xs grid grid-cols-5 border-b border-gray-100">
              <div class="font-bold col-span-2">Creator Address</div>
              <div class="break-all uppercase col-span-3">
                <router-link
                  :to="{
                    name: 'ViewAccount',
                    params: { accountParam: assets.owner },
                  }"
                  class="uppercase text-blue-600 hover:text-blue-primary hover:underline inline-flex"
                >
                  {{ Helper.createAddress(assets.owner).pretty() }}</router-link
                >
              </div>
            </div>
            <div class="py-4 text-xs grid grid-cols-5 border-b border-gray-100">
              <div class="font-bold col-span-2">Block</div>
              <div class="col-span-3">
                <router-link
                  :to="{
                    name: 'ViewBlock',
                    params: { blockHeight: assets.height },
                  }"
                  class="truncate inline-block break-all text-blue-600 hover:text-blue-primary hover:underline"
                  >{{ assets.height }}</router-link
                >
              </div>
            </div>
            <div class="py-4 text-xs grid grid-cols-5 border-b border-gray-100">
              <div class="font-bold col-span-2">Expiry</div>
              <div class="col-span-3">
                {{ assets.expiry == 0 ? "NIL" : assets.expiry }}
              </div>
            </div>
            <div class="py-4 text-xs grid grid-cols-4 border-b border-gray-100">
              <div>Supply Mutable</div>
              <div class="font-bold text-green-600 w-24 ml-10">
                {{ assets.supplyMutable }}
              </div>
              <div>Transferable</div>
              <div class="font-bold text-green-600 w-24 ml-5">
                {{ assets.transferable }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="filter shadow-xl border border-gray-50 p-5 mb-15">
        <div class="flex items-center mb-4 border-b border-gray-100 relative">
          <div
            class="w-32 font-bold text-xs text-center p-2 relative"
            :class="`${currentComponent == 'rich' ? '' : 'cursor-pointer'}`"
            @click="setCurrentComponent('rich')"
          >
            Richlist
            <div
              v-if="currentComponent == 'rich'"
              class="absolute w-full border-b border-yellow-500 transition-all duration-200"
              style="bottom: -1px"
            ></div>
          </div>
          <div
            class="w-32 font-bold text-xs text-center p-2 relative"
            :class="`${currentComponent == 'metadata' ? '' : 'cursor-pointer'}`"
            @click="setCurrentComponent('metadata')"
          >
            Metadata
            <div
              v-if="currentComponent == 'metadata'"
              class="absolute w-full border-b border-yellow-500 transition-all duration-200"
              style="bottom: -1px"
            ></div>
          </div>
        </div>
        <transition name="slide">
          <RichlistComponent
            v-if="currentComponent == 'rich'"
            :transactions="richList"
            :supply="assets.supply"
            :divisibility="assets.divisibility"
          />
          <MetadataComponent
            :metadata="metadata"
            v-else-if="currentComponent == 'metadata'"
          />
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, ref } from "vue";
import RichlistComponent from "@/modules/asset/components/RichlistComponent.vue";
import MetadataComponent from "@/modules/asset/components/MetadataComponent.vue";
import { AppState } from "@/state/appState";
import { AssetUtils } from "@/util/assetUtil";
import { Helper } from "@/util/typeHelper";
import { networkState } from "@/state/networkState";
import { NamespaceId, RichlistEntry } from "tsjs-xpx-chain-sdk";
import { NamespaceUtils } from "@/util/namespaceUtil";
import { MetadataUtils, type MetadataObj } from "@/util/metadataUtil";
import type { AssetObj } from "@/util/assetUtil";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
const internalInstance = getCurrentInstance();
const emitter = internalInstance?.appContext.config.globalProperties.emitter;
const currentComponent = ref("rich");
const isShowInvalid = ref(false);
const richList = ref<RichlistEntry[]>([]);
const metadata = ref<MetadataObj[]>([]);
const assets = ref<AssetObj | null>(null);
const setCurrentComponent = (page: string) => {
  currentComponent.value = page;
};

const networkName = computed(() => {
  return networkState.chainNetworkName;
});

const loadAsset = async () => {
  if (!AppState.isReady && !networkName.value) {
    setTimeout(loadAsset, 1000);
    return;
  }
  const accountMetadata = await MetadataUtils.getAssetMetadata(props.id);
  metadata.value = accountMetadata;
  const asset = await AssetUtils.getAssetProperties(props.id);
  const richlist = await AssetUtils.getRichList(props.id);

  if (asset) {
    isShowInvalid.value = false;
    assets.value = asset;
    richList.value = richlist;
    return;
  } else {
    let ns = new NamespaceId(props.id.toLowerCase());
    const namespaceInfo = await NamespaceUtils.fetchNamespaceInfo(ns.toHex());

    if (namespaceInfo) {
      isShowInvalid.value = false;
      if (namespaceInfo.alias.type == 1) {
        const assetAlias = await AssetUtils.getAssetProperties(
          namespaceInfo.alias.id
        );
        const richlistAlias = await AssetUtils.getRichList(
          namespaceInfo.alias.id
        );
        if (assetAlias) {
          assets.value = assetAlias;
          richList.value = richlistAlias;
        }
      } else {
        isShowInvalid.value = true;
      }
    } else {
      isShowInvalid.value = true;
    }
  }
};
loadAsset();

emitter.on("CHANGE_NETWORK", (payload: boolean) => {
  if (payload) {
    assets.value = null;
    isShowInvalid.value = false;
    loadAsset();
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.txn-div {
  @apply text-gray-800 text-xs;

  > div {
    @apply flex justify-start items-center border-b border-gray-100 py-4;

    > div:first-child {
      @apply w-36 text-xs pl-2 pr-6 font-bold;
    }

    > div:nth-child(2) {
      @apply text-xs;
    }

    > div:nth-child(3) {
      @apply pl-4 w-32 text-xs font-bold;
    }

    > div:last-child {
      @apply border-none;
    }
  }
}
</style>
