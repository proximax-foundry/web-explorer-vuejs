import {
  Deadline,
  NetworkType,
  PublicAccount,
  Account,
  UInt64,
  PlainMessage,
  EncryptedMessage,
  MosaicId,
  Mosaic,
  NamespaceId,
  Transaction,
  Address,
  MosaicSupplyType,
  MosaicNonce,
  AliasActionType,
  QueryParams,
  CosignatureTransaction,
  Password,
  TransactionHash,
  TransactionQueryParams,
  MetadataQueryParams,
  TransactionGroupType,
  Order,
  TransactionSortingField,
  TransactionFieldOrder,
  Order_v2,
  MosaicQueryParams,
  AggregateTransaction,
} from "tsjs-xpx-chain-sdk";
import type { InnerTransaction } from "tsjs-xpx-chain-sdk";
import { DateTime } from "luxon";

export class Helper {
  static createPasswordInstance(password: string) {
    return new Password(password);
  }

  static createPlainMessage(message: string): PlainMessage {
    return PlainMessage.create(message);
  }

  static createEncryptedMessage(
    message: string,
    recipientPublicKey: string,
    networkType: NetworkType,
    senderPrivateKey: string
  ): EncryptedMessage {
    const publicAccount = PublicAccount.createFromPublicKey(
      recipientPublicKey,
      networkType
    );
    return EncryptedMessage.create(message, publicAccount, senderPrivateKey);
  }

  static createEncryptedMessageFromEncoded(payload: string): EncryptedMessage {
    return EncryptedMessage.createFromPayload(payload);
  }

  static createUint64FromNumber(number: number): UInt64 {
    return UInt64.fromUint(number);
  }

  static createAsset(mosaicId: string | number[], amount: number): Mosaic {
    return new Mosaic(new MosaicId(mosaicId), UInt64.fromUint(amount));
  }

  static createAssetId(mosaicId: string | number[]): MosaicId {
    return new MosaicId(mosaicId);
  }

  static createNamespaceId(name: string | number[]): NamespaceId {
    return new NamespaceId(name);
  }

  static appendInnerTransaction(
    transactions: Transaction[],
    publicKeyTosign: string,
    innerTransactions: InnerTransaction[]
  ): InnerTransaction[] {
    const networkType = transactions[0].version.networkType;
    const publicAccount = PublicAccount.createFromPublicKey(
      publicKeyTosign,
      networkType
    );

    transactions.forEach((transaction) => {
      innerTransactions.push(transaction.toAggregate(publicAccount));
    });

    return innerTransactions;
  }

  static createInnerTransaction(
    transactions: Transaction[],
    publicKeyTosign: string
  ): InnerTransaction[] {
    const networkType = transactions[0].version.networkType;
    const publicAccount = PublicAccount.createFromPublicKey(
      publicKeyTosign,
      networkType
    );
    const newInnerTransaction: InnerTransaction[] = [];

    transactions.forEach((transaction) => {
      newInnerTransaction.push(transaction.toAggregate(publicAccount));
    });

    return newInnerTransaction;
  }

  static createAddress(address: string): Address {
    return Address.createFromRawAddress(address);
  }

  static checkAddressNetwork(address: Address, networkType: NetworkType) {
    return address.networkType === networkType;
  }

  static getMosaicSupplyType(): typeof MosaicSupplyType {
    return MosaicSupplyType;
  }

  static createPublicAccount(
    publicKey: string,
    network: NetworkType
  ): PublicAccount {
    return PublicAccount.createFromPublicKey(publicKey, network);
  }

  static createAccount(privateKey: string, network: NetworkType): Account {
    return Account.createFromPrivateKey(privateKey, network,1);
  }

  static createNonceRandom(): MosaicNonce {
    const nonce = MosaicNonce.createRandom();
    return nonce;
  }

  static createTransactionHash(hash: string, transactionType: number) {
    return new TransactionHash(hash, transactionType);
  }

