import { lastValueFrom } from "rxjs";
import { ChainConfigHttp, ChainConfig } from "tsjs-xpx-chain-sdk";

export class ChainConfigAPI {
  chainConfigHttp: ChainConfigHttp;

  constructor(endpoint: string) {
    this.chainConfigHttp = new ChainConfigHttp(endpoint);
  }

  getChainConfig(height: number): Promise<ChainConfig> {
    return lastValueFrom(this.chainConfigHttp.getChainConfig(height));
  }
}
