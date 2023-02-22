<template>
  <div>
    <div class="flex text-xs font-semibold border-b-2">
      <div class="border-b-2 p-1 mt-3 mb-3 w-18 text-center font-semibold"
        :class="`${(currentComponent == 'multisig') ? 'border-blue-500 text-white bg-blue-primary' : 'cursor-pointer'}`"
        @click="setCurrentComponent('multisig')">Multisig</div>
      <div class="border-b-2 p-1 mt-3 mb-3 w-18 text-center font-semibold"
        :class="`${(currentComponent == 'scheme') ? 'border-blue-500 text-white bg-blue-primary' : 'cursor-pointer'}`"
        @click="setCurrentComponent('scheme')">Scheme</div>
    </div>
    <div class="mb-20">
      <div v-if="currentComponent == 'multisig'">
        <div class='p-6 border-2 border-t-0 filter shadow-lg'>
          <div class='text-xs font-semibold'>Account Cosignatories</div>
          <div class='border p-4 my-3 '>
            <div class="flex flex-col gap-2">
              <div v-for="(cosigner, index) in cosignerAccountsList" :key="index">
                <div class="border w-full rounded-md p-3">
                  <div class="flex items-center">
                    <div :id="`cosignerAddress${index}`" :copyValue="cosigner" copySubject="Address"
                      class="text-txs font-bold mt-1">
                      <router-link :to="{ name: 'ViewAccount', params: { accountParam: cosigner } }"
                        class="hover:text-blue-primary hover:underline">
                        {{ cosigner}}
                      </router-link>
                    </div>
                    <img src="@/assets/img/icon-copy.svg" @click="copy(`cosignerAddress${index}`)"
                      class="ml-2 w-4 h-4 cursor-pointer" />
                    <router-link :to="{ name: 'ViewAccount', params: { accountParam: cosigner } }"
                      class="hover:bg-gray-200 w-7 h-7 ml-auto flex justify-center items-center rounded-full duration-300 transition-all cursor-pointer">
                      <img src="@/assets/img/chevron_right.svg" class="w-5 h-5">
                    </router-link>
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
              <div v-for="(multisig, index) in multisigAccountsList" :key="index">
                <div class="border w-full rounded-md p-3">
                  <div class="flex items-center">
                    <div :id="`multisigAddress${index}`" :copyValue="multisig" copySubject="Address"
                      class="text-txs font-bold mt-1">
                      <router-link :to="{ name: 'ViewAccount', params: { accountParam: multisig } }"
                        class="hover:text-blue-primary hover:underline">
                        {{ multisig}}
                      </router-link>
                    </div>
                    <img src="@/assets/img/icon-copy.svg" @click="copy(`multisigAddress${index}`)"
                      class="ml-2 w-4 h-4 cursor-pointer" />
                    <router-link :to="{ name: 'ViewAccount', params: { accountParam: multisig } }"
                      class="hover:bg-gray-200 w-7 h-7 ml-auto flex justify-center items-center rounded-full duration-300 transition-all cursor-pointer">
                      <img src="@/assets/img/chevron_right.svg" class="w-5 h-5">
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="!multisigLength" class='text-blue-primary text-xs text-center font-semibold'>Nothing to show.</div>
            <div v-if="!multisigLength"
              class='flex text-txs w-9/12 ml-auto mr-auto text-gray-400 mt-1 justify-center text-center'>
              <span>{{ prettyAddress }} is not a cosignatory of any accounts.</span>
            </div>
          </div>
        </div>
      </div>
      <SchemeComponent v-else-if="currentComponent == 'scheme'" :accountAddress="address" :accountPublicKey="accountPublicKey" />
    </div>
  </div>
</template>

<script setup lang=ts>
import { ref, computed } from "vue";
import SchemeComponent from "@/modules/account/components/SchemeComponent.vue";
import { useToast } from "primevue/usetoast";
import { copyToClipboard } from '@/util/functions';
import { Helper } from '@/util/typeHelper';

const props = defineProps({
  cosignatories: {
    type: Array<string>,
    required:true
  },
  multisig: {
    type: Array<string>,
    required:true
  },
  address: {
    type: String,
    required:true
  },
  accountPublicKey:{
    type: String,
    required:true
  },
})

const currentComponent = ref('multisig');
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

const multisigAccountsList = computed(() => {
  return props.multisig
})

const cosignerAccountsList = computed(() => {
  return props.cosignatories
})

const copy = (id :string) => {
  let element = document.getElementById(id)
  if (element) {
    let stringToCopy = element.getAttribute("copyValue");
    let copySubject = element.getAttribute("copySubject");
    if (stringToCopy) {
      copyToClipboard(stringToCopy);
      toast.add({ severity: 'info', detail: copySubject + ' copied', group: 'br', life: 3000 });
    }
  }
};

const setCurrentComponent = (page:string)  => {
  currentComponent.value = page;
}

</script>