<template>
  <div class="border-2 border-t-0 shadow-lg schema">
    <div class="p-6 filter overflow-auto transform" :class="`${ !viewDirectionDetailSetting?'-scale-x-1':(!viewDirectionSetting?'-scale-y-1':'') }`" v-if="!isFetch">
      <div class="transform">
        <blocks-tree :data="graph" :horizontal="viewDirectionSetting" :collapsable="collapsable" :props="{ label:'label', numApproveTx:'numApproveTx', numRemoval:'numRemoval', children: 'children' }">
          <template #node="{data}">
            <div class="flex flex-col justify-center p-1.5 h-20 w-72">
              <div class="transform" :class="`${ !viewDirectionDetailSetting?'-scale-x-1':(!viewDirectionSetting?'-scale-y-1':'') }`">
                <div class="text-xs text-left text-blue-500 font-bold">{{data.name}}</div>
                <div class="flex mb-3">
                  <div :id="data.label" :copyValue="prettyAddress(data.label)" copySubject="Address" class="font-bold text-left text-xs mt-0.5">{{ displayAddress(data.label) }}</div>
                  <img src="@/assets/img/icon-copy.svg" @click="copy(data.label)" class="ml-2 w-4 h-4 cursor-pointer" />
                </div>
                <div class="flex">
                  <div class="text-xxs text-gray-500">S: {{ data.numApproveTx }}-of-{{ data.children.length }}</div>
                  <div class="text-xxs text-gray-500">D: {{ data.numRemoval }}-of-{{ data.children.length }}</div>
                  <div class="flex ml-auto">
                    <div v-if="data.children.length > 0" class="ml-auto bg-green-500 rounded-2xl w-7 h-7 flex items-center justify-center" title="Multisig">
                      <img src="@/assets/img/icon-multisig.svg" class="h-4 w-5" style="transform: rotateY(180deg)">
                    </div>
                    <div v-if="data.children.length > 0 && findAccountWithAddress(data.label)!=undefined"  class="w-7 h-7 flex items-center justify-center bg-purple-500 rounded-2xl ml-1.5" title="Owner">
                      <img src="@/assets/img/icon-bookmark_white.svg" class="h-4 w-4">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </blocks-tree>
      </div>
    </div>
  </div>
  <div class="mt-5">
    <div class="font-semibold mb-3">View setting</div>
    <div>
      <input id="horizontal" name="view-type" type="radio" :value="true" v-model="viewDirectionSetting" :checked="true">
      <label for="horizontal" class="text-left py-3 text-xs pl-4 cursor-pointer">Horizontal</label>
    </div>
    <div>
      <input id="vertical" name="view-type" type="radio" :value="false" v-model="viewDirectionSetting">
      <label for="vertical" class="text-left py-3 text-xs pl-4 cursor-pointer">Vertical</label>
    </div>
    <div class="mt-3">
      <input id="detail1" name="view-type-detail" type="radio" :value="false" v-model="viewDirectionDetailSetting" :checked='true'>
      <label for="detail1" v-if="viewDirectionSetting" class="text-left py-3 text-xs pl-4 cursor-pointer">Right to Left</label>
      <label for="detail1" v-else class="text-left py-3 text-xs pl-4 cursor-pointer">Top to Bottom</label>
    </div>
    <div>
      <input id="detail2" name="view-type-detail" type="radio" :value="true" v-model="viewDirectionDetailSetting">
      <label for="detail2" v-if="viewDirectionSetting" class="text-left py-3 text-xs pl-4 cursor-pointer">Left to Right</label>
      <label for="detail2" v-else class="text-left py-3 text-xs pl-4 cursor-pointer">Bottom to Top</label>
    </div>
    <div class="mt-3">
      <input id="collapsable" type="checkbox" @click="collapsable=!collapsable">
      <label for="collapsable" class="text-left py-3 text-xs pl-4 cursor-pointer">Collapsable</label>
    </div>
  </div>
</template>

<script>
import { Address } from "tsjs-xpx-chain-sdk";
import { watch, ref, computed, getCurrentInstance, toRefs } from "vue";
import { MultisigInfo } from '@/models/multisigInfo';
import { useToast } from "primevue/usetoast";
import { copyToClipboard } from '@/util/functions';
import { Helper } from '@/util/typeHelper';
import { AccountUtils } from "@/util/accountUtil";
import { AppState } from '@/state/appState';
import 'vue3-blocks-tree/dist/vue3-blocks-tree.css';

