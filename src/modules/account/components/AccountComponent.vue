<template>
  <div class="border-2 shadow-lg filter px-2 py-4">
    <div class="flex items-center">
      <div v-html="svgString"></div>
      <div class="flex flex-col justify-center ml-2">
        <div class="text-xxs font-semibold text-gray-400 mb-1">Address</div>
        <div class="flex items-center">
          <div id="address" :copyValue="address" copySubject="Address" class="text-xs font-semibold mt-1">{{ address }}</div>
          <img src="@/assets/img/icon-copy.svg" @click="copy('address')" class="ml-2 w-4 h-4 cursor-pointer" />
        </div>
        <div class="text-xxs font-semibold text-gray-400 mt-4 mb-1">Public Key</div>
        <div class="flex items-center" v-if="publicKey===invalidPublicKey">
          <div id="publicKey" class="text-xs font-semibold mt-1 text-gray-300">{{ publicKey }}</div>
        </div>
        <div class="flex items-center" v-else>
          <div id="publicKey" :copyValue="address" copySubject="Public Key" class="text-xs font-semibold mt-1">{{ publicKey }}</div>
          <img src="@/assets/img/icon-copy.svg" @click="copy('publicKey')" class="ml-2 w-4 h-4 cursor-pointer" />
        </div>
        <div class="flex gap-2">
          <div v-if="multisig>0" class="px-2 py-1 flex mt-4 bg-orange-primary rounded-sm items-center">
            <img src="@/modules/account/img/icon-key.svg" class="h-3 w-3 mr-1" title="This is your default account everytime you login">
            <p class="font-semibold text-white text-xxs pt-px cursor-default" title="This is a multisig account" >MULTISIG</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ThemeStyleConfig } from '@/models/stores/themeStyleConfig';
import { ref } from "vue";
import { toSvg } from "jdenticon";
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";
export default {
  name:"AccountComponent",
  props:{
    address: String,
    publicKey: String,
    multisig: Number,
  },

  setup(props){
    const invalidPublicKey = '0000000000000000000000000000000000000000000000000000000000000000';
    const toast = useToast();
    let themeConfig = new ThemeStyleConfig('ThemeStyleConfig');
    themeConfig.init();
    const svgString = ref(toSvg(props.address, 70, themeConfig.jdenticonConfig));

    const copy = (id) =>{
      let stringToCopy = document.getElementById(id).getAttribute("copyValue");
      let copySubject = document.getElementById(id).getAttribute("copySubject");
      copyToClipboard(stringToCopy);

      toast.add({severity:'info', detail: copySubject + ' copied', group: 'br', life: 3000});
    };

    return{
      svgString,
      copy,
      invalidPublicKey,
    }
  }
}
</script>