import {
    MosaicId,
    PageQueryParams,
    RichlistEntry,
    MosaicNames,
} from "tsjs-xpx-chain-sdk";
import { ChainUtils } from "./chainUtils";
import { networkState } from '@/state/networkState';
import { ChainAPICall } from "@/models/REST/chainAPICall";
import { AccountUtils } from "./accountUtil";


export interface AssetObj {
    owner: string,
    height: number,
    assetId: string,
    expiry: number,
    supply: number,
    divisibility: number,
    supplyMutable: boolean,
    transferable: boolean,
    name: string,
    namespaceId : string
}

export class AssetUtils {
    static async getAssetName(assetId: string): Promise<MosaicNames[]> {
        try {
            let chainRESTCall = new ChainAPICall(ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile?.httpPort));

            let mosaicId = new MosaicId(assetId);
            let assetNames = await chainRESTCall.assetAPI.getMosaicsNames([mosaicId]);
            return assetNames;
        } catch (error) {
            console.error(error);
        }
    }

    static async getAssetProperties(assetIdHex: string): Promise<AssetObj> {
        try {
            let assetId = new MosaicId(assetIdHex);
            let assetName :any=[];
            let chainRESTCall = new ChainAPICall(ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile?.httpPort));
            let assetInfo: AssetObj;
            let asset = await chainRESTCall.assetAPI.getMosaic(assetId);
            let assetname = await this.getAssetName(assetIdHex);
            let namespaceInfo: any = [];
            
            if (assetname) {
                assetname.forEach(namespaceId => {
                    namespaceId.names.forEach(namespaceId => {
                        assetName.push(namespaceId.name);
                        namespaceInfo.push(namespaceId);
                    })                    
                });
            } else {
                assetName = null;
            }
            
            assetInfo = {
                owner: asset.owner.address.plain().toString(),
                height: asset.height.compact(),
                assetId: asset.mosaicId.toHex(),
                expiry: asset.duration.compact(),
                supply: asset.supply.compact() / Math.pow(10, asset.divisibility),
                divisibility: asset.divisibility,
                supplyMutable: asset.isSupplyMutable(),
                transferable: asset.isTransferable(),
                name: assetName[0],
                namespaceId: namespaceInfo
            }
            return assetInfo;
        } catch (error) {
            console.error(error);
        }
       
    }
  
    static async getRichList(assetIdHex: string, queryParams?: PageQueryParams): Promise<RichlistEntry[]> {
        try {
            let assetId = new MosaicId(assetIdHex);

            let chainRESTCall = new ChainAPICall(ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile?.httpPort));

            let richListInfo = await chainRESTCall.assetAPI.getMosaicRichlist(assetId, queryParams);

            return richListInfo;
        } catch(error) {
            console.error(error);
        }
    }

    
}