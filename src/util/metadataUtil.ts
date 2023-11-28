import { AppState } from "@/state/appState";
import { Buffer } from "buffer";
import {
  Convert,
  MetadataQueryParams,
  MetadataType,
  MosaicId,
  NamespaceId,
} from "tsjs-xpx-chain-sdk";
import isValidUTF8 from "utf-8-validate";

export interface MetadataObj {
  scopedMetadataKeyUtf8: string | null;
  scopedMetadataKeyHex: string;
  value: string;
}

export class MetadataUtils {
  static removeDoubleZero(string: string) {
    const isZero = string.endsWith("00");
    if (isZero) {
      string = string.substring(0, string.length - 2);
      string = this.removeDoubleZero(string);
    }
    return string;
  }

  static convertUtf8(scopedMetadataKey: string): string {
    scopedMetadataKey = MetadataUtils.removeDoubleZero(scopedMetadataKey);
    const bytes = Convert.hexToUint8(scopedMetadataKey);
    if (isValidUTF8(Buffer.from(bytes))) {
      scopedMetadataKey = Convert.decodeHexToUtf8(scopedMetadataKey);
    }
    return scopedMetadataKey;
  }

  static async getAccountMetadata(publicKey: string): Promise<MetadataObj[]> {
    if (!AppState.chainAPI) {
      throw new Error("Service Unavailable");
    }
    try {
      let accountMetadata: MetadataObj;
      const accountMetadataList: any = [];
      const metadataQueryParams = new MetadataQueryParams();
      metadataQueryParams.metadataType = MetadataType.ACCOUNT;
      metadataQueryParams.targetKey = publicKey;
      const fetchMetadata = await AppState.chainAPI.metadataAPI.searchMetadatas(
        metadataQueryParams
      );

      fetchMetadata.metadataEntries.forEach((metadataEntry) => {
        accountMetadata = {
          scopedMetadataKeyUtf8:
            metadataEntry.scopedMetadataKey.toHex() ==
            this.convertUtf8(metadataEntry.scopedMetadataKey.toHex())
              ? null
              : this.convertUtf8(metadataEntry.scopedMetadataKey.toHex()),
          scopedMetadataKeyHex: metadataEntry.scopedMetadataKey.toHex(),
          value: metadataEntry.value,
        };
        accountMetadataList.push(accountMetadata);
      });
      return accountMetadataList;
    } catch (e) {
      throw e;
    }
  }

  static async getAssetMetadata(mosaic: string): Promise<MetadataObj[]> {
    if (!AppState.chainAPI) {
      throw new Error("Service Unavailable");
    }
    try {
      let assetMetadata: MetadataObj;
      const assetMetadataList: any = [];
      const metadataQueryParams = new MetadataQueryParams();
      metadataQueryParams.metadataType = MetadataType.MOSAIC;
      metadataQueryParams.targetId = new MosaicId(mosaic);
      const fetchMetadata = await AppState.chainAPI.metadataAPI.searchMetadatas(
        metadataQueryParams
      );
      fetchMetadata.metadataEntries.forEach((metadataEntry) => {
        assetMetadata = {
          scopedMetadataKeyUtf8:
            metadataEntry.scopedMetadataKey.toHex() ==
            this.convertUtf8(metadataEntry.scopedMetadataKey.toHex())
              ? null
              : this.convertUtf8(metadataEntry.scopedMetadataKey.toHex()),
          scopedMetadataKeyHex: metadataEntry.scopedMetadataKey.toHex(),
          value: metadataEntry.value,
        };
        assetMetadataList.push(assetMetadata);
      });
      return assetMetadataList;
    } catch (e) {
      throw e;
    }
  }

  static async getNamespaceMetadata(
    namespaceName: string
  ): Promise<MetadataObj[]> {
    if (!AppState.chainAPI) {
      throw new Error("Service Unavailable");
    }
    try {
      let namespaceMetadata: MetadataObj;
      const namespaceMetadataList: any = [];
      const metadataQueryParams = new MetadataQueryParams();
      metadataQueryParams.metadataType = MetadataType.NAMESPACE;
      metadataQueryParams.targetId = new NamespaceId(namespaceName);
      const fetchMetadata = await AppState.chainAPI.metadataAPI.searchMetadatas(
        metadataQueryParams
      );

      fetchMetadata.metadataEntries.forEach((metadataEntry) => {
        namespaceMetadata = {
          scopedMetadataKeyUtf8:
            metadataEntry.scopedMetadataKey.toHex() ==
            this.convertUtf8(metadataEntry.scopedMetadataKey.toHex())
              ? null
              : this.convertUtf8(metadataEntry.scopedMetadataKey.toHex()),
          scopedMetadataKeyHex: metadataEntry.scopedMetadataKey.toHex(),
          value: metadataEntry.value,
        };
        namespaceMetadataList.push(namespaceMetadata);
      });

      return namespaceMetadataList;
    } catch (e) {
      throw e;
    }
  }
}
