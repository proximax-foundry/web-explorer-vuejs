<template>
  <div>
   <TransactionComponent :key="$route.fullPath" :viewAllTransactions="true" :accountParam="accountParam === undefined ? '' : accountParam"></TransactionComponent>
  </div>
</template>

<script setup lang="ts">
import TransactionComponent from "@/modules/account/components/TransactionComponent.vue";

defineProps({
  accountParam: {
    type: String,
    required: true,
  }});
</script>