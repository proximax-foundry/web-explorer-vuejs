import { lastValueFrom } from "rxjs";
import {
  DiagnosticHttp,
  BlockchainStorageInfo,
  ServerInfo,
} from "tsjs-xpx-chain-sdk";

export class DiagnosticAPI {
  diagnosticHttp: DiagnosticHttp;

  constructor(endpoint: string) {
    this.diagnosticHttp = new DiagnosticHttp(endpoint);
  }

  getServerInfo(): Promise<ServerInfo> {
    return lastValueFrom(this.diagnosticHttp.getServerInfo());
  }

  getDiagnosticStorage(): Promise<BlockchainStorageInfo> {
    return lastValueFrom(this.diagnosticHttp.getDiagnosticStorage());
  }
}
