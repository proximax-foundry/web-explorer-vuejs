import { firstValueFrom } from "rxjs";
import {
  AccountHttp,
  NetworkHttp,
  Address,
  PublicAccount,
  MultisigAccountGraphInfo,
  MultisigAccountInfo,
  AccountInfo,
  AggregateTransaction,
  Transaction,
  AccountRestrictionsInfo,
  AccountNames,
  TransactionQueryParams,
} from "tsjs-xpx-chain-sdk";

export class AccountAPI {
  accountHttp: AccountHttp;

  constructor(endpoint: string, networkHttp?: NetworkHttp) {
    this.accountHttp = new AccountHttp(endpoint, networkHttp);
  }

  getAccountInfo(address: Address): Promise<AccountInfo> {
    return firstValueFrom(this.accountHttp.getAccountInfo(address));
  }

  aggregateBondedTransactions(
    publicAccount: PublicAccount,
    queryParams?: TransactionQueryParams
  ): Promise<AggregateTransaction[]> {
    return firstValueFrom(this.accountHttp
      .aggregateBondedTransactions(publicAccount, queryParams));
  }

  getAccountRestrictions(address: Address): Promise<AccountRestrictionsInfo> {
    return firstValueFrom(this.accountHttp.getAccountRestrictions(address));
  }

  getAccountRestrictionsFromAccounts(
    addresses: Address[]
  ): Promise<AccountRestrictionsInfo[]> {
    return firstValueFrom(this.accountHttp
      .getAccountRestrictionsFromAccounts(addresses));
  }

  getAccountsInfo(addresses: Address[]): Promise<AccountInfo[]> {
    return firstValueFrom(this.accountHttp.getAccountsInfo(addresses));
  }

  getAccountsNames(addresses: Address[]): Promise<AccountNames[]> {
    return firstValueFrom(this.accountHttp.getAccountsNames(addresses));
  }

  getMultisigAccountGraphInfo(
    address: Address
  ): Promise<MultisigAccountGraphInfo> {
    return firstValueFrom(this.accountHttp.getMultisigAccountGraphInfo(address));
  }

  getMultisigAccountInfo(address: Address): Promise<MultisigAccountInfo> {
    return firstValueFrom(this.accountHttp.getMultisigAccountInfo(address));
  }

  transactions(
    publicAccount: PublicAccount,
    queryParams?: TransactionQueryParams
  ): Promise<Transaction[]> {
    return firstValueFrom(this.accountHttp
      .transactions(publicAccount, queryParams));
  }

  incomingTransactions(
    accountId: Address | PublicAccount,
    queryParams?: TransactionQueryParams
  ): Promise<Transaction[]> {
    return firstValueFrom(this.accountHttp
      .incomingTransactions(accountId, queryParams));
  }

  outgoingTransactions(
    publicAccount: PublicAccount,
    queryParams?: TransactionQueryParams
  ): Promise<Transaction[]> {
    return firstValueFrom(this.accountHttp
      .outgoingTransactions(publicAccount, queryParams));
  }

  unconfirmedTransactions(
    publicAccount: PublicAccount,
    queryParams?: TransactionQueryParams
  ): Promise<Transaction[]> {
    return firstValueFrom(this.accountHttp
      .unconfirmedTransactions(publicAccount, queryParams));
  }
}
