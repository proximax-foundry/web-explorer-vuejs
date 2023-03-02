import {
  MosaicId,
  PageQueryParams,
  RichlistEntry,
  MosaicNames,
  NamespaceName,
} from "tsjs-xpx-chain-sdk";
import { ChainUtils } from "./chainUtils";
import { networkState } from "@/state/networkState";
import { ChainAPICall } from "@/models/REST/chainAPICall";

export interface AssetObj {
  owner: string;
  height: number;
  assetId: string;
  expiry: number | undefined;
  supply: number;
  divisibility: number;
  supplyMutable: boolean;
  transferable: boolean;
  name: string;
  namespaceId: NamespaceName[];
}

export class AssetUtils {
  static async getAssetName(assetId: string): Promise<MosaicNames[]> {
    try {
      const chainRESTCall = new ChainAPICall(
        ChainUtils.buildAPIEndpoint(
          networkState.selectedAPIEndpoint,
          networkState.currentNetworkProfile?.httpPort
        )
      );

      const mosaicId = new MosaicId(assetId);
      const assetNames = await chainRESTCall.assetAPI.getMosaicsNames([
        mosaicId,
      ]);
      return assetNames;
    } catch (error) {
      throw error;
    }
  }

  static async getAssetProperties(assetIdHex: string): Promise<AssetObj> {
    try {
      const assetId = new MosaicId(assetIdHex);
      let assetName: any = [];
      const chainRESTCall = new ChainAPICall(
        ChainUtils.buildAPIEndpoint(
          networkState.selectedAPIEndpoint,
          networkState.currentNetworkProfile?.httpPort
        )
      );
      const asset = await chainRESTCall.assetAPI.getMosaic(assetId);
      const assetname = await this.getAssetName(assetIdHex);
      const namespaceInfo: NamespaceName[] = [];

      if (assetname) {
        assetname.forEach((namespaceId) => {
          namespaceId.names.forEach((namespaceId) => {
            assetName.push(namespaceId.name);
            namespaceInfo.push(namespaceId);
          });
        });
      } else {
        assetName = null;
      }

      const assetInfo: AssetObj = {
        owner: asset.owner.address.plain().toString(),
        height: asset.height.compact(),
        assetId: asset.mosaicId.toHex(),
        expiry: asset.duration?.compact(),
        supply: asset.supply.compact() / Math.pow(10, asset.divisibility),
        divisibility: asset.divisibility,
        supplyMutable: asset.isSupplyMutable(),
        transferable: asset.isTransferable(),
        name: assetName[0],
        namespaceId: namespaceInfo,
      };
      return assetInfo;
    } catch (error) {
      throw error;
    }
  }

  static async getRichList(
    assetIdHex: string,
    queryParams?: PageQueryParams
  ): Promise<RichlistEntry[]> {
    try {
      const assetId = new MosaicId(assetIdHex);

      const chainRESTCall = new ChainAPICall(
        ChainUtils.buildAPIEndpoint(
          networkState.selectedAPIEndpoint,
          networkState.currentNetworkProfile?.httpPort
        )
      );

      const richListInfo = await chainRESTCall.assetAPI.getMosaicRichlist(
        assetId,
        queryParams
      );

      return richListInfo;
    } catch (error) {
      throw error;
    }
  }
}
