<template>
  <div>
    <p class="text-gray-500 mb-5 text-sm font-bold">Account Details</p>
    <div v-if="isShowInvalid" class="p-3 bg-yellow-100 text-yellow-700">Account is not available in {{ networkName }}</div>
    <div v-else>
      <div>
        <AccountComponent :address="strAddress" :publicKey="strPublicKey" :linkAccount="delegatePublicKey" :namespace="matchedNamespace" :multisig="cosignatoriesLength" class="mb-10" />
      </div>
      <div class="flex text-xs font-semibold border-b-2 menu_title_div">
        <div class="w-18 text-center pb-3" :class="`${ (currentComponent=='asset')?'border-yellow-500 border-b-2':'cursor-pointer' }`" @click="setCurrentComponent('asset')">Assets</div>
        <div class="w-18 text-center" :class="`${ (currentComponent=='namespace')?'border-yellow-500 border-b-2':'cursor-pointer' }`" @click="setCurrentComponent('namespace')" v-if="accountNamespaces.length > 0">Namespaces</div>
        <div class="w-18 text-center" :class="`${ (currentComponent=='metadata')?'border-yellow-500 border-b-2':'cursor-pointer' }`" @click="setCurrentComponent('metadata')" v-if="accountMetadata.length > 0">Metadata</div>
        <div class="w-18 text-center" :class="`${ (currentComponent=='multisig')?'border-yellow-500 border-b-2':'cursor-pointer' }`" @click="setCurrentComponent('multisig')" v-if="multisigLength > 0 || cosignatoriesLength > 0">Multisig</div>
        <div class="w-18 text-center" :class="`${ (currentComponent=='scheme')?'border-yellow-500 border-b-2':'cursor-pointer' }`" @click="setCurrentComponent('scheme')" v-if="cosignatoriesLength > 0">Scheme</div>
        <div class="w-18 text-center" :class="`${ (currentComponent=='txn')?'border-yellow-500 border-b-2':'cursor-pointer' }`" @click="setCurrentComponent('txn')">Transactions</div>
      </div>
      <div class="mb-20" v-if="!isFetching">
        <AssetComponent :accountAssets="accountAssets" v-if="currentComponent=='asset'" />
        <NamespaceComponent :accountNamespaces="accountNamespaces" v-if="currentComponent=='namespace'" />
        <MetadataComponent :accountMetadata="accountMetadata" v-if="currentComponent=='metadata'" />
        <MultisigComponent :cosignatories="multisig.cosignatories" :multisig="multisig.multisigAccounts" :address="strAddress" v-else-if="currentComponent=='multisig'" />
        <SchemeComponent v-else-if="currentComponent=='scheme'" :accountAddress="strAddress" :accountPublicKey="strPublicKey" />
        <TransactionComponent v-else-if="currentComponent=='txn'" :accountAddress="strAddress" :accountPublicKey="strPublicKey" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance, ref } from "vue";
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import AssetComponent from "@/modules/account/components/AssetComponent.vue";
import NamespaceComponent from "@/modules/account/components/NamespaceComponent.vue";
import MetadataComponent from "@/modules/account/components/MetadataComponent.vue";
import MultisigComponent from "@/modules/account/components/MultisigComponent.vue";
import SchemeComponent from "@/modules/account/components/SchemeComponent.vue";
import TransactionComponent from "@/modules/account/components/TransactionComponent.vue";
import { networkState } from '@/state/networkState';
import { AppState } from '@/state/appState';
import { Helper } from "@/util/typeHelper";
import { AccountUtils } from "@/util/accountUtil";
import { MetadataUtils } from '@/util/metadataUtil';
import { Address } from "tsjs-xpx-chain-sdk";

export default {
  name: 'ViewAccount',
  components: {
    AccountComponent,
    AssetComponent,
    NamespaceComponent,
    MetadataComponent,
    MultisigComponent,
    SchemeComponent,
    TransactionComponent,
  },
  props: {
    accountParam: String
  },
  setup(props){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const currentComponent = ref('asset'); //option: multisig, metadata, scheme, transaction
    const isShowInvalid = ref(false);
    const strAddress = ref('');
    const strPublicKey  = ref('');
    const multisigLength = ref(0);
    const cosignatoriesLength = ref(0);
    const isFetching = ref(true);
    const accountAssets = ref([]);
    const delegatePublicKey = ref('0');
    const multisig = ref({
      cosignatories: [],
      multisigAccounts: []
    });
    const accountNamespaces = ref([]);
    const accountMetadata = ref([]);
   

    const matchedNamespace = ref([]);
    let account;

    const setCurrentComponent = (page) => {
      currentComponent.value = page;
    }

    const loadAccountInfo = async() => {
      if(!AppState.isReady){
        setTimeout(loadAccountInfo, 1000);
        return; 
      }

      if(props.accountParam.length == 64){
        let address = AccountUtils.getAddressFromPublicKey(props.accountParam);
        strAddress.value = Helper.createAddress(address).pretty();
        account = await AccountUtils.getAccountFromAddress(address);
        if(account!=false){
          strPublicKey.value = props.accountParam;
        }else{
          isShowInvalid.value = true;
          return;
        }
      }else if(props.accountParam.length == 40 || props.accountParam.length == 46){
        let address = Address.createFromRawAddress(props.accountParam)
        strAddress.value = Helper.createAddress(address.address).pretty();
        account = await AccountUtils.getAccountFromAddress(props.accountParam);
        if(account!=false){
          strPublicKey.value = account.publicKey;
        }else{
          isShowInvalid.value = true;
          return;
        }
      }

      delegatePublicKey.value = account.linkedAccountKey;
      
      let fetchAccountMetadata = await MetadataUtils.getAccountMetadata(strPublicKey.value);
      accountMetadata.value = fetchAccountMetadata;

      let fetchedAccountNamespaces = await AccountUtils.getAccountNamespaces(strAddress.value);
      if(fetchedAccountNamespaces !== false){
        accountNamespaces.value = fetchedAccountNamespaces;
      }
      let linkedNamespaceToAccount = await AccountUtils.fetchLinkedAccountNamespace(strAddress.value);
      matchedNamespace.value = linkedNamespaceToAccount;

      multisig.value = await AccountUtils.getMultisig(strAddress.value);
      cosignatoriesLength.value = multisig.value.cosignatories?multisig.value.cosignatories.length:0;
      multisigLength.value = multisig.value.multisigAccounts?multisig.value.multisigAccounts.length:0;

      let fetchedAccountAssets = await AccountUtils.formatAccountAsset(account.mosaics, accountNamespaces.value, strPublicKey.value);
      accountAssets.value = fetchedAccountAssets;
      isFetching.value = false;
      isShowInvalid.value = false;
    };
    loadAccountInfo();

    const networkName = computed(() => {
      return networkState.chainNetworkName;
    });

    emitter.on('CHANGE_NETWORK', payload => {
      if(payload){
        loadAccountInfo();
      }
    });

    return {
      currentComponent,
      setCurrentComponent,
      strAddress,
      strPublicKey,
      multisigLength,
      cosignatoriesLength,
      multisig,
      accountAssets,
      accountNamespaces,
      isFetching,
      isShowInvalid,
      networkName,
      delegatePublicKey,
      matchedNamespace,
      accountMetadata
    }
  }
}
</script>