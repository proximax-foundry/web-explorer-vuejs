<template>
  <div class="txn-div">
    <div
      v-if="txnDetail.group == 'partial' || txnDetail.group == 'unconfirmed'"
    >
      <div>Deadline</div>
      <div>{{ txnDetail.timestamp }}</div>
    </div>
    <div v-else>
      <div>Timestamp</div>
      <div>{{ txnDetail.timestamp }}</div>
    </div>
    <div v-if="txnDetail.group == 'confirmed'">
      <div>Block</div>
      <div>
        <router-link
          :to="{ name: 'ViewBlock', params: { blockHeight: txnDetail.height } }"
          class="text-blue-600 hover:text-blue-primary hover:underline"
          >{{ txnDetail.height }}</router-link
        >
      </div>
    </div>
    <div>
      <div>Tx Type</div>
      <div>
        {{ txnDetail.typeName }}
        <span class="text-xxs text-gray-500">
          (Version: {{ txnDetail.version }})
        </span>
      </div>
    </div>
    <div v-if="txnDetail.group == 'confirmed'">
      <div>TX FEE</div>
      <div class="relative">
        <span class="font-bold">{{ maxFee[0] }}</span
        >{{ maxFee[1] > 0 ? "." : ""
        }}<span class="text-xxs">{{ maxFee[1] }}</span>
        <img
          src="@/assets/img/icon-xpx.svg"
          class="ml-1 mr-2 inline-block"
          style="top: -1px; width: 14px"
        /><span class="font-bold">{{ nativeTokenNamespace }}</span>
      </div>
    </div>
    <div v-if="txnDetail.cosigners.length > 0">
      <div>Cosigner{{ txnDetail.cosigners.length > 1 ? "s" : "" }}</div>
      <div>
        <div
          v-for="(cosigner, item) in txnDetail.cosigners"
          :key="item"
          class="flex items-center mb-3"
        >
          <router-link
            :to="{
              name: 'ViewAccount',
              params: {
                accountParam: Helper.createAddress(
                  cosigner.signer.address.address
                ).pretty(),
              },
            }"
            class="text-blue-600 hover:text-blue-primary hover:underline mr-2"
            :id="'cosigner' + item"
            :copyValue="
              Helper.createAddress(cosigner.signer.address.address).pretty()
            "
            copySubject="Cosigner address"
            >{{
              Helper.createAddress(cosigner.signer.address.address).pretty()
            }}</router-link
          >
          <img
            src="@/assets/img/icon-copy.svg"
            @click="copy('cosigner' + item)"
            class="cursor-pointer"
          />
        </div>
      </div>
    </div>
    <div v-if="Object.keys(txnDetail.unknownData).length"  class="bg-gray-200">
        <div class="unknownDetails-col">Unknown Data</div>
        <div class="unknownDetails">
            <pre>{{ JSON.stringify(txnDetail.unknownData, undefined, 2) }}</pre>
        </div>
    </div>
  </div>
</template>

<script setup>
/*

Modify Account Metadata
Modify SDA Metadata
Modify Namespace Metadata
Account Metadata
SDA Metadata
Namespace Metadata

*/
import { computed } from "vue";
import { useToast } from "primevue/usetoast";
import { AppState } from "@/state/appState";
import { Helper } from "@/util/typeHelper";
import { copyToClipboard } from "@/util/functions";

const props = defineProps({
  txnDetail: Object,
});
const toast = useToast();
const nativeTokenNamespace = AppState.nativeToken.label;
const maxFee = computed(() => {
  if (!props.txnDetail) {
    return "";
  }
  return props.txnDetail.fee.toString().split(".");
});

const copy = (id) => {
  let element = document.getElementById(id);
  if (element) {
    let stringToCopy = element.getAttribute("copyValue");
    let copySubject = element.getAttribute("copySubject");
    if (stringToCopy) {
      copyToClipboard(stringToCopy);
      toast.add({
        severity: "info",
        detail: copySubject + " copied",
        group: "br",
        life: 3000,
      });
    }
  }
};

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
      @apply text-xs w-full;
    }

    > div:last-child {
      @apply border-none;
    }
  }

  .unknownDetails-col{
    @apply flex items-center;
  }

  .unknownDetails{
    @apply text-gray-800 text-xs flex items-center;
  }

  // .unknown-col{
  //   @apply flex items-center bg-gray-200;

  //   div.details-col {
  //     @apply w-40 text-xs pl-4;
  //   }

  //   div.raw-details {
  //     @apply text-gray-800 text-xs flex items-center w-full;
  //   }

    // .details-col{
    //   @apply w-40 text-xs pl-4;
    // }

    // .raw-details {
    //   @apply text-gray-800 text-xs flex items-center w-full;
    // }
  // }
}
</style>