<template>
  <div class="details">
    <div v-if="txnDetail.detail.address">
      <div>Address</div>
      <div class="flex">
        <router-link
          :to="{
            name: 'ViewAccount',
            params: { accountParam: txnDetail.detail.address },
          }"
          class="mr-2 hover:text-blue-primary hover:underline text-blue-600"
          id="address"
          :copyValue="Helper.createAddress(txnDetail.detail.address).pretty()"
          copySubject="Address"
        >
          {{ Helper.createAddress(txnDetail.detail.address).pretty() }}
        </router-link>
        <img
          src="@/assets/img/icon-copy.svg"
          @click="copy('address')"
          class="cursor-pointer"
        />
      </div>
    </div>
    <div v-else>
      <div>Asset</div>
      <div>
        <router-link
          :to="{ name: 'ViewAsset', params: { id: txnDetail.detail.assetId } }"
          class="text-blue-600 hover:text-blue-primary hover:underline"
          >{{ txnDetail.detail.assetId }}</router-link
        >
      </div>
    </div>
    <div>
      <div>Alias Type</div>
      <div>{{ txnDetail.detail.aliasTypeName }}</div>
    </div>
    <div>
      <div>Alias Name</div>
      <div>{{ txnDetail.detail.aliasName }}</div>
    </div>
  </div>
</template>

<script setup>
import { useToast } from "primevue/usetoast";
import { Helper } from "@/util/typeHelper";
import { copyToClipboard } from "@/util/functions";

defineProps({
  txnDetail: Object,
});
const toast = useToast();

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
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.details {
  @apply text-gray-800 text-xs;

  > div {
    @apply flex items-center border-b border-gray-100 py-4;

    > div:first-child {
      @apply w-40 text-xs px-4;
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
