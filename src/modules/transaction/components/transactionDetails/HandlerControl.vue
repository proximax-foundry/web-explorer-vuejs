<template>
    <template v-if="handlerType === ComponentNames.transactionHash">
        <HashHandler :label="label" :value="value" :style-class="styleClass"></HashHandler>
    </template>
    <template v-if="handlerType === ComponentNames.status">
        <StatusHandler :label="label" :value="value" :style-class="styleClass"></StatusHandler>
    </template>
    <template v-if="handlerType === ComponentNames.block">
        <BlockHandler :label="label" :value="value" :style-class="styleClass"></BlockHandler>
    </template>
    <template v-else-if="handlerType === ComponentNames.publicKey">
        <PublicKeyHandler :label="label" :value="value" :style-class="styleClass" :isArray="isArray" ></PublicKeyHandler>
    </template>
    <template v-if="handlerType === ComponentNames.fee">
        <FeeHandler :label="label" :value="value" :style-class="styleClass" :toggle-resolve="toggleResolve" ></FeeHandler>
    </template>
    <template v-else-if="handlerType === ComponentNames.address">
        <AddressHandler :label="label" :value="value" :style-class="styleClass" :isArray="isArray" ></AddressHandler>
    </template>
    <template v-else-if="handlerType === ComponentNames.asset">
        <SdaHandler :label="label" :value="value || ''" :secondary-value="secondaryValue || ''" :style-class="styleClass" :toggle-resolve="toggleResolve" :isArray="isArray" ></SdaHandler>
    </template>
    <template v-else-if="handlerType === ComponentNames.namespace">
        <NamespaceHandlerVue :label="label" :value="value" :style-class="styleClass" :toggle-resolve="toggleResolve" ></NamespaceHandlerVue>
    </template>
    <template v-else-if="handlerType === ComponentNames.assetID">
        <SdaIdHandler :label="label" :value="value" :style-class="styleClass" :toggle-resolve="toggleResolve" ></SdaIdHandler>
    </template>

</template>
  
<script setup lang="ts">
import {ComponentNames} from "../../componentEnum";
import FeeHandler from "./FeeHandler.vue";
import AddressHandler from "./AddressHandler.vue";
import BlockHandler from "./BlockHandler.vue";
import HashHandler from "./HashHandler.vue";
import StatusHandler from "./StatusHandler.vue";
import SdaHandler from "./SdaHandler.vue";
import NamespaceHandlerVue from "./NamespaceHandler.vue";
import SdaIdHandler from "./SdaIdHandler.vue";
import PublicKeyHandler from "./PublicKeyHandler.vue";

interface IRow {
  label: string;
  value: string;
  secondaryValue: string;
  handlerType: string;
  styleClass: string;
  toggleResolve: boolean;
  isArray?: boolean;
}

const props = withDefaults(defineProps<IRow>(),{});

</script>