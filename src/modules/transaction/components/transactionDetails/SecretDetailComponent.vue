<template>
  <div class="details">
    <div>
      <div>Recipient</div>
      <div class="flex">
        <router-link
          :to="{
            name: 'ViewAccount',
            params: { accountParam: txnDetail.detail.recipient },
          }"
          class="inline-block hover:text-blue-primary hover:underline text-blue-600"
          id="recipientAddress"
          :copyValue="Helper.createAddress(txnDetail.detail.recipient).pretty()"
          copySubject="Recipient address"
        >
          {{ Helper.createAddress(txnDetail.detail.recipient).pretty() }}
        </router-link>
        <img
          src="@/assets/img/icon-copy.svg"
          @click="copy('recipientAddress')"
          class="cursor-pointer ml-2"
        />
      </div>
    </div>
    <div>
      <div>Hash Type</div>
      <div>{{ txnDetail.detail.hashType }}</div>
    </div>
    <div>
      <div>Secret</div>
      <div class="break-all">{{ txnDetail.detail.secret }}</div>
    </div>
    <div v-if="txnDetail.detail.duration">
      <div>Duration</div>
      <div>{{ txnDetail.detail.duration }} blocks</div>
    </div>
    <div v-if="txnDetail.detail.proof">
      <div>Proof</div>
      <div class="break-all">{{ txnDetail.detail.proof }}</div>
    </div>
    <div v-if="txnDetail.detail.amount">
      <div>Amount</div>
      <div>
        <span class="font-bold">{{
          formatCurrency(txnDetail.detail.amount)[0]
        }}</span>
        <span class="text-xxs" v-if="formatCurrency(txnDetail.detail.amount)[1]"
          >.{{ formatCurrency(txnDetail.detail.amount)[1] }}</span
        >
        <div
          class="ml-1 inline-block font-bold"
          v-if="nativeTokenNamespace == txnDetail.detail.namespaceName"
        >
          {{ txnDetail.detail.namespaceName }}
        </div>
        <div
          v-else
          class="inline-block text-gray-400 text-txs hover:text-gray-700 duration-300 transition-all"
        >
          <router-link
            :to="{
              name: 'ViewAsset',
              params: { id: txnDetail.detail.assetId },
            }"
            class="inline-block ml-1 hover:text-blue-primary hover:underline text-blue-600"
          >
            {{ txnDetail.detail.assetId }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useToast } from "primevue/usetoast";
import { AppState } from "@/state/appState";
import { Helper } from "@/util/typeHelper";
import { copyToClipboard } from "@/util/functions";

defineProps({
  txnDetail: Object,
});

const toast = useToast();

const nativeTokenNamespace = AppState.nativeToken.label;

const copy = (id) => {
  let stringToCopy = document.getElementById(id).getAttribute("copyValue");
  let copySubject = document.getElementById(id).getAttribute("copySubject");
  copyToClipboard(stringToCopy);
  toast.add({
    severity: "info",
    detail: copySubject + " copied",
    group: "br",
    life: 3000,
  });
};

const formatCurrency = (amount) => {
  return amount.toString().split(".");
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.details {
  @apply text-gray-800 text-xs;

  > div {
    @apply flex items-center border-b border-gray-100 py-4;

    > div:first-child {
      @apply w-40 text-xs pl-4;
    }

    > div:nth-child(2) {
      @apply text-xs w-full;
    }
  }

  > div:last-child {
    @apply border-none;
  }
}
</style>
