import { AppState } from "@/state/appState";
import {
  Account,
  Address,
  AggregateTransaction,
  PublicAccount,
  MultisigCosignatoryModification,
  MultisigCosignatoryModificationType,
  AccountInfo,
  MultisigAccountInfo,
  Mosaic,
  NamespaceId,
} from "tsjs-xpx-chain-sdk";
import { ChainUtils } from "./chainUtils";
import { TransactionUtils } from '@/models/util/transactionUtils';
import { Helper } from "@/util/typeHelper";

export interface AssetObj {
  id: string;
  name: string;
  balance: string;
}

export class AccountUtils{
  static async getAccountFromAddress (address :string) :Promise<AccountInfo|boolean> {
    try {
      let addressobj = Address.createFromRawAddress(address);
      let account = await ChainUtils.getAccountInfo(addressobj);
      return account;
    } catch(error){
      // console.log(error)
      return false;
    }
  }

  static getAddressFromPublicKey (publicKey: string): string|boolean{
    try{
      let address = PublicAccount.createFromPublicKey(publicKey, AppState.networkType)
      return address.address.plain();
    } catch(error){
      // console.warn(error);
      return false;
    }
  }

  static async getMultisig(strAddress: string) : Promise<MultisigAccountInfo|boolean>{
    try{
      let address = Address.createFromRawAddress(strAddress);
      let multisig = await AppState.chainAPI.accountAPI.getMultisigAccountInfo(address);
      return multisig;
    } catch(error){
      // console.warn(error);
      return false;
    }
  }

  static async formatAccountAsset(assets: Mosaic[]): Promise<AssetObj[]>{
    let formattedAsset:any = [];
    if(assets.length > 0){
      for(let key in assets){
        let objAsset:AssetObj;
        let assetName:string;
        let assetDetails = await AppState.chainAPI.assetAPI.getMosaic(assets[key].id);
        if(!TransactionUtils.isNamespace(assets[key].id)){
          let assetsNames = await TransactionUtils.getAssetsName([assets[key].id]);
          if(assetsNames[0].names.length){
            assetName = assetsNames[0].names[0].name;
          }else{
            assetName = '';
          }
        }else{
          let namespaceId = new NamespaceId(assets[key].id.toDTO().id);
          let nsNames = await TransactionUtils.getNamespacesName([namespaceId]);
          assetName = nsNames[0].name;
          if(!assetName){
            assetName = '';
          }
        }
        objAsset = {
          id: assets[key].id.id.toHex(),
          balance: Helper.convertToCurrency(assets[key].amount.compact(), assetDetails.divisibility),
          name: assetName,
        }
        formattedAsset.push(objAsset);
      }
    }
    return formattedAsset;
  }
}

