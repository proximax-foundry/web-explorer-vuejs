<template>
        <div class="details-col">Unknown Data</div>
        <div class="raw-details">
            <pre>{{ unknownData }}</pre>
        </div>
</template>
  
<script setup>
import { onMounted } from "vue";

const props = defineProps({
    txnDetail: Object,
});

const unknownData = JSON.stringify(props.txnDetail.unknownData, undefined, 2);

</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.details-col{
    @apply flex items-center p-2;

}

.raw-details {
    @apply text-gray-800 text-xs flex items-center py-4 break-all col-span-3;;
}
</style>