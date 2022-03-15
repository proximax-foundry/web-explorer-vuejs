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
  NamespaceInfo,
} from "tsjs-xpx-chain-sdk";
import { ChainUtils } from "./chainUtils";
import { TransactionUtils } from '@/models/util/transactionUtils';
import { Helper } from "@/util/typeHelper";
import { pushScopeId } from "vue";

export interface AssetObj {
  id: string;
  name: string;
  balance: string;
}

export interface NamespaceObj{
  id: string;
  name: string;
  active: boolean;
  type: number;
  linkedId: string;
  depth: number;
}

export interface MatchedNamespace{
  id: string;
  name: string;
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

  static async getAccountNamespaces(address:string): Promise<NamespaceObj[]|boolean>{
    let namespaceObj:NamespaceObj[] = [];
    try {
      let addressobj = Address.createFromRawAddress(address);
      let namespaceInfo = await AppState.chainAPI.namespaceAPI.getNamespacesFromAccount(addressobj);
      for(let i = 0; i < namespaceInfo.length; ++i){
        let ns:any = {};  
        let nsName = await AppState.chainAPI.namespaceAPI.getNamespacesName([namespaceInfo[i].id]);
        ns.name = nsName[0].name;
        ns.active = namespaceInfo[i].active;
        ns.id = namespaceInfo[i].id.toHex();
        ns.type = Number(namespaceInfo[i].alias.type);
        ns.depth = namespaceInfo[i].depth;
        if(ns.type == 1){
          ns.linkedId = namespaceInfo[i].id.toHex();
        }else if(ns.type == 2){
          ns.linkedId = namespaceInfo[i].alias.address.pretty();
        }else{
          ns.linkedId = '';
        }
        namespaceObj.push(ns);
      }
      namespaceObj.sort((a, b) => {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
          return 0;
      });
      // namespaceObj .sort((a, b) => {
      //   if (a.depth > b.depth) return 1;
      //   if (a.depth < b.depth) return -1;
      //     return 0;
      // });
      return namespaceObj;
    } catch(error){
      return false;
    }
  }

  static fetchLinkedAccountNamespace(namespace:NamespaceObj[], address:string):MatchedNamespace[]{
    let matchedNs: MatchedNamespace[] = [];
    if(namespace.length > 0){
      namespace.forEach(ns => {
        if(ns.type == 2){ // match linked address type
          if(ns.linkedId == address){
            matchedNs.push({
              name: ns.name,
              id: ns.id
            });
          }
        }
      });
    }
    return matchedNs;
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

