<template>
    <div v-for="item in formattedTxn" class="details">
      <div v-if="item.amountTransfer">
        <div>Amount</div>
        <div class="relative">
          <span class="font-bold">{{ transferAmount[0] }}</span
          >{{ transferAmount[1] > 0 ? "." : ""
          }}<span class="text-xxs">{{ transferAmount[1] }}</span>
          <img
            src="@/assets/img/icon-xpx.svg"
            class="ml-2 inline-block"
            style="top: -1px; width: 14px"
          />
          <span class="font-bold ml-2">{{ nativeTokenLabel }}</span>
        </div>
      </div>
      <div v-if="item.sda.length > 0">
        <div>SDAs</div>
        <div class="relative">
          <div v-for="(sda, index) in item.sda" :key="index">
            <span class="font-bold">{{ sdaAmount![index][0] }}</span
            >{{ sdaAmount![index][1] > 0 ? "." : ""
            }}<span class="text-xxs">{{ sdaAmount![index][1] }}</span>
            <img
              v-if="
                sda.currentAlias[0] && sda.currentAlias[0].name == 'xarcade.xar'
              "
              src="@/modules/account/img/xarcade-logo.svg"
              class="inline-block h-7 w-7 mr-2 ml-2 border-2 rounded-3xl"
            />
            <img
              v-else-if="
                sda.currentAlias[0] && sda.currentAlias[0].name == 'prx.metx'
              "
              src="@/modules/account/img/metx-logo.svg"
              class="inline-block h-7 w-7 mr-2 ml-2 border-2 rounded-3xl"
            />
            <img
              v-else
              src="@/modules/transaction/img/proximax-logo-gray.svg"
              class="inline-block h-6 w-6 mr-2 ml-2"
            />
            <div
              class="inline-block text-gray-400 text-txs hover:text-gray-700 duration-300 transition-all"
            >
              <!-- <router-link v-if="sda.currentAlias[0]" :to="{ name: 'ViewAsset', params: { id: sda.id }}" class="hover:text-blue-primary hover:underline">{{ sda.label }}</router-link> -->
              <!-- {{ sda.name?' / ':'' }} -->
              <router-link
                :to="{ name: 'ViewAsset', params: { id: sda.id } }"
                class="hover:text-blue-primary hover:underline"
                >{{ sda.label }}</router-link
              >
            </div>
          </div>
          <!-- <div v-if="txnDetail.detail.amount.length == 0">-</div> -->
        </div>
      </div>
    </div>
</template>
  
<script setup lang='ts'>
import type { SDA } from "@/models/transactions/sda";
import { AppState } from "@/state/appState";
import { TransactionUtils } from "@/util/transactionUtils";
import { Helper } from "@/util/typeHelper";
import { MosaicNames, NamespaceId, NamespaceName, type MosaicId } from "tsjs-xpx-chain-sdk";
import { computed, ref } from "vue";
  
const props = defineProps({
    txnDetail: Object,
  });

const formattedTxn = ref<any>([]);
const nativeTokenNamespaceId = computed(() =>
    new NamespaceId(AppState.nativeToken.fullNamespace).toHex()
);
const nativeTokenLabel = AppState.nativeToken.label;

