import { firstValueFrom } from "rxjs";
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
    return firstValueFrom(this.namespaceHttp.getLinkedAddress(namespaceId));
  }

  getLinkedMosaicId(namespaceId: NamespaceId): Promise<MosaicId> {
    return firstValueFrom(this.namespaceHttp.getLinkedMosaicId(namespaceId));
  }

  getNamespace(namespaceId: NamespaceId): Promise<NamespaceInfo> {
    return firstValueFrom(this.namespaceHttp.getNamespace(namespaceId));
  }

  getNamespacesFromAccount(
    address: Address,
    queryParams?: QueryParams
  ): Promise<NamespaceInfo[]> {
    return firstValueFrom(this.namespaceHttp
      .getNamespacesFromAccount(address, queryParams));
  }

  getNamespacesFromAccounts(
    addresses: Address[],
    queryParams?: QueryParams
  ): Promise<NamespaceInfo[]> {
    return firstValueFrom(this.namespaceHttp
      .getNamespacesFromAccounts(addresses, queryParams));
  }

  getNamespacesName(namespaceIds: NamespaceId[]): Promise<NamespaceName[]> {
    return firstValueFrom(this.namespaceHttp.getNamespacesName(namespaceIds));
  }
}
