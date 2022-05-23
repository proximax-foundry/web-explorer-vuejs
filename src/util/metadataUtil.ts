import { AppState } from "@/state/appState";
import { Convert, MetadataQueryParams, MetadataType, MosaicId, NamespaceId, PublicAccount } from "tsjs-xpx-chain-sdk";

export interface MetadataObj {
    scopedMetadataKeyUtf8: string;
    scopedMetadataKeyHex: string;
    name: string,
    id: string;
    value: string;
}

export class MetadataUtils {

    static isASCII(string: string){
        return /^[\x00-\x7F]*$/.test(string);
    }

    static removeDoubleZero(string: string){
        let isZero = string.endsWith('00')
        if (isZero) {
            string = string.substring(0, string.length - 2);
            string = this.removeDoubleZero(string)
        }
        return string;
    }

    static convertUtf8 (scopedMetadataKey: string):string{
        scopedMetadataKey = this.removeDoubleZero(scopedMetadataKey);
        let utf8 = Convert.decodeHexToUtf8(scopedMetadataKey);
            
        if (this.isASCII(utf8)) {
            scopedMetadataKey = utf8;
        }
        return scopedMetadataKey;
    }
    
    static async getAccountMetadata(publicKey: string): Promise<MetadataObj[]> {
        let accountMetadata: MetadataObj;
        let accountMetadataList: any = [];
        let metadataQueryParams = new MetadataQueryParams();
        metadataQueryParams.metadataType = MetadataType.ACCOUNT;
        metadataQueryParams.targetKey = PublicAccount.createFromPublicKey(publicKey, AppState.networkType);
        let fetchMetadata = await AppState.chainAPI.metadataAPI.searchMetadatas(metadataQueryParams);
        fetchMetadata.metadataEntries.forEach(metadataEntry => {            
            accountMetadata = {
                scopedMetadataKeyUtf8: metadataEntry.scopedMetadataKey.toHex() == this.convertUtf8(metadataEntry.scopedMetadataKey.toHex()) ? null : this.convertUtf8(metadataEntry.scopedMetadataKey.toHex()),
                scopedMetadataKeyHex: metadataEntry.scopedMetadataKey.toHex(),
                name: "",
                id: "-",
                value: metadataEntry.value
            }
            accountMetadataList.push(accountMetadata);
        })

        return accountMetadataList;
    }

    static async getAssetMetadata(mosaic: any = []): Promise<MetadataObj[]> {
        console.log(mosaic);
        let assetMetadata: MetadataObj;
        let assetMetadataList: any = [];
        let metadataQueryParams = new MetadataQueryParams();
        mosaic.forEach(async (mosaicId) => {
            console.log(mosaicId.id);
            metadataQueryParams.metadataType = MetadataType.MOSAIC;
            metadataQueryParams.targetId = new MosaicId(mosaicId.id);
            let fetchMetadata = await AppState.chainAPI.metadataAPI.searchMetadatas(metadataQueryParams);
            console.log(fetchMetadata);
            fetchMetadata.metadataEntries.forEach(metadataEntry => {
                console.log(metadataEntry.targetId);
                assetMetadata = {
                    scopedMetadataKeyUtf8: metadataEntry.scopedMetadataKey.toHex() == this.convertUtf8(metadataEntry.scopedMetadataKey.toHex()) ? null : this.convertUtf8(metadataEntry.scopedMetadataKey.toHex()),
                    scopedMetadataKeyHex: metadataEntry.scopedMetadataKey.toHex(),
                    name: "",
                    id: mosaicId.id,
                    value: metadataEntry.value
                }
                assetMetadataList.push(assetMetadata);
            })
        })
        return assetMetadataList;
    }

    static async getNamespaceMetadata(namespaceId: string): Promise<MetadataObj[]> {
        let namespaceMetadata: MetadataObj;
        let namespaceMetadataList: any = [];
        let metadataQueryParams = new MetadataQueryParams();
        metadataQueryParams.metadataType = MetadataType.NAMESPACE;
        metadataQueryParams.targetId = new NamespaceId(namespaceId);
        let fetchMetadata = await AppState.chainAPI.metadataAPI.searchMetadatas(metadataQueryParams);
        fetchMetadata.metadataEntries.forEach(metadataEntry => {
            namespaceMetadata = {
                scopedMetadataKeyUtf8: metadataEntry.scopedMetadataKey.toHex() == this.convertUtf8(metadataEntry.scopedMetadataKey.toHex()) ? null : this.convertUtf8(metadataEntry.scopedMetadataKey.toHex()),
                scopedMetadataKeyHex: metadataEntry.scopedMetadataKey.toHex(),
                name: "",
                id: namespaceId,
                value: metadataEntry.value
            }
            namespaceMetadataList.push(namespaceMetadata);
        })
        return namespaceMetadataList;
    }
}