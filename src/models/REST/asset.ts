import { firstValueFrom } from "rxjs";
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
    return firstValueFrom(this.mosaicHttp.getMosaic(mosaicId));
  }

  getMosaicRichlist(
    mosaicId: MosaicId,
    queryParams?: PageQueryParams
  ): Promise<RichlistEntry[]> {
    return firstValueFrom(this.mosaicHttp.getMosaicRichlist(mosaicId, queryParams));
  }

  getMosaics(mosaicIds: MosaicId[]): Promise<MosaicInfo[]> {
    return firstValueFrom(this.mosaicHttp.getMosaics(mosaicIds));
  }

  getMosaicsNames(mosaicIds: MosaicId[]): Promise<MosaicNames[]> {
    return firstValueFrom(this.mosaicHttp.getMosaicsNames(mosaicIds));
  }

  getMosaicLevy(mosaicId: MosaicId): Promise<MosaicLevy> {
    return firstValueFrom(this.mosaicHttp.getMosaicLevy(mosaicId));
  }

  searchMosaics(queryParams: MosaicQueryParams): Promise<MosaicSearch> {
    return firstValueFrom(this.mosaicHttp.searchMosaics(queryParams));
  }
}
