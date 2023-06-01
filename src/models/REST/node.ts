import { firstValueFrom } from "rxjs";
import { NodeHttp, NodeInfo, NodeTime } from "tsjs-xpx-chain-sdk";

export class NodeAPI {
  nodeHttp: NodeHttp;

  constructor(endpoint: string) {
    this.nodeHttp = new NodeHttp(endpoint);
  }

  getNodeInfo(): Promise<NodeInfo> {
    return firstValueFrom(this.nodeHttp.getNodeInfo());
  }

  getNodeTime(): Promise<NodeTime> {
    return firstValueFrom(this.nodeHttp.getNodeTime());
  }
}
