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
          class="mr-2 hover:text-blue-primary hover:underline text-blue-600"
          id="recipient"
          :copyValue="Helper.createAddress(txnDetail.detail.recipient).pretty()"
          copySubject="Recipient address"
        >
          {{ Helper.createAddress(txnDetail.detail.recipient).pretty() }}
        </router-link>
        <img
          src="@/assets/img/icon-copy.svg"
          @click="copy('recipient')"
          class="cursor-pointer"
        />
      </div>
    </div>
    <div v-if="txnDetail.detail.amountTransfer">
      <div>Amount</div>
      <div class="relative">
        <span class="font-bold">{{ transferAmount[0] }}</span
        >{{ transferAmount[1] > 0 ? "." : ""
        }}<span class="text-xxs">{{ transferAmount[1] }}</span>
        <img
          src="@/assets/img/icon-xpx.svg"
          class="ml-2 inline-block"
          style="top: -1px; width: 14px"
        />
        <span class="font-bold ml-2">{{ nativeTokenLabel }}</span>
      </div>
    </div>
    <!-- <div v-if="txnDetail.detail.assetAmount">
      <div>Amount</div>
      <div class="relative">
        <span class="font-bold">{{ Helper.toCurrencyFormat(assetAmount[0], nativeTokenDivisibility) }}</span>{{ assetAmount[1]>0?'.':'' }}<span class="text-xxs">{{ assetAmount[1] }}</span>
        <div class="inline-block text-gray-400 text-txs hover:text-gray-700 duration-300 transition-all ml-1">
          <router-link v-if="txnDetail.assetName" :to="{ name: 'ViewNamespace', params: { namespaceParam: txnDetail.assetName }}" class="hover:text-blue-primary hover:underline">{{ txnDetail.assetName }}</router-link>
          {{ txnDetail.assetName?' / ':'' }}
          <router-link :to="{ name: 'ViewAsset', params: { id: txnDetail.assetId }}" class="hover:text-blue-primary hover:underline">{{ txnDetail.assetId }}</router-link>
        </div>
      </div>
    </div> -->
    <div v-if="txnDetail.detail.sda.length > 0">
      <div>Amount</div>
      <div class="relative">
        <div v-for="(sda, index) in txnDetail.detail.sda" :key="index">
          <span class="font-bold">{{ sdaAmount[index][0] }}</span
          >{{ sdaAmount[index][1] > 0 ? "." : ""
          }}<span class="text-xxs">{{ sdaAmount[index][1] }}</span>
          <img
            v-if="
              sda.currentAlias[0] && sda.currentAlias[0].name == 'xarcade.xar'
            "
            src="@/modules/account/img/xarcade-logo.svg"
            class="inline-block h-7 w-7 mr-2 ml-2 border-2 rounded-3xl"
          />
          <img
            v-else-if="
              sda.currentAlias[0] && sda.currentAlias[0].name == 'prx.metx'
            "
            src="@/modules/account/img/metx-logo.svg"
            class="inline-block h-7 w-7 mr-2 ml-2 border-2 rounded-3xl"
          />
          <img
            v-else
            src="@/modules/transaction/img/proximax-logo-gray.svg"
            class="inline-block h-6 w-6 mr-2 ml-2"
          />
          <div
            class="inline-block text-gray-400 text-txs hover:text-gray-700 duration-300 transition-all"
          >
            <!-- <router-link v-if="sda.currentAlias[0]" :to="{ name: 'ViewAsset', params: { id: sda.id }}" class="hover:text-blue-primary hover:underline">{{ sda.label }}</router-link> -->
            <!-- {{ sda.name?' / ':'' }} -->
            <router-link
              :to="{ name: 'ViewAsset', params: { id: sda.id } }"
              class="hover:text-blue-primary hover:underline"
              >{{ sda.label }}</router-link
            >
          </div>
        </div>
        <!-- <div v-if="txnDetail.detail.amount.length == 0">-</div> -->
      </div>
    </div>
    <div v-if="txnDetail.detail.message">
      <div>{{ txnDetail.detail.messageTypeTitle }}</div>
      <div class="break-all">{{ txnDetail.detail.message }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useToast } from "primevue/usetoast";
import { AppState } from "@/state/appState";
import { Helper } from "@/util/typeHelper";
import { copyToClipboard } from "@/util/functions";

const props = defineProps({
  txnDetail: Object,
});

const toast = useToast();
const nativeTokenLabel = AppState.nativeToken.label;

const transferAmount = computed(() => {
  return props.txnDetail.detail.amountTransfer.toString().split(".");
});

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

const sdaAmount = computed(() => {
  let formattedSDA = [];
  if (props.txnDetail.detail.sda.length > 0) {
    props.txnDetail.detail.sda.forEach((sda) => {
      formattedSDA.push(sda.amount.toString().split("."));
    });
  }
  return formattedSDA;
});
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
