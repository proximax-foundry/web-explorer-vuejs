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
    static async getAssetName(assetId: string): Promise<MosaicNames> {
        try {
            let chainRESTCall = new ChainAPICall(ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile?.httpPort));

            let mosaicId = new MosaicId(assetId);
            let assetNames = await chainRESTCall.assetAPI.getMosaicsNames([mosaicId]);
            return assetNames[0];
        } catch (error) {
            console.error(error);
        }
    }

    static async getAssetProperties(assetIdHex: string): Promise<AssetObj> {
        try {
            let assetId = new MosaicId(assetIdHex);
            let assetName = null;
            let chainRESTCall = new ChainAPICall(ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile?.httpPort));
            let assetInfo: AssetObj;
            let asset = await chainRESTCall.assetAPI.getMosaic(assetId);
            let assetname = await this.getAssetName(assetIdHex);
            let namespaceId = await AccountUtils.getAccountNamespaces(asset.owner.address.plain().toString());
            let namespaceInfo = null;
            if (!assetname) {
                assetName = null;
            } else if(assetname instanceof MosaicNames){
                if (assetname.names[0] != undefined) {
                    assetName = assetname.names[0].name.toString();
                    if (Array.isArray(namespaceId)) {
                        let getNamespace = namespaceId.find(name => name.name === assetName);
                        namespaceInfo = getNamespace.id;
                    } else {
                        namespaceInfo = null;
                    }
                } else {
                    assetName = null;
                }
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
                name: assetName,
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