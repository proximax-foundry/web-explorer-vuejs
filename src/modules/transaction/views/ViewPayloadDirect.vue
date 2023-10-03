<template>
    <div>

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
import { computed, ref } from 'vue';
import ViewPayload from "@/modules/transaction/views/ViewPayload.vue";
import { networkState } from '@/state/networkState';
import { 
    TransactionMapping, UnknownTransaction, 
    Convert, AggregateTransaction, 
    TransactionType 
} from 'tsjs-xpx-chain-sdk';

const props = defineProps({
  payload: {
    type: String,
    required: true,
  },
});

const isDecoding = ref(false);
const isTxnPayload = ref(true);
const isDeprecatedTxn = ref(false);
const isFetch = ref(true);
const findPayload = ref("");
const payloadToDecode = ref(props.payload);

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

    if (payloadToDecode.value.length == 0) {
        isDecoding.value = false;
        isTxnPayload.value = false;
    }
    else{
        isDecoding.value = true;

        payloadToDecode.value = payloadToDecode.value.trim();

        if(!Convert.isHexString(payloadToDecode.value) || payloadToDecode.value.length <= 122*2){
            isTxnPayload.value = false;
            isDecoding.value = false;
            return;
        }

        let txnSize = parseInt(Convert.hexReverse(payloadToDecode.value.substring(0, 8)), 16);

        if(payloadToDecode.value.length !== txnSize*2){
            isTxnPayload.value = false;
            isDecoding.value = false;
            return;
        }

        try {
            let txn = TransactionMapping.createFromPayload(payloadToDecode.value);

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
            }else if(!(txn instanceof UnknownTransaction)){
                isTxnPayload.value = true;
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

decodePayload();
</script>

<style scoped>
:deep(.p-accordion-header,.p-highlight) {
    background-color: lightblue;
    display:flex;
    margin-top: 10px;
    padding:10px;
}
</style>