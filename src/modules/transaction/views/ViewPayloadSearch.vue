<template>
    <div>
        <div class="flex justify-center">
            <div class="flex border rounded-lg border-gray-900">
                <Textarea v-model="enterText" placeholder="Search Payload" class="rounded-lg bg-transparent p-1" autoResize rows="6" cols="80" />
                <div v-if="isSearching" class="flex justify-center items-center w-10">
                    <div class="flex justify-center items-center border-gray-400">
                        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-navy-primary mr-2"></div>
                    </div>
                </div>
                <div v-else class="hover:bg-blue-100 cursor-pointer flex justify-center items-center rounded-r-lg w-10">
                    <img src="@/assets/img/icon-search.svg" class="w-4 inline-block search" @click="searchPayload" />
                </div>
            </div>
        </div>

        <Accordion :activeIndex="isPayloadTxn? null:0">
            <AccordionTab class="p-accordion-header p-highlight" :disabled="isPayloadTxn">
                <div v-if="findPayload.length == 0"></div>
                <div v-else>
                    <ViewPayload :payload="convertPayload" class="mt-3" />
                </div>
            </AccordionTab>
        </Accordion>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Textarea from 'primevue/textarea';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import ViewPayload from "@/modules/transaction/views/ViewPayload.vue";
import { Convert } from 'tsjs-xpx-chain-sdk';

const enterText = ref("");
const isSearching = ref(false);
const isPayloadTxn = ref(true);
const findPayload = ref("");
const convertPayload = ref()

const searchPayload = async () => {
    if (enterText.value.length == 0) {
        isSearching.value = true
    }
    else{
        isSearching.value = false
        isPayloadTxn.value = false
        findPayload.value = enterText.value
        convertPayload.value = Convert.hexToUint8(findPayload.value)
    }
};

watch(
  () => enterText.value,
  (value) => {
    isPayloadTxn.value = true
    findPayload.value = ""
  }
)
</script>

<style scoped>
:deep(.p-accordion-header,.p-highlight) {
    background-color: lightblue;
    display:flex;
    margin-top: 10px;
    padding:10px;
}
</style>