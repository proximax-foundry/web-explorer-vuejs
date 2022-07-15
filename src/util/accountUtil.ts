import { computed } from "vue";
import { AppState } from "@/state/appState";
import {
  Account,
  Address,
  AggregateTransaction,
  PublicAccount,
  MultisigCosignatoryModification,
  MultisigCosignatoryModificationType,
  AccountInfo,
  MultisigAccountGraphInfo,
  MultisigAccountInfo,
  Mosaic,
  NamespaceId,
  NamespaceInfo,
  MosaicId,
} from "tsjs-xpx-chain-sdk";
import { ChainUtils } from "./chainUtils";
import { networkState } from '@/state/networkState';
import { ChainProfileConfig } from "@/models/stores/chainProfileConfig";
import { TransactionUtils } from '@/models/util/transactionUtils';
import { Helper } from "@/util/typeHelper";

export interface AssetObj {
  id: string;
  name: [];
  balance: string;
  isActive: boolean;
  isOwner: boolean;
}

export interface NamespaceObj{
  id: string;
  name: string;
  active: boolean;
  type: number;
  linkedId: string;
  depth: number;
  endHeight: number;
  expiringRelativeTime: string;
}

export interface MatchedNamespace{
  name: string;
}

export class AccountUtils {
  static async getAccountFromAddress(address: string): Promise<AccountInfo | boolean> {
    try {
      let addressobj = Address.createFromRawAddress(address);
      let account = await ChainUtils.getAccountInfo(addressobj);
      return account;
    } catch (error) {
      // console.log(error)
      return false;
    }
  }

  static async getAccountNamespaces(address: string): Promise<NamespaceObj[] | boolean> {
    let namespaceObj: NamespaceObj[] = [];
    let month = ['Jan', 'Feb', 'Mac', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    try {
      let chainConfig = new ChainProfileConfig(networkState.chainNetworkName);
      chainConfig.init();
      let blockTargetTime = parseInt(chainConfig.blockGenerationTargetTime);

      let addressobj = Address.createFromRawAddress(address);
      let namespaceInfo = await AppState.chainAPI.namespaceAPI.getNamespacesFromAccount(addressobj);
      let currentBlock = await AppState.chainAPI.chainAPI.getBlockchainHeight();

      for (let i = 0; i < namespaceInfo.length; ++i) {
        let ns: any = {};
        let nsName = await AppState.chainAPI.namespaceAPI.getNamespacesName([namespaceInfo[i].id]);
        ns.name = nsName[0].name;
        ns.active = namespaceInfo[i].active;
        ns.id = namespaceInfo[i].id.toHex();
        ns.type = Number(namespaceInfo[i].alias.type);
        ns.depth = namespaceInfo[i].depth;
        ns.endHeight = namespaceInfo[i].endHeight.compact();

        // calculate expiration
        let remainingBlockHeight = ns.endHeight - currentBlock;
        let timestamp = (Math.floor(Date.now()) + (remainingBlockHeight * blockTargetTime * 1000));
        let date = new Date(timestamp);
        ns.expiringRelativeTime = day[date.getDay()] + ' ' + date.getDate() + ' ' + month[date.getMonth()] + ' ' + date.getFullYear();

        if (ns.type == 1) {
          ns.linkedId = namespaceInfo[i].alias.mosaicId.id.toHex();
        } else if (ns.type == 2) {
          ns.linkedId = namespaceInfo[i].alias.address.pretty();
        } else {
          ns.linkedId = '';
        }
        namespaceObj.push(ns);
      }
      namespaceObj.sort((a, b) => {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
      });
      return namespaceObj;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  static async fetchLinkedAccountNamespace(address: string): Promise<MatchedNamespace[]> {
    let matchedNs: MatchedNamespace[] = [];
    let addressobj = Address.createFromRawAddress(address);
    let namespace = await AppState.chainAPI.accountAPI.getAccountsNames([addressobj]);

    if (namespace.length > 0) {
      namespace.forEach(ns => {
        ns.names.forEach(name => {
          matchedNs.push({
            name: name.name
          });
        })
      })
    }
 
    return matchedNs;
  }

  static getAddressFromPublicKey(publicKey: string): string | boolean {
    try {
      let address = PublicAccount.createFromPublicKey(publicKey, AppState.networkType)
      return address.address.plain();
    } catch (error) {
      console.warn(error);
      return false;
    }
  }

  static async getMultisig(strAddress: string): Promise<MultisigAccountInfo | boolean> {
    try {
      let address = Address.createFromRawAddress(strAddress);
      let multisig = await AppState.chainAPI.accountAPI.getMultisigAccountInfo(address);
      return multisig;
    } catch (error) {
      console.warn(error);
      return false;
    }
  }

  static async formatAccountAsset(assets: Mosaic[], namespace: NamespaceObj[], publicKey: string): Promise<AssetObj[]> {
    let formattedAsset: any = [];
    if (assets.length > 0) {
      let mosaicQueryParams = Helper.createMosaicQueryParams();
      mosaicQueryParams.ownerPubKey = publicKey;
      let mosaicSearch = await AppState.chainAPI.assetAPI.searchMosaics(mosaicQueryParams); //Search 0 balance asset
      let currentBlock = await AppState.chainAPI.chainAPI.getBlockchainHeight();
      let objAsset: AssetObj;
      let assetName: any=[];
      let namespaceId: string;
      let isOwner: boolean = false;
      let isActive: boolean = false;

      let assetDetails;
      for (let key in assets) {
        assetDetails = await AppState.chainAPI.assetAPI.getMosaic(assets[key].id);
        if ((assetDetails.height.compact() + assetDetails.duration.compact()) > currentBlock) {
          isActive = true;
        } else if (assetDetails.height.compact() == 1) {
          isActive = true;
        }

        if (assetDetails.owner.publicKey == publicKey) {
          isOwner = true;
        }

        let assetsNames = await TransactionUtils.getAssetsName([assets[key].id]);
        if (assetsNames[0].names.length) {
          assetName = assetsNames[0].names;
        } else {
          assetName = '';
          namespaceId = '';
        }
        objAsset = {
          id: assets[key].id.id.toHex(),
          balance: Helper.convertToCurrency(assets[key].amount.compact(), assetDetails.divisibility),
          name: assetName,
          isOwner,
          isActive,
        }
        formattedAsset.push(objAsset);  
      }

      let get0balanceAsset = mosaicSearch.mosaicsInfo.filter(id => !assets.find(o => o.id.toHex() == id.mosaicId.id.toHex()));
      
      for (let key in get0balanceAsset) {
        isOwner = true;
        isActive = true;
        let assetsNames = await TransactionUtils.getAssetsName([get0balanceAsset[key].mosaicId]);
        if (assetsNames[0].names.length) {
          assetName = assetsNames[0].names;
        } else {
          assetName = '';
          namespaceId = '';
        }
        objAsset = {
          id: get0balanceAsset[key].mosaicId.toHex(),
          balance: "0",
          name: assetName,
          isOwner,
          isActive,
        }
        formattedAsset.push(objAsset);
      }      
    }
    return formattedAsset;
  }
}