export default {
  name:"SchemeComponent",
  props:{
    accountAddress: String,
    accountPublicKey: String,
  },
  setup(props){
    const toast = useToast();
    const isFetch = ref(true);
    const collapsable = ref(false);
    const graph = ref({});
    const viewDirectionSetting = ref(true);
    const viewDirectionDetailSetting = ref(true);

    const prettyAddress = (address) => {
      return Helper.createAddress(address).pretty();
    };

    const displayAddress = (address) =>{
      let part1 = address.slice(0,13);
      let part2 = address.slice(35,46);
      return part1 + '...' + part2;
    }

    const findAccountWithAddress = (address) =>{
      return address == props.accountAddress;
    }

    const splitBalance = balance => {
      let formattedBalance =  Helper.toCurrencyFormat(balance, AppState.nativeToken.divisibility);
      let split = formattedBalance.split(".")
      if (split[1]!=undefined){
        return {left:split[0],right:split[1]}
      }else{
        return {left:split[0], right:null}
      }
    }

    const currentNativeTokenName = computed(() => {
      return AppState.nativeToken.label;
    });

    const convertToAddress = (publicKey) =>{
      return Address.createFromPublicKey(publicKey, AppState.networkType);
    }

    const getChildObject = (cosignaturies, multisigAccounts)  =>{
      let tempArray = [];
      let cosigns = [];
      for(let i=0; i < cosignaturies.length; i++){
        cosigns = findCosign(cosignaturies[i], multisigAccounts);
        tempArray.push({
          label: convertToAddress(cosignaturies[i]).pretty(),
          numApproveTx:getApproveTx(cosignaturies[i], multisigAccounts),
          numRemoval:getRemoval(cosignaturies[i], multisigAccounts),
          children: getChildObject(cosigns)
        }); //keep on looping to the end
      }
      return tempArray;
    }

    const findCosign = (publicKey, multisigAccounts) =>{
      return multisigAccounts.find(account=>account.publicKey == publicKey).cosignaturies;
    };

    const getApproveTx = (publicKey, multisigAccounts) =>{
      return multisigAccounts.find(account => account.publicKey == publicKey).minApproval;
    };

    const getRemoval = (publicKey, multisigAccounts) =>{
      return multisigAccounts.find(account => account.publicKey == publicKey).minRemoval;
    };

    // const multisigAccounts = currentAccount.value.multisigInfo.filter(accounts=>accounts.level>=0 || accounts.publicKey == currentAccount.value.publicKey)

    const generateGraph = async(strAddress) => {
      if(!AppState.isReady){
        setTimeout(generateGraph, 1000);
      }
      let address = Address.createFromRawAddress(strAddress);
      let graphInfo = await AppState.chainAPI.accountAPI.getMultisigAccountGraphInfo(address);
      let multisigInfos = [];

      graphInfo.multisigAccounts.forEach((value, key)=>{
        const level = key;
        for(let i =0; i < value.length; ++i){
          let multiInfo = value[i];
          let newMultisigInfo = new MultisigInfo(
            multiInfo.account.publicKey,
            level,
            multiInfo.cosignatories.map((cosign) => cosign.publicKey),
            multiInfo.multisigAccounts.map((cosign) => cosign.publicKey),
            multiInfo.minApproval,
            multiInfo.minRemoval
          );
          multisigInfos.push(newMultisigInfo);
        }
      });

      const multisigAccounts = multisigInfos.filter((accounts)=>accounts.level >= 0 || accounts.publicKey == props.accountPublicKey);

      graph.value = {
        label: convertToAddress(multisigAccounts[0].publicKey).pretty(),
        numApproveTx:getApproveTx(multisigAccounts[0].publicKey, multisigAccounts),
        numRemoval:getRemoval(multisigAccounts[0].publicKey, multisigAccounts),
        children: getChildObject(multisigAccounts[0].cosignaturies, multisigAccounts)
      };
      isFetch.value = false;
    }
    generateGraph(props.accountAddress);

    const copy = (id) =>{
      let stringToCopy = document.getElementById(id).getAttribute("copyValue");
      let copySubject = document.getElementById(id).getAttribute("copySubject");
      copyToClipboard(stringToCopy);
      toast.add({severity:'info', detail: copySubject + ' copied', group: 'br', life: 3000});
    };

    return{
      viewDirectionSetting,
      viewDirectionDetailSetting,
      collapsable,
      findAccountWithAddress,
      displayAddress,
      splitBalance,
      copy,
      prettyAddress,
      currentNativeTokenName,
      graph,
      isFetch
    }
  }
}
</script>
<style lang="scss" scoped>
// @import "@/assets/scss/vue3-blocks-tree.scss";

.schema::v-deep{
  .org-tree-node-label{
    .org-tree-node-label-inner{
      @apply bg-gray-50;
      box-shadow: none !important;
      @apply border border-gray-300;
    }
  }
}
</style>