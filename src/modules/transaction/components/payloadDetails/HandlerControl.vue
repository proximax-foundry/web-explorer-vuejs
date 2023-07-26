<template>
    <template v-if="handlerType === ComponentNames.fee">
        <FeeHandler :label="label" :value="value" :style-class="styleClass" :toggle-resolve="toggleResolve" ></FeeHandler>
    </template>
    <template v-else-if="handlerType === ComponentNames.address">
        <AddressHandler :label="label" :value="value" :style-class="styleClass" ></AddressHandler>
    </template>
    <template v-else-if="handlerType === ComponentNames.publicKey">
        <PublicKeyHandler :label="label" :value="value" :style-class="styleClass" ></PublicKeyHandler>
    </template>
    <template v-else-if="handlerType === ComponentNames.namespace">
        <NamespaceHandler :label="label" :value="value" :style-class="styleClass" :toggle-resolve="toggleResolve" ></NamespaceHandler>
    </template>
    <template v-else-if="handlerType === ComponentNames.assetID">
        <SdaIdHandler :label="label" :value="value" :style-class="styleClass" :toggle-resolve="toggleResolve" ></SdaIdHandler>
    </template>
    <template v-else-if="handlerType === ComponentNames.assetAmount">
        <SdaAmountHandler :label="label" :value="value" :secondary-value="secondaryValue || ''" :style-class="styleClass" :toggle-resolve="toggleResolve" ></SdaAmountHandler>
    </template>
    <template v-else-if="handlerType === ComponentNames.asset">
        <SdaHandler :label="label" :value="value" :secondary-value="secondaryValue || ''" :style-class="styleClass" :toggle-resolve="toggleResolve" ></SdaHandler>
    </template>
    <template v-else-if="handlerType === ComponentNames.metadata">
        <MetadataHandler :label="label" :value="value" :secondary-value="secondaryValue || ''" :style-class="styleClass" :toggle-resolve="toggleResolve" ></MetadataHandler>
    </template>

</template>
  
<script setup lang="ts">

import { computed, ref } from "vue";
import NamespaceHandler from "./NamespaceHandler.vue";
import SdaHandler from "./SdaHandler.vue";
import AddressHandler from "./AddressHandler.vue";
import SdaIdHandler from "./SdaIdHandler.vue";
import SdaAmountHandler from "./SdaAmountHandler.vue";
import PublicKeyHandler from "./PublicKeyHandler.vue";
import MetadataHandler from "./MetadataHandler.vue";
import FeeHandler from "./FeeHandler.vue";
import {ComponentNames} from "../../componentEnum";

const props = defineProps({
    label: String,
    value: String,
    secondaryValue: String,
    styleClass: String,
    handlerType: String,
    toggleResolve: Boolean
});

</script>
