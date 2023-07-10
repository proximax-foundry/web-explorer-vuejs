import { lastValueFrom } from "rxjs";
import {
  NamespaceHttp,
  NetworkHttp,
  MosaicId,
  Address,
  QueryParams,
  NamespaceId,
  NamespaceName,
  NamespaceInfo,
} from "tsjs-xpx-chain-sdk";

export class NamespaceAPI {
  namespaceHttp: NamespaceHttp;

  constructor(endpoint: string, networkHttp?: NetworkHttp) {
    this.namespaceHttp = new NamespaceHttp(endpoint, networkHttp);
  }

  getLinkedAddress(namespaceId: NamespaceId): Promise<Address> {
    return lastValueFrom(this.namespaceHttp.getLinkedAddress(namespaceId));
  }

  getLinkedMosaicId(namespaceId: NamespaceId): Promise<MosaicId> {
    return lastValueFrom(this.namespaceHttp.getLinkedMosaicId(namespaceId));
  }

  getNamespace(namespaceId: NamespaceId): Promise<NamespaceInfo> {
    return lastValueFrom(this.namespaceHttp.getNamespace(namespaceId));
  }

  getNamespacesFromAccount(
    address: Address,
    queryParams?: QueryParams
  ): Promise<NamespaceInfo[]> {
    return lastValueFrom(this.namespaceHttp
      .getNamespacesFromAccount(address, queryParams));
  }

  getNamespacesFromAccounts(
    addresses: Address[],
    queryParams?: QueryParams
  ): Promise<NamespaceInfo[]> {
    return lastValueFrom(this.namespaceHttp
      .getNamespacesFromAccounts(addresses, queryParams));
  }

  getNamespacesName(namespaceIds: NamespaceId[]): Promise<NamespaceName[]> {
    return lastValueFrom(this.namespaceHttp.getNamespacesName(namespaceIds));
  }
}
