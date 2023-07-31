<template>
  <template v-if="value.value && Array.isArray(value.value)">
    <div :class="styleClass">
      <div>
        <div>{{ value.name }}</div>
        <div>
          <div v-for="item of value.value">
            <DisplayValue :style-class="styleClass" :toggle-resolve="toggleResolve" :value="item">
            </DisplayValue>
          </div>
        </div>
      </div>
    </div>
  </template>
  <template v-else-if="Array.isArray(value)">
    <template v-for="item of value">
      <DisplayValue :style-class="styleClass" :toggle-resolve="toggleResolve" :value="item">
      </DisplayValue>
    </template>
  </template>
  <template v-else>
    <DisplaySimpleValue :handler-type="value.handlerType ?? ''" 
      :toggle-resolve="toggleResolve" :style-class="styleClass"
      :name="value.name" :secondary-value="value.secondaryValue ?? ''" :value="value.value ?? ''">
    </DisplaySimpleValue>
  </template>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { RowData } from "./IRowData";
import DisplaySimpleValue from "./DisplaySimpleValue.vue";

interface IRow {
  value: RowData,  
  styleClass: string,
  toggleResolve: boolean
}

const props = withDefaults(defineProps<IRow>(),{});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.txn-div,
.details {
  @apply text-gray-800 text-xs;

  > div {
    @apply flex items-center border-b border-gray-100 py-4;

    > div:first-child {
      @apply w-40 text-xs pl-4 flex-none;
    }

    > div:nth-child(2) {
      @apply text-xs grow;
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
      @apply col-span-3;
    }
  }

  > div:nth-child(2n + 1) {
    @apply bg-gray-100;
  }
}
</style>
