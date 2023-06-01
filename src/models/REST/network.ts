import { firstValueFrom } from "rxjs";
import { NetworkHttp, NetworkType } from "tsjs-xpx-chain-sdk";

export class NetworkAPI {
  networkHttp: NetworkHttp;

  constructor(endpoint: string) {
    this.networkHttp = new NetworkHttp(endpoint);
  }

  getNetworkType(): Promise<NetworkType> {
    return firstValueFrom(this.networkHttp.getNetworkType());
  }
}
