<template>
  <div class="border-2 border-t-0">
    <div
      v-if="accountNamespaces.length == 0"
      class="text-blue-primary text-xs text-center font-semibold py-5"
    >
      No namespace available
    </div>
    <div>
      <div
        class="grid grid-cols-4 md:hidden bg-gray-100 text-xs font-semibold text-gray-600 px-3"
      >
        <div class="text-left px-2 py-3 col-span-2">Name</div>
        <div class="text-left px-2 py-3">Expiry</div>
        <div class="text-center px-2 py-3">Active</div>
      </div>
      <div
        class="hidden md:grid md:grid-cols-10 bg-gray-100 text-xs font-semibold text-gray-600 px-3"
      >
        <div class="text-left px-2 py-3 col-span-2">ID</div>
        <div class="text-left px-2 py-3 col-span-2">Name</div>
        <div class="text-left px-2 py-3 col-span-4">Linked</div>
        <div class="text-left px-2 py-3">Expiry</div>
        <div class="text-center px-2 py-3">Active</div>
      </div>
      <div
        v-for="(namespace, index) in accountNamespaces"
        :key="index"
        class="grid grid-cols-4 md:hidden text-xs px-3 items-center"
        :class="`${index != accountNamespaces.length - 1 ? 'gray-line' : ''}`"
      >
        <div class="px-2 py-3 col-span-2">
          <div class="break-word my-2">{{ namespace.name }}</div>
          <div class="text-xxs mt-4 mb-1 text-gray-400">ID:</div>
          <router-link
            :to="{
              name: 'ViewNamespace',
              params: { namespaceParam: namespace.id },
            }"
            class="uppercase text-blue-600 hover:text-blue-primary hover:underline mb-2"
            >{{ namespace.id }}</router-link
          >
          <div class="col-span-4 mt-4">
            <div v-if="namespace.type == 1">
              <div class="text-xxs mb-1 text-gray-400">Linked asset:</div>
              <router-link
                :to="{ name: 'ViewAsset', params: { id: namespace.linkedId } }"
                class="hover:text-blue-primary hover:underline break-all"
                >{{ namespace.linkedId }}</router-link
              >
            </div>
            <div v-else-if="namespace.type == 2">
              <div class="text-xxs mb-1 text-gray-400">Linked address:</div>
              <router-link
                :to="{
                  name: 'ViewAccount',
                  params: { accountParam: namespace.linkedId },
                }"
                class="hover:text-blue-primary hover:underline break-all"
                >{{ namespace.linkedId }}</router-link
              >
            </div>
            <div v-else class="text-gray-400">No linked asset</div>
          </div>
        </div>
        <div class="px-2 py-3">
          <span
            v-if="
              namespace.expiringRelativeTime == 'undefined NaN undefined NaN'
            "
            v-tooltip.bottom="
              '<tiptitle>End Block: ' +
              namespace.endHeight +
              '</tiptitle><tiptext>No expiry</tiptext>'
            "
            >{{ namespace.endHeight }}</span
          ><span
            v-else
            v-tooltip.bottom="
              '<tiptitle>End Block: ' +
              namespace.endHeight +
              '</tiptitle><tiptext>Estimated expiring on ' +
              namespace.expiringRelativeTime +
              '</tiptext>'
            "
            >{{ namespace.endHeight }}</span
          >
        </div>
        <div class="px-2 py-3 text-center">
          <span
            class="material-icons md-16 text-green-600 font-bold"
            v-if="namespace.active"
            >done</span
          ><span class="material-icons md-16 text-red-700 font-bold" v-else
            >close</span
          >
        </div>
      </div>
      <div
        v-for="(namespace, index) in accountNamespaces"
        :key="index"
        class="hidden md:grid md:grid-cols-10 text-xs px-3 items-center"
        :class="`${index != accountNamespaces.length - 1 ? 'gray-line' : ''}`"
      >
        <div class="px-2 py-3 col-span-2">
          <router-link
            :to="{
              name: 'ViewNamespace',
              params: { namespaceParam: namespace.id },
            }"
            class="uppercase text-blue-600 hover:text-blue-primary hover:underline"
            >{{ namespace.id }}</router-link
          >
        </div>
        <div class="px-2 py-3 col-span-2 break-words">{{ namespace.name }}</div>
        <div class="px-2 py-3 col-span-4">
          <div v-if="namespace.type == 1">
            <router-link
              :to="{ name: 'ViewAsset', params: { id: namespace.linkedId } }"
              class="uppercase text-blue-600 hover:text-blue-primary hover:underline break-all"
              >{{ namespace.linkedId }}</router-link
            >
          </div>
          <div v-else-if="namespace.type == 2">
            <router-link
              :to="{
                name: 'ViewAccount',
                params: { accountParam: namespace.linkedId },
              }"
              class="text-blue-600 hover:text-blue-primary hover:underline break-all"
              >{{ namespace.linkedId }}</router-link
            >
          </div>
          <div v-else>No linked Asset / Address</div>
        </div>
        <div class="px-2 py-3">
          <span
            v-if="
              namespace.expiringRelativeTime == 'undefined NaN undefined NaN'
            "
            v-tooltip.bottom="
              '<tiptitle>End Block: ' +
              namespace.endHeight +
              '</tiptitle><tiptext>No expiry</tiptext>'
            "
            >{{ namespace.endHeight }}</span
          ><span
            v-else
            v-tooltip.bottom="
              '<tiptitle>End Block: ' +
              namespace.endHeight +
              '</tiptitle><tiptext>Estimated expiring on ' +
              namespace.expiringRelativeTime +
              '</tiptext>'
            "
            >{{ namespace.endHeight }}</span
          >
        </div>
        <div class="px-2 py-3 text-center">
          <span
            class="material-icons md-16 text-green-600 font-bold"
            v-if="namespace.active"
            >done</span
          ><span class="material-icons md-16 text-red-700 font-bold" v-else
            >close</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NamespaceObj } from "@/util/accountUtil";

defineProps({
  accountNamespaces: {
    type: Array<NamespaceObj>,
    required: true,
  },
});
</script>

<style></style>