  static createTransactionQueryParams(): TransactionQueryParams {
    return new TransactionQueryParams();
  }

  static createMosaicQueryParams(): MosaicQueryParams {
    return new MosaicQueryParams();
  }

  static createMetadataQueryParams(): MetadataQueryParams {
    return new MetadataQueryParams();
  }

  static createTransactionFieldOrder(
    sortingField: TransactionSortingField,
    order: Order_v2
  ): TransactionFieldOrder {
    return new TransactionFieldOrder(sortingField, order);
  }

  static getQueryParamOrder(): typeof Order {
    return Order;
  }

  static getQueryParamOrder_v2(): typeof Order_v2 {
    return Order_v2;
  }

  static getTransactionSortField(): typeof TransactionSortingField {
    return TransactionSortingField;
  }

  static getTransactionGroupType(): typeof TransactionGroupType {
    return TransactionGroupType;
  }

  static getAliasActionType(): typeof AliasActionType {
    return AliasActionType;
  }

  static amountFormatterSimple(amount: number, d: number = 6): string {
    const amountDivisibility = Number(amount) / Math.pow(10, d);
    return amountDivisibility.toLocaleString("en-us", {
      minimumFractionDigits: d,
    });
  }

  static convertDisplayDateTimeFormat24(dateTimeJSON: string): string {
    const date = new Date(dateTimeJSON).toISOString().replace("Z", ""); //solve the issue of wrong timestamp catch with iso format with 'Z'
    return DateTime.fromISO(date).toFormat("yyyy-LLL-dd, TT") + " +UTC";
  }

  static formatDeadline(timestamp: number): string {
    return Helper.convertDisplayDateTimeFormat24(
      new Date(timestamp + Deadline.timestampNemesisBlock * 1000).toISOString()
    );
  }

  static numberToJSONDate(dateNumber: number): string {
    const newDate = new Date(dateNumber);

    return newDate.toISOString();
  }

  static convertToCurrency(value: number, divisibility: number): string {
    const exactValue = value / Math.pow(10, divisibility);

    return new Intl.NumberFormat("en", {
      maximumFractionDigits: divisibility,
    }).format(exactValue);
  }

  static toCurrencyFormat(value: number, divisibility: number): string {
    const exactValue = value;

    return new Intl.NumberFormat("en", {
      maximumFractionDigits: divisibility,
    }).format(exactValue);
  }

  static convertToExact = (value: number, divisibility: number): number => {
    return value / Math.pow(10, divisibility);
  };

  static convertToAbsolute = (value: number, divisibility: number): number => {
    return value * Math.pow(10, divisibility);
  };

  static convertNumberMinimumFormat(value: number, decimalPoint: number) {
    return parseFloat(value.toFixed(decimalPoint));
  }

  static createQueryParams(
    pageSize: number,
    idToStartFrom?: string | undefined
  ) {
    return new QueryParams(pageSize, idToStartFrom);
  }

  static checkIsJSON(data: string): boolean {
    try {
      JSON.parse(data);
      return true;
    } catch (error) {
      return false;
    }
  }

  static createCosignatureTransaction(
    signedABT: AggregateTransaction
  ): CosignatureTransaction {
    return CosignatureTransaction.create(signedABT);
  }

  static validateBuildSelectAccountBalance(
    balanceAccount: number,
    feeTransaction: number,
    rental: number
  ): boolean {
    const totalFee = feeTransaction + rental;
    return balanceAccount >= totalFee;
  }

  static ucwordsNoUnderscore(data: string){

    return data.trim().replaceAll("_", " ").toLowerCase().split(" ")
                .map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(" ");
  }

  static ucwordsNoUnderscoreReplace(data: string, searchString :string, replaceString :string){

    return data.trim().replaceAll("_", " ").toLowerCase().replace(searchString, replaceString).split(" ")
                .map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(" ");
  }
}

export interface LooseObject {
  [key: string]: any;
}
