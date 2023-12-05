<template>
  <div>
    <div class="flex text-xs font-semibold border-b-2">
      <div
        class="border-b-2 p-1 mt-3 mb-3 w-18 text-center font-semibold"
        :class="`${
          currentComponent == 'multisig'
            ? 'border-blue-500 text-white bg-blue-primary'
            : 'cursor-pointer'
        }`"
        @click="setCurrentComponent('multisig')"
      >
        Multisig
      </div>
      <div
        class="border-b-2 p-1 mt-3 mb-3 w-18 text-center font-semibold"
        :class="`${
          currentComponent == 'scheme'
            ? 'border-blue-500 text-white bg-blue-primary'
            : 'cursor-pointer'
        }`"
        @click="setCurrentComponent('scheme')"
      >
        Scheme
      </div>
    </div>
    <div class="mb-20">
      <div v-if="currentComponent == 'multisig'">
        <div class="p-6 border-2 border-t-0 filter shadow-lg">
          <div class="text-xs font-semibold">Account Cosignatories</div>
          <div class="border p-4 my-3">
            <div class="flex flex-col gap-2">
              <div
                v-for="(cosigner, index) in cosignerAccountsList"
                :key="index"
              >
                <div class="border w-full rounded-md p-3">
                  <div class="flex items-center">
                    <div
                      :id="`cosignerAddress${index}`"
                      :copyValue="cosigner"
                      copySubject="Address"
                      class="text-txs font-bold mt-1"
                    >
                      <router-link
                        :to="{
                          name: 'ViewAccount',
                          params: { accountParam: cosigner },
                        }"
                        class="hover:text-blue-primary hover:underline"
                      >
                        {{ cosigner }}
                      </router-link>
                    </div>
                    <img
                      src="@/assets/img/icon-copy.svg"
                      @click="copy(`cosignerAddress${index}`)"
                      class="ml-2 w-4 h-4 cursor-pointer"
                    />
                    <router-link
                      :to="{
                        name: 'ViewAccount',
                        params: { accountParam: cosigner },
                      }"
                      class="hover:bg-gray-200 w-7 h-7 ml-auto flex justify-center items-center rounded-full duration-300 transition-all cursor-pointer"
                    >
                      <img
                        src="@/assets/img/chevron_right.svg"
                        class="w-5 h-5"
                      />
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="!cosignerLength"
              class="text-blue-primary text-xs text-center font-semibold"
            >
              Nothing to show.
            </div>
            <div
              v-if="!cosignerLength"
              class="text-txs w-9/12 ml-auto mr-auto text-gray-400 mt-1 text-center"
            >
              <span
                >"{{ prettyAddress }}" does not have any cosignatory
                accounts.</span
              >
            </div>
          </div>
          <div class="gray-line my-8"></div>
          <div class="text-xs font-semibold">Cosignatory of</div>
          <div class="border p-4 mt-3">
            <div v-if="multisigLength" class="w-full">
              <button
                class="mr-5 w-32 blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto"
                @click="expandTree()"
              >
                Expand All
              </button>
              <button
                class="w-32 blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto"
                @click="collapseTree()"
              >
                Collapse All
              </button>
              <Tree
                v-if="multisigAccountsList.length"
                v-model:expandedKeys="expandedKeys"
                :value="multisigAccountsList"
                :filter="true"
                filterMode="strict"
                @node-select="onNodeSelect"
                selectionMode="single"
                class="w-full pt-1.5"
              >
                <template #default="slotProps">
                  <div>{{ slotProps.node.label }}</div>
                </template>
                <template #child="slotProps">
                  <div
                    class="border rounded-md p-3 flex flex-col shadow-lg filter mb-2 w-full"
                  >
                    <div class="text-blue-primary font-semibold text-xs">
                      {{ slotProps.node.label }}
                    </div>
                  </div>
                </template>
              </Tree>
            </div>
            <div
              v-if="!multisigLength"
              class="text-blue-primary text-xs text-center font-semibold"
            >
              Nothing to show.
            </div>
            <div
              v-if="!multisigLength"
              class="flex text-txs w-9/12 ml-auto mr-auto text-gray-400 mt-1 justify-center text-center"
            >
              <span
                >{{ prettyAddress }} is not a cosignatory of any accounts.</span
              >
            </div>
          </div>
        </div>
      </div>
      <SchemeComponent
        v-else-if="currentComponent == 'scheme'"
        :accountAddress="address"
        :accountPublicKey="accountPublicKey"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import SchemeComponent from "@/modules/account/components/SchemeComponent.vue";
import { useToast } from "primevue/usetoast";
import { copyToClipboard } from "@/util/functions";
import { Helper } from "@/util/typeHelper";
import { useRouter } from "vue-router";
import Tree from "primevue/tree";
import type { TreeExpandedKeys } from "primevue/tree";
import type { TreeNode } from "primevue/treenode";

interface Multisig {
  key: string;
  label: string;
  selectable: boolean;
  children: { key: string; label: string; data: string; selectable: boolean }[];
}

const props = defineProps({
  cosignatories: {
    type: Array<string>,
    required: true,
  },
  multisig: {
    type: Array<Multisig>,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  accountPublicKey: {
    type: String,
    required: true,
  },
  multisigLength: {
    type: Number,
    required: true,
  },
});

const router = useRouter();
const currentComponent = ref("multisig");
const toast = useToast();
const prettyAddress = computed(() => {
  return Helper.createAddress(props.address).pretty();
});

const cosignerLength = computed(() => {
  return props.cosignatories.length;
});

const multisigAccountsList = computed(() => {
  let multisigAccounts: {
    key: string;
    label: string;
    selectable: boolean;
    children: {
      key: string;
      label: string;
      selectable: boolean;
      data: string;
    }[];
  }[] = [];
  if (!props.multisig) {
    return multisigAccounts;
  }
  for (let i = 0; i < props.multisig.length; ++i) {
    if (props.multisig[i].children.length > 0) {
      multisigAccounts.push(props.multisig[i]);
    }
  }
  return multisigAccounts;
});

const cosignerAccountsList = computed(() => {
  return props.cosignatories;
});

const copy = (id: string) => {
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
const onNodeSelect = (node: TreeNode) => {
  router.push({
    name: "ViewAccount",
    params: { accountParam: node.data },
  });
};

const setCurrentComponent = (page: string) => {
  currentComponent.value = page;
};

const expandedKeys = ref<TreeExpandedKeys>({});
const expandTree = () => {
  for (let node of multisigAccountsList.value) {
    expandNode(node);
  }

  expandedKeys.value = { ...expandedKeys.value };
};
const collapseTree = () => {
  expandedKeys.value = {};
};
const expandNode = (node: TreeNode) => {
  if (node.children && node.children.length) {
    expandedKeys.value[node.key as string] = true;
  }
};
expandTree();
</script>

<style scoped lang="scss">
.p-tree:deep {
  .p-tree {
    border: 1px solid #495057;
    background: #ffffff;
    color: #495057;
    padding: 1.25rem;
    border-radius: 6px;
  }
  .p-link {
    margin-top: 0px;
  }
  .p-treenode-children {
    padding: 0 0 0 1rem;
  }
  .p-tree-container .p-treenode .p-treenode-content {
    border-radius: 6px;
    transition: box-shadow 0.2s;
    padding: 0.5rem;
  }
  .p-treenode-label {
    border: 1px solid rgb(231, 231, 234);
    border-radius: 6px;
    padding: 20px 12px;
    width: 100%;
    font-size: 10px;
    line-height: 12px;
    font-weight: 700;
  }
  .p-tree-filter-container {
    width: 99%;
    border: 1px solid rgb(231, 231, 234);
    border-radius: 6px;
    padding: 6px 10px;
    margin: 6px 0px;
  }
  .p-tree-filter {
    width: 98%;
    outline: none;
    height: 40px;
  }
}
</style>
