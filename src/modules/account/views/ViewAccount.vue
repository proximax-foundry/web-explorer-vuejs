<template>
  <div>
    <p class="text-gray-500 mb-5 text-sm font-bold">Account Details</p>
    <div v-if="isShowInvalid" class="p-3 bg-yellow-100 text-yellow-700">
      Account is not available in {{ networkName }}
    </div>
    <div v-else>
      <div>
        <AccountComponent
          :address="strAddress"
          :publicKey="strPublicKey"
          :linkAccount="delegatePublicKey"
          :namespace="matchedNamespace"
          :multisig="cosignatoriesLength"
          :harvester="isHarvester"
          class="mb-10"
        />
      </div>
      <div class="flex text-xs font-semibold border-b-2 menu_title_div">
        <div
          class="w-18 text-center pb-3"
          :class="`${
            currentComponent == 'asset'
              ? 'border-yellow-500 border-b-2'
              : 'cursor-pointer'
          }`"
          @click="setCurrentComponent('asset')"
        >
          Assets
        </div>
        <div
          class="w-18 text-center"
          :class="`${
            currentComponent == 'namespace'
              ? 'border-yellow-500 border-b-2'
              : 'cursor-pointer'
          }`"
          @click="setCurrentComponent('namespace')"
          v-if="accountNamespaces.length > 0"
        >
          Namespaces
        </div>
        <div
          class="w-18 text-center"
          :class="`${
            currentComponent == 'metadata'
              ? 'border-yellow-500 border-b-2'
              : 'cursor-pointer'
          }`"
          @click="setCurrentComponent('metadata')"
          v-if="accountMetadata.length > 0"
        >
          Metadata
        </div>
        <div
          class="w-18 text-center"
          :class="`${
            currentComponent == 'multisig'
              ? 'border-yellow-500 border-b-2'
              : 'cursor-pointer'
          }`"
          @click="setCurrentComponent('multisig')"
          v-if="multisigLength > 0 || cosignatoriesLength > 0"
        >
          Multisig
        </div>
        <div
          class="w-18 text-center"
          :class="`${
            currentComponent == 'txn'
              ? 'border-yellow-500 border-b-2'
              : 'cursor-pointer'
          }`"
          @click="setCurrentComponent('txn')"
        >
          Transactions
        </div>
        <div
          class="w-18 text-center"
          :class="`${
            currentComponent == 'drive'
              ? 'border-yellow-500 border-b-2'
              : 'cursor-pointer'
          }`"
          @click="setCurrentComponent('drive')"
          v-if="bcDrivesLength > 0"
        >
          Drives
        </div>
      </div>
      <div class="mb-20" v-if="!isFetching">
        <AssetComponent
          :accountAsset="accountAssets"
          :accountPublicKey="strPublicKey"
          v-if="currentComponent == 'asset'"
        />
        <NamespaceComponent
          :accountNamespaces="accountNamespaces"
          v-if="currentComponent == 'namespace'"
        />
        <MetadataComponent
          :accountMetadata="accountMetadata"
          v-if="currentComponent == 'metadata'"
        />
        <MultisigComponent
          :cosignatories="multisig.cosignatories"
          :multisig="multisigAddress"
          :address="strAddress"
          :accountPublicKey="strPublicKey"
          :multisig-length="multisigLength"
          v-else-if="currentComponent == 'multisig'"
        />
        <TransactionComponent
          v-else-if="currentComponent == 'txn'"
          :accountParam="strAddress || strPublicKey"
        />
        <DriveComponent
          :publicKey="strPublicKey"
          v-show="currentComponent == 'drive'"
          @show-all-drives="updateBcDrives"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, ref } from "vue";
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import AssetComponent from "@/modules/account/components/AssetComponent.vue";
import NamespaceComponent from "@/modules/account/components/NamespaceComponent.vue";
import MetadataComponent from "@/modules/account/components/MetadataComponent.vue";
import MultisigComponent from "@/modules/account/components/MultisigComponent.vue";
import TransactionComponent from "@/modules/account/components/TransactionComponent.vue";
import DriveComponent from "../components/DriveComponent.vue";
import { networkState } from "@/state/networkState";
import { AppState } from "@/state/appState";
import { Helper } from "@/util/typeHelper";
import {
  AccountUtils,
  type MatchedNamespace,
  type NamespaceObj,
} from "@/util/accountUtil";
import { MetadataUtils, type MetadataObj } from "@/util/metadataUtil";
import { AccountInfo, Address } from "tsjs-xpx-chain-sdk";
import { MultisigInfo } from "@/models/multisigInfo";
import type { DriveInfo } from "tsjs-xpx-chain-sdk";

interface multisigLayer {
  key: string, label: string, selectable: boolean, children: { key: string, label: string, data:string, selectable: boolean }[]
}

const props = defineProps({
  accountParam: String,
});
const internalInstance = getCurrentInstance();
const emitter = internalInstance?.appContext.config.globalProperties.emitter;
const currentComponent = ref("asset"); //option: multisig, metadata, scheme, transaction
const isShowInvalid = ref(false);
const strAddress = ref("");
const strPublicKey = ref("");
const multisigLength = ref(0);
const cosignatoriesLength = ref(0);
const bcDrivesLength = ref(0);
const isFetching = ref(true);
const isHarvester = ref(false)
const accountAssets = ref<{ id: string; amount: number }[]>([]);
const delegatePublicKey = ref("0");
const multisig = ref<{ cosignatories: string[] }>({
  cosignatories: []
});
const accountNamespaces = ref<NamespaceObj[]>([]);
const accountMetadata = ref<MetadataObj[]>([]);
const multisigAddress = ref<multisigLayer[]>([]);
const matchedNamespace = ref<MatchedNamespace[]>([]);

const networkName = computed(() => {
  return networkState.chainNetworkName;
});

const setCurrentComponent = (page: string) => {
  currentComponent.value = page;
};

const loadAccountInfo = async () => {
  let account: false | AccountInfo = false;
  if (!AppState.isReady && !networkName.value) {
    setTimeout(loadAccountInfo, 1000);
    return;
  }
  if (!props.accountParam) {
    return;
  }
  if (props.accountParam.length == 64) {
    let address = AccountUtils.getAddressFromPublicKey(props.accountParam);
    if (!address) {
      isShowInvalid.value = true;
      return;
    }
    strAddress.value = Helper.createAddress(address).pretty();
    account = await AccountUtils.getAccountFromAddress(address);
    if (account) {
      strPublicKey.value = account.publicKey;
      delegatePublicKey.value = account.linkedAccountKey;
      accountAssets.value = account.mosaics.map((mosaic) => {
        return {
          id: mosaic.id.toHex(),
          amount: mosaic.amount.compact(),
        };
      });
    } else {
      isShowInvalid.value = true;
      return;
    }
  } else if (
    props.accountParam.length == 40 ||
    props.accountParam.length == 46
  ) {
    let address = Address.createFromRawAddress(props.accountParam);
    strAddress.value = address.pretty();
    account = await AccountUtils.getAccountFromAddress(props.accountParam);

    if (account) {
      strPublicKey.value = account.publicKey;
      delegatePublicKey.value = account.linkedAccountKey;
      accountAssets.value = account.mosaics.map((mosaic) => {
        return {
          id: mosaic.id.toHex(),
          amount: mosaic.amount.compact(),
        };
      });

    } else {
      isShowInvalid.value = true;
      return;
    }
  }

  let fetchAccountMetadata = await MetadataUtils.getAccountMetadata(
    strPublicKey.value
  );
  accountMetadata.value = fetchAccountMetadata;

  let fetchedAccountNamespaces = await AccountUtils.getAccountNamespaces(
    strAddress.value
  );
  if (fetchedAccountNamespaces) {
    accountNamespaces.value = fetchedAccountNamespaces;
  }
  let linkedNamespaceToAccount = await AccountUtils.fetchLinkedAccountNamespace(
    strAddress.value
  );
  
  matchedNamespace.value = linkedNamespaceToAccount;
  const multisigInfo = await AccountUtils.getMultisig(strAddress.value);
  if (multisigInfo) {
    const { cosignatories } = multisigInfo;
    multisig.value.cosignatories = cosignatories.map((cosignatory) =>
      cosignatory.address.plain()
    );
    cosignatoriesLength.value = cosignatories.length;
  }

  const address = Address.createFromRawAddress(strAddress.value);
  try {
    const harvesterInfo = await AppState.chainAPI!.harvesterAPI.getAccountHarvestingHarvesterInfo(address);
    if (harvesterInfo.length > 0) {
      isHarvester.value = true;
    }
  } catch (e) {
    console.log(e)
  }
  isFetching.value = false;
};

loadAccountInfo();

const generateMultisigInfoBelowLevelZero = async () => {
  if (!AppState.isReady) {
    setTimeout(generateMultisigInfoBelowLevelZero, 1000);
    return;
  }
  if (!AppState.chainAPI) {
    return;
  }

  let address = Address.createFromRawAddress(strAddress.value);
  try {
    var graphInfo =
      await AppState.chainAPI.accountAPI.getMultisigAccountGraphInfo(address);
  } catch {
    return
  }

  let multisigInfos: MultisigInfo[] = [];
  try {
    let graphInfo =
      await AppState.chainAPI.accountAPI.getMultisigAccountGraphInfo(address);
  
    graphInfo.multisigAccounts.forEach((value, key) => {
      const level = key;
      for (let i = 0; i < value.length; ++i) {
        let multiInfo = value[i];
        let newMultisigInfo = new MultisigInfo(
          multiInfo.account.publicKey,
          level,
          multiInfo.cosignatories.map((cosign) => cosign.publicKey),
          multiInfo.multisigAccounts.map((cosign) => cosign.publicKey),
          multiInfo.minApproval,
          multiInfo.minRemoval
        );
        multisigInfos.push(newMultisigInfo);
      }
    });
  } catch (error) {
    
  }
  
  var multisigAccounts: multisigLayer[] = [];
  var indexNo = 0
  multisigAccounts.push({
    key: "0",
    label: "Level 1",
    selectable: false,
    children: []
  })
  multisigAccounts.push({
    key: "1",
    label: "Level 2",
    selectable: false,
    children: []
  })
  multisigAccounts.push({
    key: "2",
    label: "Level 3",
    selectable: false,
    children: []
  })

  const multisigAccBelowLevelZero = multisigInfos.filter((accounts) => accounts.level < 0 ).map(acc => AccountUtils.getAddressFromPublicKey(acc.publicKey)as string)
  const multisigAccLevelNOne = multisigInfos.filter((accounts) => accounts.level == -1 ).map(acc => Helper.createAddress(AccountUtils.getAddressFromPublicKey(acc.publicKey)as string).pretty())

  multisigAccLevelNOne.forEach((element) => {
    multisigAccounts[0].children.push(
      {
        key: '0-' + indexNo.toString(),
        label: element,
        data: element,
        selectable: true
      }
    )
    indexNo++
  })
  indexNo = 0

  const multisigAccLevelNTwo = multisigInfos.filter((accounts) => accounts.level == -2 ).map(acc => Helper.createAddress(AccountUtils.getAddressFromPublicKey(acc.publicKey)as string).pretty())

  multisigAccLevelNTwo.forEach((element) => {
    multisigAccounts[1].children.push(
      {
        key: '1-' + indexNo.toString(),
        label: element,
        data: element,
        selectable: true
      }
    )
    indexNo++
  })
  indexNo = 0

  const multisigAccLevelNThree = multisigInfos.filter((accounts) => accounts.level == -3 ).map(acc => Helper.createAddress(AccountUtils.getAddressFromPublicKey(acc.publicKey)as string).pretty())

  multisigAccLevelNThree.forEach((element) => {
    multisigAccounts[2].children.push(
      {
        key: '2-' + indexNo.toString(),
        label: element,
        data: element,
        selectable: true
      }
    )
    indexNo++
  })
  indexNo = 0
  
  multisigAddress.value = multisigAccounts
  multisigLength.value = multisigAccBelowLevelZero.length;
};

generateMultisigInfoBelowLevelZero();

const updateBcDrives = (data: DriveInfo[]) => {
  bcDrivesLength.value = data.length;
}

emitter.on("CHANGE_NETWORK", (payload: boolean) => {
  if (payload) {
    isShowInvalid.value = false;
    currentComponent.value = 'asset'
    loadAccountInfo();
  }
});

</script>