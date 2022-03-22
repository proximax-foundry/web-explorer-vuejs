import { computed } from "vue";
import { AppState } from "@/state/appState";
import {
  Account,
  Address,
  PublicAccount,
  AccountInfo,
  Mosaic,
  NamespaceId,
  NamespaceInfo,
} from "tsjs-xpx-chain-sdk";
import { ChainUtils } from "./chainUtils";
import { networkState } from '@/state/networkState';
import { ChainProfileConfig } from "@/models/stores/chainProfileConfig";
import { TransactionUtils } from '@/models/util/transactionUtils';
import { Helper } from "@/util/typeHelper";
import { NamespaceUtils, namespaceInfoFormatted } from "@/util/namespaceUtil";
import { AccountUtils } from "@/util/accountUtil";
import { AssetUtils } from '@/util/assetUtil';
import { typeOf } from "mathjs";

export interface searchResult{
  valid: boolean;
  searchType: string;
  param: string;  // 'PublicKeyOrHash', 'AssetOrNamespace', 'Address', 'Block'
}

export class SearchUtils{
  static async search (searchString:string, filter:string) :Promise<searchResult> {
    try {
      switch(filter) {
        case 'all':
          if(searchString.length == 64){ // Public key or Txn hash
            // verify if it is txn hash
            let transaction = await TransactionUtils.getTransaction(searchString);
            if(transaction.isFound === true){
              return {
                valid: true,
                searchType: 'Hash',
                param: searchString,
              };
            }else{
              // verify Public Key
              let address:string|boolean = AccountUtils.getAddressFromPublicKey(searchString);
              if(address != false){
                let addressStr = address.toString();
                let account = await AccountUtils.getAccountFromAddress(addressStr);
                if(account != false){
                  return {
                    valid: true,
                    searchType: 'PublicKey',
                    param: searchString,
                  };
                }else{
                  return {
                    valid: false,
                    searchType: 'PublicKeyOrHash',
                    param: searchString,
                  };
                }
              }else{
                return {
                  valid: false,
                  searchType: 'PublicKeyOrHash',
                  param: searchString,
                };
              }
            }
          }else if(searchString.length == 40 || searchString.length == 46){ // address
            let account = await AccountUtils.getAccountFromAddress(searchString);
            if(account != false){
              return {
                valid: true,
                searchType: 'Address',
                param: searchString,
              };
            }else{
              return {
                valid: false,
                searchType: 'Address',
                param: searchString,
              };
            }
          }else if(searchString.length == 16){ // asset and namespace
            // search asset
            if(NamespaceUtils.isNamespace(searchString)){
              let namespace = await NamespaceUtils.fetchNamespaceInfo(searchString);
              if(namespace != false){
                return {
                  valid: true,
                  searchType: 'Namespace',
                  param: searchString,
                };
              }else{
                return {
                  valid: false,
                  searchType: 'Namespace',
                  param: searchString,
                };
              }
            }else{
              let asset = await AssetUtils.getAssetProperties(searchString);
              if(asset != false){
                return {
                  valid: true,
                  searchType: 'Asset',
                  param: searchString,
                };
              }else{
                return {
                  valid: false,
                  searchType: 'Asset',
                  param: searchString,
                };
              }
            }
          }else if(!isNaN(parseInt(searchString))){ // block
            return {
              valid: true,
              searchType: 'Block',
              param: searchString,
            };
          }else{
            // search alias
            let ns = new NamespaceId(searchString.toLowerCase());
            let formattedNs:namespaceInfoFormatted|boolean = await NamespaceUtils.fetchNamespaceInfo(ns.toHex());
            if(typeof formattedNs === 'boolean'){
              return {
                valid: false,
                searchType: 'Namespace',
                param: searchString,
              };
            }else{
              if(formattedNs.alias.type == 2){
                return {
                  valid: true,
                  searchType: 'Address',
                  param: formattedNs.alias.id,
                };
              }else if(formattedNs.alias.type == 1){
                return {
                  valid: true,
                  searchType: 'Asset',
                  param: formattedNs.alias.id,
                };
              }else{
                return {
                  valid: true,
                  searchType: 'Namespace',
                  param: searchString,
                };
              }
            }
          }
        case 'tx':
          if(searchString.length == 64){
            let transaction = await TransactionUtils.getTransaction(searchString);
            if(transaction.isFound === true){
              return {
                valid: true,
                searchType: 'Hash',
                param: searchString,
              };
            }else{
              return {
                valid: false,
                searchType: 'Hash',
                param: searchString,
              };
            }
          }else{
            return {
              valid: false,
              searchType: 'Hash',
              param: searchString,
            };
          }
        case 'block':
          if(!isNaN(parseInt(searchString))){ // block
            return {
              valid: true,
              searchType: 'Block',
              param: searchString,
            };
          }else{
            return {
              valid: false,
              searchType: 'Block',
              param: searchString,
            };
          }
        case 'assetID':
          if(searchString.length == 16){
            let asset = await AssetUtils.getAssetProperties(searchString);
            if(asset != false){
              return {
                valid: true,
                searchType: 'Asset',
                param: searchString,
              };
            }else{
              return {
                valid: false,
                searchType: 'Asset',
                param: searchString,
              };
            }
          }else{
            let ns = new NamespaceId(searchString.toLowerCase());
            let formattedNs:namespaceInfoFormatted|boolean = await NamespaceUtils.fetchNamespaceInfo(ns.toHex());
            if(typeof formattedNs === 'boolean'){
              return {
                valid: false,
                searchType: 'Asset',
                param: searchString,
              };
            }else{
              if(formattedNs.alias.type == 1){
                return {
                  valid: true,
                  searchType: 'Asset',
                  param: formattedNs.alias.id,
                };
              }
            }
          }
        case 'namespaceID':
          if(searchString.length == 16){
            let namespace = await NamespaceUtils.fetchNamespaceInfo(searchString);
            if(namespace != false){
              return {
                valid: true,
                searchType: 'Namespace',
                param: searchString,
              };
            }else{
              return {
                valid: false,
                searchType: 'Namespace',
                param: searchString,
              };
            }
          }else{
            let ns = new NamespaceId(searchString.toLowerCase());
            let formattedNs:namespaceInfoFormatted|boolean = await NamespaceUtils.fetchNamespaceInfo(ns.toHex());
            if(typeof formattedNs === 'boolean'){
              return {
                valid: false,
                searchType: 'Namespace',
                param: searchString,
              };
            }else{
              if(formattedNs.alias.type == 2){
                return {
                  valid: true,
                  searchType: 'Address',
                  param: formattedNs.alias.id,
                };
              }else if(formattedNs.alias.type == 1){
                return {
                  valid: true,
                  searchType: 'Asset',
                  param: formattedNs.alias.id,
                };
              }else{
                return {
                  valid: true,
                  searchType: 'Namespace',
                  param: searchString,
                };
              }
            }
          }
        case 'address':
          if(searchString.length == 40 || searchString.length == 46){
            let account = await AccountUtils.getAccountFromAddress(searchString);
            if(account != false){
              return {
                valid: true,
                searchType: 'Address',
                param: searchString,
              };
            }else{
              return {
                valid: false,
                searchType: 'Address',
                param: searchString,
              };
            }
          }else{
            return {
              valid: false,
              searchType: 'Address',
              param: searchString,
            };
          }
        case 'publicKey':
          if(searchString.length == 64){
            let address:string|boolean = AccountUtils.getAddressFromPublicKey(searchString);
            if(address != false){
              let addressStr = address.toString();
              let account = await AccountUtils.getAccountFromAddress(addressStr);
              if(account != false){
                return {
                  valid: true,
                  searchType: 'PublicKey',
                  param: searchString,
                };
              }else{
                return {
                  valid: false,
                  searchType: 'PublicKey',
                  param: searchString,
                };
              }
            }else{
              return {
                valid: false,
                searchType: 'PublicKey',
                param: searchString,
              };
            }
          }else{
            return {
              valid: false,
              searchType: 'PublicKey',
              param: searchString,
            };
          }
      }
    } catch(error){
      return {
        valid: false,
        searchType: 'all',
        param: searchString,
      };
    }
  }
}

