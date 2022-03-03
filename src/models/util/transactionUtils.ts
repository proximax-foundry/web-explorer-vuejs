import { readonly, computed } from "vue";
import {
  Account,
  Address,
  AliasActionType,
  Deadline,
  EncryptedMessage,
  // NetworkCurrencyMosaic,
  // FeeCalculationStrategy,
  LinkAction,
  Mosaic,
  MosaicId,
  MosaicInfo,
  UInt64,
  MosaicProperties,
  MosaicSupplyType,
  MosaicAlias,
  // MosaicService,
  MosaicNonce,
  PlainMessage,
  TransferTransaction,
  TransactionHttp,
  TransactionBuilderFactory,
  PublicAccount,
  AccountHttp,
  AccountInfo,
  FeeCalculationStrategy,
  MessageType,
  NetworkType,
  NamespaceId,
  NamespaceInfo,
  NamespaceType,
  NamespaceName,
  Transaction,
  TransactionType,
  AggregateTransaction,
  CosignatureTransaction,
  TransactionQueryParams,
  AddressAliasTransaction,
  AddExchangeOfferTransaction,
  ChainConfigTransaction,
  ChainUpgradeTransaction,
  ExchangeOfferTransaction,
  RemoveExchangeOfferTransaction,
  AccountLinkTransaction,
  LockFundsTransaction,
  // ModifyMetadataTransaction,
  AccountMetadataTransaction,
  NamespaceMetadataTransaction,
  MosaicMetadataTransaction,
  AccountMosaicRestrictionModificationTransaction,
  AccountOperationRestrictionModificationTransaction,
  AccountAddressRestrictionModificationTransaction,
  ModifyMultisigAccountTransaction,
  MosaicAliasTransaction,
  MosaicDefinitionTransaction,
  MosaicSupplyChangeTransaction,
  RegisterNamespaceTransaction,
  SecretLockTransaction,
  SecretProofTransaction,
  InnerTransaction,
  ExchangeOfferType,
  HashType,
  RestrictionType,
  AccountRestrictionModification,
  SignedTransaction,
  CosignatureSignedTransaction,
  TransactionGroupType,
  TransactionSearch,
  MosaicNames,
  RestrictionModificationType,
  MosaicModifyLevyTransaction,
  MosaicRemoveLevyTransaction,
  MultisigCosignatoryModificationType,
  MetadataType,
  Convert,
  MetadataQueryParams,
  MetadataEntry,
  AggregateTransactionInfo,
  TransactionInfo,
} from "tsjs-xpx-chain-sdk";
// import { mergeMap, timeout, filter, map, first, skip } from 'rxjs/operators';
import { networkState } from "@/state/networkState";
import { ChainUtils } from "@/util/chainUtils";
import { ChainAPICall } from "@/models/REST/chainAPICall";
import { Helper } from "./typeHelper";
import { Duration } from "js-joda";
import { AppState } from '@/state/appState';
import { SDA } from '@/models/transactions/sda';
import {
  InnerAliasTransaction, InnerTransaction as MyInnerTxn, InnerExchangeTransaction, TxnExchangeOffer, InnerChainTransaction, InnerLinkTransaction, InnerLockTransaction,
  InnerRestrictionTransaction, RestrictionModification, InnerAccountTransaction, InnerAssetTransaction, InnerNamespaceTransaction, InnerSecretTransaction, InnerTransferTransaction, InnerMetadataTransaction
} from "@/models/transactions/transaction";
import { HashType as myHashType } from "@/models/const/hashType";
export enum MsgType{
  NONE = 0,
  GREEN = 1,
  RED = 2,
  INFO = 3,
}

export enum InnerTxnLegendType{
  NONE = 0,
  ADD_REMOVE = 1,
  TRUE_FALSE = 2,
  BUY_SELL = 3,
  ALLOW_BLOCK = 4
}
export interface TxnDetails{
  type: MsgType,
  value: string | number;
  label?: string;
  short?: string;
  hover?: string;
}
export interface InnerTxnDetails{
  typeName: string;
  signer: string;
  signerAddressPretty: string;
  signerAddressPlain: string;
  infos: TxnDetails[];
  legendType: InnerTxnLegendType;
  sdas: string[];
  infoInfoList?: [];
  infoGreenList?: [];
  infoRedList?: [];
  infoList?: [];
}

const networkAPIEndpoint = computed(() => ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile?.httpPort));
const localNetworkType = computed(() => ChainUtils.getNetworkType(networkState.currentNetworkProfile?.network.type));
const namespaceIdFirstCharacterString = "89ABCDEF";
const nativeTokenNamespaceId = computed(()=> new NamespaceId(AppState.nativeToken.fullNamespace).toHex());

export const transactionTypeName = {
  transfer: {
    id: TransactionType.TRANSFER,
    name: 'Transfer'
  },
  registerNameSpace: {
    id: TransactionType.REGISTER_NAMESPACE,
    name: 'Register Namespace'
  },
  mosaicDefinition: {
    id: TransactionType.MOSAIC_DEFINITION,
    name: 'SDA Definition'
  },
  mosaicSupplyChange: {
    id: TransactionType.MOSAIC_SUPPLY_CHANGE,
    name: 'SDA Supply Change'
  },
  modifyMultisigAccount: {
    id: TransactionType.MODIFY_MULTISIG_ACCOUNT,
    name: 'Modify Multisig Account'
  },
  aggregateComplete: {
    id: TransactionType.AGGREGATE_COMPLETE,
    name: 'Aggregate Complete'
  },
  aggregateBonded: {
    id: TransactionType.AGGREGATE_BONDED,
    name: 'Aggregate Bonded'
  },
  mosaicAlias: {
    id: TransactionType.MOSAIC_ALIAS,
    name: 'SDA Alias'
  },
  addressAlias: {
    id: TransactionType.ADDRESS_ALIAS,
    name: 'Address Alias'
  },
  lock: {
    id: TransactionType.LOCK,
    name: 'LockFund'
  },
  accountLink: {
    id: TransactionType.LINK_ACCOUNT,
    name: 'Account Link'
  },
  exchangeOffer: {
    id: TransactionType.EXCHANGE_OFFER,
    name: 'Exchange Offer'
  },
  addExchangeOffer: {
    id: TransactionType.ADD_EXCHANGE_OFFER,
    name: 'Add Exchange Offer'
  },
  removeExchangeOffer: {
    id: TransactionType.REMOVE_EXCHANGE_OFFER,
    name: 'Remove Exchange Offer'
  },
  modifyAccountMetadata: {
    id: TransactionType.MODIFY_ACCOUNT_METADATA,
    name: 'Modify Account Metadata'
  },
  modifyMosaicMetadata: {
    id: TransactionType.MODIFY_MOSAIC_METADATA,
    name: 'Modify SDA Metadata'
  },
  modifyNamespaceMetadata: {
    id: TransactionType.MODIFY_NAMESPACE_METADATA,
    name: 'Modify Namespace Metadata'
  },
  modifyAccountRestrictionAddress: {
    id: TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS,
    name: 'Modify Account Address Restriction'
  },
  modifyAccountRestrictionMosaic: {
    id: TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC,
    name: 'Modify Account SDA Restriction'
  },
  modifyAccountRestrictionOperation: {
    id: TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION,
    name: 'Modify Account Operation Restriction'
  },
  chainConfigure: {
    id: TransactionType.CHAIN_CONFIGURE,
    name: 'Chain Configure'
  },
  chainUpgrade: {
    id: TransactionType.CHAIN_UPGRADE,
    name: 'Chain Upgrade'
  },
  secretLock: {
    id: TransactionType.SECRET_LOCK,
    name: "Secret Lock"
  },
  secretProof: {
    id: TransactionType.SECRET_PROOF,
    name: "Secret Proof"
  },
  modifyAccountMetadata_v2: {
    id: TransactionType.ACCOUNT_METADATA_V2,
    name: "Account Metadata"
  },
  modifyMosaicMetadata_v2: {
    id: TransactionType.MOSAIC_METADATA_V2,
    name: "SDA Metadata"
  },
  modifyNamespaceMetadata_v2: {
    id: TransactionType.NAMESPACE_METADATA_V2,
    name: "Namespace Metadata"
  },
  modifyMosaicLevy: {
    id: TransactionType.MODIFY_MOSAIC_LEVY,
    name: "Modify SDA Levy"
  },
  removeRemoveLevy: {
    id: TransactionType.REMOVE_MOSAIC_LEVY,
    name: "Remove SDA Levy"
  }
};

export class TransactionUtils {


  static async getAccInfo(address: Address): Promise<AccountInfo> {

    const chainAPICall = new ChainAPICall(networkAPIEndpoint.value);

    const accountInfo = await chainAPICall.accountAPI.getAccountInfo(address);
    // console.log(publicKey);
    return accountInfo;
  }

  static getTransactionTypeNameByEnum(transactionType: TransactionType): string{

    let name = "";

    for(let key in transactionTypeName){
      if(transactionType === transactionTypeName[key].id){
        name = transactionTypeName[key].name;
        break;
      }
    }

    return name;
  }

  static getFee(transaction: Transaction): number{

    return transaction.maxFee.compact();
  }

  static getFakeEncryptedMessageSize(message: string): number{
    return EncryptedMessage.create(message, PublicAccount.createFromPublicKey("0".repeat(64), ChainUtils.getNetworkType(localNetworkType.value)), "0".repeat(64)).size();
  }

  static getPlainMessageSize(message: string): number{
    return PlainMessage.create(message).size();
  }

  static signTransaction(transaction: Transaction, account: Account, generationHash: string): SignedTransaction {
    return account.sign(transaction, generationHash);
  }

  static aggregateToCosignatureTransaction(aggregateTransaction: AggregateTransaction): CosignatureTransaction {
    return CosignatureTransaction.create(aggregateTransaction);
  }

  static cosignTransaction(transactionToCosign: AggregateTransaction, account: Account): CosignatureSignedTransaction {
    const cosignatureTransaction = TransactionUtils.aggregateToCosignatureTransaction(transactionToCosign);

    return account.signCosignatureTransaction(cosignatureTransaction);
  }

  static async getTransactions(publicAccount: PublicAccount, queryParams?: TransactionQueryParams): Promise<Transaction[]> {

    let transactions = await ChainUtils.getAccountTransactions(publicAccount, queryParams);

    return transactions;
  }

  static async searchTransactions(txnGroupType: TransactionGroupType, queryParams?: TransactionQueryParams): Promise<TransactionSearch> {

    let transactionsResult = await ChainUtils.searchTransactions(txnGroupType, queryParams);

    return transactionsResult;
  }

  static async getUnconfirmedTransactions(publicAccount: PublicAccount, queryParams?: TransactionQueryParams): Promise<Transaction[]> {

    let transactions = await ChainUtils.getAccountUnconfirmedTransactions(publicAccount, queryParams);

    return transactions;
  }

  static async getPartialTransactions(publicAccount: PublicAccount, queryParams?: TransactionQueryParams): Promise<Transaction[]> {

    let transactions = await ChainUtils.getAccountPartialTransactions(publicAccount, queryParams);

    return transactions;
  }

  static async getResolvedAsset(mosaicId: MosaicId, blockHeight: number): Promise<MosaicId>{

    let resolvedAsset: MosaicId = null;

    if(TransactionUtils.isNamespace(mosaicId)){

      let receipts = await AppState.chainAPI.blockAPI.getBlockReceipts(blockHeight);

      for(let i=0; i < receipts.mosaicResolutionStatements.length; ++i){
        let unresolved = receipts.mosaicResolutionStatements[i].unresolved;
        let resolved = receipts.mosaicResolutionStatements[i].resolutionEntries[0].resolved;
        if(unresolved instanceof MosaicId){ // actually is namespaceId
          let namespaceIdHex: string = unresolved.toHex();

          if(mosaicId.toHex() !== namespaceIdHex){
            continue;
          }

          if(resolved instanceof MosaicAlias){
            resolvedAsset = resolved.mosaicId;
            break;
          }
          else{
            continue;
          }
        }
        else{
          continue;
        }
      }
    }
    else{
      resolvedAsset = mosaicId;
    }

    return resolvedAsset;
}

  // static announceTransaction(signedTx: SignedTransaction): void {

  //   ChainUtils.announceTransaction(signedTx);
  // }

  // static announceBondedTransaction(signedTx: SignedTransaction): void {

  //   ChainUtils.announceBondedTransaction(signedTx);
  // }

  // static announceCosignatureSignedTransaction(signedTx: CosignatureSignedTransaction) :void {
  //   ChainUtils.announceCosignTransaction(signedTx);
  // }

