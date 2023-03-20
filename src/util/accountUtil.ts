import { AppState } from "@/state/appState";
import {
  Address,
  PublicAccount,
  AccountInfo,
  MultisigAccountInfo,
  Mosaic,
  MosaicCreatorFilters,
} from "tsjs-xpx-chain-sdk";
import { ChainUtils } from "./chainUtils";
import { networkState } from "@/state/networkState";
import { ChainProfileConfig } from "@/models/stores/chainProfileConfig";
import { TransactionUtils } from "@/util/transactionUtils";
import { Helper } from "@//util/typeHelper";

export interface AssetObj {
  id: string;
  name: any[] | "";
  balance: string;
  isActive: boolean;
  isOwner: boolean;
}

export interface NamespaceObj {
  id: string;
  name: string;
  active: boolean;
  type: number;
  linkedId: string;
  depth: number;
  endHeight: number;
  expiringRelativeTime: string;
}

export interface MatchedNamespace {
  name: string;
}

export class AccountUtils {
  static async getAccountFromAddress(
    address: string
  ): Promise<AccountInfo | false> {
    try {
      const addressobj = Address.createFromRawAddress(address);
      const account = await ChainUtils.getAccountInfo(addressobj);
      return account;
    } catch (error) {
      // console.log(error)
      return false;
    }
  }

