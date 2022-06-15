import { AppState } from "@/state/appState";
import { Convert, MetadataQueryParams, MetadataType, MosaicId, NamespaceId, PublicAccount, UInt64 } from "tsjs-xpx-chain-sdk";
import isValidUTF8 from 'utf-8-validate';

export interface MetadataObj {
    scopedMetadataKeyUtf8: string;
    scopedMetadataKeyHex: string;
    value: string;
}

export class MetadataUtils {
    static removeDoubleZero(string: string) {
        let isZero = string.endsWith('00')
        if (isZero) {
            string = string.substring(0, string.length - 2);
            string = this.removeDoubleZero(string)
        }
        return string;
    }

    static convertUtf8(scopedMetadataKey: string): string {
        scopedMetadataKey = MetadataUtils.removeDoubleZero(scopedMetadataKey)
        let bytes = Convert.hexToUint8(scopedMetadataKey);
        if (isValidUTF8(bytes)) {
            scopedMetadataKey = Convert.decodeHexToUtf8(scopedMetadataKey)
        }
        return scopedMetadataKey
    }
    
    static async getAccountMetadata(publicKey: string): Promise<MetadataObj[]> {
        try{
            let accountMetadata: MetadataObj;
            let accountMetadataList: any = [];
            let metadataQueryParams = new MetadataQueryParams();
            metadataQueryParams.metadataType = MetadataType.ACCOUNT;
            metadataQueryParams.targetKey = publicKey;
            let fetchMetadata = await AppState.chainAPI.metadataAPI.searchMetadatas(metadataQueryParams);

            fetchMetadata.metadataEntries.forEach(metadataEntry => {
                accountMetadata = {
                    scopedMetadataKeyUtf8: metadataEntry.scopedMetadataKey.toHex() == this.convertUtf8(metadataEntry.scopedMetadataKey.toHex()) ? null : this.convertUtf8(metadataEntry.scopedMetadataKey.toHex()),
                    scopedMetadataKeyHex: metadataEntry.scopedMetadataKey.toHex(),
                    value: metadataEntry.value
                }
                accountMetadataList.push(accountMetadata);
            })
            return accountMetadataList;
        } catch(e) {
            console.error(e);
        }
    }

    static async getAssetMetadata(mosaic: string): Promise<MetadataObj[]> {
        try {
            let assetMetadata: MetadataObj;
            let assetMetadataList: any = [];
            let metadataQueryParams = new MetadataQueryParams();
                metadataQueryParams.metadataType = MetadataType.MOSAIC;
            metadataQueryParams.targetId = new MosaicId(mosaic);
                let fetchMetadata = await AppState.chainAPI.metadataAPI.searchMetadatas(metadataQueryParams);
                fetchMetadata.metadataEntries.forEach(metadataEntry => {
                    assetMetadata = {
                        scopedMetadataKeyUtf8: metadataEntry.scopedMetadataKey.toHex() == this.convertUtf8(metadataEntry.scopedMetadataKey.toHex()) ? null : this.convertUtf8(metadataEntry.scopedMetadataKey.toHex()),
                        scopedMetadataKeyHex: metadataEntry.scopedMetadataKey.toHex(),
                        value: metadataEntry.value
                    }
                    assetMetadataList.push(assetMetadata);
                })
            return assetMetadataList;
        } catch (e) {
            console.error(e);
        }
    }

    static async getNamespaceMetadata(namespaceName: string): Promise<MetadataObj[]> {
        try {
        let namespaceMetadata: MetadataObj;
        let namespaceMetadataList: any = [];
        let metadataQueryParams = new MetadataQueryParams();
            metadataQueryParams.metadataType = MetadataType.NAMESPACE;
            metadataQueryParams.targetId = new NamespaceId(namespaceName);
            let fetchMetadata = await AppState.chainAPI.metadataAPI.searchMetadatas(metadataQueryParams);

            fetchMetadata.metadataEntries.forEach(metadataEntry => {
                namespaceMetadata = {
                    scopedMetadataKeyUtf8: metadataEntry.scopedMetadataKey.toHex() == this.convertUtf8(metadataEntry.scopedMetadataKey.toHex()) ? null : this.convertUtf8(metadataEntry.scopedMetadataKey.toHex()),
                    scopedMetadataKeyHex: metadataEntry.scopedMetadataKey.toHex(),
                    value: metadataEntry.value
                }
                namespaceMetadataList.push(namespaceMetadata);
            })
        
        return namespaceMetadataList;
        } catch (e) {
            console.error(e);
        }
    }
        
}