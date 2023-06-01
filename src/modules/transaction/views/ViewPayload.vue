<template>
  <div>
    <p class="text-gray-500 mb-5 text-sm font-bold">Payload Details</p>
    <div v-if="!isFetching">
      <div class="filter shadow-xl border border-gray-50 p-5 mb-15">
        <pre>{{ JSON.stringify(transactionPayload, null, 2) }}</pre>
      </div>
    </div>
    <p class="text-gray-500 mb-5 text-sm font-bold">Transaction Details</p>
    <div class="filter shadow-xl border border-gray-50 p-5 mb-15">
      <div class="txn-div">
        <div>
          <div>Deadline</div>
          <div>{{ deadline }}</div>
        </div>
        <div>
          <div>Tx Type</div>
          <div>
            {{ transactionPayload.transactionName }}
            <span class="text-xxs text-gray-500">
              (Version: {{ transactionPayload.version.txnTypeVersion }})
            </span>
          </div>
        </div>
        <div>
          <div>TX FEE</div>
          <div class="relative">
            <span class="font-bold">{{ maxFee[0] }}</span>{{ maxFee[1] > 0 ? "." : ""
            }}<span class="text-xxs">{{ maxFee[1] }}</span>
            <img src="@/assets/img/icon-xpx.svg" class="ml-1 mr-2 inline-block" style="top: -1px; width: 14px" /><span
              class="font-bold">{{ nativeTokenNamespace }}</span>
          </div>
        </div>
      </div>

      <div
        v-if="transactionPayload.type === TransactionType.ADDRESS_ALIAS || transactionPayload.type === TransactionType.MOSAIC_ALIAS">
        <div class="txn-div">
          <div v-if="transactionPayload.address">
            <div>Address</div>
            <div class="flex">
              <router-link :to="{
                name: 'ViewAccount',
                params: { accountParam: transactionPayload.address },
              }" class="mr-2 hover:text-blue-primary hover:underline text-blue-600" id="address"
                :copyValue="Helper.createAddress(transactionPayload.address).pretty()" copySubject="Address">
                {{ Helper.createAddress(transactionPayload.address).pretty() }}
              </router-link>
            </div>
          </div>
          <div v-else>
            <div>Asset</div>
            <div>
              <router-link :to="{ name: 'ViewAsset', params: { id: transactionPayload.assetId } }"
                class="text-blue-600 hover:text-blue-primary hover:underline">{{ transactionPayload.assetId
                }}</router-link>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="transactionPayload.type === TransactionType.TRANSFER">
        <div class="txn-div">
          <div>
            <div>Recipient</div>
            <div class="flex">
              <router-link :to="{
                name: 'ViewAccount',
                params: { accountParam: transactionPayload.recipient.address },
              }" class="mr-2 hover:text-blue-primary hover:underline text-blue-600" id="recipient"
                :copyValue="Helper.createAddress(transactionPayload.recipient.address).pretty()"
                copySubject="Recipient address">
                {{ Helper.createAddress(transactionPayload.recipient.address).pretty() }}
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="transactionPayload.type === TransactionType.AGGREGATE_BONDED_V1 ||
        transactionPayload.type === TransactionType.AGGREGATE_COMPLETE_V1 || 
        transactionPayload.type === TransactionType.ACCOUNT_METADATA_V2 || 
        transactionPayload.type === TransactionType.MOSAIC_METADATA_V2 || 
        transactionPayload.type === TransactionType.NAMESPACE_METADATA_V2
        ">
        <div class="txn-div">
          <div>
            <div>Inner Transaction</div>
          </div>
          <InnerPayloadTxnComponent :innerTxn="transactionPayload.innerTransactions" :txn="txn" />
        </div>
      </div>

      <div v-else-if="transactionPayload.type === TransactionType.MOSAIC_DEFINITION ||
        transactionPayload.type === TransactionType.MOSAIC_SUPPLY_CHANGE ||
        transactionPayload.type === TransactionType.MODIFY_MOSAIC_LEVY ||
        transactionPayload.type === TransactionType.REMOVE_MOSAIC_LEVY
        ">
        <div class="txn-div">
          <div>
            <div>Asset ID</div>
            <div>
              <router-link :to="{ name: 'ViewAsset', params: { id: transactionPayload.assetId } }"
                class="uppercase text-blue-600 hover:text-blue-primary hover:underline">
                {{ transactionPayload.assetId }}
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="transactionPayload.type === TransactionType.REGISTER_NAMESPACE">
        <div class="txn-div">
          <div>
            <div>Namespace Type</div>
            <div>{{ transactionPayload.registerTypeName }}</div>
          </div>
          <div>
            <div>Namespace Name</div>
            <div>
              <router-link :to="{
                name: 'ViewNamespace',
                params: { namespaceParam: transactionPayload.namespaceId },
              }" class="text-blue-600 hover:text-blue-primary hover:underline">
                {{ transactionPayload.namespaceName }}
              </router-link>
            </div>
          </div>
          <div v-if="transactionPayload.parentName">
            <div>Parent</div>
            <div>
              <router-link :to="{
                name: 'ViewNamespace',
                params: { namespaceParam: transactionPayload.parentId },
              }" class="text-blue-600 hover:text-blue-primary hover:underline">
                {{ transactionPayload.parentName }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { AddressAliasTransaction, Convert, MosaicAliasTransaction, NamespaceType, RegisterNamespaceTransaction, TransactionMapping, TransactionType } from 'tsjs-xpx-chain-sdk';
import { computed, ref } from 'vue';
import { AppState } from "@/state/appState";
import { Helper } from '@/util/typeHelper';
import { TransactionUtils } from '@/util/transactionUtils';
import InnerPayloadTxnComponent from "@/modules/transaction/components/InnerPayloadTxnComponent.vue";

const props = defineProps({
  payload: {
    type: Uint8Array,
    required: true,
  }
});

const transactionPayload = ref<any>({});
const nativeTokenNamespace = AppState.nativeToken.label;
const isFetching = ref(true);
const txn = ref();

const convertPayload = Convert.uint8ArrayToHex(props.payload)

if (convertPayload) {
  txn.value = TransactionMapping.createFromPayload(convertPayload)
}

const loadPayloadTransaction = async () => {
  if (!AppState.isReady) {
    setTimeout(loadPayloadTransaction, 1000);
    return;
  }
  if (txn.value) {
    for (const property in txn.value) {
      if (txn.value.hasOwnProperty(property) && (typeof txn.value[property] === "object")) {
        let second: any = {}
        for (const subProperty in txn.value[property]) {
          if (txn.value[property].hasOwnProperty(subProperty) && (typeof txn.value[property][subProperty] === "object")) {
            let third: any = {}
            for (const thirdProperty in txn.value[property][subProperty]) {
              third[thirdProperty] = txn.value[property][subProperty][thirdProperty]
            }
            second[subProperty] = third
          }
          else {
            second[subProperty] = txn.value[property][subProperty]
          }
        }
        transactionPayload.value[property] = second
      }
      else if (txn.value[property] !== undefined) {
        transactionPayload.value[property] = txn.value[property]

      }
    }
  }
  switch (transactionPayload.value.type) {
    case TransactionType.ADDRESS_ALIAS:
    case TransactionType.MOSAIC_ALIAS:
      if (transactionPayload.value.type === TransactionType.ADDRESS_ALIAS) {
        const addressAliasTxn = txn.value as AddressAliasTransaction;
        transactionPayload.value.address = addressAliasTxn.address.plain();
      }
      else if (transactionPayload.value.type === TransactionType.MOSAIC_ALIAS) {
        const assetAliasTxn = txn.value as MosaicAliasTransaction;
        transactionPayload.value.assetId = assetAliasTxn.mosaicId.toHex();
        break;
      }
    case TransactionType.MOSAIC_DEFINITION:
    case TransactionType.MOSAIC_SUPPLY_CHANGE:
    case TransactionType.MODIFY_MOSAIC_LEVY:
    case TransactionType.REMOVE_MOSAIC_LEVY:
      if (transactionPayload.value.type === TransactionType.MOSAIC_DEFINITION ||
        transactionPayload.value.type === TransactionType.MOSAIC_SUPPLY_CHANGE ||
        transactionPayload.value.type === TransactionType.MODIFY_MOSAIC_LEVY ||
        transactionPayload.value.type === TransactionType.REMOVE_MOSAIC_LEVY
      ) {
        transactionPayload.value.assetId = txn.value.mosaicId.toHex();
        break;
      }
    case TransactionType.REGISTER_NAMESPACE:
      if (transactionPayload.value.type === TransactionType.REGISTER_NAMESPACE) {
        const registerTxn = txn.value as RegisterNamespaceTransaction;
        transactionPayload.value.namespaceName = registerTxn.namespaceName;
        transactionPayload.value.namespaceId = registerTxn.namespaceId.id.toHex();
        if (registerTxn.namespaceType === NamespaceType.RootNamespace && registerTxn.duration) {
          transactionPayload.value.value = NamespaceType.RootNamespace;
          transactionPayload.value.registerTypeName = "Root namespace";
        }
        if (registerTxn.parentId) {
          transactionPayload.value.registerType = NamespaceType.SubNamespace;
          transactionPayload.value.registerTypeName = "Sub namespace";
          transactionPayload.value.parentId = registerTxn.parentId.toHex();
          const namespaceName = await TransactionUtils.getNamespacesName([
            registerTxn.parentId,
          ]);
          transactionPayload.value.parentName = namespaceName[0].name;
        }
      }
  }
  isFetching.value = false;
}

loadPayloadTransaction()

const maxFee: any = computed(() => {
  if (!txn.value) {
    return "";
  }
  const fee = TransactionUtils.convertToExactNativeAmount(txn.value.maxFee.compact())
  return fee.toString().split(".");
});

const deadline = computed(() => {
  if (!txn.value) {
    return "";
  }
  return Helper.formatDeadline(txn.value.deadline.adjustedValue.compact())
})

</script>

<style scoped lang="scss">
.txn-div,
.details {
  @apply text-gray-800 text-xs;

  >div {
    @apply flex items-center border-b border-gray-100 py-4;

    >div:first-child {
      @apply w-40 text-xs pl-4;
    }

    >div:nth-child(2) {
      @apply text-xs w-full;
    }

    >div:last-child {
      @apply border-none;
    }
  }
}
</style>