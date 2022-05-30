<template>
      <button class="mr-10 w-32 blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto" @click="downloadCSV">Export CSV</button>
</template>

<script>
import { AppState } from '@/state/appState';
import { Helper } from "@/util/typeHelper";
import { computed } from "vue";



export default {
  name: 'ExportCSVComponent',
  props: {
    selectedTxnType: String,
    transactions: Array
  },
  setup(props) {
    
    const nativeTokenName = computed(() => AppState.nativeToken.label);

    const displayAssetDiv = (sda) => {
      let asset_div;
      let assetArray = []
      assetArray.push(sda.id);

      if(sda.currentAlias && sda.currentAlias.length){
        asset_div = (sda.amount + ' ' + sda.currentAlias[0].name);
      }
      else{
        asset_div = (sda.amount + ' - ' + sda.id);
      }
      return asset_div;
    }

    const displaySDAs = (sdas) => {
      let sda_rows = [];
      if(sdas.length > 0){
        for(const sda of sdas){
          let asset_div = displayAssetDiv(sda);
          sda_rows.push(asset_div);
        }
        return sda_rows.join("");
      }
    }

    const displayAggregateTxn = (txns) => {
      let txn_rows;
        for(const txn of txns){
         txn_rows = txn.name + " ("+ txn.total + ")";        
        }
        return txn_rows;  
    }

    const displayExchangeOffer = (offer) => {
      let offer_rows;
      if(offer.length > 0){
       offer.forEach(exchangeOffer=>{
           console.log(exchangeOffer);
         offer_rows = exchangeOffer.type + "-";
         offer_rows += (exchangeOffer.amount > 0)?" Amount: "+exchangeOffer.amount:'';
         offer_rows += (exchangeOffer.assetNamespace ?  " Asset Namespace: "+exchangeOffer.assetNamespace : " Asset: "+ exchangeOffer.assetId);
         offer_rows += (exchangeOffer.cost > 0)?(" Cost: " + exchangeOffer.cost + " " + nativeTokenName.value):'';
       })
        return offer_rows;
      }
    }
    
    const displayModification = (data) =>{
      let modification_rows = [];
      
      for(const restrictMod of data){
        let test = restrictMod.action === 'Add'? restrictMod.action+": " +(restrictMod.name ? restrictMod.name : restrictMod.value):restrictMod.action+": "+ (restrictMod.name ? restrictMod.name : restrictMod.value);
        modification_rows.push(test);
      }
      return modification_rows.join("  ");
    }
    const downloadCSV = () => {
      let objArray = exportValue();
      const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
      let str = '';
      let csvData = '';
      let header = [];
        for (let i = 0; i < array.length; i++) {
          let line = '';
            for (const index in array[i]) { 
              header.push(index);
              if (line !== '') line += ',';
              line += array[i][index];
            }
            str += line + '\r\n'; 
        }
      let uniqueChars = [...new Set(header)];
        csvData += uniqueChars.join(",") + '\r\n';
        csvData += str;
      const exportedFilenmae = props.selectedTxnType + '.csv' || 'export.csv'; // eslint-disable-line
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
          navigator.msSaveBlob(blob, exportedFilenmae);
        } else {
          const link = document.createElement('a');
          if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }
    }

    const exportValue = () =>{
      let export_Value = [];
      props.transactions.forEach(data=>{
        switch(props.selectedTxnType){
          case "Transfer":
            export_Value.push({
              TxHash: data.hash,
              Timestamp: Helper.convertDisplayDateTimeFormat24(data.timestamp).replace(",", ""),
              Type: data.type,
              Block:data.block,
              Signer: Helper.createAddress(data.signerAddress).pretty(),
              Recipient: data.recipient?Helper.createAddress(data.recipient).pretty():"-",
              TxFee: (data.fee? data.fee:0) + " "+ nativeTokenName.value,
              Amount: (data.amountTransfer ? data.amountTransfer: 0 ) + " "+ nativeTokenName.value,
              SDA:displaySDAs(data.sda)?displaySDAs(data.sda):"-",
              Message: data.namespaceName? data.amount+ " "+ data.namespaceName: (data.assetId?data.assetId + " - "+ data.amount:"-")
            })
            break;
          case "Account":
            export_Value.push({
              TxHash: data.hash,
              Type: data.type,
              Account:data.block,
              ApprovalDelta: data.oldApprovalNumber ? data.oldApprovalNumber: '' + " " + data.approvalDelta>0?' +'+data.approvalDelta:data.approvalDelta,
              RemovalDelta: data.oldApprovalNumber ? data.oldApprovalNumber: '' + " "+ data.removalDelta>0?' +'+data.removalDelta:data.removalDelta,
              Info: (data.addedCosigner.length != 0?"Adding account: "+data.addedCosigner.join("  ")+"  ":"") + ( data.removedCosigner.length != 0?"Removing account: " + data.removedCosigner.join("  "):"-")
            })
            break;
          case "Aggregate":
            export_Value.push({
              TxHash: data.hash,
              Timestamp: Helper.convertDisplayDateTimeFormat24(data.timestamp).replace(",", ""),
              Type: data.type,
              Block:data.block,
              TxFee: (data.fee? data.fee:0) + " "+ nativeTokenName.value,
              Transaction:displayAggregateTxn(data.txnList)
            })
            break;
          case "Alias":
            export_Value.push({
              TxHash: data.hash,
              Timestamp: Helper.convertDisplayDateTimeFormat24(data.timestamp).replace(",", ""),
              Type: data.type,
              Block:data.block,
              TxFee: (data.fee? data.fee:0) + " "+ nativeTokenName.value,
              Info: data.aliasTypeName === 'Link'?(data.assetId? data.aliasName + " link with " +data.assetId:data.aliasName + " link with " +data.address):(data.assetId? data.aliasName + " unlink with " +data.assetId:data.aliasName + " unlink with " +data.address)
            })
            break;
          case "Asset":
            export_Value.push({
              TxHash: data.hash,
              Timestamp: Helper.convertDisplayDateTimeFormat24(data.timestamp).replace(",", ""),
              Type: data.type,
              Block:data.block,
              TxFee: (data.fee? data.fee:0) + " "+ nativeTokenName.value,
              AssetID: data.assetId +  (data.namespaceName? " " + data.namespaceName : ""),
              Info: (data.nonce?"Nonce: " + ' +'+data.nonce + "  ":"") + (data.divisibility!==null?"Divisibility: " + data.divisibility + "  ":"") + (data.transferable!==null?"Transferable: " + (data.transferable==true?"Yes":"No") + "  ":"") +  (data.supplyMutable!==null?"Supply Mutable: " + (data.supplyMutable==true?"Yes":"No") + "  ":"") + (data.duration>0? "Duration: " + data.duration + "  ":"") + (data.supplyDelta?"Supply: " +' +'+ data.supplyDelta + "  ":"") + (data.levyAssetId?"  Levy: " + data.levyAssetId + "  ":"")+(data.levyAssetName?" " + data.levyAssetName+"  ":"") + (data.levyAssetAmount?"Levy Amount: "+ data.levyAssetAmount+"  ":"") +  (data.levyRecipient?"Levy Recipient: " + data.levyRecipient +"  ":"")
            })
            break;
          case "Namespace":
            export_Value.push({
              TxHash: data.hash,
              Timestamp: Helper.convertDisplayDateTimeFormat24(data.timestamp).replace(",", ""),
              Type: data.type,
              Block:data.block,
              TxFee: (data.fee? data.fee:0) + " "+ nativeTokenName.value,
              RegisterType: data.registerTypeName,
              Namespace: data.namespaceName,
              ParentNamespace: data.parentName ? data.parentName : "-",
              Duration: data.duration ? data.duration + ' Block' + (data.duration>1?'s':'') : "-",
            })
            break;
          case "Metadata":
            export_Value.push({
              TxHash: data.hash,
              Timestamp: Helper.convertDisplayDateTimeFormat24(data.timestamp).replace(",", ""),
              Type: data.type,
              Block:data.block,
              TxFee: (data.fee? data.fee:0) + " "+ nativeTokenName.value,
              ScopedMetadataKey: data.scopedMetadataKey,
              Target: (data.targetId?data.targetId:data.targetIdName) + (data.targetIdName ? " ("+data.targetIdName+")":"")
            })
            break;
          case "Exchange":
            export_Value.push({
              TxHash: data.hash,
              Timestamp: Helper.convertDisplayDateTimeFormat24(data.timestamp).replace(",", ""),
              Type: data.type,
              Block:data.block,
              TxFee: (data.fee? data.fee:0) + " "+ nativeTokenName.value,
              Offer: (displayExchangeOffer(data.exchangeOffers))  
            })
            break;
          case "Lock":
            export_Value.push({
              TxHash: data.hash,
              Timestamp: Helper.convertDisplayDateTimeFormat24(data.timestamp).replace(",", ""),
              Type: data.type,
              Block:data.block,
              TxFee: (data.fee? data.fee:0) + " "+ nativeTokenName.value,
              LockHash:  data.lockHash,
              Duration: data.duration ? data.duration + ' Block' + (data.duration>1?'s':'') : "-",
              Refunded: data.isRefunded ? 'Yes':'No'
            })
            break;
          case "Link":
            export_Value.push({
              TxHash: data.hash,
              Timestamp: Helper.convertDisplayDateTimeFormat24(data.timestamp).replace(",", ""),
              Type: data.type,
              Block:data.block,
              TxFee: (data.fee? data.fee:0) + " "+ nativeTokenName.value,
              RemotePublicKey:  data.remotePublicKey,
              Info: data.action === 'Link'?"Linked":"Unlinked"
            })
            break;
          case "Restriction":
            export_Value.push({
              TxHash: data.hash,
              Timestamp: Helper.convertDisplayDateTimeFormat24(data.timestamp).replace(",", ""),
              Type: data.type,
              Block:data.block,
              TxFee: (data.fee? data.fee:0) + " "+ nativeTokenName.value,
              RestrictionType:  data.restrictionTypeOutput,
              Modification: displayModification(data.modification) 
            })
            break;
          case "Secret":
            export_Value.push({
              TxHash: data.hash,
              Timestamp: Helper.convertDisplayDateTimeFormat24(data.timestamp).replace(",", ""),
              Type: data.type,
              Block:data.block,
              Recipient: data.recipient?Helper.createAddress(data.recipient).pretty():"-",
              TxFee: (data.fee? data.fee:0) + " "+ nativeTokenName.value,
              HashType:  data.hashType,
              Secret: data.secret?data.secret:"-",
              Proof:  data.proof?data.proof:"-",
              SDA:  data.namespaceName ? data.amount + ' ' + data.namespaceName : data.assetId?  data.assetId + ' - ' +  data.amount:"-",
              Info:  data.duration ? "Duration: " + data.duration + ' block' + (data.duration>1?'s':'') : "-"

            })
            break;
          case "Chain":
            export_Value.push({
              TxHash: data.hash,
              Timestamp: Helper.convertDisplayDateTimeFormat24(data.timestamp).replace(",", ""),
              Type: data.type,
              Block:data.block,
              TxFee: (data.fee? data.fee:0) + " "+ nativeTokenName.value,
              Info: (data.applyHeightDelta>0?  "Apply Height Delta: " + data.applyHeightDelta + "  " :"") + (data.newVersion>0?"New Version: " +data.newVersion + "  ":"") + (data.upgradePeriod>0?"Upgrade Period: "+data.upgradePeriod+ "  ":"")
            })
            break;
          default:
            export_Value.push({
              TxHash:data.hash,
              Timestamp:Helper.convertDisplayDateTimeFormat24(data.timestamp).replace(",", ""),
              Type: data.type,
              Block:data.block,
              Signer: Helper.createAddress(data.signerAddress).pretty(),
              Recipient: data.recipient?Helper.createAddress(data.recipient).pretty():"-",
              TxFee: (data.fee? data.fee:0) + " "+ nativeTokenName.value,
              Amount: (data.amountTransfer > 0 ? data.amountTransfer: 0 ) + " "+ nativeTokenName.value,
              SDA:displaySDAs(data.sda)?displaySDAs(data.sda):"-",
              Message: data.message && data.messageType !== 1 ? data.messageTypeTitle + ": " + data.message : "-"
            })
            break;
          }
        })
        let export_Json = JSON.stringify(export_Value);
        return export_Json;
    };

     return {
     downloadCSV
     }
  }
}
</script>
