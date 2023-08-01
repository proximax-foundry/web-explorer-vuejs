import { lastValueFrom } from "rxjs";
import {
  ExchangeHttp,
  NetworkHttp,
  Address,
  PublicAccount,
  MosaicId,
  ExchangeOfferType,
  MosaicExchange,
  AccountExchanges,
} from "tsjs-xpx-chain-sdk";

export class ExchangeAPI {
  exchangeHttp: ExchangeHttp;

  constructor(endpoint: string, networkHttp?: NetworkHttp) {
    this.exchangeHttp = new ExchangeHttp(endpoint, networkHttp);
  }

  getAccountExchanges(
    accountId: Address | PublicAccount
  ): Promise<AccountExchanges | undefined> {
    return lastValueFrom(this.exchangeHttp.getAccountExchanges(accountId));
  }

  getExchangeOffers(
    offerType: ExchangeOfferType,
    mosaicId: MosaicId
  ): Promise<MosaicExchange[]> {
    return lastValueFrom(this.exchangeHttp.getExchangeOffers(offerType, mosaicId));
  }

  getExchangeList(): Promise<MosaicId[]> {
    return lastValueFrom(this.exchangeHttp.getOfferList());
  }
}
