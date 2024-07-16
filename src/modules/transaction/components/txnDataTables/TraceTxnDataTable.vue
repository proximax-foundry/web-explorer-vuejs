<template>
    <div>
      <DataTable
        :value="traceTransactions"
        scrollDirection="horizontal"
        responsiveLayout="scroll"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate=""
        :globalFilterFields="['recipient', 'sender', 'signerAddress', 'type']"
      >
        <Column style="width: 200px" v-if="!wideScreen">
          <template #body="{ data }">
            <div>
              <div
                class="uppercase text-xs text-gray-300 font-bold mb-1 break-all"
              >
                TX HASH
              </div>
              <router-link
                class="uppercase font-bold text-xs block text-blue-600 hover:text-blue-primary hover:underline"
                :to="{ name: 'ViewTransaction', params: { hash: data.hash } }"
              >
                <span
                  class="text-xs truncate inline-flex break-all hover:underline hover:text-blue-primary text-ellipsis overflow-hidden w-44"
                  v-tooltip.right="data.hash"
                  >{{ data.hash }}</span
                >...
              </router-link>
            </div>
            <div>
              <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
                Type
              </div>
              <div class="flex items-center">
                <div class="uppercase font-bold text-xs mr-2">
                  {{ data.type }}
                </div>
              </div>
            </div>
            <div>
              <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
                Recipient
              </div>
              <div class="uppercase font-bold text-xs">
                <span
                  v-if="data.recipient === '' || data.recipient === null"
                >-</span>
                <router-link
                  :to="{
                    name: 'ViewAccount',
                    params: { accountParam: data.recipient },
                  }"
                  v-tooltip.right="Helper.createAddress(data.recipient).pretty()"
                  v-else
                  class="truncate inline-flex text-xs break-all text-blue-600 hover:text-blue-primary hover:underline w-44"
                  ><span class="text-ellipsis overflow-hidden">{{
                    Helper.createAddress(data.recipient).pretty()
                  }}</span
                  >...</router-link
                >
              </div>
            </div>
          </template>
        </Column>
        <Column style="width: 200px" v-if="!wideScreen">
          <template #body="{ data }">
            <div>
              <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
                From
              </div>
              <div class="uppercase font-bold text-xs">
                <span v-if="data.sender === '' || data.sender === null">-</span>
                <router-link
                  :to="{
                    name: 'ViewAccount',
                    params: { accountParam: data.sender },
                  }"
                  v-else
                  v-tooltip.bottom="Helper.createAddress(data.sender).pretty()"
                  class="truncate inline-flex w-44 text-xs break-all text-blue-600 hover:text-blue-primary hover:underline"
                  ><span class="text-ellipsis overflow-hidden">{{
                    Helper.createAddress(data.sender).pretty()
                  }}</span
                  >...</router-link
                >
              </div>
            </div>
            <div>
              <div class="uppercase text-xs text-gray-300 font-bold mb-1 mt-5">
                AMOUNT{{(nativeToken.label)}}
              </div>
              <div v-if="data.sender === Helper.createAddress(accountAddress!).plain() && data.amount.fee" class="inline-block text-xs font-bold py-1 px-2 my-1 mx-1 rounded bg-red-200 text-red-700">{{ data.amount.fee }} (fee)</div>
              <div v-if="data.amount.xpx">
                <div v-if="data.type === 'Place Sda Exchange Offer' || data.type === 'Remove Exchange Offer'" class="inline-block text-xs font-bold py-1 px-2 my-1 mx-1 rounded" :class="data.getXpxOffer ? 'bg-red-200 text-red-700' : 'bg-green-200 text-green-700'">
                  {{ data.amount.xpx }}
                </div>
                <div v-else class="inline-block text-xs font-bold py-1 px-2 my-1 mx-1 rounded" :class="data.sender === Helper.createAddress(accountAddress!).plain() ? 'bg-red-200 text-red-700' : 'bg-green-200 text-green-700'">
                  {{ data.amount.xpx }}
                </div>
              </div>
            </div>
          </template>
        </Column>
        <Column
          field="hash"
          header="TX HASH"
          headerStyle="width:50px"
          v-if="wideScreen"
        >
          <template #body="{ data }">
            <router-link
              :to="{ name: 'ViewTransaction', params: { hash: data.hash } }"
              class="text-xs text-blue-600 hover:text-blue-primary hover:underline inline-flex"
              v-tooltip.bottom="data.hash"
              ><span class="text-ellipsis overflow-hidden w-20">{{
                data.hash
              }}</span
              >...
            </router-link>
          </template>
        </Column>
        <Column
          field="type"
          header="TYPE"
          headerStyle="width:70px"
          v-if="wideScreen"
        >
          <template #body="{ data }">
            <span class="text-xs">{{ data.type }}</span>
          </template>
        </Column>
        <Column
          field="block"
          v-if="wideScreen"
          header="BLOCK"
          headerStyle="width:70px"
        >
          <template #body="{ data }">
            <router-link
              :to="{ name: 'ViewBlock', params: { blockHeight: data.block } }"
              class="text-blue-600 hover:text-blue-primary hover:underline text-xs"
              >{{ data.block }}</router-link
            >
          </template>
        </Column>
        <Column
          field="signer"
          header="FROM"
          headerStyle="width:130px"
          v-if="wideScreen"
        >
          <template #body="{ data }">
            <span v-if="data.sender === '' || data.sender === null">-</span>
            <router-link
              :to="{ name: 'ViewAccount', params: { accountParam: data.sender } }"
              v-else
              v-tooltip.bottom="Helper.createAddress(data.sender).pretty()"
              class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-32"
              ><span class="text-ellipsis overflow-hidden"
                >{{ Helper.createAddress(data.sender).pretty() }} </span
              >...
            </router-link>
          </template>
        </Column>
        <Column
          field="recipient"
          header="RECIPIENT"
          headerStyle="width:130px"
          v-if="wideScreen"
        >
          <template #body="{ data }">
            <span v-if="data.recipient === '' || data.recipient === null">-</span>
            <router-link
              :to="{
                name: 'ViewAccount',
                params: { accountParam: data.recipient },
              }"
              v-tooltip.bottom="Helper.createAddress(data.recipient).pretty()"
              v-else
              class="truncate inline-flex text-xs text-blue-600 hover:text-blue-primary hover:underline w-32"
            >
              <span class="text-ellipsis overflow-hidden">{{
                Helper.createAddress(data.recipient).pretty()
              }}</span
              >...
            </router-link>
          </template>
        </Column>
        <Column :header="'AMOUNT(' + nativeToken.label + ')'" headerStyle="width:10px" v-if="wideScreen">
          <template #body="{ data }">
            <div v-if="data.sender === Helper.createAddress(accountAddress!).plain() && data.amount.fee" class="inline-block font-bold py-1 px-2 my-1 mx-1 rounded bg-red-200 text-red-700">{{ data.amount.fee }} (fee)</div>
            <div v-if="data.amount.xpx">
              <div v-if="data.type === 'Place Sda Exchange Offer' || data.type === 'Remove Exchange Offer'" class="inline-block font-bold py-1 px-2 my-1 mx-1 rounded" :class="data.getXpxOffer ? 'bg-red-200 text-red-700' : 'bg-green-200 text-green-700'">
                {{ data.amount.xpx }}
              </div>
              <div v-else class="inline-block font-bold py-1 px-2 my-1 mx-1 rounded" :class="data.sender === Helper.createAddress(accountAddress!).plain() ? 'bg-red-200 text-red-700' : 'bg-green-200 text-green-700'">
                {{ data.amount.xpx }}
              </div>
            </div>
          </template>
        </Column>
        <template #empty> No transaction found </template>
        <template #loading> Fetching transactions </template>
      </DataTable>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from "vue";
  import DataTable from "primevue/datatable";
  import Column from "primevue/column";
  import { Helper } from "@/util/typeHelper";
  import { AppState } from "@/state/appState";
  import { TransactionUtils } from "@/util/transactionUtils";
  import { Address, BalanceChangeReceipt, BalanceTransferReceipt, BlockInfo, NamespaceId, OfferCreationReceipt, OfferExchangeReceipt, OfferRemovalReceipt, ReceiptType, TransactionType, TransferTransaction } from "tsjs-xpx-chain-sdk";

  interface TraceTransaction {
    hash: string | undefined,
    type: string,
    block: number,
    sender: string | null,
    recipient: string | null,
    amount: { fee?: number, xpx?: number},
    getXpxOffer?: boolean,
  }
  
  const props = defineProps({
    transactions: Array,
    accountAddress: String,
    pages: Number,
  });
  
  const traceTransactions = ref<TraceTransaction[]>([])
  const wideScreen = ref(false);
  const screenResizeHandler = () => {
    if (window.innerWidth < 1024) {
      wideScreen.value = false;
    } else {
      wideScreen.value = true;
    }
  };
  screenResizeHandler();
  
  onUnmounted(() => {
    window.removeEventListener("resize", screenResizeHandler);
  });
  
  onMounted(() => {
    window.addEventListener("resize", screenResizeHandler);
  });
  const nativeToken = computed(() => AppState.nativeToken);
  
  const currencyDivisibility = computed(() => {
    return AppState.nativeToken.divisibility;
  });

  const  formatTypeWord = (txnType: string) => {
    return txnType.replace(/_/g, ' ').replace(/\b\w+\b/g, type => {
      return type.charAt(0) + type.slice(1).toLowerCase();
    });
  }

  const storeTxnDetails = (hash: string | undefined, type: number, blockHeight: number, signer: string  | null, recipient: string | null, fee: number | null, xpx: number | null, getXpxOffer?: boolean) => {
    traceTransactions.value.push({
      hash: hash,
      type: formatTypeWord(TransactionType[type]),
      block: blockHeight,
      sender: signer,
      recipient: recipient,
      amount: { fee:TransactionUtils.convertToExactNativeAmount(fee!), xpx: TransactionUtils.convertToExactNativeAmount(xpx!)},
      getXpxOffer: getXpxOffer
    })
  }

  const getBlockReceiptDetail = async (txn: any, currentAddress: string, fee: number | null) => {
    const blockReceipts = await AppState.chainAPI!.blockAPI.getBlockReceipts(txn.transactionInfo.height.compact());
    const {transactionStatements,} = blockReceipts;
    for(const statement of transactionStatements){
      for(const receipt of statement.receipts){
        if (receipt instanceof BalanceTransferReceipt) {
          const { type, version, size, ...val } = receipt;
          if((txn.type === TransactionType.REGISTER_NAMESPACE && type === ReceiptType.Namespace_Rental_Fee) || (txn.type === TransactionType.MOSAIC_DEFINITION && type === ReceiptType.Mosaic_Rental_Fee)){
            if(val.mosaicId.toHex() === nativeToken.value.assetId){
              if(val.sender.address.plain() === currentAddress){
                storeTxnDetails(txn.transactionInfo.hash? txn.transactionInfo.hash : txn.transactionInfo.aggregateHash, txn.type, txn.transactionInfo.height.compact(), txn.signer ? txn.signer.address.address : null,txn.recipient? txn.recipient.address : null, fee, val.amount.compact());
              }
            }
          }
        }
        else if (receipt instanceof OfferCreationReceipt && txn.type === TransactionType.PLACE_SDA_EXCHANGE_OFFER) {
          const { type, version, size, ...val } = receipt;
          if(val.mosaicIdGive.toHex() === nativeToken.value.assetId){
            storeTxnDetails(txn.transactionInfo.hash? txn.transactionInfo.hash : txn.transactionInfo.aggregateHash, txn.type, txn.transactionInfo.height.compact(), txn.signer ? txn.signer.address.address : null,txn.recipient? txn.recipient.address : null, fee, val.mosaicAmountGive.compact(), true);
          }
          else if(val.mosaicIdGet.toHex() === nativeToken.value.assetId){
            storeTxnDetails(txn.transactionInfo.hash? txn.transactionInfo.hash : txn.transactionInfo.aggregateHash, txn.type, txn.transactionInfo.height.compact(), txn.signer ? txn.signer.address.address : null,txn.recipient? txn.recipient.address : null, fee, val.mosaicAmountGet.compact(), false);
          }
        }
        else if (receipt instanceof OfferExchangeReceipt && txn.type === TransactionType.EXCHANGE_OFFER) {
          const { type, version, size, ...val } = receipt;
          if(val.mosaicIdGive.toHex() === nativeToken.value.assetId){
            let assetToGive = val.exchangeDetails.map((z) => {
              return {
                mosaicAmountGive: z.mosaicAmountGive.compact(),
              }
            })
            let totalAssetGive = 0
            for(const assetAmount of assetToGive){
              totalAssetGive = totalAssetGive + assetAmount.mosaicAmountGive
            }
            storeTxnDetails(txn.transactionInfo.hash? txn.transactionInfo.hash : txn.transactionInfo.aggregateHash, txn.type, txn.transactionInfo.height.compact(), txn.signer ? txn.signer.address.address : null,txn.recipient? txn.recipient.address : null, fee, totalAssetGive, true);
          }
          else if(val.mosaicIdGet.toHex() === nativeToken.value.assetId){
            let assetToGet = val.exchangeDetails.map((z) => {
              return {
                mosaicAmountGive: z.mosaicAmountGet.compact(),
              }
            })
            let totalAssetGet = 0
            for(const assetAmount of assetToGet){
              totalAssetGet = totalAssetGet + assetAmount.mosaicAmountGive
            }
            storeTxnDetails(txn.transactionInfo.hash? txn.transactionInfo.hash : txn.transactionInfo.aggregateHash, txn.type, txn.transactionInfo.height.compact(), txn.signer ? txn.signer.address.address : null,txn.recipient? txn.recipient.address : null, fee, totalAssetGet, false);
          }
        }
        else if (receipt instanceof OfferRemovalReceipt && txn.type === TransactionType.REMOVE_EXCHANGE_OFFER) {
          const { type, version, size, ...val } = receipt;
          if(val.mosaicIdGive.toHex() === nativeToken.value.assetId){
            storeTxnDetails(txn.transactionInfo.hash? txn.transactionInfo.hash : txn.transactionInfo.aggregateHash, txn.type, txn.transactionInfo.height.compact(), txn.signer ? txn.signer.address.address : null,txn.recipient? txn.recipient.address : null, fee, val.mosaicAmountGiveReturned.compact(), false);
          }
        }
      }
    }
  }

  const getTransactionDetails = async () => {
    if(!AppState.chainAPI){
      return;
    }
    for(const transaction of props.transactions!){
      const currentAddress = Helper.createAddress(props.accountAddress!).plain();
      let txn = transaction as any
      let txnBytes: number
      if(!txn.transactionInfo.size){
        let convertTxn = txn as TransferTransaction
        txnBytes = convertTxn.size
      }
      else{
        txnBytes = txn.transactionInfo.size
      }
      const blockInfo = await AppState.chainAPI.blockAPI.getBlockByHeight(
        txn.transactionInfo.height.compact()
      );
      const txnSize = txnBytes * blockInfo.feeMultiplier;
      if(txn.type === TransactionType.AGGREGATE_BONDED_V1 || txn.type === TransactionType.AGGREGATE_COMPLETE_V1){
        if(txn.signer.address.address === currentAddress){
          storeTxnDetails(txn.transactionInfo.hash? txn.transactionInfo.hash : txn.transactionInfo.aggregateHash, txn.type, txn.transactionInfo.height.compact(), txn.signer ? txn.signer.address.address : null,txn.recipient? txn.recipient.address : null, txnSize, null);
        }
        let getTxn = await TransactionUtils.getTransaction(txn.transactionInfo.hash? txn.transactionInfo.hash : txn.transactionInfo.aggregateHash);
        const filterTransaction = getTxn.txn.innerTransactions.filter((txn: { type: number; }) => txn.type !== TransactionType.MOSAIC_SUPPLY_CHANGE && txn.type !== TransactionType.ACCOUNT_METADATA_V2 && txn.type !== TransactionType.NAMESPACE_METADATA_V2 && txn.type !== TransactionType.MOSAIC_METADATA_V2);
        if(getTxn.isFound){
          for(const txn of filterTransaction){
            if(txn.signer ? txn.signer.address.address === currentAddress : false || txn.recipient? txn.recipient.address === currentAddress : false){
              if(txn.type === TransactionType.TRANSFER){
                for(const mosaic of txn.mosaics){
                  if(mosaic.id.toHex() === nativeToken.value.assetId || mosaic.id.toHex() === new NamespaceId(nativeToken.value.fullNamespace).toHex()){
                    storeTxnDetails(txn.transactionInfo.hash? txn.transactionInfo.hash : txn.transactionInfo.aggregateHash, txn.type, txn.transactionInfo.height.compact(), txn.signer ? txn.signer.address.address : null,txn.recipient? txn.recipient.address : null, null, mosaic.amount.compact());
                  }
                }
              }
              else if(txn.type === TransactionType.REGISTER_NAMESPACE || txn.type === TransactionType.MOSAIC_DEFINITION || txn.type === TransactionType.PLACE_SDA_EXCHANGE_OFFER || txn.type === TransactionType.REMOVE_EXCHANGE_OFFER){
                await getBlockReceiptDetail(txn, currentAddress, null);
              }
              else{
                storeTxnDetails(txn.transactionInfo.hash? txn.transactionInfo.hash : txn.transactionInfo.aggregateHash, txn.type, txn.transactionInfo.height.compact(), txn.signer ? txn.signer.address.address : null,txn.recipient? txn.recipient.address : null, txnSize, null);
              }
            }
          }
        }
      }
      else if(txn.type === TransactionType.TRANSFER){
        for(const mosaic of txn.mosaics){
          if(mosaic.id.toHex() === nativeToken.value.assetId || mosaic.id.toHex() === new NamespaceId(nativeToken.value.fullNamespace).toHex()){
            storeTxnDetails(txn.transactionInfo.hash? txn.transactionInfo.hash : txn.transactionInfo.aggregateHash, txn.type, txn.transactionInfo.height.compact(), txn.signer ? txn.signer.address.address : null,txn.recipient? txn.recipient.address : null, txnSize, mosaic.amount.compact());
          }
        }
      }
      else if(txn.type === TransactionType.REGISTER_NAMESPACE || txn.type === TransactionType.MOSAIC_DEFINITION || txn.type === TransactionType.PLACE_SDA_EXCHANGE_OFFER || txn.type === TransactionType.REMOVE_EXCHANGE_OFFER){
        await getBlockReceiptDetail(txn, currentAddress, txnSize);
      }
      else{
        storeTxnDetails(txn.transactionInfo.hash? txn.transactionInfo.hash : txn.transactionInfo.aggregateHash, txn.type, txn.transactionInfo.height.compact(), txn.signer ? txn.signer.address.address : null,txn.recipient? txn.recipient.address : null, txnSize, null);
      }
    }
    traceTransactions.value.sort((a,b) => b.block - a.block)
  }
  getTransactionDetails()

  </script>
  
  <style lang="scss" scoped></style>