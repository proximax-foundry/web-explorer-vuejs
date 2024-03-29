import { lastValueFrom } from "rxjs";
import { ChainHttp, BlockchainScore } from "tsjs-xpx-chain-sdk";

export class ChainAPI {
  chainHttp: ChainHttp;

  constructor(endpoint: string) {
    this.chainHttp = new ChainHttp(endpoint);
  }

  getBlockchainHeight(): Promise<number> {
    return lastValueFrom(this.chainHttp
      .getBlockchainHeight())
      .then((blockNum) => blockNum.compact());
  }

  getBlockchainScore(): Promise<BlockchainScore> {
    return lastValueFrom(this.chainHttp.getBlockchainScore());
  }
}
