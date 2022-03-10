<template>
  <div class='p-6 border-2 border-t-0 filter shadow-lg'>
    <div class='text-xs font-semibold'>Account Cosignatories</div>
    <div class='border p-4 my-3 '>
      <div class="flex flex-col gap-2">
        <div v-for="(cosigner,index) in cosignerAccountsList" :key="index">
          <div class="border w-full rounded-md p-3">
            <div class="flex items-center">
              <div :id="`cosignerAddress${index}`" :copyValue="cosigner.address" copySubject="Address" class="text-txs font-bold mt-1">{{cosigner.address}}</div>
              <img src="@/assets/img/icon-copy.svg" @click="copy(`cosignerAddress${index}`)" class="ml-2 w-4 h-4 cursor-pointer" />
              <img src="@/assets/img/chevron_right.svg" class="w-5 h-5 ml-auto">
            </div>
          </div>
        </div>
      </div>
      <div v-if="!cosignerLength" class='text-blue-primary text-xs text-center font-semibold'>Nothing to show.</div>
      <div v-if="!cosignerLength" class='text-txs w-9/12 ml-auto mr-auto text-gray-400 mt-1 text-center'>
        <span>"{{ prettyAddress }}" does not have any cosignatory accounts.</span>
      </div>
    </div>
    <div class="gray-line my-8"></div>
    <div class='text-xs font-semibold'>Cosignatory of</div>
    <div class='border p-4 mt-3'>
      <div class="flex flex-col gap-2">
        <div v-for="(multisig,index) in multisigAccountsList" :key="index">
          <div class="border w-full rounded-md p-3">
            <div class="flex items-center">
              <div :id="`multisigAddress${index}`" :copyValue="multisig.address" copySubject="Address" class="text-txs font-bold mt-1">{{multisig.address}}</div>
              <img src="@/assets/img/icon-copy.svg" @click="copy(`multisigAddress${index}`)" class="ml-2 w-4 h-4 cursor-pointer" />
              <img src="@/assets/img/chevron_right.svg" class="w-5 h-5 ml-auto">
            </div>
          </div>
        </div>
      </div>
      <div v-if="!multisigLength" class='text-blue-primary text-xs text-center font-semibold'>Nothing to show.</div>
      <div v-if="!multisigLength" class='flex text-txs w-9/12 ml-auto mr-auto text-gray-400 mt-1 justify-center text-center'>
        <span>{{ prettyAddress }} is not a cosignatory of any accounts.</span>
      </div>
    </div>
  </div>
</template>

<script>

import { watch, ref, computed, getCurrentInstance, toRefs } from "vue";
import { useToast } from "primevue/usetoast";
import { copyToClipboard } from '@/util/functions';
import { Helper } from '@/util/typeHelper';
import { AccountUtils } from "@/models/util/accountUtil";
import { AppState } from '@/state/appState';

export default {
  name:"MultisigComponent",
  props:{
    cosignatories: Array,
    multisig: Array,
    address: String,
  },
  setup(props){
    const toast = useToast();
    const prettyAddress = computed(() => {
      return Helper.createAddress(props.address).pretty();
    });

    const cosignerLength = computed(() => {
      return props.cosignatories.length;
    });

    const multisigLength = computed(() => {
      return props.multisig.length;
    });

    const multisigAccountsList = computed(()=>{
      let multisigAccountsList = [];
      let multisigAccounts = props.multisig;
      if(multisigAccounts.length > 0){
        multisigAccounts.forEach( account => multisigAccountsList.push({address: Helper.createAddress(account.address.address).pretty()}) );
      }
      return multisigAccountsList;
    }, {deep: true} )

    const cosignerAccountsList = computed(()=>{
      let cosignerAccountsList = [];
      let cosignerAccounts = props.cosignatories;
      if(cosignerAccounts.length > 0){
        cosignerAccounts.forEach( account => cosignerAccountsList.push({address: Helper.createAddress(account.address.address).pretty()}) );
      }
      return cosignerAccountsList
    }, {deep: true} )

    const copy = (id) =>{
      let stringToCopy = document.getElementById(id).getAttribute("copyValue");
      let copySubject = document.getElementById(id).getAttribute("copySubject");
      copyToClipboard(stringToCopy);
      toast.add({severity:'info', detail: copySubject + ' copied', group: 'br', life: 3000});
    };

    return{
      cosignerLength,
      multisigLength,
      multisigAccountsList,
      cosignerAccountsList,
      copy,
      prettyAddress,
    }
  }
}
</script>