  static getTransactionTypeName(type: number): string | null {

    let typeName = "";

    switch (type) {
      case TransactionType.ADDRESS_ALIAS:
        typeName = transactionTypeName.addressAlias.name
        break;
      case TransactionType.ADD_EXCHANGE_OFFER:
        typeName = transactionTypeName.addExchangeOffer.name
        break;
      case TransactionType.AGGREGATE_BONDED:
        typeName = transactionTypeName.aggregateBonded.name
        break;
      case TransactionType.AGGREGATE_COMPLETE:
        typeName = transactionTypeName.aggregateComplete.name
        break;
      case TransactionType.CHAIN_CONFIGURE:
        typeName = transactionTypeName.chainConfigure.name
        break;
      case TransactionType.CHAIN_UPGRADE:
        typeName = transactionTypeName.chainUpgrade.name
        break;
      case TransactionType.EXCHANGE_OFFER:
        typeName = transactionTypeName.exchangeOffer.name
        break;
      case TransactionType.REMOVE_EXCHANGE_OFFER:
        typeName = transactionTypeName.removeExchangeOffer.name
        break;
      case TransactionType.LINK_ACCOUNT:
        typeName = transactionTypeName.accountLink.name
        break;
      case TransactionType.LOCK:
        typeName = transactionTypeName.lock.name
        break;
      case TransactionType.MODIFY_ACCOUNT_METADATA:
        typeName = transactionTypeName.modifyAccountMetadata.name
        break;
      case TransactionType.MODIFY_MOSAIC_METADATA:
        typeName = transactionTypeName.modifyMosaicMetadata.name
        break;
      case TransactionType.MODIFY_NAMESPACE_METADATA:
        typeName = transactionTypeName.modifyNamespaceMetadata.name
        break;
      case TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS:
        typeName = transactionTypeName.modifyAccountRestrictionAddress.name
        break;
      case TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC:
        typeName = transactionTypeName.modifyAccountRestrictionMosaic.name
        break;
      case TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION:
        typeName = transactionTypeName.modifyAccountRestrictionOperation.name
        break;
      case TransactionType.MODIFY_MULTISIG_ACCOUNT:
        typeName = transactionTypeName.modifyMultisigAccount.name
        break;
      case TransactionType.MOSAIC_ALIAS:
        typeName = transactionTypeName.mosaicAlias.name
        break;
      case TransactionType.MOSAIC_DEFINITION:
        typeName = transactionTypeName.mosaicDefinition.name
        break;
      case TransactionType.MOSAIC_SUPPLY_CHANGE:
        typeName = transactionTypeName.mosaicSupplyChange.name
        break;
      case TransactionType.REGISTER_NAMESPACE:
        typeName = transactionTypeName.registerNameSpace.name
        break;
      case TransactionType.SECRET_LOCK:
        typeName = transactionTypeName.secretLock.name
        break;
      case TransactionType.SECRET_PROOF:
        typeName = transactionTypeName.secretProof.name
        break;
      case TransactionType.TRANSFER:
        typeName = transactionTypeName.transfer.name
        break;
      case TransactionType.ACCOUNT_METADATA_V2:
        typeName = transactionTypeName.modifyAccountMetadata_v2.name
        break;
      case TransactionType.MOSAIC_METADATA_V2:
        typeName = transactionTypeName.modifyMosaicMetadata_v2.name
        break;
      case TransactionType.NAMESPACE_METADATA_V2:
        typeName = transactionTypeName.modifyNamespaceMetadata_v2.name
        break;
      case TransactionType.MODIFY_MOSAIC_LEVY:
        typeName = transactionTypeName.modifyMosaicLevy.name
        break;
      case TransactionType.REMOVE_MOSAIC_LEVY:
        typeName = transactionTypeName.removeRemoveLevy.name
        break;  

      default:
        typeName = null;
        break;
    }

    return typeName;
  }

  static async getTransaction(hash: string) : Promise<any|boolean> {
    try {
      let txn:any = {};
      let txnStatus = await AppState.chainAPI.transactionAPI.getTransactionStatus(hash);
      if(txnStatus.group == 'partial'){
        txn = await AppState.chainAPI.transactionAPI.getPartialTransaction(hash);
      }else{
        txn = await AppState.chainAPI.transactionAPI.getTransaction(hash);
      }
      console.log(txn);

      // get fee
      let transactionInfo: TransactionInfo | AggregateTransactionInfo = txn.transactionInfo;
      let txnHash = transactionInfo instanceof AggregateTransactionInfo ? transactionInfo.aggregateHash : transactionInfo.hash;

      let blockHeight: number = 0;
      let txnBytes: number = 0;
      let deadline = null;

      if(transactionInfo instanceof AggregateTransactionInfo){
        console.log(txn)
        console.log(TransactionUtils.getTransactionTypeName(txn.type))
        //let aggregateTxn = await this.autoFindAggregateTransaction(txnHash);
        blockHeight = transactionInfo.height.compact();
        //txnBytes = aggregateTxn.serialize().length / 2;
        //deadline = aggregateTxn.deadline.adjustedValue.compact();
      }
      else if(txn.type === TransactionType.AGGREGATE_BONDED || txn.type === TransactionType.AGGREGATE_COMPLETE){
        console.log(txn)
        console.log(TransactionUtils.getTransactionTypeName(txn.type))
        let aggregateTxn = await TransactionUtils.autoFindAggregateTransaction(txnHash);
        blockHeight = aggregateTxn.transactionInfo.height.compact();
        txnBytes = aggregateTxn.serialize().length / 2;
        deadline = aggregateTxn.deadline.adjustedValue.compact();
      }
      else{
        blockHeight = transactionInfo.height.compact();

        // wait SDK to fix
        try {
            txnBytes = txn.serialize().length / 2;
        } catch (error) {
            console.log(error);
        }
        deadline = txn.deadline.adjustedValue.compact();
      }

      let blockInfo = await AppState.chainAPI.blockAPI.getBlockByHeight(blockHeight);
      txn.fee = txnBytes * blockInfo.feeMultiplier;
      txn.deadline = deadline;
      txn.timestamp = new Date(blockInfo.timestamp.compact() + Deadline.timestampNemesisBlock * 1000).toISOString()

      console.log(txn)

      if(txn.type == TransactionType.TRANSFER){
        let sdas: SDA[] = [];
        for(let y = 0; y < txn.mosaics.length; ++y){
          let rawAmount = txn.mosaics[y].amount.compact();
          let actualAmount = rawAmount;
          let assetId:MosaicId;
          let isSendWithNamespace = TransactionUtils.isNamespace(txn.mosaics[y].id);
          if(isSendWithNamespace){
            let namespaceId = new NamespaceId(txn.mosaics[y].id.toDTO().id);
            assetId = await TransactionUtils.getAssetAlias(namespaceId);
          }
          else{
            assetId = txn.mosaics[y].id;
          }

          let assetIdHex = assetId.toHex();
          txn.amountTransfer = 0;
          if([AppState.nativeToken.assetId, nativeTokenNamespaceId.value].includes(assetIdHex)){
            txn.amountTransfer += TransactionUtils.convertToExactNativeAmount(actualAmount);
            continue;
          }

          let assetInfo = await TransactionUtils.getAssetInfo(txn.mosaics[y].id.toHex());

          let newSDA: any = {
            amount: rawAmount/Math.pow(10, assetInfo.divisibility),
            id: assetIdHex,
          };
          let assetName = await TransactionUtils.getAssetName(assetIdHex);
          if(assetName.names[0]){
            newSDA.name = assetName.names[0].name;
          }
          sdas.push(newSDA);
        }
        txn.amount = sdas;
      }
      return {txn, txnStatus, isFound: true};
    }catch (e){
      return { isFound: false };
      console.error(e)
    }
  }

  static isNamespace(mosaicId: MosaicId): boolean{
    console.log(mosaicId.toHex())
    return Array.from(namespaceIdFirstCharacterString).includes(mosaicId.toHex().toUpperCase().substring(0, 1));
  }

  static async getAssetAlias(namespaceId: NamespaceId): Promise<MosaicId>{

    let assetId = await AppState.chainAPI.namespaceAPI.getLinkedMosaicId(namespaceId);

   return assetId;
  }

  static async getAssetInfo(assetId: string): Promise<MosaicInfo>{
    let mosaicId = new MosaicId(assetId);
    let assetInfo = await AppState.chainAPI.assetAPI.getMosaic(mosaicId);
    return assetInfo;
  }

  static async getAddressAlias(namespaceId: NamespaceId): Promise<Address>{
    let address = await AppState.chainAPI.namespaceAPI.getLinkedAddress(namespaceId);

    return address;
  }

  static async getAssetName(assetId: string): Promise<MosaicNames>{
    let mosaicId = new MosaicId(assetId);
    let assetNames = await AppState.chainAPI.assetAPI.getMosaicsNames([mosaicId]);
    return assetNames[0];
  }

  static async getAssetsName(mosaicIds: MosaicId[]): Promise<MosaicNames[]>{
    let assetNames = await AppState.chainAPI.assetAPI.getMosaicsNames(mosaicIds);

    return assetNames;
  }

  static async getAssetMetadata(assetId: MosaicId, scopedMetadataKey: UInt64): Promise<MetadataEntry>{
    let metadataQP = new MetadataQueryParams();
    metadataQP.metadataType = MetadataType.MOSAIC;
    metadataQP.scopedMetadataKey = scopedMetadataKey;
    metadataQP.targetId = assetId;

    let metadataResult = await AppState.chainAPI.metadataAPI.searchMetadatas(metadataQP);

    return metadataResult.metadataEntries.length ? metadataResult.metadataEntries[0] : null;
  }

  static async getAccountMetadata(targetKey: PublicAccount, scopedMetadataKey: UInt64): Promise<MetadataEntry>{
    let metadataQP = new MetadataQueryParams();
    metadataQP.metadataType = MetadataType.ACCOUNT;
    metadataQP.scopedMetadataKey = scopedMetadataKey;
    metadataQP.targetKey = targetKey;

    let metadataResult = await AppState.chainAPI.metadataAPI.searchMetadatas(metadataQP);

    return metadataResult.metadataEntries.length ? metadataResult.metadataEntries[0] : null;
  }

  static async getNamespaces(namespaceId: NamespaceId): Promise<NamespaceInfo>{
    let namespaceInfo = await AppState.chainAPI.namespaceAPI.getNamespace(namespaceId);
    return namespaceInfo;
  }

  static async getNamespacesName(namespaceIds: NamespaceId[]): Promise<NamespaceName[]>{
    let namespacesName = await AppState.chainAPI.namespaceAPI.getNamespacesName(namespaceIds);

    return namespacesName;
  }

  static async getNamespaceMetadata(nsId: NamespaceId, scopedMetadataKey: UInt64): Promise<MetadataEntry>{
    let metadataQP = new MetadataQueryParams();
    metadataQP.metadataType = MetadataType.NAMESPACE;
    metadataQP.scopedMetadataKey = scopedMetadataKey;
    metadataQP.targetId = nsId;

    let metadataResult = await AppState.chainAPI.metadataAPI.searchMetadatas(metadataQP);

    return metadataResult.metadataEntries.length ? metadataResult.metadataEntries[0] : null;
  }

  /**
     * @param oldValue - string
     * @param valueChange - hex string
     * @param sizeDelta
     */
  static applyValueChange(oldValue: string,  valueChange: string, sizeDelta: number): string{

    let newSize = (Convert.utf8ToHex(oldValue).length /2) + sizeDelta;
    let oldValueBytes = Convert.hexToUint8(Convert.utf8ToHex(oldValue));
    let valueChangeBytes = Convert.hexToUint8(valueChange);

    let valueUint8Array = new Uint8Array(newSize);

    for(let i = 0; i < valueUint8Array.length; ++i){
        valueUint8Array[i] = oldValueBytes[i] ^ valueChangeBytes[i];
    }

    return Convert.decodeHexToUtf8(Convert.uint8ToHex(valueUint8Array));
  }

  static convertToExactNativeAmount(amount: number){
    if(AppState.nativeToken.divisibility === 0){
      return amount;
    }
    return amount > 0 ? amount / Math.pow(10, AppState.nativeToken.divisibility) : 0;
  }

  static convertToExactAmount(amount: number, divisibility: number){
    if(divisibility === 0){
        return amount;
    }
    return amount > 0 ? amount / Math.pow(10, divisibility) : 0;
  }

  static convertToSwapType(txnMessage: string){
    let newType = null;
    try {
      if(txnMessage){
        let messageData = JSON.parse(txnMessage);

        if(messageData.type){
          switch (messageData.type) {
            case 'Swap':
              newType = 'Swap (nis1-XPX)';
              break;
            case 'Swap-bsc-xpx':
              newType = 'Swap (BSC-XPX)';
              break;
            case 'Swap-xpx-bsc':
              newType = 'Swap (XPX-BSC)';
              break;
            case 'Swap-xpx-bsc-fees':
              newType = 'Swap Fee (XPX-BSC)';
              break;
            default:
              break;
          }
        }
      }
    } catch (error) {}
    return newType;
  }

  static async extractPartialInnerTransaction(innerTransaction: InnerTransaction): Promise<InnerTxnDetails> {

    let transactionDetails: InnerTxnDetails;

    let tempData: MyInnerTxn;

    switch (innerTransaction.type) {
      case TransactionType.ADDRESS_ALIAS: {
        let addressAliasTx = innerTransaction as AddressAliasTransaction;
        tempData = await TransactionUtils.extractAddressAlias(addressAliasTx);
        let addressAliasFormat = tempData as InnerAliasTransaction;

        let infos: TxnDetails[] = [];

        let namespaceInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Namespace",
            value: addressAliasFormat.aliasName
        };
        infos.push(namespaceInfo);

        let actionInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Action",
            value: addressAliasFormat.aliasTypeName
        };
        infos.push(actionInfo);

        let addressInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Address",
            value: addressAliasFormat.address
        };
        infos.push(addressInfo);

