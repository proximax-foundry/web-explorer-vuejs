<template>
  <div class="mt-3 border border-gray-200 p-3" v-for="(item, index) in allInnerTransactions" :key="index">
    <div class="">
      <div class="table_div">
        <div>
          <div>Type</div>
          <div>{{ TransactionUtils.getTransactionTypeName(item.type) }}</div>
        </div>
        <div>
          <div>Public Key</div>
          <div>{{ item.signer.publicKey }}</div>
        </div>
        <div>
          <div>Signer</div>
          <div>{{ item.signer.address.address }}</div>
        </div>
        <div>
          <div>Fully signed</div>
          <div>{{ innerSignedList[index] }}</div>
        </div>
      </div>
      <div v-if="txn.type == TransactionType.AGGREGATE_BONDED" class="table_div">
        <div v-for="(info, infoListindex) in innerTxnExtractedData[index].infoList" :key="infoListindex">
          <div>{{ info.label ? info.label : '' }}</div>
          <div>{{ info.short ? info.short : info.value }}</div>
        </div>
        <div v-if="innerTxnExtractedData[index].infoGreenList.length > 0">
          <div v-if="innerTxnExtractedData[index].legendType === InnerTxnLegendType.ADD_REMOVE" >Add</div>
          <div v-else-if="innerTxnExtractedData[index].legendType === InnerTxnLegendType.TRUE_FALSE" >True</div>
          <div v-else-if="innerTxnExtractedData[index].legendType === InnerTxnLegendType.BUY_SELL" >Buy</div>
          <div v-else-if="innerTxnExtractedData[index].legendType === InnerTxnLegendType.ALLOW_BLOCK" >Allow</div>
          <div>{{ innerTxnExtractedData[index].infoGreenList.map(info => info.short ? info.short : info.value).join(", ") }}</div>
        </div>
        <div v-if="innerTxnExtractedData[index].infoRedList.length > 0">
          <div v-if="innerTxnExtractedData[index].legendType === InnerTxnLegendType.ADD_REMOVE" >Remove</div>
          <div v-else-if="innerTxnExtractedData[index].legendType === InnerTxnLegendType.TRUE_FALSE" >False</div>
          <div v-else-if="innerTxnExtractedData[index].legendType === InnerTxnLegendType.BUY_SELL" >Sell</div>
          <div v-else-if="innerTxnExtractedData[index].legendType === InnerTxnLegendType.ALLOW_BLOCK" >Block</div>
          <div>{{ innerTxnExtractedData[index].infoRedList.map(info => info.short ? info.short : info.value).join(", ") }}</div>
        </div>
        <div v-if="innerTxnExtractedData[index].infoInfoList.length > 0">
          <div>Info</div>
          <div>{{ innerTxnExtractedData[index].infoInfoList.map(info => info.short ? info.short : info.value).join(", ") }}</div>
        </div>
        <!-- <div v-if="item.sdas.length > 0">
          <div>SDAs</div>
          <div>{{ item.sdas.join("<br>") }}</div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, getCurrentInstance, inject, ref, watch, toRefs } from "vue";
