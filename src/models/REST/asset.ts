import { lastValueFrom } from "rxjs";
import {
  MosaicHttp,
  NetworkHttp,
  MosaicId,
  MosaicInfo,
  MosaicNames,
  RichlistEntry,
  PageQueryParams,
  MosaicLevy,
  MosaicQueryParams,
  MosaicSearch,
} from "tsjs-xpx-chain-sdk";

export class AssetAPI {
  mosaicHttp: MosaicHttp;

  constructor(endpoint: string, networkHttp?: NetworkHttp) {
    this.mosaicHttp = new MosaicHttp(endpoint, networkHttp);
  }

  getMosaic(mosaicId: MosaicId): Promise<MosaicInfo> {
    return lastValueFrom(this.mosaicHttp.getMosaic(mosaicId));
  }

  getMosaicRichlist(
    mosaicId: MosaicId,
    queryParams?: PageQueryParams
  ): Promise<RichlistEntry[]> {
    return lastValueFrom(this.mosaicHttp.getMosaicRichlist(mosaicId, queryParams));
  }

  getMosaics(mosaicIds: MosaicId[]): Promise<MosaicInfo[]> {
    return lastValueFrom(this.mosaicHttp.getMosaics(mosaicIds));
  }

  getMosaicsNames(mosaicIds: MosaicId[]): Promise<MosaicNames[]> {
    return lastValueFrom(this.mosaicHttp.getMosaicsNames(mosaicIds));
  }

  getMosaicLevy(mosaicId: MosaicId): Promise<MosaicLevy> {
    return lastValueFrom(this.mosaicHttp.getMosaicLevy(mosaicId));
  }

  searchMosaics(queryParams: MosaicQueryParams): Promise<MosaicSearch> {
    return lastValueFrom(this.mosaicHttp.searchMosaics(queryParams));
  }
}
