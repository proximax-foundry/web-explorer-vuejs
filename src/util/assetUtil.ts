import {
    MosaicId,
    MosaicInfo,
    PageQueryParams,
    RichlistEntry,
    MosaicNames,
} from "tsjs-xpx-chain-sdk";
import { ChainUtils } from "./chainUtils";
import { networkState } from '@/state/networkState';
import { ChainAPICall } from "@/models/REST/chainAPICall";

export class AssetUtils {
   
    static async getAssetProperties(assetIdHex: string): Promise<MosaicInfo | boolean> {
        try {
            let assetId = new MosaicId(assetIdHex);

            let chainRESTCall = new ChainAPICall(ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile?.httpPort));

            let assetInfo = await chainRESTCall.assetAPI.getMosaic(assetId);
            return assetInfo;
        } catch (error) {
            return false;
        }
       
    }
  
    static async getRichList(assetIdHex: string, queryParams?: PageQueryParams): Promise<RichlistEntry[] | boolean> {
        try {
            let assetId = new MosaicId(assetIdHex);

            let chainRESTCall = new ChainAPICall(ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile?.httpPort));

            let richListInfo = await chainRESTCall.assetAPI.getMosaicRichlist(assetId, queryParams);

            return richListInfo;
        } catch(error) {
            return false;
        }
    }

    static async getAssetName(assetId: string): Promise<MosaicNames | boolean> {
        try {
            let chainRESTCall = new ChainAPICall(ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile?.httpPort));

            let mosaicId = new MosaicId(assetId);
            let assetNames = await chainRESTCall.assetAPI.getMosaicsNames([mosaicId]);
            return assetNames[0];
        } catch(error) {
            return false;
        }
    }
}