import { TransactionType } from "tsjs-xpx-chain-sdk";
import { TransactionUtils, MsgType, InnerTxnLegendType } from '@/models/util/transactionUtils';
import { TransactionUtils as TxnUtils } from '@/util/transactionUtils';
import { Helper } from "@/util/typeHelper";
import { CosignUtils } from '@/util/cosignUtils';
export default {
  name: 'InnerTxnComponent',
  props: {
    innerTxn: Object,
    txn: Object,
    txnGroup: String,
  },
  setup(props) {

    console.log(props.innerTxn.length);
    let allCosigners = []; // hold all the final cosigners public Keys
    let cosignedSigner = []; // all the cosigned final signers, include multisig account (calculated)
    let oriSignedSigners = []; // all the cosigned final signers + initiator
    let signedSigners = []; // all the cosigned final signers + initiator, include multisig account (calculated)

    const  allInnerTransactions = ref(props.innerTxn);
    const innerTxnExtractedData = ref([{
      infoInfoList: {},
      infoGreenList: {},
      infoRedList: {},
      infoList: {}
    }]);

    if(props.txn.type == TransactionType.AGGREGATE_BONDED){
      let castedAggregateTxn = TxnUtils.castToAggregate(props.txn);
      allCosigners.push(castedAggregateTxn.signer.publicKey);
      cosignedSigner = castedAggregateTxn.cosignatures.map(cosigner=> cosigner.signer.publicKey);
      oriSignedSigners = cosignedSigner.concat([props.txn.signer.publicKey]);
      signedSigners = [...oriSignedSigners];
      console.log('signedSigners')
      console.log(signedSigners)

      props.innerTxn.forEach(async(txn, item) => {
        let extractedData = await TransactionUtils.extractPartialInnerTransaction(txn);
        extractedData.infoInfoList = extractedData.infos.filter(info => !info.label && info.type === MsgType.INFO);
        extractedData.infoGreenList = extractedData.infos.filter(info => !info.label && info.type === MsgType.GREEN);
        extractedData.infoRedList = extractedData.infos.filter(info => !info.label && info.type === MsgType.RED);
        extractedData.infoList = extractedData.infos.filter(info => info.type === MsgType.NONE);
        innerTxnExtractedData.value[item] = extractedData;
        // console.log(allInnerTransactions.value[item])
      });
    }

    const innerSignedList = ref([]);
    let currentInnerSigners = [];

    if(props.innerTxn.length > 0){
      props.innerTxn.forEach(async(txn) => {
        if(txn.type === TransactionType.MODIFY_MULTISIG_ACCOUNT){
          let allDeepCosigners = await CosignUtils.getAllDeepModifyMultisigCosigners(txn);
          currentInnerSigners = allDeepCosigners;
          let flatCosigners = await CosignUtils.getAllFlatModifyMultisigCosigners(txn);

          for(let a = 0; a < flatCosigners.length; ++a){
            try {
              let accountMultisigGraphInfo = await AppState.chainAPI.accountAPI.getMultisigAccountGraphInfo(PublicAccount.createFromPublicKey(flatCosigners[a], AppState.networkType).address);

              let allMultisigKey = accountMultisigGraphInfo.multisigAccounts.keys().sort((a, b)=>{return a-b}); // ascending keys

              for(let y =0; y < allMultisigKey.length ;++y){
                const level = allMultisigKey[y];
                const multisigAccountsInfo = accountMultisigGraphInfo.multisigAccounts.get(level);

                for(let x =0; x < multisigAccountsInfo.length ;++x){
                  if(CosignUtils.isFulllySigned(multisigAccountsInfo[x], signedSigners)){
                    signedSigners.push(multisigAccountsInfo[x].account.publicKey);
                  }
                }
              }
            } catch (error) {
              //console.log(error);
            }
          }
          signedSigners = Array.from(new Set(signedSigners));
          console.log(signedSigners)
          console.log('flatCosigners')
          console.log(flatCosigners)
          let isSigned = flatCosigners.every((val) => signedSigners.includes(val));
          innerSignedList.value.push(isSigned);
          // innerRelatedList.push(allDeepCosigners.includes(currentPublicKey));
        }
      });
    }

    return {
      TransactionUtils,
      Helper,
      innerSignedList,
      allInnerTransactions,
      InnerTxnLegendType,
      TransactionType,
      innerTxnExtractedData,
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.table_div{
  @apply text-xs;
  > div{
    @apply grid grid-cols-4;
    > div{
      @apply p-2;
    }
    > div:first-child{
      @apply text-blue-primary font-bold;
    }
    > div:nth-child(2){
      @apply break-all col-span-3;
    }
  }

  > div:nth-child(2n+1){
    @apply bg-gray-100;
  }
}
</style>
