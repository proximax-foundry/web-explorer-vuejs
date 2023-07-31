<template>
    <div>
        <div class="flex justify-center">
            <div class="flex border rounded-lg border-gray-900">
                <Textarea v-model="enterText" placeholder="Transaction payload to decode" class="rounded-lg bg-transparent p-1" autoResize rows="6" cols="80" />
                <div v-if="isDecoding" class="flex justify-center items-center w-10">
                    <div class="flex justify-center items-center border-gray-400">
                        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-navy-primary mr-2"></div>
                    </div>
                </div>
                <div v-else class="hover:bg-blue-100 cursor-pointer flex justify-center items-center rounded-r-lg w-10" @click="decodePayload">
                    <img src="@/assets/img/icon-search.svg" class="w-4 inline-block search"/>
                </div>
            </div>
        </div>

        <div v-if="payloadToDecode.length == 0"></div>
        <div v-else>
            <div v-if="isTxnPayload && !isDeprecatedTxn">
                <ViewPayload :payload="payloadToDecode" class="mt-3" />
            </div>
            <div v-else-if="!isTxnPayload">
                <div class="pb-14 pt-2">
                    <div class="p-3 bg-yellow-100 text-yellow-700">
                        Unable to decode transaction payload. Make sure it is a correct payload.
                    </div>
                </div>
            </div>
            <div v-else-if="isDeprecatedTxn">
                <div class="pb-14 pt-2">
                    <div class="p-3 bg-yellow-100 text-yellow-700">
                        Deprecated transaction type found.
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Textarea from 'primevue/textarea';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import ViewPayload from "@/modules/transaction/views/ViewPayload.vue";
import { networkState } from '@/state/networkState';
import { 
    TransactionMapping, UnknownTransaction, 
    Convert, AggregateTransaction, 
    TransactionType 
} from 'tsjs-xpx-chain-sdk';

const enterText = ref("");
const isDecoding = ref(false);
const isTxnPayload = ref(true);
const isDeprecatedTxn = ref(false);
const isFetch = ref(true);
const findPayload = ref("");
const payloadToDecode = ref("");

const networkName = computed(() => {
  return networkState.chainNetworkName;
});

const deprecatedTxnType = [
    TransactionType.MODIFY_ACCOUNT_METADATA,
    TransactionType.MODIFY_MOSAIC_METADATA,
    TransactionType.MODIFY_NAMESPACE_METADATA
];

const decodePayload = async () => {
    
    isDeprecatedTxn.value = false;

    if (enterText.value.length == 0) {
        isDecoding.value = false;
        isTxnPayload.value = false;
    }
    else{
        isDecoding.value = true;

        enterText.value = enterText.value.trim();

        if(!Convert.isHexString(enterText.value) || enterText.value.length <= 122*2){
            isTxnPayload.value = false;
            isDecoding.value = false;
            return;
        }

        let txnSize = parseInt(Convert.hexReverse(enterText.value.substring(0, 8)), 16);

        if(enterText.value.length !== txnSize*2){
            isTxnPayload.value = false;
            isDecoding.value = false;
            return;
        }

        try {
            let txn = TransactionMapping.createFromPayload(enterText.value);

            if(deprecatedTxnType.includes(txn.type)){
                isDeprecatedTxn.value = true;
            }
            else if(txn instanceof AggregateTransaction){
                for(const innerTxn of txn.innerTransactions){
                    if(innerTxn instanceof UnknownTransaction){
                        isTxnPayload.value = false;
                        break;
                    }
                    else if(deprecatedTxnType.includes(innerTxn.type)){
                        isDeprecatedTxn.value = true;
                        break;
                    } 
                }
                isTxnPayload.value = true;
                payloadToDecode.value = enterText.value;
            }else if(!(txn instanceof UnknownTransaction)){
                isTxnPayload.value = true;
                payloadToDecode.value = enterText.value;
            }
            else{
                isTxnPayload.value = false;
            }
        } catch (error) {
            isTxnPayload.value = false;
        }

        isDecoding.value = false;
    }
};
</script>

<style scoped>
:deep(.p-accordion-header,.p-highlight) {
    background-color: lightblue;
    display:flex;
    margin-top: 10px;
    padding:10px;
}
</style>