  static async getAccountNamespaces(
    address: string
  ): Promise<NamespaceObj[] | false> {
    if (!AppState.chainAPI) {
      throw new Error("Service Unavailable");
    }
    const namespaceObj: NamespaceObj[] = [];
    const month = [
      "Jan",
      "Feb",
      "Mac",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    try {
      const chainConfig = new ChainProfileConfig(networkState.chainNetworkName);
      chainConfig.init();
      const blockTargetTime = parseInt(chainConfig.blockGenerationTargetTime);

      const addressobj = Address.createFromRawAddress(address);
      const namespaceInfo =
        await AppState.chainAPI.namespaceAPI.getNamespacesFromAccount(
          addressobj
        );
      const currentBlock =
        await AppState.chainAPI.chainAPI.getBlockchainHeight();

      for (let i = 0; i < namespaceInfo.length; ++i) {
        const ns: NamespaceObj = {
          id: "",
          name: "",
          active: false,
          type: 0,
          linkedId: "",
          depth: 0,
          endHeight: 0,
          expiringRelativeTime: "",
        };
        const nsName = await AppState.chainAPI.namespaceAPI.getNamespacesName([
          namespaceInfo[i].id,
        ]);
        ns.name = nsName[0].name;
        ns.active = namespaceInfo[i].active;
        ns.id = namespaceInfo[i].id.toHex();
        ns.type = Number(namespaceInfo[i].alias.type);
        ns.depth = namespaceInfo[i].depth;
        ns.endHeight = namespaceInfo[i].endHeight.compact();

        // calculate expiration
        const remainingBlockHeight = ns.endHeight - currentBlock;
        const timestamp =
          Math.floor(Date.now()) +
          remainingBlockHeight * blockTargetTime * 1000;
        const date = new Date(timestamp);
        ns.expiringRelativeTime =
          day[date.getDay()] +
          " " +
          date.getDate() +
          " " +
          month[date.getMonth()] +
          " " +
          date.getFullYear();

        if (ns.type == 1) {
          const mosaicId = namespaceInfo[i].alias.mosaicId;
          ns.linkedId = mosaicId ? mosaicId.id.toHex() : "";
        } else if (ns.type == 2) {
          const address = namespaceInfo[i].alias.address;
          ns.linkedId = address ? address.pretty() : "";
        } else {
          ns.linkedId = "";
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
      return false;
    }
  }

  static async fetchLinkedAccountNamespace(
    address: string
  ): Promise<MatchedNamespace[]> {
    if (!AppState.chainAPI) {
      throw new Error("Service Unavailable");
    }
    const matchedNs: MatchedNamespace[] = [];
    const addressobj = Address.createFromRawAddress(address);
    const namespace = await AppState.chainAPI.accountAPI.getAccountsNames([
      addressobj,
    ]);

    if (namespace.length > 0) {
      namespace.forEach((ns) => {
        ns.names.forEach((name) => {
          matchedNs.push({
            name: name.name,
          });
        });
      });
    }

    return matchedNs;
  }

  static getAddressFromPublicKey(publicKey: string): string | false {
    try {
      const address = PublicAccount.createFromPublicKey(
        publicKey,
        AppState.networkType
      );
      return address.address.plain();
    } catch (error) {
      console.warn(error);
      return false;
    }
  }

  static async getMultisig(
    strAddress: string
  ): Promise<MultisigAccountInfo | false> {
    if (!AppState.chainAPI) {
      return false;
    }
    try {
      const address = Address.createFromRawAddress(strAddress);
      const multisig =
        await AppState.chainAPI.accountAPI.getMultisigAccountInfo(address);
      return multisig;
    } catch (error) {
      return false;
    }
  }

  static async formatAccountAsset(assets: Mosaic[],publicKey: string): Promise<AssetObj[]> {
    if(!AppState.chainAPI){
      throw new Error("Service unavailable")
    }
    let formattedAsset: any = [];
    if (assets.length > 0) {
      let mosaicQueryParams = Helper.createMosaicQueryParams();
      let mosaicCreatorFilters = new MosaicCreatorFilters(publicKey);
      mosaicCreatorFilters.holding = false;
      mosaicQueryParams.ownerFilters = mosaicCreatorFilters;
      let currentBlock = await AppState.chainAPI.chainAPI.getBlockchainHeight();
      let objAsset: AssetObj;
      let assetName: any=[];
      let isOwner: boolean = false;
      let isActive: boolean = false;
      let assetsHex = assets.map(x => x.id.toHex());

      let assetsDetails = await AppState.chainAPI.assetAPI.getMosaics(assets.map(x => x.id));
      let assetsNames = await TransactionUtils.getAssetsName(assets.map(x => x.id));

      for (let key in assets) {
        let assetDetails = assetsDetails.find(x => x.mosaicId.toHex() === assetsHex[key])
        if(!assetDetails){
          throw new Error("Service unavailable")
        }
        if(!assetDetails.duration){
          isActive = true
        }
        else if ((assetDetails.height.compact() + assetDetails.duration.compact()) > currentBlock) {
          isActive = true;
        } else if (assetDetails.height.compact() == 1) {
          isActive = true;
        }

        if (assetDetails.owner.publicKey == publicKey) {
          isOwner = true;
        }

        let assetNames = assetsNames[key];
        if (assetNames.names.length) {
          assetName = assetNames.names;
        } else {
          assetName = '';
        }
        const assetIdHex = assetDetails.mosaicId.toHex();
        objAsset = {
          id: assetIdHex,
          balance: Helper.convertToCurrency(assets[key].amount.compact(), assetDetails.divisibility),
          name: assetName,
          isOwner,
          isActive,
        }
        formattedAsset.push(objAsset);  
      }

      // let get0balanceAsset = mosaicSearch.mosaicsInfo.filter(id => !assets.find(o => o.id.toHex() == id.mosaicId.id.toHex()));
      
      // for (let key in get0balanceAsset) {
      //   isOwner = true;
      //   isActive = true;
      //   let assetsNames = await TransactionUtils.getAssetsName([get0balanceAsset[key].mosaicId]);
      //   if (assetsNames[0].names.length) {
      //     assetName = assetsNames[0].names;
      //   } else {
      //     assetName = '';
      //     namespaceId = '';
      //   }
      //   objAsset = {
      //     id: get0balanceAsset[key].mosaicId.toHex(),
      //     balance: "0",
      //     name: assetName,
      //     isOwner,
      //     isActive,
      //   }
      //   formattedAsset.push(objAsset);
      // }      
    }
    return formattedAsset;
  }
}
