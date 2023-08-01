import { lastValueFrom } from "rxjs";
import {
  TransactionHttp,
  SignedTransaction,
  CosignatureSignedTransaction,
  TransactionAnnounceResponse,
  Transaction,
  TransactionStatus,
  TransactionGroupType,
  TransactionQueryParams,
  TransactionType,
  TransactionSearch,
  TransactionCount,
} from "tsjs-xpx-chain-sdk";

export class TransactionAPI {
  transactionHttp: TransactionHttp;

  constructor(endpoint: string) {
    this.transactionHttp = new TransactionHttp(endpoint);
  }

  announce(
    signedTransaction: SignedTransaction
  ): Promise<TransactionAnnounceResponse> {
    return lastValueFrom(this.transactionHttp.announce(signedTransaction));
  }

  announceAggregateBonded(
    signedTransaction: SignedTransaction
  ): Promise<TransactionAnnounceResponse> {
    return lastValueFrom(this.transactionHttp
      .announceAggregateBonded(signedTransaction));
  }

  announceAggregateBondedCosignature(
    cosignatureSignedTransaction: CosignatureSignedTransaction
  ): Promise<TransactionAnnounceResponse> {
    return lastValueFrom(this.transactionHttp
      .announceAggregateBondedCosignature(cosignatureSignedTransaction));
  }

  /**
   * Gets a transaction for a transactionId
   * @param transactionId - Transaction id or hash.
   */
  getTransaction(transactionId: string): Promise<Transaction> {
    return lastValueFrom(this.transactionHttp.getTransaction(transactionId));
  }

  /**
   * Gets a transaction for a transactionId
   * @param transactionId - Transaction id or hash.
   */
  getUnconfirmedTransaction(transactionId: string): Promise<Transaction> {
    return lastValueFrom(this.transactionHttp
      .getUnconfirmedTransaction(transactionId));
  }

  /**
   * Gets a transaction for a transactionId
   * @param transactionId - Transaction id or hash.
   */
  getPartialTransaction(transactionId: string): Promise<Transaction> {
    return lastValueFrom(this.transactionHttp
      .getPartialTransaction(transactionId));
  }

  /**
   * Gets an array of transactions for different transaction ids
   * @param transactionIds - Array of transactions id and/or hash.
   *
   */
  getTransactions(transactionIds: string[]): Promise<Transaction[]> {
    return lastValueFrom(this.transactionHttp.getTransactions(transactionIds));
  }

  /**
   * Gets a transaction for a transactionId
   * @param transactionId - Transaction id or hash.
   */
  getTransactionEffectiveFee(transactionId: string): Promise<number> {
    return lastValueFrom(this.transactionHttp
      .getTransactionEffectiveFee(transactionId));
  }

  getTransactionStatus(transactionHash: string): Promise<TransactionStatus> {
    return lastValueFrom(this.transactionHttp
      .getTransactionStatus(transactionHash));
  }

  getTransactionsStatuses(
    transactionHashes: string[]
  ): Promise<TransactionStatus[]> {
    return lastValueFrom(this.transactionHttp
      .getTransactionsStatuses(transactionHashes));
  }

  searchTransactions(
    transactionGroupType: TransactionGroupType,
    transactionQueryParams?: TransactionQueryParams
  ): Promise<TransactionSearch> {
    return lastValueFrom(this.transactionHttp
      .searchTransactions(transactionGroupType, transactionQueryParams));
  }

  getTransactionsCount(
    transactionTypes: TransactionType[],
    transactionGroupType: TransactionGroupType
  ): Promise<TransactionCount[]> {
    return lastValueFrom(this.transactionHttp
      .getTransactionsCount(transactionTypes, transactionGroupType));
  }
}
