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
import { networkState } from '@/state/networkState';
import { ChainProfileConfig } from "@/models/stores/chainProfileConfig";
import { TransactionUtils } from '@/models/util/transactionUtils';
import { Helper } from "@/util/typeHelper";
import { NamespaceUtils, namespaceInfoFormatted } from "@/util/namespaceUtil";
import { AccountUtils } from "@/util/accountUtil";
import { AssetUtils } from '@/util/assetUtil';
import { BlockUtils } from "@/util/blockUtil"

export interface searchResult{
  valid: boolean;
  searchType: string;
  param: string;  // 'PublicKeyOrHash', 'AssetOrNamespace', 'Address', 'Block'
}

const regexNumeric = /^[0-9]+$/;

export class SearchService{
  searchString:string;
  filter:string;

  async search (_searchString:string, _filter:string) :Promise<searchResult> {
    this.searchString = _searchString.trim();
    this.filter = _filter;
    try {
      switch(this.filter) {
        case 'all':
          if(this.searchString.length == 64){ // Public key or Txn hash
            // verify if it is txn hash
            let transactionSearch = await this.searchTxn();
            if(transactionSearch.valid){
              return transactionSearch;
            }else{
              return this.searchPublicKey('PublicKeyOrHash');
            }
          }else if(this.searchString.length == 40 || this.searchString.length == 46){ // address
            return this.searchAddress();
          }else if(this.searchString.length == 16){ // asset and namespace
            // search asset
            if(NamespaceUtils.isNamespace(this.searchString)){
              return this.searchNamespace();
            }else{
              return this.searchAsset();
            }
          }else if(regexNumeric.test(this.searchString)){ // block
            return this.searchBlock();
          }else{
            // search alias
            return this.searchAlias();
          }
        case 'tx':
          if(this.searchString.length == 64){
            return this.searchTxn();
          }else{
            return {
              valid: false,
              searchType: 'Hash',
              param: this.searchString,
            };
          }
        case 'block':
          if(regexNumeric.test(this.searchString)){ // block
            return this.searchBlock();
            // return {
            //   valid: true,
            //   searchType: 'Block',
            //   param: this.searchString,
            // };
          }else{
            return {
              valid: false,
              searchType: 'Block',
              param: this.searchString,
            };
          }
        case 'assetID':
          if(this.searchString.length == 16){
            return this.searchAsset();
          }else{
            return this.searchAssetAlias();
          }
        case 'namespaceID':
          if(this.searchString.length == 16){
            return this.searchNamespace();
          }else{
            return this.searchAlias();
          }
        case 'address':
          if(this.searchString.length == 40 || this.searchString.length == 46){
            return this.searchAddress();
          }else{
            return {
              valid: false,
              searchType: 'Address',
              param: this.searchString,
            };
          }
        case 'publicKey':
          if(this.searchString.length == 64){
            return this.searchPublicKey('PublicKey');
          }else{
            return {
              valid: false,
              searchType: 'PublicKey',
              param: this.searchString,
            };
          }
      }
    } catch(error){
      return {
        valid: false,
        searchType: 'all',
        param: this.searchString,
      };
    }
  }

  async searchAsset():Promise<searchResult>{
    let asset = await AssetUtils.getAssetProperties(this.searchString);
    if(asset != false){
      return {
        valid: true,
        searchType: 'Asset',
        param: this.searchString,
      };
    }else{
      return {
        valid: false,
        searchType: 'Asset',
        param: this.searchString,
      };
    }
  }

  async searchPublicKey(invalidLabel:string ):Promise<searchResult>{
    let address:string|boolean = AccountUtils.getAddressFromPublicKey(this.searchString);
    if(address != false){
      let addressStr = address.toString();
      let account = await AccountUtils.getAccountFromAddress(addressStr);
      if(account != false){
        return {
          valid: true,
          searchType: 'PublicKey',
          param: this.searchString,
        };
      }else{
        return {
          valid: false,
          searchType: invalidLabel,
          param: this.searchString,
        };
      }
    }else{
      return {
        valid: false,
        searchType: invalidLabel,
        param: this.searchString,
      };
    }
  }

  async searchAddress():Promise<searchResult>{
    let account = await AccountUtils.getAccountFromAddress(this.searchString);
    if(account != false){
      return {
        valid: true,
        searchType: 'Address',
        param: this.searchString,
      };
    }else{
      return {
        valid: false,
        searchType: 'Address',
        param: this.searchString,
      };
    }
  }

  async searchTxn():Promise<searchResult>{
    let transaction = await TransactionUtils.getTransaction(this.searchString);
    if(transaction.isFound === true){
      return {
        valid: true,
        searchType: 'Hash',
        param: this.searchString,
      };
    }else{
      return {
        valid: false,
        searchType: 'Hash',
        param: this.searchString,
      };
    }
  }

  async searchAlias():Promise<searchResult>{
    let ns = new NamespaceId(this.searchString.toLowerCase());
    let formattedNs:namespaceInfoFormatted|boolean = await NamespaceUtils.fetchNamespaceInfo(ns.toHex());
    if(typeof formattedNs === 'boolean'){
      let namespace = await NamespaceUtils.fetchNamespaceInfo(ns.toHex());
      if(namespace != false){
        return {
          valid: true,
          searchType: 'Namespace',
          param: ns.toHex(),
        };
      }else{
        return {
          valid: false,
          searchType: 'Namespace',
          param: this.searchString,
        };
      }
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
          param: ns.toHex(),
        };
      }
    }
  }

  async searchNamespace():Promise<searchResult>{
    let namespace = await NamespaceUtils.fetchNamespaceInfo(this.searchString);
    if(namespace != false){
      return {
        valid: true,
        searchType: 'Namespace',
        param: this.searchString,
      };
    }else{
      return {
        valid: false,
        searchType: 'Namespace',
        param: this.searchString,
      };
    }
  }

  async searchAssetAlias(){
    let ns = new NamespaceId(this.searchString.toLowerCase());
    let formattedNs:namespaceInfoFormatted|boolean = await NamespaceUtils.fetchNamespaceInfo(ns.toHex());
    if(typeof formattedNs === 'boolean'){
      return {
        valid: false,
        searchType: 'Asset',
        param: this.searchString,
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

  async searchBlock(){
    const block = await BlockUtils.getBlockByHeight(parseInt(this.searchString));
    if(block != false){
      return {
        valid: true,
        searchType: 'Block',
        param: this.searchString,
      };
    }else{
      return {
        valid: false,
        searchType: 'Block',
        param: this.searchString,
      };
    }
  }
}