        transactionDetails = {
            signer: addressAliasFormat.signer,
            signerAddressPlain: addressAliasFormat.signerAddress,
            signerAddressPretty: Address.createFromRawAddress(addressAliasFormat.signerAddress).pretty(),
            infos: infos,
            sdas: [],
            legendType: InnerTxnLegendType.NONE,
            typeName: addressAliasFormat.type
        };
      }
      break;

      case TransactionType.MOSAIC_ALIAS: {
        let mosaicAliasTx = innerTransaction as MosaicAliasTransaction;
        tempData = await TransactionUtils.extractAssetAlias(mosaicAliasTx);
        let assetAliasFormat = tempData as InnerAliasTransaction;

        let infos: TxnDetails[] = [];

        let namespaceInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Namespace",
          value: assetAliasFormat.aliasName
        };
        infos.push(namespaceInfo);

        let actionInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Action",
          value: assetAliasFormat.aliasTypeName
        };
        infos.push(actionInfo);

        let assetInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Asset",
          value: assetAliasFormat.assetId
        };
        infos.push(assetInfo);

        transactionDetails = {
          signer: assetAliasFormat.signer,
          signerAddressPlain: assetAliasFormat.signerAddress,
          signerAddressPretty: Address.createFromRawAddress(assetAliasFormat.signerAddress).pretty(),
          infos: infos,
          sdas: [],
          legendType: InnerTxnLegendType.NONE,
          typeName: assetAliasFormat.type
        };
      }
      break;

      case TransactionType.ADD_EXCHANGE_OFFER:{
        let addExchangeOfferTx = innerTransaction as AddExchangeOfferTransaction;
        tempData = await TransactionUtils.extractAddExchangeOffer(addExchangeOfferTx);
        let addExchangeOfferFormat = tempData as InnerExchangeTransaction;

        let infos: TxnDetails[] = [];

        for(let i =0; i < addExchangeOfferFormat.exchangeOffers.length; ++i){
            let offer = addExchangeOfferFormat.exchangeOffers[i];
            let offeringAssetString = `${offer.amount} ${offer.assetId}` + offer.assetNamespace ? ` (${offer.assetNamespace})`: '';
            let costString = `${offer.cost} ${AppState.nativeToken.label}`;
            let offerInfo: TxnDetails = {
                type: offer.type === "Buy" ? MsgType.GREEN: MsgType.RED,
                value: costString + " - " + offeringAssetString + `. Duration: ${offer.duration}`
            };
            infos.push(offerInfo);
        }

        transactionDetails = {
            signer: addExchangeOfferFormat.signer,
            signerAddressPlain: addExchangeOfferFormat.signerAddress,
            signerAddressPretty: Address.createFromRawAddress(addExchangeOfferFormat.signerAddress).pretty(),
            infos: infos,
            sdas: [],
            legendType: InnerTxnLegendType.BUY_SELL,
            typeName: addExchangeOfferFormat.type
        };
      }
      break;

      case TransactionType.EXCHANGE_OFFER:{
        let exchangeOfferTx = innerTransaction as ExchangeOfferTransaction;
        tempData = await TransactionUtils.extractExchangeOffer(exchangeOfferTx);
        let exchangeOfferFormat = tempData as InnerExchangeTransaction;

        let infos: TxnDetails[] = [];

        for(let i =0; i < exchangeOfferFormat.exchangeOffers.length; ++i){
          let offer = exchangeOfferFormat.exchangeOffers[i];
          let offeringAssetString = `${offer.amount} ${offer.assetId}` + offer.assetNamespace ? ` (${offer.assetNamespace})`: '';
          let costString = `${offer.cost} ${AppState.nativeToken.label}`;
          let ownerPublicAccount = PublicAccount.createFromPublicKey(offer.owner, AppState.networkType);
          let owner = Helper.createAddress(ownerPublicAccount.address.plain()).pretty();
          let offerInfo: TxnDetails = {
              type: offer.type === "Buy" ? MsgType.RED: MsgType.GREEN,
              value: costString + " - " + offeringAssetString + `. From: ${owner}`
          };
          infos.push(offerInfo);
        }

        transactionDetails = {
          signer: exchangeOfferFormat.signer,
          signerAddressPlain: exchangeOfferFormat.signerAddress,
          signerAddressPretty: Address.createFromRawAddress(exchangeOfferFormat.signerAddress).pretty(),
          infos: infos,
          sdas: [],
          legendType: InnerTxnLegendType.BUY_SELL,
          typeName: exchangeOfferFormat.type
        };
      }
      break;

      case TransactionType.REMOVE_EXCHANGE_OFFER:{
        let removeExchangeOfferTx = innerTransaction as RemoveExchangeOfferTransaction;
        tempData = await TransactionUtils.extractRemoveExchangeOffer(removeExchangeOfferTx);
        let removeExchangeOfferFormat = tempData as InnerExchangeTransaction;

        let infos: TxnDetails[] = [];

        for(let i =0; i < removeExchangeOfferFormat.exchangeOffers.length; ++i){
          let offer = removeExchangeOfferFormat.exchangeOffers[i];
          let offeringAssetString = `${offer.assetId}` + offer.assetNamespace ? ` (${offer.assetNamespace})`: '';

          let offerInfo: TxnDetails = {
              type: offer.type === "Buy" ? MsgType.GREEN: MsgType.RED,
              value: offeringAssetString
          };
          infos.push(offerInfo);
        }

        transactionDetails = {
          signer: removeExchangeOfferFormat.signer,
          signerAddressPlain: removeExchangeOfferFormat.signerAddress,
          signerAddressPretty: Address.createFromRawAddress(removeExchangeOfferFormat.signerAddress).pretty(),
          infos: infos,
          sdas: [],
          legendType: InnerTxnLegendType.BUY_SELL,
          typeName: removeExchangeOfferFormat.type
        };
      }
      break;

      case TransactionType.CHAIN_CONFIGURE:{
        let chainConfigureTx = innerTransaction as ChainConfigTransaction;
        tempData = TransactionUtils.extractChainConfig(chainConfigureTx);
        let chainConfigFormat = tempData as InnerChainTransaction;

        let infos: TxnDetails[] = [];

        let applyHeightDeltaInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Apply after blocks",
          value: chainConfigFormat.applyHeightDelta
        };
        infos.push(applyHeightDeltaInfo);

        transactionDetails = {
          signer: chainConfigFormat.signer,
          signerAddressPlain: chainConfigFormat.signerAddress,
          signerAddressPretty: Address.createFromRawAddress(chainConfigFormat.signerAddress).pretty(),
          infos: infos,
          sdas: [],
          legendType: InnerTxnLegendType.NONE,
          typeName: chainConfigFormat.type
        };
      }
      break;

      case TransactionType.CHAIN_UPGRADE:{
        let chainUpgradeTx = innerTransaction as ChainUpgradeTransaction;
        tempData = TransactionUtils.extractChainUpgrade(chainUpgradeTx);
        let chainUpgradeFormat = tempData as InnerChainTransaction;

        let infos: TxnDetails[] = [];

        let versionInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "New Version",
            value: chainUpgradeFormat.newVersion
        };
        infos.push(versionInfo);

        let upgradePeriodInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Upgrade After Blocks",
            value: chainUpgradeFormat.upgradePeriod
        };
        infos.push(upgradePeriodInfo);

        transactionDetails = {
            signer: chainUpgradeFormat.signer,
            signerAddressPlain: chainUpgradeFormat.signerAddress,
            signerAddressPretty: Address.createFromRawAddress(chainUpgradeFormat.signerAddress).pretty(),
            infos: infos,
            sdas: [],
            legendType: InnerTxnLegendType.NONE,
            typeName: chainUpgradeFormat.type
        };
      }
      break;

      case TransactionType.LINK_ACCOUNT:{
        let accountLinkTx = innerTransaction as AccountLinkTransaction;
        tempData = TransactionUtils.extractAccountLink(accountLinkTx);
        let accountLinkFormat = tempData as InnerLinkTransaction;
        let infos: TxnDetails[] = [];

        let linkInfo: TxnDetails = {
            type: accountLinkFormat.action === "Link" ? MsgType.GREEN : MsgType.RED,
            value: accountLinkFormat.remotePublicKey
        };
        infos.push(linkInfo);

        transactionDetails = {
            signer: accountLinkFormat.signer,
            signerAddressPlain: accountLinkFormat.signerAddress,
            signerAddressPretty: Address.createFromRawAddress(accountLinkFormat.signerAddress).pretty(),
            infos: infos,
            sdas: [],
            legendType: InnerTxnLegendType.ADD_REMOVE,
            typeName: accountLinkFormat.type
        };
      }
      break;

      case TransactionType.LOCK:{
        let lockFundTx = innerTransaction as LockFundsTransaction;
        tempData = await TransactionUtils.extractLockHash(lockFundTx, TransactionGroupType.PARTIAL);
        let lockFundFormat = tempData as InnerLockTransaction;

        let infos: TxnDetails[] = [];

        let hashInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Hash",
          value: lockFundFormat.lockHash
        };
        infos.push(hashInfo);
        let durationInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Action",
          value: lockFundFormat.duration
        };

        infos.push(durationInfo);

        let lockingInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Locking Amount",
          value: lockFundFormat.amountLocking + ` ${AppState.nativeToken.label}`
        };
        infos.push(lockingInfo);

        transactionDetails = {
          signer: lockFundFormat.signer,
          signerAddressPlain: lockFundFormat.signerAddress,
          signerAddressPretty: Address.createFromRawAddress(lockFundFormat.signerAddress).pretty(),
          infos: infos,
          sdas: [],
          legendType: InnerTxnLegendType.NONE,
          typeName: lockFundFormat.type
        };
      }
      break;

      case TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS:{
        let accAddressRestrictionTx = innerTransaction as AccountAddressRestrictionModificationTransaction;
        tempData = TransactionUtils.extractAccAddressRestriction(accAddressRestrictionTx);
        let accAddressRestrictionFormat = tempData as InnerRestrictionTransaction;

        let infos: TxnDetails[] = [];

        let actionInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Action",
          value: accAddressRestrictionFormat.restrictionTypeOutput
        };

        infos.push(actionInfo);
        for(let i =0; i < accAddressRestrictionFormat.modification.length; ++i){
          let modification = accAddressRestrictionFormat.modification[i];

          let restrictInfo: TxnDetails = {
            type:  modification.action === "Add" ? MsgType.GREEN : MsgType.RED,
            value: modification.value,
            short: Helper.createAddress(modification.value).pretty()
          };
          infos.push(restrictInfo);
        }

        transactionDetails = {
          signer: accAddressRestrictionFormat.signer,
          signerAddressPlain: accAddressRestrictionFormat.signerAddress,
          signerAddressPretty: Address.createFromRawAddress(accAddressRestrictionFormat.signerAddress).pretty(),
          infos: infos,
          sdas: [],
          legendType: InnerTxnLegendType.ALLOW_BLOCK,
          typeName: accAddressRestrictionFormat.type
        };
      }
      break;

      case TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC:{
        let accMosaicModifyTx = innerTransaction as AccountMosaicRestrictionModificationTransaction;
        tempData = await TransactionUtils.extractAccAssetRestriction(accMosaicModifyTx);
        let accAssetRestrictionFormat = tempData as InnerRestrictionTransaction;

        let infos: TxnDetails[] = [];

        let actionInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Action",
            value: accAssetRestrictionFormat.restrictionTypeOutput
        };

        infos.push(actionInfo);
        for(let i =0; i < accAssetRestrictionFormat.modification.length; ++i){
            let modification = accAssetRestrictionFormat.modification[i];

            let restrictInfo: TxnDetails = {
                type:  modification.action === "Add" ? MsgType.GREEN : MsgType.RED,
                value: modification.value + modification.name ? `(${modification.name})` : ''
            };

            infos.push(restrictInfo);
        }

        transactionDetails = {
            signer: accAssetRestrictionFormat.signer,
            signerAddressPlain: accAssetRestrictionFormat.signerAddress,
            signerAddressPretty: Address.createFromRawAddress(accAssetRestrictionFormat.signerAddress).pretty(),
            infos: infos,
            sdas: [],
            legendType: InnerTxnLegendType.ALLOW_BLOCK,
            typeName: accAssetRestrictionFormat.type
        };
      }
      break;

      case TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION:{
        let accOperationModifyTx = innerTransaction as AccountOperationRestrictionModificationTransaction;
        tempData = TransactionUtils.extractAccOperationRestriction(accOperationModifyTx);
        let accOperationRestrictionFormat = tempData as InnerRestrictionTransaction;

        let infos: TxnDetails[] = [];

        let actionInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Action",
          value: accOperationRestrictionFormat.restrictionTypeOutput
        };

        infos.push(actionInfo);
        for(let i =0; i < accOperationRestrictionFormat.modification.length; ++i){
          let modification = accOperationRestrictionFormat.modification[i];

          let restrictInfo: TxnDetails = {
            type:  modification.action === "Add" ? MsgType.GREEN : MsgType.RED,
            value: modification.value
          };

          infos.push(restrictInfo);
        }

        transactionDetails = {
          signer: accOperationRestrictionFormat.signer,
          signerAddressPlain: accOperationRestrictionFormat.signerAddress,
          signerAddressPretty: Address.createFromRawAddress(accOperationRestrictionFormat.signerAddress).pretty(),
          infos: infos,
          sdas: [],
          legendType: InnerTxnLegendType.ALLOW_BLOCK,
          typeName: accOperationRestrictionFormat.type
        };
      }
      break;

      case TransactionType.MODIFY_MULTISIG_ACCOUNT:{
        let modifyMultisigAccountTx = innerTransaction as ModifyMultisigAccountTransaction;
        tempData = await TransactionUtils.extractModifyMultisig(modifyMultisigAccountTx, TransactionGroupType.PARTIAL);
        let modifyMultisigFormat = tempData as InnerAccountTransaction;

        let infos: TxnDetails[] = [];
        let approvalChanges: string;

        if(modifyMultisigFormat.approvalDelta === 0){
          approvalChanges = '';
        }
        else if(modifyMultisigFormat.approvalDelta > 0){
          approvalChanges = ` (+${modifyMultisigFormat.approvalDelta})`;
        }
        else{
          approvalChanges = ` (${modifyMultisigFormat.approvalDelta})`;
        }

        let minApprovalInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Minimum Approval",
          value: modifyMultisigFormat.oldApprovalNumber + approvalChanges
        };

        infos.push(minApprovalInfo);

        let removalChanges: string;

        if(modifyMultisigFormat.removalDelta === 0){
          removalChanges = '';
        }
        else if(modifyMultisigFormat.removalDelta > 0){
          removalChanges = ` (+${modifyMultisigFormat.removalDelta})`;
        }
        else{
          removalChanges = ` (${modifyMultisigFormat.removalDelta})`;
        }

        let minRemovalInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Minimum Removal",
          value: modifyMultisigFormat.oldRemovalNumber + removalChanges
        };

        infos.push(minRemovalInfo);

        for(let i =0; i < modifyMultisigFormat.addedCosigner.length; ++i){
          let publicAccount = PublicAccount.createFromPublicKey(modifyMultisigFormat.addedCosigner[i], AppState.networkType)
          let tryShortName = Helper.createAddress(publicAccount.address.plain()).pretty();
          let shortName = tryShortName === publicAccount.address.plain() ? '' : tryShortName;
          let addCosignerInfo: TxnDetails = {
            type: MsgType.GREEN,
            value: modifyMultisigFormat.addedCosigner[i],
            short: shortName
          };

          infos.push(addCosignerInfo);
        }

        for(let i =0; i < modifyMultisigFormat.removedCosigner.length; ++i){
          let publicAccount = PublicAccount.createFromPublicKey(modifyMultisigFormat.removedCosigner[i], AppState.networkType)
          let removeCosignerInfo: TxnDetails = {
            type: MsgType.GREEN,
            value: modifyMultisigFormat.removedCosigner[i],
            short: Helper.createAddress(publicAccount.address.plain()).pretty()
          };

          infos.push(removeCosignerInfo);
        }

        transactionDetails = {
          signer: modifyMultisigFormat.signer,
          signerAddressPlain: modifyMultisigFormat.signerAddress,
          signerAddressPretty: Address.createFromRawAddress(modifyMultisigFormat.signerAddress).pretty(),
          infos: infos,
          sdas: [],
          legendType: InnerTxnLegendType.ADD_REMOVE,
          typeName: modifyMultisigFormat.type
        };
      }
      break;

      case TransactionType.MOSAIC_DEFINITION:{
        let mosaicDefinitionTx = innerTransaction as MosaicDefinitionTransaction;
        tempData = TransactionUtils.extractAssetDefinition(mosaicDefinitionTx);
        let assetDefFormat = tempData as InnerAssetTransaction;

        let infos: TxnDetails[] = [];
        let assetInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Asset",
          value: assetDefFormat.assetId
        };

        infos.push(assetInfo);

        let assetDivisibilityInfo: TxnDetails = {
          type: MsgType.INFO,
          value: `Divisibility: ${assetDefFormat.divisibility}`
        };

        infos.push(assetDivisibilityInfo);

        let assetTransferableInfo: TxnDetails = {
          type: assetDefFormat.transferable ? MsgType.GREEN : MsgType.RED,
          value: `Transferable`
        };

        infos.push(assetTransferableInfo);

        let assetSupplyMutableInfo: TxnDetails = {
          type: assetDefFormat.supplyMutable ? MsgType.GREEN : MsgType.RED,
          value: `Supply Mutable`
        };

        infos.push(assetSupplyMutableInfo);

        if(assetDefFormat.duration){
          let assetDurationInfo: TxnDetails = {
            type: MsgType.INFO,
            label: "Duration",
            value: assetDefFormat.duration
          };

          infos.push(assetDurationInfo);
        }

        transactionDetails = {
          signer: assetDefFormat.signer,
          signerAddressPlain: assetDefFormat.signerAddress,
          signerAddressPretty: Address.createFromRawAddress(assetDefFormat.signerAddress).pretty(),
          infos: infos,
          sdas: [],
          legendType: InnerTxnLegendType.TRUE_FALSE,
          typeName: assetDefFormat.type
        };
      }
      break;

      case TransactionType.MOSAIC_SUPPLY_CHANGE:{
        let mosaicSupplyTx = innerTransaction as MosaicSupplyChangeTransaction;
        tempData = await TransactionUtils.extractAssetSupplyChange(mosaicSupplyTx);
        let assetSupplyFormat = tempData as InnerAssetTransaction;

        let infos: TxnDetails[] = [];
        let assetInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Asset",
          value: assetSupplyFormat.assetId + assetSupplyFormat.namespaceName ? ` (${assetSupplyFormat.namespaceName})` : ''
        };

        infos.push(assetInfo);

        let assetSupplyInfo: TxnDetails = {
          type: MsgType.INFO,
          label: "Asset",
          value: assetSupplyFormat.supplyDelta > 0 ? `+${assetSupplyFormat.supplyDelta}` : assetSupplyFormat.supplyDelta
        };

        infos.push(assetSupplyInfo);

        transactionDetails = {
          signer: assetSupplyFormat.signer,
          signerAddressPlain: assetSupplyFormat.signerAddress,
          signerAddressPretty: Address.createFromRawAddress(assetSupplyFormat.signerAddress).pretty(),
          infos: infos,
          sdas: [],
          legendType: InnerTxnLegendType.NONE,
          typeName: assetSupplyFormat.type
        };
      }
      break;

      case TransactionType.MODIFY_MOSAIC_LEVY:{
        let assetLevyTx = innerTransaction as MosaicModifyLevyTransaction;
        tempData = await TransactionUtils.extractAssetModifyLevy(assetLevyTx);
        let assetLevyFormat = tempData as InnerAssetTransaction;

        let infos: TxnDetails[] = [];
        let assetInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Asset",
          value: assetLevyFormat.assetId + assetLevyFormat.namespaceName ? ` (${assetLevyFormat.namespaceName})` : ''
        };

        infos.push(assetInfo);

        let levyAssetInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Levy Asset",
          value: assetLevyFormat.levyAssetAmount + ' ' + assetLevyFormat.levyAssetId + assetLevyFormat.levyAssetName ? ` (${assetLevyFormat.levyAssetName})` : ''
        };

        infos.push(levyAssetInfo);

        let levyAssetRecipientInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Levy Recipient",
          value: assetLevyFormat.levyRecipient,
          short: Helper.createAddress(assetLevyFormat.levyRecipient).pretty()
        };

        infos.push(levyAssetRecipientInfo);

        transactionDetails = {
          signer: assetLevyFormat.signer,
          signerAddressPlain: assetLevyFormat.signerAddress,
          signerAddressPretty: Helper.createAddress(assetLevyFormat.signerAddress).pretty(),
          infos: infos,
          sdas: [],
          legendType: InnerTxnLegendType.NONE,
          typeName: assetLevyFormat.type
        };
      }
      break;

      case TransactionType.REMOVE_MOSAIC_LEVY:{
        let assetRemoveLevyTx = innerTransaction as MosaicRemoveLevyTransaction;
        tempData = await TransactionUtils.extractAssetRemoveLevy(assetRemoveLevyTx);
        let removeAssetLevyFormat = tempData as InnerAssetTransaction;

        let infos: TxnDetails[] = [];
        
        let assetInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Asset",
          value: removeAssetLevyFormat.assetId + removeAssetLevyFormat.namespaceName ? ` (${removeAssetLevyFormat.namespaceName})` : ''
        };

        infos.push(assetInfo);

        transactionDetails = {
          signer: removeAssetLevyFormat.signer,
          signerAddressPlain: removeAssetLevyFormat.signerAddress,
          signerAddressPretty: Address.createFromRawAddress(removeAssetLevyFormat.signerAddress).pretty(),
          infos: infos,
          sdas: [],
          legendType: InnerTxnLegendType.NONE,
          typeName: removeAssetLevyFormat.type
        };
      }
      break;

      case TransactionType.REGISTER_NAMESPACE:{
        let registerNamespaceTx = innerTransaction as RegisterNamespaceTransaction;
        tempData = await TransactionUtils.extractRegisterNamespace(registerNamespaceTx);
        let registerNamespaceFormat = tempData as InnerNamespaceTransaction;

        let infos: TxnDetails[] = [];
        let typeInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Type",
          value: registerNamespaceFormat.registerTypeName + registerNamespaceFormat.isExtend ? ' (Extend)' : ' (Register)'
        };
        infos.push(typeInfo);

        let nameInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Name",
          value: registerNamespaceFormat.namespaceName
        };
        infos.push(nameInfo);

        if(registerNamespaceFormat.parentName){
          let parentNameInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Parent Name",
            value: registerNamespaceFormat.parentName
          };
          infos.push(parentNameInfo);
        }

        if(registerNamespaceFormat.duration){
          let durationInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Duration",
            value: registerNamespaceFormat.duration.toString()
          };
          infos.push(durationInfo);
        }

        transactionDetails = {
          signer: registerNamespaceFormat.signer,
          signerAddressPlain: registerNamespaceFormat.signerAddress,
          signerAddressPretty: Address.createFromRawAddress(registerNamespaceFormat.signerAddress).pretty(),
          infos: infos,
          sdas: [],
          legendType: InnerTxnLegendType.NONE,
          typeName: registerNamespaceFormat.type
        };
      }
      break;

      case TransactionType.SECRET_LOCK:{
        let secretLockTx = innerTransaction as SecretLockTransaction;
        tempData = await TransactionUtils.extractNonconfirmedSecretLock(secretLockTx, TransactionGroupType.PARTIAL);
        let secretLockFormat = tempData as InnerSecretTransaction;

        let infos: TxnDetails[] = [];
        let sdas = [];

        let sdaString = `${secretLockFormat.amount} ${secretLockFormat.assetId}` + secretLockFormat.namespaceName ? ` (${secretLockFormat.namespaceName})`: '';

        sdas.push(sdaString);

        let recipientInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Recipient",
          value: secretLockFormat.recipient,
          short: Helper.createAddress(secretLockFormat.recipient).pretty()
        };

        infos.push(recipientInfo);

        let hashTypeInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Hash Type",
          value: secretLockFormat.hashType
        };

        infos.push(hashTypeInfo);

        let secretInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Secret",
          value: secretLockFormat.secret
        };

        infos.push(secretInfo);

        let durationInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Duration",
          value: secretLockFormat.duration
        };

        infos.push(durationInfo);

        transactionDetails = {
          signer: secretLockFormat.signer,
          signerAddressPlain: secretLockFormat.signerAddress,
          signerAddressPretty: Address.createFromRawAddress(secretLockFormat.signerAddress).pretty(),
          infos: infos,
          sdas: sdas,
          legendType: InnerTxnLegendType.NONE,
          typeName: secretLockFormat.type
        };
      }
      break;

      case TransactionType.SECRET_PROOF:{
        let secretProofTx = innerTransaction as SecretProofTransaction;
        tempData = TransactionUtils.extractSecretProof(secretProofTx);
        let secretProofFormat = tempData as InnerSecretTransaction;

        let infos: TxnDetails[] = [];

        let recipientInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Recipient",
          value: secretProofFormat.recipient,
          short: Helper.createAddress(secretProofFormat.recipient).pretty()
        };

        infos.push(recipientInfo);

        let hashTypeInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Hash Type",
          value: secretProofFormat.hashType
        };

        infos.push(hashTypeInfo);

        let secretInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Secret",
          value: secretProofFormat.secret
        };

        infos.push(secretInfo);

        let proofInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Proof",
          value: secretProofFormat.proof
        };

        infos.push(proofInfo);

        transactionDetails = {
          signer: secretProofFormat.signer,
          signerAddressPlain: secretProofFormat.signerAddress,
          signerAddressPretty: Address.createFromRawAddress(secretProofFormat.signerAddress).pretty(),
          infos: infos,
          sdas: [],
          legendType: InnerTxnLegendType.NONE,
          typeName: secretProofFormat.type
        };
      }
      break;

      case TransactionType.TRANSFER:{
        let transferTx = innerTransaction as TransferTransaction;
        tempData = await TransactionUtils.extractNonconfirmedTransfer(transferTx, TransactionGroupType.PARTIAL);
        let transferFormat = tempData as InnerTransferTransaction;
        let sdas = [];
        let infos: TxnDetails[] = [];

        let shortName = Helper.createAddress(transferFormat.recipient).pretty();
        if(shortName === transferFormat.recipient && transferFormat.recipientNamespaceName){
          shortName = transferFormat.recipientNamespaceName;
        }
        else if(shortName === transferFormat.recipient){
          shortName = '';
        }

        let recipientInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Recipient",
          value: Address.createFromRawAddress(transferFormat.recipient).pretty(),
          short: shortName
        };

        infos.push(recipientInfo);

        if(transferFormat.message){
          let msgInfo: TxnDetails = {
            type: MsgType.NONE,
            label: transferFormat.messageTypeTitle,
            value: transferFormat.messageType === MessageType.EncryptedMessage ? 'xxxxxx' : transferFormat.message,
          };
          infos.push(msgInfo);
        }

        if(transferFormat.amountTransfer){
          sdas.push(`${transferFormat.amountTransfer} ${AppState.nativeToken.label}`);
        }

        for(let i = 0; i < transferFormat.sda.length; ++i){
          let tempSDA = transferFormat.sda[i];
          let sdaString = '';
          if(tempSDA.currentAlias && tempSDA.currentAlias.length){
            sdaString = (tempSDA.amount + ` ${tempSDA.id} ` + `(${tempSDA.currentAlias[0].name})`);
          }else{
            sdaString = (tempSDA.amount + ' ' + tempSDA.id);
          }
          sdas.push(sdaString);
        }

        transactionDetails = {
          signer: transferFormat.signer,
          signerAddressPlain: transferFormat.signerAddress,
          signerAddressPretty: Address.createFromRawAddress(transferFormat.signerAddress).pretty(),
          infos: infos,
          sdas: sdas,
          legendType: InnerTxnLegendType.NONE,
          typeName: transferFormat.type
        };
      }
      break;

      case TransactionType.ACCOUNT_METADATA_V2:{
        let accMetadataTx = innerTransaction as AccountMetadataTransaction;
        tempData = await TransactionUtils.extractAccMetadata(accMetadataTx, TransactionGroupType.PARTIAL);
        let accMetadataFormat = tempData as InnerMetadataTransaction;
        let infos: TxnDetails[] = [];

        let targetPublicAccount =  PublicAccount.createFromPublicKey(accMetadataFormat.targetPublicKey, AppState.networkType);
        let targetAddress = targetPublicAccount.address.plain();

        let accountInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Account",
          value: targetPublicAccount.address.plain(),
          short: Helper.createAddress(targetAddress).pretty()
        };

        infos.push(accountInfo);

        let scopedMetadataKeyInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Scoped Metadata Key",
          value: accMetadataFormat.scopedMetadataKey
        };

        infos.push(scopedMetadataKeyInfo);

        if(accMetadataFormat.oldValue){
          let oldValueInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Current Value",
            value: accMetadataFormat.oldValue
          };

          infos.push(oldValueInfo);
        }

        let newValueInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "New Value",
          value: accMetadataFormat.newValue
        };

        infos.push(newValueInfo);

        transactionDetails = {
          signer: accMetadataFormat.signer,
          signerAddressPlain: accMetadataFormat.signerAddress,
          signerAddressPretty: Address.createFromRawAddress(accMetadataFormat.signerAddress).pretty(),
          infos: infos,
          sdas: [],
          legendType: InnerTxnLegendType.NONE,
          typeName: accMetadataFormat.type
        };
      }
      break;

      case TransactionType.NAMESPACE_METADATA_V2:{
        let nsMetadataTx = innerTransaction as NamespaceMetadataTransaction;
        tempData = await TransactionUtils.extractNamespaceMetadata(nsMetadataTx, TransactionGroupType.PARTIAL);
        let namespaceMetadataFormat = tempData as InnerMetadataTransaction;

        let infos: TxnDetails[] = [];

        let namespaceInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Namespace",
          value: namespaceMetadataFormat.targetIdName ? namespaceMetadataFormat.targetIdName: namespaceMetadataFormat.targetId
        };

        infos.push(namespaceInfo);

        let scopedMetadataKeyInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "Scoped Metadata Key",
          value: namespaceMetadataFormat.scopedMetadataKey
        };

        infos.push(scopedMetadataKeyInfo);

        if(namespaceMetadataFormat.oldValue){
          let oldValueInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Current Value",
            value: namespaceMetadataFormat.oldValue
          };

          infos.push(oldValueInfo);
        }

        let newValueInfo: TxnDetails = {
          type: MsgType.NONE,
          label: "New Value",
          value: namespaceMetadataFormat.newValue
        };

        infos.push(newValueInfo);

        transactionDetails = {
          signer: namespaceMetadataFormat.signer,
          signerAddressPlain: namespaceMetadataFormat.signerAddress,
          signerAddressPretty: Address.createFromRawAddress(namespaceMetadataFormat.signerAddress).pretty(),
          infos: infos,
          sdas: [],
          legendType: InnerTxnLegendType.NONE,
          typeName: namespaceMetadataFormat.type
        };
      }
      break;

      case TransactionType.MOSAIC_METADATA_V2:{
        let assetMetadataTx = innerTransaction as MosaicMetadataTransaction;
        tempData = await TransactionUtils.extractAssetMetadata(assetMetadataTx, TransactionGroupType.PARTIAL);
        let assetMetadataFormat = tempData as InnerMetadataTransaction;

        let infos: TxnDetails[] = [];

        let namespaceInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Asset",
            value: assetMetadataFormat.targetIdName ? assetMetadataFormat.targetIdName: assetMetadataFormat.targetId
        };

        infos.push(namespaceInfo);

        let scopedMetadataKeyInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Scoped Metadata Key",
            value: assetMetadataFormat.scopedMetadataKey
        };

        infos.push(scopedMetadataKeyInfo);

        if(assetMetadataFormat.oldValue){
            let oldValueInfo: TxnDetails = {
                type: MsgType.NONE,
                label: "Current Value",
                value: assetMetadataFormat.oldValue
            };

            infos.push(oldValueInfo);
        }

        let newValueInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "New Value",
            value: assetMetadataFormat.newValue
        };

        infos.push(newValueInfo);

        transactionDetails = {
            signer: assetMetadataFormat.signer,
            signerAddressPlain: assetMetadataFormat.signerAddress,
            signerAddressPretty: Address.createFromRawAddress(assetMetadataFormat.signerAddress).pretty(),
            infos:infos,
            sdas: [],
            legendType: InnerTxnLegendType.NONE,
            typeName: assetMetadataFormat.type
        };
      }
      break;
      default:
        break;
    }

    return transactionDetails;
  }

  // -----------------------------------extract Address Alias only---------------------------------------------------
  static async extractAddressAlias(addressAliasTxn: AddressAliasTransaction): Promise<InnerAliasTransaction> {
    let txnDetails = new InnerAliasTransaction();
    txnDetails.signer = addressAliasTxn.signer.publicKey;
    txnDetails.signerAddress = addressAliasTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(addressAliasTxn.type);

    txnDetails.address = addressAliasTxn.address.plain();
    txnDetails.aliasType = addressAliasTxn.actionType;
    txnDetails.aliasTypeName = addressAliasTxn.actionType === AliasActionType.Link ? "Link" : "Unlink";
    let nsId = addressAliasTxn.namespaceId;

    try {
        let nsName = await TransactionUtils.getNamespacesName([nsId]);

        txnDetails.aliasName = nsName[0].name;
    } catch (error) {
    }
    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

   // -----------------------------------extract Asset Alias only---------------------------------------------------
  static async extractAssetAlias(assetAliasTxn: MosaicAliasTransaction): Promise<InnerAliasTransaction> {
    let txnDetails = new InnerAliasTransaction();
    txnDetails.signer = assetAliasTxn.signer.publicKey;
    txnDetails.signerAddress = assetAliasTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(assetAliasTxn.type);

    txnDetails.assetId = assetAliasTxn.mosaicId.toHex();
    txnDetails.aliasType = assetAliasTxn.actionType;
    txnDetails.aliasTypeName = assetAliasTxn.actionType === AliasActionType.Link ? "Link" : "Unlink";

    let nsId = assetAliasTxn.namespaceId;

    try {
        let nsName = await TransactionUtils.getNamespacesName([nsId]);

        txnDetails.aliasName = nsName[0].name;
    } catch (error) {
    }
    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Add Exchange Offer only---------------------------------------------------
  static async extractAddExchangeOffer(addExchangeOfferTxn: AddExchangeOfferTransaction): Promise<InnerExchangeTransaction> {

    let txnDetails = new InnerExchangeTransaction();
    txnDetails.signer = addExchangeOfferTxn.signer.publicKey;
    txnDetails.signerAddress = addExchangeOfferTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(addExchangeOfferTxn.type);

    for(let i = 0; i < addExchangeOfferTxn.offers.length; ++i){
      let tempExchangeOffer = addExchangeOfferTxn.offers[i];

      let assetId = tempExchangeOffer.mosaicId.toHex();
      let amount = tempExchangeOffer.mosaicAmount.compact();

      let newTxnExchangeOffer: TxnExchangeOffer = {
        amount: amount,
        amountIsRaw: true,
        assetId: assetId,
        cost: TransactionUtils.convertToExactNativeAmount(tempExchangeOffer.cost.compact()),
        duration: tempExchangeOffer.duration.compact(),
        type: tempExchangeOffer.type === ExchangeOfferType.SELL_OFFER ? "Sell" : "Buy",
      };

      try {
        let assetInfo = await TransactionUtils.getAssetInfo(assetId);

        newTxnExchangeOffer.amountIsRaw = false;
        newTxnExchangeOffer.amount = TransactionUtils.convertToExactAmount(amount, assetInfo.divisibility);

        let assetName = await TransactionUtils.getAssetName(assetId);

        if(assetName.names.length){
          newTxnExchangeOffer.assetNamespace = assetName.names[0].name;
        }

      } catch (error) {
      }

      txnDetails.exchangeOffers.push(newTxnExchangeOffer);
    }
    let allBuyOffers = txnDetails.exchangeOffers.filter(x => x.type === "Buy");
    let allSellOffers = txnDetails.exchangeOffers.filter(x => x.type === "Sell");

    txnDetails.exchangeOffers = txnDetails.isTakingOffer ? allSellOffers.concat(allBuyOffers) : allBuyOffers.concat(allSellOffers);

    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Remove Exchange Offer only---------------------------------------------------
  static async extractRemoveExchangeOffer(removeExchangeOfferTxn: RemoveExchangeOfferTransaction): Promise<InnerExchangeTransaction> {

    let txnDetails = new InnerExchangeTransaction();
    txnDetails.signer = removeExchangeOfferTxn.signer.publicKey;
    txnDetails.signerAddress = removeExchangeOfferTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(removeExchangeOfferTxn.type);

    for(let i = 0; i < removeExchangeOfferTxn.offers.length; ++i){
      let tempExchangeOffer = removeExchangeOfferTxn.offers[i];

      let assetId = tempExchangeOffer.mosaicId.toHex();

      let newTxnExchangeOffer: TxnExchangeOffer = {
        assetId: assetId,
        type: tempExchangeOffer.offerType === ExchangeOfferType.SELL_OFFER ? "Sell" : "Buy",
      };
      try {
        let assetName = await TransactionUtils.getAssetName(assetId);

        if(assetName.names.length){
            newTxnExchangeOffer.assetNamespace = assetName.names[0].name;
        }
      } catch (error) {}
      txnDetails.exchangeOffers.push(newTxnExchangeOffer);
    }

    let allBuyOffers = txnDetails.exchangeOffers.filter(x => x.type === "Buy");
    let allSellOffers = txnDetails.exchangeOffers.filter(x => x.type === "Sell");

    txnDetails.exchangeOffers = txnDetails.isTakingOffer ? allSellOffers.concat(allBuyOffers) : allBuyOffers.concat(allSellOffers);

    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Chain Configure only---------------------------------------------------
  static extractChainConfig(chainConfigureTxn: ChainConfigTransaction): InnerChainTransaction {
    let txnDetails = new InnerChainTransaction();
    txnDetails.signer = chainConfigureTxn.signer.publicKey;
    txnDetails.signerAddress = chainConfigureTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(chainConfigureTxn.type);
    txnDetails.applyHeightDelta = chainConfigureTxn.applyHeightDelta.compact();
    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Chain Upgrade only---------------------------------------------------
  static extractChainUpgrade(chainUpdateTxn: ChainUpgradeTransaction): InnerChainTransaction {

    let txnDetails = new InnerChainTransaction();
    txnDetails.signer = chainUpdateTxn.signer.publicKey;
    txnDetails.signerAddress = chainUpdateTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(chainUpdateTxn.type);
    txnDetails.upgradePeriod = chainUpdateTxn.upgradePeriod.compact();
    txnDetails.newVersion = chainUpdateTxn.newBlockchainVersion.toHex()
    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Exchange Offer only---------------------------------------------------
  static async extractExchangeOffer(exchangeOfferTxn: ExchangeOfferTransaction): Promise<InnerExchangeTransaction> {
    let txnDetails = new InnerExchangeTransaction();
    txnDetails.signer = exchangeOfferTxn.signer.publicKey;
    txnDetails.signerAddress = exchangeOfferTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(exchangeOfferTxn.type);

    txnDetails.isTakingOffer = true;
    for(let i = 0; i < exchangeOfferTxn.offers.length; ++i){
      let tempExchangeOffer = exchangeOfferTxn.offers[i];

      let assetId = tempExchangeOffer.mosaicId.toHex();
      let amount = tempExchangeOffer.mosaicAmount.compact();

      let newTxnExchangeOffer: TxnExchangeOffer = {
        amount: amount,
        amountIsRaw: true,
        assetId: assetId,
        cost: TransactionUtils.convertToExactNativeAmount(tempExchangeOffer.cost.compact()),
        owner: tempExchangeOffer.owner.publicKey,
        type: tempExchangeOffer.type === ExchangeOfferType.SELL_OFFER ? "Sell" : "Buy",
      };

      try {
        let assetInfo = await TransactionUtils.getAssetInfo(assetId);

        newTxnExchangeOffer.amountIsRaw = false;
        newTxnExchangeOffer.amount = TransactionUtils.convertToExactAmount(amount, assetInfo.divisibility);

        let assetName = await TransactionUtils.getAssetName(assetId);

        if(assetName.names.length){
            newTxnExchangeOffer.assetNamespace = assetName.names[0].name;
        }
      } catch (error) {
      }
      txnDetails.exchangeOffers.push(newTxnExchangeOffer);
    }

    let allBuyOffers = txnDetails.exchangeOffers.filter(x => x.type === "Buy");
    let allSellOffers = txnDetails.exchangeOffers.filter(x => x.type === "Sell");

    txnDetails.exchangeOffers = txnDetails.isTakingOffer ? allSellOffers.concat(allBuyOffers) : allBuyOffers.concat(allSellOffers);
    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Account Link only---------------------------------------------------
  static extractAccountLink(accLinkTxn: AccountLinkTransaction): InnerLinkTransaction {

    let txnDetails = new InnerLinkTransaction();
    txnDetails.signer = accLinkTxn.signer.publicKey;
    txnDetails.signerAddress = accLinkTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(accLinkTxn.type);
    txnDetails.action = accLinkTxn.linkAction === LinkAction.Link ? "Link" : "Unlink";
    txnDetails.remotePublicKey = accLinkTxn.remoteAccountKey;
    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Account Address Restriction only---------------------------------------------------
  static extractAccAddressRestriction(accAddressRestrictTxn: AccountAddressRestrictionModificationTransaction): InnerRestrictionTransaction {

    let txnDetails = new InnerRestrictionTransaction();
    txnDetails.signer = accAddressRestrictTxn.signer.publicKey;
    txnDetails.signerAddress = accAddressRestrictTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(accAddressRestrictTxn.type);

    txnDetails.restrictionTypeOutput = TransactionUtils.getRestrictionTypeName(accAddressRestrictTxn.restrictionType).action;

    for(let i = 0; i < accAddressRestrictTxn.modifications.length; ++i){
      let modification = accAddressRestrictTxn.modifications[i];

      let newRestrictionModification: RestrictionModification = {
          action: modification.modificationType === RestrictionModificationType.Add ? "Add" : "Remove",
          value: modification.value
      };
      txnDetails.modification.push(newRestrictionModification);
    }

    let allAddModification = txnDetails.modification.filter(x => x.action === "Add");
    let allRemoveModification = txnDetails.modification.filter(x => x.action === "Remove");

    txnDetails.modification = allAddModification.concat(allRemoveModification);

    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Account Asset Restriction only---------------------------------------------------
  static async extractAccAssetRestriction(accAssetRestrictTxn: AccountMosaicRestrictionModificationTransaction): Promise<InnerRestrictionTransaction> {

    let txnDetails = new InnerRestrictionTransaction();
    txnDetails.signer = accAssetRestrictTxn.signer.publicKey;
    txnDetails.signerAddress = accAssetRestrictTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(accAssetRestrictTxn.type);

    txnDetails.restrictionTypeOutput = TransactionUtils.getRestrictionTypeName(accAssetRestrictTxn.restrictionType).action;

    for(let i = 0; i < accAssetRestrictTxn.modifications.length; ++i){
      let modification = accAssetRestrictTxn.modifications[i];
      let newRestrictionModification: RestrictionModification = {
        action: modification.modificationType === RestrictionModificationType.Add ? "Add" : "Remove",
        value: new MosaicId(modification.value).toHex()
      };

      try {
        let assetId = newRestrictionModification.value;
        if(assetId === AppState.nativeToken.assetId){
          newRestrictionModification.name = AppState.nativeToken.label;
        }
        else{
          let assetName = await TransactionUtils.getAssetName(assetId);

          if(assetName.names.length){
            newRestrictionModification.name = assetName.names[0].name;
          }
        }
      } catch (error) {}
      txnDetails.modification.push(newRestrictionModification);
    }

    let allAddModification = txnDetails.modification.filter(x => x.action === "Add");
    let allRemoveModification = txnDetails.modification.filter(x => x.action === "Remove");

    txnDetails.modification = allAddModification.concat(allRemoveModification);

    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Account Operation Restriction only---------------------------------------------------
  static extractAccOperationRestriction(accOperationRestrictTxn: AccountOperationRestrictionModificationTransaction): InnerRestrictionTransaction {

    let txnDetails = new InnerRestrictionTransaction();
    txnDetails.signer = accOperationRestrictTxn.signer.publicKey;
    txnDetails.signerAddress = accOperationRestrictTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(accOperationRestrictTxn.type);

    txnDetails.restrictionTypeOutput = TransactionUtils.getRestrictionTypeName(accOperationRestrictTxn.restrictionType).action;

    for(let i = 0; i < accOperationRestrictTxn.modifications.length; ++i){

      let modification = accOperationRestrictTxn.modifications[i];

      let newRestrictionModification: RestrictionModification = {
          action: modification.modificationType === RestrictionModificationType.Add ? "Add" : "Remove",
          value: TransactionUtils.getTransactionTypeNameByEnum(modification.value)
      };

      txnDetails.modification.push(newRestrictionModification);
    }

    let allAddModification = txnDetails.modification.filter(x => x.action === "Add");
    let allRemoveModification = txnDetails.modification.filter(x => x.action === "Remove");

    txnDetails.modification = allAddModification.concat(allRemoveModification);

    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  static async extractModifyMultisig(modifyMultisigTxn: ModifyMultisigAccountTransaction, txnGroupType: TransactionGroupType = TransactionGroupType.CONFIRMED): Promise<InnerAccountTransaction> {
    if(txnGroupType === TransactionGroupType.CONFIRMED){
      return await this.extractConfirmedModifyMultisig(modifyMultisigTxn);
    }
    else if(txnGroupType === TransactionGroupType.UNCONFIRMED){
      return await this.extractUnconfirmedModifyMultisig(modifyMultisigTxn);
    }
    else{
      return await this.extractPartialModifyMultisig(modifyMultisigTxn);
    }
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Asset Definition only---------------------------------------------------
  static extractAssetDefinition(assetDefTxn: MosaicDefinitionTransaction): InnerAssetTransaction {
    let txnDetails = new InnerAssetTransaction();
    txnDetails.signer = assetDefTxn.signer.publicKey;
    txnDetails.signerAddress = assetDefTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(assetDefTxn.type);

    txnDetails.assetId = assetDefTxn.mosaicId.toHex();
    txnDetails.divisibility = assetDefTxn.mosaicProperties.divisibility;
    txnDetails.duration = assetDefTxn.mosaicProperties.duration ? assetDefTxn.mosaicProperties.duration.compact() : undefined;
    txnDetails.transferable = assetDefTxn.mosaicProperties.transferable;
    txnDetails.supplyMutable = assetDefTxn.mosaicProperties.supplyMutable;
    txnDetails.nonce = assetDefTxn.mosaicNonce.toNumber();
    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Asset Supply Change only---------------------------------------------------
  static async extractAssetSupplyChange(assetSupplyChangeTxn: MosaicSupplyChangeTransaction): Promise<InnerAssetTransaction> {

    let txnDetails = new InnerAssetTransaction();
    txnDetails.signer = assetSupplyChangeTxn.signer.publicKey;
    txnDetails.signerAddress = assetSupplyChangeTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(assetSupplyChangeTxn.type);

    let assetId = assetSupplyChangeTxn.mosaicId.toHex();

    txnDetails.assetId = assetId;
    txnDetails.supplyDelta = assetSupplyChangeTxn.delta.compact();
    txnDetails.supplyDeltaIsRaw = true;

    if(assetSupplyChangeTxn.direction === MosaicSupplyType.Decrease){
      txnDetails.supplyDelta = -txnDetails.supplyDelta;
    }

    try {
      let assetInfo = await TransactionUtils.getAssetInfo(assetId);

      txnDetails.supplyDelta = TransactionUtils.convertToExactAmount(txnDetails.supplyDelta, assetInfo.divisibility);

      txnDetails.supplyDeltaIsRaw = false;
    } catch (error) {}
    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Asset Modify Levy only---------------------------------------------------
  static async extractAssetModifyLevy(assetModifyLevyTxn: MosaicModifyLevyTransaction): Promise<InnerAssetTransaction> {

    let txnDetails = new InnerAssetTransaction();
    txnDetails.signer = assetModifyLevyTxn.signer.publicKey;
    txnDetails.signerAddress = assetModifyLevyTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(assetModifyLevyTxn.type);

    let assetId = assetModifyLevyTxn.mosaicId.toHex();
    let levyAssetId = assetModifyLevyTxn.mosaicLevy.mosaicId.toHex();
    let levyAmount = assetModifyLevyTxn.mosaicLevy.fee.compact();

    txnDetails.assetId = assetId;
    txnDetails.levyAssetId = levyAssetId;
    txnDetails.levyAssetAmount = levyAmount;
    txnDetails.levyAssetAmountIsRaw = true;
    txnDetails.levyType = assetModifyLevyTxn.mosaicLevy.type;
    txnDetails.levyRecipient = assetModifyLevyTxn.mosaicLevy.recipient.plain();

    try {
      let assetName = await TransactionUtils.getAssetName(assetId);

      if(assetName.names.length){
        txnDetails.namespaceName = assetName.names[0].name;
      }

      let levyAssetInfo = await TransactionUtils.getAssetInfo(levyAssetId);

      txnDetails.levyAssetAmount = TransactionUtils.convertToExactAmount(levyAmount, levyAssetInfo.divisibility);

      txnDetails.levyAssetAmountIsRaw = false;

      let levyAssetName = await TransactionUtils.getAssetName(levyAssetId);

      if(levyAssetName.names.length){
        txnDetails.levyAssetName = levyAssetName.names[0].name;
      }
    } catch (error) {}

    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Asset Remove Levy only---------------------------------------------------
  static async extractAssetRemoveLevy(assetRemoveLevyTxn: MosaicRemoveLevyTransaction): Promise<InnerAssetTransaction> {

    let txnDetails = new InnerAssetTransaction();
    txnDetails.signer = assetRemoveLevyTxn.signer.publicKey;
    txnDetails.signerAddress = assetRemoveLevyTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(assetRemoveLevyTxn.type);
    let assetId = assetRemoveLevyTxn.mosaicId.toHex();
    txnDetails.assetId = assetId;
    try {
      let assetName = await TransactionUtils.getAssetName(assetId);
      if(assetName.names.length){
        txnDetails.namespaceName = assetName.names[0].name;
      }
    } catch (error) {}
    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Register Namespace only---------------------------------------------------
  static async extractRegisterNamespace(registerNSTxn: RegisterNamespaceTransaction): Promise<InnerNamespaceTransaction> {

    let txnDetails = new InnerNamespaceTransaction();
    txnDetails.signer = registerNSTxn.signer.publicKey;
    txnDetails.signerAddress = registerNSTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(registerNSTxn.type);

    txnDetails.namespaceName = registerNSTxn.namespaceName;

    if(registerNSTxn.namespaceType === NamespaceType.RootNamespace){
      txnDetails.duration = registerNSTxn.duration.compact();
      txnDetails.registerType = NamespaceType.RootNamespace;
      txnDetails.registerTypeName = "Root namespace";

      try {
        let namespaceInfo = await AppState.chainAPI.namespaceAPI.getNamespace(registerNSTxn.namespaceId);

        txnDetails.isExtend = true;
      } catch (error) {}
    }
    else{
      txnDetails.registerType = NamespaceType.SubNamespace;
      txnDetails.registerTypeName = "Sub namespace";
      txnDetails.parentId = registerNSTxn.parentId.toHex();
      let namespaceName = await TransactionUtils.getNamespacesName([registerNSTxn.parentId]);
      txnDetails.parentName = namespaceName[0].name;
    }

    txnDetails.namespaceId = registerNSTxn.namespaceId.toHex();
    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------


  // -----------------------------------extract Secret Proof only---------------------------------------------------
  static extractSecretProof(secretProofTxn: SecretProofTransaction): InnerSecretTransaction {
    let txnDetails = new InnerSecretTransaction();
    txnDetails.signer = secretProofTxn.signer.publicKey;
    txnDetails.signerAddress = secretProofTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(secretProofTxn.type);

    txnDetails.secret = secretProofTxn.secret;
    txnDetails.recipient = secretProofTxn.recipient.plain();
    txnDetails.hashType = myHashType[secretProofTxn.hashType];
    txnDetails.proof = secretProofTxn.proof;
    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  static async extractNonconfirmedTransfer(transferTxn: TransferTransaction, txnGroupType: TransactionGroupType = TransactionGroupType.UNCONFIRMED): Promise<InnerTransferTransaction> {
    if(txnGroupType === TransactionGroupType.UNCONFIRMED){
      return await TransactionUtils.extractUnconfirmedTransfer(transferTxn);
    }
    else{
      return await TransactionUtils.extractPartialTransfer(transferTxn);
    }
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Account Metadata_v2 only---------------------------------------------------
  static async extractConfirmedAccountMetadata(accMetadataTxn: AccountMetadataTransaction): Promise<InnerMetadataTransaction> {
    let txnDetails = new InnerMetadataTransaction();
    txnDetails.signer = accMetadataTxn.signer.publicKey;
    txnDetails.signerAddress = accMetadataTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(accMetadataTxn.type);

    txnDetails.metadataType = MetadataType.ACCOUNT;
    txnDetails.metadataTypeName = "Account";

    txnDetails.scopedMetadataKey = accMetadataTxn.scopedMetadataKey.toHex();
    txnDetails.targetPublicKey = accMetadataTxn.targetPublicKey.publicKey;
    txnDetails.sizeChanged = accMetadataTxn.valueSizeDelta;
    return txnDetails;
  }

  static async extractUnconfirmedAccountMetadata(accMetadataTxn: AccountMetadataTransaction): Promise<InnerMetadataTransaction> {
    return await TransactionUtils.extractPartialAccountMetadata(accMetadataTxn);
  }

  static async extractPartialAccountMetadata(accMetadataTxn: AccountMetadataTransaction): Promise<InnerMetadataTransaction> {
    let txnDetails = new InnerMetadataTransaction();
    txnDetails.signer = accMetadataTxn.signer.publicKey;
    txnDetails.signerAddress = accMetadataTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(accMetadataTxn.type);
    txnDetails.metadataType = MetadataType.ACCOUNT;
    txnDetails.metadataTypeName = "Account";

    txnDetails.scopedMetadataKey = accMetadataTxn.scopedMetadataKey.toHex();
    txnDetails.targetPublicKey = accMetadataTxn.targetPublicKey.publicKey;
    txnDetails.sizeChanged = accMetadataTxn.valueSizeDelta;
    txnDetails.valueChange = Convert.uint8ToHex(accMetadataTxn.valueDifferences);

    try {
      let nsMetadataEntry = await TransactionUtils.getAccountMetadata(accMetadataTxn.targetPublicKey, accMetadataTxn.scopedMetadataKey);
      if(nsMetadataEntry){
        txnDetails.oldValue = nsMetadataEntry.value;
        txnDetails.newValue = TransactionUtils.applyValueChange(txnDetails.oldValue, txnDetails.valueChange, txnDetails.sizeChanged);
      }
    } catch (error) {}
    return txnDetails;
  }

  static async extractAccMetadata(accMetadataTxn: AccountMetadataTransaction, txnGroupType: TransactionGroupType = TransactionGroupType.CONFIRMED): Promise<InnerMetadataTransaction> {
    if(txnGroupType === TransactionGroupType.CONFIRMED){
      return await this.extractConfirmedAccountMetadata(accMetadataTxn);
    }
    else if(txnGroupType === TransactionGroupType.UNCONFIRMED){
      return await this.extractUnconfirmedAccountMetadata(accMetadataTxn);
    }
    else{
      return await this.extractPartialAccountMetadata(accMetadataTxn);
    }
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Namespace Metadata_v2 only--------------------------------------------------- 
  static async extractConfirmedNamespaceMetadata(nsMetadataTxn: NamespaceMetadataTransaction): Promise<InnerMetadataTransaction> {
    let txnDetails = new InnerMetadataTransaction();

    txnDetails.signer = nsMetadataTxn.signer.publicKey;
    txnDetails.signerAddress = nsMetadataTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(nsMetadataTxn.type);

    let nsId = nsMetadataTxn.targetNamespaceId.toHex();

    txnDetails.metadataType = MetadataType.NAMESPACE;
    txnDetails.metadataTypeName = "Namespace";
    txnDetails.scopedMetadataKey = nsMetadataTxn.scopedMetadataKey.toHex();
    txnDetails.targetId = nsId;
    txnDetails.targetPublicKey = nsMetadataTxn.targetPublicKey.publicKey;
    txnDetails.sizeChanged = nsMetadataTxn.valueSizeDelta;

    try {
      let nsName = await TransactionUtils.getNamespacesName([NamespaceId.createFromEncoded(nsId)]);

      if(nsName.length){
          txnDetails.targetIdName = nsName[0].name;
      }
    } catch (error) {}
    return txnDetails;
}

  static async extractUnconfirmedNamespaceMetadata(nsMetadataTxn: NamespaceMetadataTransaction): Promise<InnerMetadataTransaction> {
    return await TransactionUtils.extractPartialNamespaceMetadata(nsMetadataTxn);
  }

  static async extractPartialNamespaceMetadata(nsMetadataTxn: NamespaceMetadataTransaction): Promise<InnerMetadataTransaction> {
    let txnDetails = new InnerMetadataTransaction();

    txnDetails.signer = nsMetadataTxn.signer.publicKey;
    txnDetails.signerAddress = nsMetadataTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(nsMetadataTxn.type);

    let nsId = nsMetadataTxn.targetNamespaceId.toHex();

    txnDetails.metadataType = MetadataType.NAMESPACE;
    txnDetails.metadataTypeName = "Namespace";
    txnDetails.scopedMetadataKey = nsMetadataTxn.scopedMetadataKey.toHex();
    txnDetails.targetId = nsId;
    txnDetails.targetPublicKey = nsMetadataTxn.targetPublicKey.publicKey;
    txnDetails.sizeChanged = nsMetadataTxn.valueSizeDelta;
    txnDetails.valueChange = Convert.uint8ToHex(nsMetadataTxn.valueDifferences);

    try {
      let nsName = await TransactionUtils.getNamespacesName([NamespaceId.createFromEncoded(nsId)]);

      if(nsName.length){
          txnDetails.targetIdName = nsName[0].name;
      }

      let nsMetadataEntry = await TransactionUtils.getNamespaceMetadata(nsMetadataTxn.targetNamespaceId, nsMetadataTxn.scopedMetadataKey);
      if(nsMetadataEntry){
        txnDetails.oldValue = nsMetadataEntry.value;
        txnDetails.newValue = TransactionUtils.applyValueChange(txnDetails.oldValue, txnDetails.valueChange, txnDetails.sizeChanged);
      }
    } catch (error) {}
    return txnDetails;
  }

  static async extractNamespaceMetadata(nsMetadataTxn: NamespaceMetadataTransaction, txnGroupType: TransactionGroupType = TransactionGroupType.CONFIRMED): Promise<InnerMetadataTransaction> {
    if(txnGroupType === TransactionGroupType.CONFIRMED){
      return await this.extractConfirmedNamespaceMetadata(nsMetadataTxn);
    }
    else if(txnGroupType === TransactionGroupType.UNCONFIRMED){
      return await TransactionUtils.extractUnconfirmedNamespaceMetadata(nsMetadataTxn);
    }
    else{
      return await TransactionUtils.extractPartialNamespaceMetadata(nsMetadataTxn);
    }
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Asset Metadata_v2 only---------------------------------------------------
  static async extractConfirmedAssetMetadata(assetMetadataTxn: MosaicMetadataTransaction): Promise<InnerMetadataTransaction> {
    let txnDetails = new InnerMetadataTransaction();

    txnDetails.signer = assetMetadataTxn.signer.publicKey;
    txnDetails.signerAddress = assetMetadataTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(assetMetadataTxn.type);

    let assetId = assetMetadataTxn.targetMosaicId.toHex();

    txnDetails.metadataType = MetadataType.MOSAIC;
    txnDetails.metadataTypeName = "Asset";
    txnDetails.scopedMetadataKey = assetMetadataTxn.scopedMetadataKey.toHex();
    txnDetails.targetId = assetId;
    txnDetails.targetPublicKey = assetMetadataTxn.targetPublicKey.publicKey;
    txnDetails.sizeChanged = assetMetadataTxn.valueSizeDelta;

    try {
      let assetName = await TransactionUtils.getAssetName(assetId);

      if(assetName.names.length){
        txnDetails.targetIdName = assetName.names[0].name;
      }
    } catch (error) {}
    return txnDetails;
  }

  static async extractUnconfirmedAssetMetadata(assetMetadataTxn: MosaicMetadataTransaction): Promise<InnerMetadataTransaction> {
    return await TransactionUtils.extractPartialAssetMetadata(assetMetadataTxn);
  }

  static async extractPartialAssetMetadata(assetMetadataTxn: MosaicMetadataTransaction): Promise<InnerMetadataTransaction> {
    let txnDetails = new InnerMetadataTransaction();
    txnDetails.signer = assetMetadataTxn.signer.publicKey;
    txnDetails.signerAddress = assetMetadataTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(assetMetadataTxn.type);
    let assetId = assetMetadataTxn.targetMosaicId.toHex();

    txnDetails.metadataType = MetadataType.MOSAIC;
    txnDetails.metadataTypeName = "Asset";
    txnDetails.scopedMetadataKey = assetMetadataTxn.scopedMetadataKey.toHex();
    txnDetails.targetId = assetId;
    txnDetails.targetPublicKey = assetMetadataTxn.targetPublicKey.publicKey;
    txnDetails.sizeChanged = assetMetadataTxn.valueSizeDelta;
    txnDetails.valueChange = Convert.uint8ToHex(assetMetadataTxn.valueDifferences);

    try {
      let assetName = await TransactionUtils.getAssetName(assetId);

      if(assetName.names.length){
          txnDetails.targetIdName = assetName.names[0].name;
      }

      let assetMetadataEntry = await TransactionUtils.getAssetMetadata(assetMetadataTxn.targetMosaicId, assetMetadataTxn.scopedMetadataKey);
      if(assetMetadataEntry){
        txnDetails.oldValue = assetMetadataEntry.value;
        txnDetails.newValue = TransactionUtils.applyValueChange(txnDetails.oldValue, txnDetails.valueChange, txnDetails.sizeChanged);
      }
    } catch (error) {}
    return txnDetails;
  }

  static async extractAssetMetadata(assetMetadataTxn: MosaicMetadataTransaction, txnGroupType: TransactionGroupType = TransactionGroupType.CONFIRMED): Promise<InnerMetadataTransaction> {
    if(txnGroupType === TransactionGroupType.CONFIRMED){
      return await TransactionUtils.extractConfirmedAssetMetadata(assetMetadataTxn);
    }
    else if(txnGroupType === TransactionGroupType.UNCONFIRMED){
      return await TransactionUtils.extractUnconfirmedAssetMetadata(assetMetadataTxn);
    }
    else{
      return await TransactionUtils.extractPartialAssetMetadata(assetMetadataTxn);
    }
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Lock Hash only--------------------------------------------------- 
  static async extractConfirmedLockHash(lockFundTxn: LockFundsTransaction): Promise<InnerLockTransaction> {

    let txnDetails = new InnerLockTransaction();
    txnDetails.signer = lockFundTxn.signer.publicKey;
    txnDetails.signerAddress = lockFundTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(lockFundTxn.type);

    txnDetails.lockHash = lockFundTxn.hash;
    txnDetails.duration = lockFundTxn.duration.compact();

    let amount = lockFundTxn.mosaic.amount.compact()
    txnDetails.amountLocking = AppState.nativeToken.divisibility ? amount / Math.pow(10, AppState.nativeToken.divisibility) : amount;

    try {
      let txnStatus = await AppState.chainAPI.transactionAPI.getTransactionStatus(lockFundTxn.hash);
      txnDetails.isRefunded = txnStatus.group === TransactionGroupType.CONFIRMED;
    } catch (error) {
      txnDetails.isRefunded = false;
    }

    return txnDetails;
  }

  static extractUnconfirmedLockHash(lockFundTxn: LockFundsTransaction): InnerLockTransaction {
    return TransactionUtils.extractPartialLockHash(lockFundTxn);
  }

  static extractPartialLockHash(lockFundTxn: LockFundsTransaction): InnerLockTransaction {
    let txnDetails = new InnerLockTransaction();
    txnDetails.signer = lockFundTxn.signer.publicKey;
    txnDetails.signerAddress = lockFundTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(lockFundTxn.type);

    txnDetails.lockHash = lockFundTxn.hash;
    txnDetails.duration = lockFundTxn.duration.compact();

    let amount = lockFundTxn.mosaic.amount.compact()
    txnDetails.amountLocking = AppState.nativeToken.divisibility ? amount / Math.pow(10, AppState.nativeToken.divisibility) : amount;
    return txnDetails;
  }

  static async extractLockHash(lockFundTxn: LockFundsTransaction, txnGroupType: TransactionGroupType = TransactionGroupType.CONFIRMED): Promise<InnerLockTransaction> {

    if(txnGroupType === TransactionGroupType.CONFIRMED){
        return await TransactionUtils.extractConfirmedLockHash(lockFundTxn);
    }
    if(txnGroupType === TransactionGroupType.UNCONFIRMED){
        return TransactionUtils.extractUnconfirmedLockHash(lockFundTxn);
    }
    else{
        return TransactionUtils.extractPartialLockHash(lockFundTxn);
    }
  }
  // --------------------------------------end------------------------------------------------------------------

  static getRestrictionTypeName(restrictionType: RestrictionType){

    let restrictionTypeName = {
        action: '',
        type: ''
    };

    switch(restrictionType){
      case RestrictionType.AllowAddress:
        restrictionTypeName.action = "Allow";
        restrictionTypeName.type = "Address"
        break;
      case RestrictionType.BlockAddress:
        restrictionTypeName.action = "Block";
        restrictionTypeName.type = "Address"
        break;
      case RestrictionType.AllowMosaic:
        restrictionTypeName.action = "Allow";
        restrictionTypeName.type = "SDA"
        break;
      case RestrictionType.BlockMosaic:
        restrictionTypeName.action = "Block";
        restrictionTypeName.type = "SDA"
        break;
      case RestrictionType.AllowTransaction:
        restrictionTypeName.action = "Allow";
        restrictionTypeName.type = "Transaction Type"
        break;
      case RestrictionType.BlockTransaction:
        restrictionTypeName.action = "Block";
        restrictionTypeName.type = "Transaction Type"
        break;
      default:
        break;
    }
    return restrictionTypeName;
  }

  // -----------------------------------extract Modify Multisig only--------------------------------------------------- 
  static async extractConfirmedModifyMultisig(modifyMultisigTxn: ModifyMultisigAccountTransaction): Promise<InnerAccountTransaction> {
    let txnDetails = new InnerAccountTransaction();
    txnDetails.signer = modifyMultisigTxn.signer.publicKey;
    txnDetails.signerAddress = modifyMultisigTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(modifyMultisigTxn.type);

    txnDetails.approvalDelta = modifyMultisigTxn.minApprovalDelta;
    txnDetails.removalDelta = modifyMultisigTxn.minRemovalDelta;
    txnDetails.addedCosigner = modifyMultisigTxn.modifications.filter(x => x.type === MultisigCosignatoryModificationType.Add)
        .map(x => x.cosignatoryPublicAccount.publicKey);
    txnDetails.removedCosigner = modifyMultisigTxn.modifications.filter(x => x.type === MultisigCosignatoryModificationType.Remove)
        .map(x => x.cosignatoryPublicAccount.publicKey);
    return txnDetails;
  }

  static async extractUnconfirmedModifyMultisig(modifyMultisigTxn: ModifyMultisigAccountTransaction): Promise<InnerAccountTransaction> {
    return await TransactionUtils.extractPartialModifyMultisig(modifyMultisigTxn);
  }

  static async extractPartialModifyMultisig(modifyMultisigTxn: ModifyMultisigAccountTransaction): Promise<InnerAccountTransaction> {
    let txnDetails = new InnerAccountTransaction();
    txnDetails.signer = modifyMultisigTxn.signer.publicKey;
    txnDetails.signerAddress = modifyMultisigTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(modifyMultisigTxn.type);

    txnDetails.approvalDelta = modifyMultisigTxn.minApprovalDelta;
    txnDetails.removalDelta = modifyMultisigTxn.minRemovalDelta;
    txnDetails.addedCosigner = modifyMultisigTxn.modifications.filter(x => x.type === MultisigCosignatoryModificationType.Add)
        .map(x => x.cosignatoryPublicAccount.publicKey);
    txnDetails.removedCosigner = modifyMultisigTxn.modifications.filter(x => x.type === MultisigCosignatoryModificationType.Remove)
        .map(x => x.cosignatoryPublicAccount.publicKey);

    try {
        let multisigInfo = await AppState.chainAPI.accountAPI.getMultisigAccountInfo(modifyMultisigTxn.signer.address);

        if(multisigInfo){
          txnDetails.oldApprovalNumber = multisigInfo.minApproval;
          txnDetails.oldRemovalNumber = multisigInfo.minRemoval;
        }

    } catch (error) {
      txnDetails.oldApprovalNumber = 0;
      txnDetails.oldRemovalNumber = 0;
    }
    return txnDetails;
  }

  async extractModifyMultisig(modifyMultisigTxn: ModifyMultisigAccountTransaction, txnGroupType: TransactionGroupType = TransactionGroupType.CONFIRMED): Promise<InnerAccountTransaction> {
    if(txnGroupType === TransactionGroupType.CONFIRMED){
      return await TransactionUtils.extractConfirmedModifyMultisig(modifyMultisigTxn);
    }
    else if(txnGroupType === TransactionGroupType.UNCONFIRMED){
      return await TransactionUtils.extractUnconfirmedModifyMultisig(modifyMultisigTxn);
    }
    else{
      return await TransactionUtils.extractPartialModifyMultisig(modifyMultisigTxn);
    }
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Secret Lock only--------------------------------------------------- 
  static async extractConfirmedSecretLock(secretLockTxn: SecretLockTransaction, blockNum: number): Promise<InnerSecretTransaction> {

    let txnDetails = new InnerSecretTransaction();
    txnDetails.signer = secretLockTxn.signer.publicKey;
    txnDetails.signerAddress = secretLockTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(secretLockTxn.type);

    txnDetails.duration = secretLockTxn.duration.compact();
    txnDetails.secret = secretLockTxn.secret;
    txnDetails.recipient = secretLockTxn.recipient.plain();
    txnDetails.amount = secretLockTxn.mosaic.amount.compact();
    txnDetails.hashType = myHashType[secretLockTxn.hashType];

    let isNamespace = TransactionUtils.isNamespace(secretLockTxn.mosaic.id);
    let resolvedAssetId = await TransactionUtils.getResolvedAsset(secretLockTxn.mosaic.id, blockNum);

    txnDetails.assetId = resolvedAssetId.toHex();

    try {
      if(!isNamespace){
        let assetsNames = await TransactionUtils.getAssetsName([secretLockTxn.mosaic.id]);

        if(assetsNames[0].names.length){
            txnDetails.namespaceName = assetsNames[0].names[0].name;
        }
      }
      else{
        txnDetails.isSendWithNamespace = true;
        let namespaceId = new NamespaceId(secretLockTxn.mosaic.id.toDTO().id);

        let nsNames = await TransactionUtils.getNamespacesName([namespaceId]);
        txnDetails.namespaceName = nsNames[0].name;
      }

      if(txnDetails.namespaceName && txnDetails.namespaceName === "prx.xpx"){
        txnDetails.namespaceName = AppState.nativeToken.label;
      }

      let assetInfo = await TransactionUtils.getAssetInfo(txnDetails.assetId);

      if(assetInfo.divisibility > 0){
        txnDetails.amount = TransactionUtils.convertToExactAmount(txnDetails.amount, assetInfo.divisibility);
      }
      txnDetails.amountIsRaw = false;
    } catch (error) {}
    return txnDetails;
}

static async extractUnconfirmedSecretLock(secretLockTxn: SecretLockTransaction): Promise<InnerSecretTransaction> {
    return TransactionUtils.extractPartialSecretLock(secretLockTxn);
}

static async extractPartialSecretLock(secretLockTxn: SecretLockTransaction): Promise<InnerSecretTransaction> {
    let txnDetails = new InnerSecretTransaction();

    txnDetails.signer = secretLockTxn.signer.publicKey;
    txnDetails.signerAddress = secretLockTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(secretLockTxn.type);

    txnDetails.duration = secretLockTxn.duration.compact();
    txnDetails.secret = secretLockTxn.secret;
    txnDetails.recipient = secretLockTxn.recipient.plain();
    txnDetails.amount = secretLockTxn.mosaic.amount.compact();
    txnDetails.hashType = myHashType[secretLockTxn.hashType];

    let isNamespace = TransactionUtils.isNamespace(secretLockTxn.mosaic.id);

    try {
        if(!isNamespace){
            txnDetails.assetId = secretLockTxn.mosaic.id.toHex();

            let assetsNames = await TransactionUtils.getAssetsName([secretLockTxn.mosaic.id]);

            if(assetsNames[0].names.length){
                txnDetails.namespaceName = assetsNames[0].names[0].name;
            }
        }
        else{
            let namespaceId = new NamespaceId(secretLockTxn.mosaic.id.toDTO().id);
            let linkedAssetId = await TransactionUtils.getAssetAlias(namespaceId);

            txnDetails.assetId = linkedAssetId.toHex();
            txnDetails.isSendWithNamespace = true;

            let nsNames = await TransactionUtils.getNamespacesName([namespaceId]);
            txnDetails.namespaceName = nsNames[0].name;
        }

        if(txnDetails.namespaceName && txnDetails.namespaceName === "prx.xpx"){
            txnDetails.namespaceName = AppState.nativeToken.label;
        }

        let assetInfo = await TransactionUtils.getAssetInfo(txnDetails.assetId);

        if(assetInfo.divisibility > 0){
            txnDetails.amount = TransactionUtils.convertToExactAmount(txnDetails.amount, assetInfo.divisibility);
        }
        txnDetails.amountIsRaw = false;
    } catch (error) {}

    return txnDetails;
}

static async extractNonconfirmedSecretLock(secretLockTxn: SecretLockTransaction, txnGroupType: TransactionGroupType = TransactionGroupType.UNCONFIRMED): Promise<InnerSecretTransaction> {
    if(txnGroupType === TransactionGroupType.UNCONFIRMED){
        return await TransactionUtils.extractUnconfirmedSecretLock(secretLockTxn);
    }
    else{
        return await TransactionUtils.extractPartialSecretLock(secretLockTxn);
    }
}
// --------------------------------------end------------------------------------------------------------------

static async extractUnconfirmedTransfer(transferTxn: TransferTransaction): Promise<InnerTransferTransaction> {
  let txnDetails = await TransactionUtils.extractPartialTransfer(transferTxn);

  if(txnDetails.messageType === MessageType.PlainMessage){
    let newType = TransactionUtils.convertToSwapType(txnDetails.message);

    if(newType){
        txnDetails.type = newType;
    }
  }
  return txnDetails;
}

static async extractPartialTransfer(transferTxn: TransferTransaction): Promise<InnerTransferTransaction> {
  let txnDetails = new InnerTransferTransaction();
  txnDetails.signer = transferTxn.signer.publicKey;
  txnDetails.signerAddress = transferTxn.signer.address.plain();
  txnDetails.type = TransactionUtils.getTransactionTypeName(transferTxn.type);

  let sdas: SDA[] = [];

  txnDetails.message = transferTxn.message.payload;
  txnDetails.messageType = transferTxn.message.type;

  switch(txnDetails.messageType){
    case MessageType.PlainMessage:
      txnDetails.messageTypeTitle = "Plain Message";
      break;
    case MessageType.EncryptedMessage:
      txnDetails.messageTypeTitle = "Encrypted Message";
      break;
    case MessageType.HexadecimalMessage:
      txnDetails.messageTypeTitle = "Hexadecimal Message";
      break;
  }
  let recipientIsNamespace = transferTxn.recipient instanceof NamespaceId ? true : false;

  let recipient;

  if(transferTxn.recipient instanceof NamespaceId){
    txnDetails.recipientNamespaceId = transferTxn.recipient.toHex();
    recipient = await TransactionUtils.getAddressAlias(transferTxn.recipient);
    let namespacesName = await TransactionUtils.getNamespacesName([transferTxn.recipient]);
    txnDetails.recipientNamespaceName = namespacesName[0].name;
  }
  else{
      recipient = transferTxn.recipient;
  }

  txnDetails.recipient = recipient.plain();
  txnDetails.sender = transferTxn.signer.address.plain();
  // txnDetails.in_out = this.selectedAccount.address === txnDetails.sender ? false: true;
  txnDetails.in_out = false;

  for(let y = 0; y < transferTxn.mosaics.length; ++y){

      let rawAmount = transferTxn.mosaics[y].amount.compact();
      let actualAmount = rawAmount;

      let assetId;
      let isSendWithNamespace = TransactionUtils.isNamespace(transferTxn.mosaics[y].id);

      if(isSendWithNamespace){
          let namespaceId = new NamespaceId(transferTxn.mosaics[y].id.toDTO().id);
          assetId = await TransactionUtils.getAssetAlias(namespaceId);
      }
      else{
          assetId = transferTxn.mosaics[y].id;
      }

      let assetIdHex = assetId.toHex();

      if([AppState.nativeToken.assetId, nativeTokenNamespaceId.value].includes(assetIdHex)){
          txnDetails.amountTransfer = TransactionUtils.convertToExactNativeAmount(actualAmount);
          continue;
      }

      let newSDA: SDA = {
          amount: rawAmount,
          divisibility: 0,
          id: assetIdHex,
          amountIsRaw: true,
          sendWithNamespace: isSendWithNamespace
      };

      if(isSendWithNamespace){
          let namespaceId = transferTxn.mosaics[y].id;

          newSDA.sendWithAlias = {
              idHex: namespaceId.toHex(),
              id: namespaceId.toDTO().id
          }
      }

      sdas.push(newSDA);
  }

  let namespaceIds = sdas.filter(sda => sda.sendWithNamespace).map(sda => Helper.createNamespaceId(sda.sendWithAlias.id));

  let allAssetId = sdas.filter(sda =>{ 
      return sda.amountIsRaw
  }).map(sda => Helper.createAssetId(sda.id));

  if(namespaceIds.length || allAssetId.length){
      let namespacesNames: NamespaceName[] = [];
      namespacesNames = await AppState.chainAPI.namespaceAPI.getNamespacesName(namespaceIds);
      let assetsProperties = await AppState.chainAPI.assetAPI.getMosaics(allAssetId);
      let aliasNames: MosaicNames[] = await AppState.chainAPI.assetAPI.getMosaicsNames(allAssetId);

      for(let x= 0; x < sdas.length; ++x){

        let assetProperties = assetsProperties.filter(aliasName=> aliasName.mosaicId.toHex() === sdas[x].id)[0];

        sdas[x].divisibility = assetProperties.divisibility;
        sdas[x].amount = TransactionUtils.convertToExactAmount(sdas[x].amount, assetProperties.divisibility);
        sdas[x].amountIsRaw = false;

        let mosaicNames: MosaicNames = aliasNames.filter(aliaName => aliaName.mosaicId.toHex() === sdas[x].id)[0];
        let currentAliasNames: NamespaceName[] = mosaicNames.names;
        sdas[x].currentAlias = currentAliasNames.map(currentAlias =>{ 
            return { name: currentAlias.name, id: currentAlias.namespaceId.toDTO().id, idHex: currentAlias.namespaceId.toHex() }
        });

        if(sdas[x].sendWithAlias){
            sdas[x].sendWithAlias.name = namespacesNames
                .filter(nsName => nsName.namespaceId.toHex() === sdas[x].sendWithAlias.idHex)
                .map(nsName => nsName.name)[0]
        }
      }
  }
    txnDetails.sda = sdas;
    return txnDetails;
  }

  static async autoFindAggregateTransaction(hash: string): Promise<AggregateTransaction> | null{

    let statusGroup = "";
    let txn: Transaction = null;

    while (txn === null && statusGroup !== "confirmed" && statusGroup !== "error"){

      try {
        let txnStatus = await AppState.chainAPI.transactionAPI.getTransactionStatus(hash);

        statusGroup = txnStatus.group;

        switch (statusGroup) {
          case TransactionGroupType.CONFIRMED:
            try {
              txn = await AppState.chainAPI.transactionAPI.getTransaction(hash);
            } catch (error) {
              statusGroup = "error"
            }
            break;

          case TransactionGroupType.UNCONFIRMED:
            try {
              txn = await AppState.chainAPI.transactionAPI.getUnconfirmedTransaction(hash);
            } catch (error) {}
            break;
          case TransactionGroupType.PARTIAL:
            try {
              txn = await AppState.chainAPI.transactionAPI.getPartialTransaction(hash);
            } catch (error) {}
            break;
          default:
            statusGroup = "error";
            break;
        }
      } catch (error) {
        statusGroup = "error";
      }
    }

    if(statusGroup === "error" || txn === null){
      return null;
    }
    else{
      let aggregateTxn = txn as AggregateTransaction
      return aggregateTxn;
    }
  }
}


