<template>
  <div v-if="toggleTransform">
    <div v-if="!detectError">
      <div
        v-if="!(txnType == TransactionType.REGISTER_NAMESPACE || innerType == TransactionType.REGISTER_NAMESPACE)"
        v-for="item in formattedNamespaceId"
        :class="[checkTxnType(txnType) ? 'table_div' : 'txn-div']"
      >
        <div v-if="item.aliasName">
          <div>Namespace Name</div>
          <div>{{ item.aliasName }}</div>
        </div>
      </div>
      <div
        v-else-if="(txnType == TransactionType.REGISTER_NAMESPACE || innerType == TransactionType.REGISTER_NAMESPACE) && txnDetail"
        v-for="item in formattedNamespaceId"
        :class="[checkTxnType(txnType) ? 'table_div' : 'txn-div']"
      >
        <div v-if="item.aliasName && txnDetail.name === 'ParentId'">
          <div>Parent</div>
          <div>
            <router-link
              :to="{
                name: 'ViewNamespace',
                params: { namespaceParam: txnDetail.value },
              }"
              class="hover:text-blue-primary hover:underline text-blue-600"
              >{{ item.aliasName }}
            </router-link>
          </div>
        </div>
        <div v-if="txnDetail.name === 'NamespaceId'">
          <div>{{ txnDetail.name }}</div>
          <div>
            <router-link
              :to="{
                name: 'ViewNamespace',
                params: { namespaceParam: txnDetail.value },
              }"
              class="hover:text-blue-primary hover:underline text-blue-600"
              >{{ txnDetail.value }}
            </router-link>
            <span class="text-xxs text-gray-500" v-if="txnDetail.secondaryValue"
              >({{ txnDetail.secondaryValue }})</span
            >
          </div>
        </div>
      </div>
    </div>
    <div v-else :class="[checkTxnType(txnType) ? 'table_div' : 'txn-div']">
      <div v-if="txnDetail">
        <div>{{ txnDetail.name }}</div>
        <div>
          <router-link
            :to="{
              name: 'ViewNamespace',
              params: { namespaceParam: txnDetail.value },
            }"
            class="hover:text-blue-primary hover:underline text-blue-600"
            >{{ txnDetail!.value }}
          </router-link>
          <span class="text-xxs text-gray-500" v-if="txnDetail.secondaryValue"
            >({{ txnDetail.secondaryValue }})</span
          >
          <span class="text-red-600 pl-2">(Namespace Name Not Found)</span>
        </div>
      </div>
    </div>
  </div>

  <div v-else :class="[checkTxnType(txnType) ? 'table_div' : 'txn-div']">
    <div v-if="txnDetail">
      <div>{{ txnDetail.name }}</div>
      <div>
        <router-link
          :to="{
            name: 'ViewNamespace',
            params: { namespaceParam: txnDetail.value },
          }"
          class="hover:text-blue-primary hover:underline text-blue-600"
          >{{ txnDetail.value }}
        </router-link>
        <span class="text-xxs text-gray-500" v-if="txnDetail.secondaryValue"
          >({{ txnDetail.secondaryValue }})</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TransactionUtils } from "@/util/transactionUtils";
import { TransactionType } from "tsjs-xpx-chain-sdk";
import { NamespaceId } from "tsjs-xpx-chain-sdk";
import { ref } from "vue";

const props = defineProps({
  txnDetail: Object,
  NamespaceID: NamespaceId,
  toggleTransform: Boolean,
  txnType: Number,
  innerType: { type: Number, required: false },
});

const formattedNamespaceId = ref<any>([]);
const detectError = ref(false);
const checkTxnType = (type: any) => {
  if (
    type == TransactionType.AGGREGATE_BONDED_V1 ||
    type == TransactionType.AGGREGATE_COMPLETE_V1
  ) {
    return true;
  } else {
    return false;
  }
};

const formatNamespaceID = async (namespaceId: NamespaceId | undefined) => {
  let txn = <
    {
      aliasName: string;
    }
  >{};
  try {
    if (namespaceId) {
      const nsName = await TransactionUtils.getNamespacesName([namespaceId]);
      txn.aliasName = nsName[0].name;
    }
  } catch (error) {
    detectError.value = true;
  }
  formattedNamespaceId.value.push(txn);
};

formatNamespaceID(props.NamespaceID);
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.txn-div,
.details {
  @apply text-gray-800 text-xs;

  > div {
    @apply flex items-center border-b border-gray-100 py-4;

    > div:first-child {
      @apply w-40 text-xs pl-4;
    }

    > div:nth-child(2) {
      @apply text-xs;
    }

    > div:last-child {
      @apply border-none;
    }
  }
}

.table_div {
  @apply text-xs;

  > div {
    @apply grid grid-cols-4;

    > div {
      @apply p-2;
    }

    > div:first-child {
      @apply text-blue-primary font-bold;
    }

    > div:nth-child(2) {
      @apply break-all col-span-3;
    }
  }

  > div:nth-child(2n + 1) {
    @apply bg-gray-100;
  }
}
</style>
