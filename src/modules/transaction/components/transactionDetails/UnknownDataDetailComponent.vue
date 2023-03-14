<template>
    <div class="details">
        <div>
            <div>Unknown Data</div>
            <span>
                <pre id="unknown"></pre>
            </span>
        </div>
    </div>
</template>
  
<script setup>
import { onMounted } from "vue";

const props = defineProps({
    txnDetail: Object,
});

onMounted(() => {
    if (props.txnDetail.type === 'UNKNOWN')
        document.getElementById("unknown").innerHTML = JSON.stringify(props.txnDetail.unknownData, undefined, 2);
})

</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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
    }

    >div:last-child {
        @apply border-none;
    }
}
</style>