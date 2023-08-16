<template>
    <template v-if="handlerType && typeof value == 'string'">
      <HandlerControl :label="name" :style-class="styleClass" 
        :value="value" :secondary-value="secondaryValue" :toggle-resolve="toggleResolve" :handler-type="handlerType" :isArray="isArray" >
      </HandlerControl>
    </template>
    <div v-else :class="[isArray ? 'isArrayClass-' + styleClass : styleClass]">
      <div class="data-details">
        <div v-if="name !== ' '" class="w-40">{{ name }}</div>
        <div v-else class="w-0"></div>
        <div>{{ value }} 
          <span v-if="secondaryValue">
            ( {{ secondaryValue }} )
          </span>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import HandlerControl from "./HandlerControl.vue";

interface IRow {
  name: string;
  value: string;
  secondaryValue: string;
  handlerType: string;
  styleClass: string,
  toggleResolve: boolean,
  isArray?: boolean
}

const props = withDefaults(defineProps<IRow>(),{});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.txn-div{
  @apply text-gray-800 text-xs;

  > div {
    @apply flex items-center border-b border-gray-100 py-4;

    > div:first-child {
      @apply text-xs pl-4 mr-1;
    }

    > div:nth-child(2) {
      @apply text-xs w-full;
    }

    > div:last-child {
      @apply border-none;
    }
  }
}

.isArrayClass-txn-div {
  @apply text-gray-800 text-xs;

    > div {
      @apply flex items-center border-b border-gray-100 py-4;
  
      > div:first-child {
      @apply text-xs;
      }

      > div:nth-child(2) {
        @apply text-xs w-full;
      }
 
      > div:last-child {
        @apply border-none;
      }
    }
  }

.isArrayClass-table_div{
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
        @apply overflow-hidden col-span-3;
      }
    }

    > div:nth-child(2n + 1) {
      @apply bg-gray-100;
    }
  }

.data-details {

  > div:nth-child(2) {
    @apply w-full;
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
      @apply overflow-hidden col-span-3;
    }
  }

  > div:nth-child(2n + 1) {
    @apply bg-gray-100;
  }
}
</style>