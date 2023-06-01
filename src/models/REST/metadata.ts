import { firstValueFrom } from "rxjs";
import {
  MetadataHttp,
  NetworkHttp,
  MetadataQueryParams,
  MetadataEntry,
  MetadataSearch,
} from "tsjs-xpx-chain-sdk";

export class MetadataAPI {
  metadataHttp: MetadataHttp;

  constructor(endpoint: string, networkHttp?: NetworkHttp) {
    this.metadataHttp = new MetadataHttp(endpoint, networkHttp);
  }

  /**
   * Get the Metadata for a given compositeHash
   * @param compositeHash - compositeHash for Account/mosaic/namespace
   *
   */
  getMetadata(compositeHash: string): Promise<MetadataEntry> {
    return firstValueFrom(this.metadataHttp.getMetadata(compositeHash));
  }

  getMetadatas(compositeHashes: string[]): Promise<MetadataEntry[]> {
    return firstValueFrom(this.metadataHttp.getMetadatas(compositeHashes));
  }

  searchMetadatas(
    metadataQueryParams: MetadataQueryParams
  ): Promise<MetadataSearch> {
    return firstValueFrom(this.metadataHttp.searchMetadata(metadataQueryParams));
  }
}
