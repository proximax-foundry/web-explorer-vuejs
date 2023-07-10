import { lastValueFrom } from "rxjs";
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
    return lastValueFrom(this.accountHttp.getAccountInfo(address));
  }

  aggregateBondedTransactions(
    publicAccount: PublicAccount,
    queryParams?: TransactionQueryParams
  ): Promise<AggregateTransaction[]> {
    return lastValueFrom(this.accountHttp
      .aggregateBondedTransactions(publicAccount, queryParams));
  }

  getAccountRestrictions(address: Address): Promise<AccountRestrictionsInfo> {
    return lastValueFrom(this.accountHttp.getAccountRestrictions(address));
  }

  getAccountRestrictionsFromAccounts(
    addresses: Address[]
  ): Promise<AccountRestrictionsInfo[]> {
    return lastValueFrom(this.accountHttp
      .getAccountRestrictionsFromAccounts(addresses));
  }

  getAccountsInfo(addresses: Address[]): Promise<AccountInfo[]> {
    return lastValueFrom(this.accountHttp.getAccountsInfo(addresses));
  }

  getAccountsNames(addresses: Address[]): Promise<AccountNames[]> {
    return lastValueFrom(this.accountHttp.getAccountsNames(addresses));
  }

  getMultisigAccountGraphInfo(
    address: Address
  ): Promise<MultisigAccountGraphInfo> {
    return lastValueFrom(this.accountHttp.getMultisigAccountGraphInfo(address));
  }

  getMultisigAccountInfo(address: Address): Promise<MultisigAccountInfo> {
    return lastValueFrom(this.accountHttp.getMultisigAccountInfo(address));
  }

  transactions(
    publicAccount: PublicAccount,
    queryParams?: TransactionQueryParams
  ): Promise<Transaction[]> {
    return lastValueFrom(this.accountHttp
      .transactions(publicAccount, queryParams));
  }

  incomingTransactions(
    accountId: Address | PublicAccount,
    queryParams?: TransactionQueryParams
  ): Promise<Transaction[]> {
    return lastValueFrom(this.accountHttp
      .incomingTransactions(accountId, queryParams));
  }

  outgoingTransactions(
    publicAccount: PublicAccount,
    queryParams?: TransactionQueryParams
  ): Promise<Transaction[]> {
    return lastValueFrom(this.accountHttp
      .outgoingTransactions(publicAccount, queryParams));
  }

  unconfirmedTransactions(
    publicAccount: PublicAccount,
    queryParams?: TransactionQueryParams
  ): Promise<Transaction[]> {
    return lastValueFrom(this.accountHttp
      .unconfirmedTransactions(publicAccount, queryParams));
  }
}
