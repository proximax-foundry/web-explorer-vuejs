<template>
  <div>
   <TransactionComponent :key="$route.fullPath" :viewAllTransactions="true" :accountAddress="accountParam === undefined ? '' : accountParam" accountPublicKey=""></TransactionComponent>
  </div>
</template>

<script setup lang="ts">
import TransactionComponent from "@/modules/account/components/TransactionComponent.vue";

const props = defineProps({
  accountParam: {
    type: String,
    required: true,
  }});
</script>