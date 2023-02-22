<template>
  <div class="border-2 border-t-0">
    <div>
      <div
        class="grid grid-cols-5 md:hidden bg-gray-100 text-xs font-semibold text-gray-600 px-3"
      >
        <div class="text-left py-3 col-span-2">Target ID</div>
        <div class="text-left pl-16 py-3 col-span-2">Current Value</div>
      </div>
      <div
        class="hidden md:grid md:grid-cols-8 bg-gray-100 text-xs font-semibold text-gray-600 px-3"
      >
        <div class="text-left px-2 py-3 col-span-4">Scoped Metadata Key</div>
        <div class="text-left px-2 py-3 col-span-4">Current Value</div>
      </div>
      <div
        v-for="(metadata, index) in accountMetadata"
        :key="index"
        class="grid grid-cols-5 text-xs md:hidden py-6 px-3 items-center"
        :class="`${index != accountMetadata.length - 1 ? 'gray-line' : ''}`"
      >
        <div class="text-left py-3 col-span-2">
          <div class="flex">
            <div>{{ metadata.scopedMetadataKeyHex }}</div>
            <div
              class="ml-3 text-gray-400 font-semibold"
              v-if="metadata.scopedMetadataKeyUtf8"
            >
              hex
            </div>
          </div>
          <div class="flex" v-if="metadata.scopedMetadataKeyUtf8">
            <div>{{ metadata.scopedMetadataKeyUtf8 }}</div>
            <div class="ml-3 text-gray-400 font-semibold">utf-8</div>
          </div>
        </div>
        <div class="pl-16 py-3 col-span-2">{{ metadata.value }}</div>
      </div>
      <div
        v-for="(metadata, index) in accountMetadata"
        :key="index"
        class="hidden md:grid md:grid-cols-8 py-6 px-3 items-center text-xs"
        :class="`${index != accountMetadata.length - 1 ? 'gray-line' : ''}`"
      >
        <div class="px-2 py-3 col-span-4">
          <div class="flex">
            <div>{{ metadata.scopedMetadataKeyHex }}</div>
            <div
              class="ml-3 text-gray-400 font-semibold"
              v-if="metadata.scopedMetadataKeyUtf8"
            >
              hex
            </div>
          </div>
          <div class="flex" v-if="metadata.scopedMetadataKeyUtf8">
            <div>{{ metadata.scopedMetadataKeyUtf8 }}</div>
            <div class="ml-3 text-gray-400 font-semibold">utf-8</div>
          </div>
        </div>
        <div class="py-3 px-2 col-span-2 flex items-center">
          {{ metadata.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  accountMetadata: {
    type: Array<{
      scopedMetadataKeyUtf8: string | null;
      scopedMetadataKeyHex: string;
      value: string;
    }>,
    required: true,
  },
});
</script>