const formatSDAs = async (data: any) => {
    let txn = < {
        amountTransfer: number,
        sda: SDA[]
    } > {}
    const sdas: SDA[] = []
        for (let item in data.value) {
            const rawAmount = data.value[item].secondaryValue;
            const isSendWithNamespace = TransactionUtils.isNamespaceWithString(
                    data.value[item].value
                );

                let assetId: MosaicId;
                let assetIdHex: string;

                if (isSendWithNamespace) {
                    const namespaceId = new NamespaceId(
                        data.value[item].value.toDTO().id
                    );
                    assetId = await TransactionUtils.getAssetAlias(namespaceId);
                    assetIdHex = assetId.toHex();
                } else {
                    assetIdHex = data.value[item].value
                }

                if (
                    [AppState.nativeToken.assetId, nativeTokenNamespaceId.value].includes(
                        assetIdHex
                    )
                ) {
                    txn.amountTransfer = TransactionUtils.convertToExactNativeAmount(rawAmount);
                    continue;
                }

                const newSDA: SDA = {
                    amount: rawAmount,
                    divisibility: 0,
                    id: assetIdHex,
                    amountIsRaw: true,
                    sendWithNamespace: isSendWithNamespace,
                };

                if (isSendWithNamespace) {
                    const namespaceId = data.value[item].value;

                    newSDA.sendWithAlias = {
                        idHex: namespaceId.toHex(),
                        id: namespaceId.toDTO().id,
                    };
                }

                sdas.push(newSDA);

                const namespaceIds = sdas
                    .filter((sda) => sda.sendWithNamespace)
                    .map((sda) => {
                        if (sda.sendWithAlias) {
                            return Helper.createNamespaceId(sda.sendWithAlias.id);
                        }
                        return new NamespaceId("");
                    });

                const allAssetId = sdas
                    .filter((sda) => {
                        return sda.amountIsRaw;
                    })
                    .map((sda) => Helper.createAssetId(sda.id));

                if (namespaceIds.length || allAssetId.length) {
                    let namespacesNames: NamespaceName[] = [];
                    if (!AppState.chainAPI) {
                        return
                    }
                    namespacesNames = await AppState.chainAPI.namespaceAPI.getNamespacesName(
                        namespaceIds
                    );
                    const assetsProperties = await AppState.chainAPI.assetAPI.getMosaics(
                        allAssetId
                    );
                    const aliasNames: MosaicNames[] =
                        await AppState.chainAPI.assetAPI.getMosaicsNames(allAssetId);

                    for (let x = 0; x < sdas.length; ++x) {
                        const assetProperties = assetsProperties.filter(
                            (aliasName) => aliasName.mosaicId.toHex() === sdas[x].id
                        )[0];

                        sdas[x].divisibility = assetProperties.divisibility;
                        sdas[x].amount = TransactionUtils.convertToExactAmount(
                            sdas[x].amount,
                            assetProperties.divisibility
                        );
                        sdas[x].amountIsRaw = false;

                        const mosaicNames: MosaicNames = aliasNames.filter(
                            (aliaName) => aliaName.mosaicId.toHex() === sdas[x].id
                        )[0];
                        const currentAliasNames: NamespaceName[] = mosaicNames.names;
                        sdas[x].currentAlias = currentAliasNames.map((currentAlias) => {
                            return {
                                name: currentAlias.name,
                                id: currentAlias.namespaceId.toDTO().id,
                                idHex: currentAlias.namespaceId.toHex(),
                            };
                        });
                        const { sendWithAlias, currentAlias } = sdas[x];
                        if (sendWithAlias) {
                            sendWithAlias.name = namespacesNames
                                .filter(
                                    (nsName) => nsName.namespaceId.toHex() === sendWithAlias.idHex
                                )
                                .map((nsName) => nsName.name)[0];
                        }
                        if (!currentAlias) {
                            sdas[x].label = sdas[x].id;
                        } else if (
                            currentAlias.length &&
                            AppState.registeredToken.find(
                                (rt) => rt.fullNamespace === currentAlias[0].name
                            )
                        ) {
                            const findNamespace = AppState.registeredToken.find(
                                (rt) => rt.fullNamespace === currentAlias[0].name
                            );
                            if (findNamespace) {
                                sdas[x].label = findNamespace.label;
                            }
                        } else if (currentAlias.length) {
                            sdas[x].label = currentAlias[0].name;
                        } else {
                            sdas[x].label = sdas[x].id;
                        }
                    }
                }
                txn.sda = sdas
            }
    return txn
}

const doSomething = async() =>{
    formattedTxn.value.push(await formatSDAs(props.txnDetail))
}
doSomething()
console.log(formattedTxn.value)

const transferAmount = computed(() => {
    for(let item in formattedTxn.value){
        return formattedTxn.value[item].amountTransfer.toString().split(".");
    }
});

const sdaAmount = computed(() => {
  let formattedSDA: any[] = [];
  for(let item in formattedTxn.value){
    if (formattedTxn.value[item].sda.length > 0) {
        formattedTxn.value[item].sda.forEach((sda: { amount: { toString: () => string; }; }) => {
        formattedSDA.push(sda.amount.toString().split("."));
        });
    }
    return formattedSDA;
  }
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.details {
  @apply text-gray-800 text-xs;

  > div {
    @apply flex items-center border-b border-gray-100 py-4;

    > div:first-child {
      @apply w-40 text-xs pl-4;
    }

    > div:nth-child(2) {
      @apply text-xs;
    }
  }

  > div:last-child {
    @apply border-none;
  }
}
</style>
  
