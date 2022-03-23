import {
    MosaicId,
    PageQueryParams,
    RichlistEntry,
    MosaicNames,
} from "tsjs-xpx-chain-sdk";
import { ChainUtils } from "./chainUtils";
import { networkState } from '@/state/networkState';
import { ChainAPICall } from "@/models/REST/chainAPICall";

export interface AssetObj {
    owner: string,
    height: number,
    assetId: string,
    expiry: number,
    supply: number,
    divisibility: number,
    supplyMutable: boolean,
    transferable: boolean
}

export class AssetUtils {
   
    static async getAssetProperties(assetIdHex: string): Promise<AssetObj | boolean> {
        try {
            let assetId = new MosaicId(assetIdHex);

            let chainRESTCall = new ChainAPICall(ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile?.httpPort));
            let assetInfo: AssetObj;
            let asset = await chainRESTCall.assetAPI.getMosaic(assetId);
            
            assetInfo = {
                owner: asset.owner.address.pretty(),
                height: asset.height.compact(),
                assetId: asset.mosaicId.toHex(),
                expiry: asset.duration.compact(),
                supply: asset.supply.compact(),
                divisibility: asset.divisibility,
                supplyMutable: asset.isSupplyMutable(),
                transferable: asset.isTransferable()
            }
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
            console.log(assetNames);
            return assetNames[0];
        } catch(error) {
            return false;
        }
    }
}