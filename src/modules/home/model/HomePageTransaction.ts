import {
    Account,
    Address,
    Deadline,
    EncryptedMessage,
    // NetworkCurrencyMosaic,
    // FeeCalculationStrategy,
    Mosaic,
    MosaicId,
    UInt64,
    MosaicProperties,
    MosaicSupplyType,
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
    NetworkType,
    NamespaceId,
    Transaction,
    TransactionType,
    AggregateTransaction,
    CosignatureTransaction,
    QueryParams,
    AddressAliasTransaction,
    AddExchangeOfferTransaction,
    ChainConfigTransaction,
    ChainUpgradeTransaction,
    ExchangeOfferTransaction,
    RemoveExchangeOfferTransaction,
    AccountLinkTransaction,
    LockFundsTransaction,
    MosaicMetadataTransaction,
    AccountMetadataTransaction,
    NamespaceMetadataTransaction,
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
    TransactionQueryParams,
    TransactionGroupType,
    TransactionSearch,
    TransactionInfo,
    AggregateTransactionInfo,
    AddressAlias,
    MosaicAlias,
    NamespaceName,
    MosaicNames,
    MessageType,
    NamespaceType,
    LinkAction,
    MosaicInfo,
    AccountRestrictionTransaction,
    RestrictionModificationType,
    MosaicRemoveLevyTransaction,
    MosaicModifyLevyTransaction,
    MetadataType,
    AliasActionType,
    MultisigCosignatoryModificationType,
    MetadataQueryParams,
    MetadataEntry,
    Convert
} from "tsjs-xpx-chain-sdk";
import {
    ConfirmedTransferTransaction, UnconfirmedTransferTransaction, PartialTransferTransaction,
    ConfirmedAggregateTransaction, UnconfirmedAggregateTransaction, PartialAggregateTransaction,
    ConfirmedAliasTransaction, UnconfirmedAliasTransaction, PartialAliasTransaction,
    ConfirmedAssetTransaction, UnconfirmedAssetTransaction, PartialAssetTransaction,
    ConfirmedChainTransaction, UnconfirmedChainTransaction, PartialChainTransaction,
    ConfirmedExchangeTransaction, UnconfirmedExchangeTransaction, PartialExchangeTransaction,
    ConfirmedLinkTransaction, UnconfirmedLinkTransaction, PartialLinkTransaction,
    ConfirmedLockTransaction, UnconfirmedLockTransaction, PartialLockTransaction,
    ConfirmedMetadataTransaction, UnconfirmedMetadataTransaction, PartialMetadataTransaction,
    ConfirmedAccountTransaction, UnconfirmedAccountTransaction, PartialAccountTransaction,
    ConfirmedNamespaceTransaction, UnconfirmedNamespaceTransaction, PartialNamespaceTransaction,
    ConfirmedRestrictionTransaction, UnconfirmedRestrictionTransaction, PartialRestrictionTransaction,
    ConfirmedSecretTransaction, UnconfirmedSecretTransaction, PartialSecretTransaction,
    ConfirmedTransaction, UnconfirmedTransaction, PartialTransaction,
    SDA, AliasNamespace, TxnExchangeOffer, RestrictionModification, TxnList,
    InnerAccountTransaction, InnerAliasTransaction, InnerAssetTransaction, InnerChainTransaction,
    InnerExchangeTransaction, InnerLinkTransaction, InnerLockTransaction, InnerMetadataTransaction, InnerNamespaceTransaction,
    InnerRestrictionTransaction, InnerSecretTransaction, InnerTransaction as MyInnerTxn, InnerTransferTransaction
} from "../model/transactions/transaction";
import { TransactionUtils } from "@/util/transactionUtils";
import { Helper } from "@/util/typeHelper";
import { AppState } from "@/state/appState";

export interface blockDataList {
    block: number,
    signerAddress: string,
    amount: number,
}

export interface transactionDataList {
    block: number,
    hash: string,
    signerAddress: string,
    recipient: string,
    amount: number,

}
export class HomePageTransaction {
    static convertToExactNativeAmount(amount: number) {
        if (AppState.nativeToken.divisibility === 0) {
            return amount;
        }
        return amount > 0 ? amount / Math.pow(10, AppState.nativeToken.divisibility) : 0;
    }

    async formatConfirmedTransaction(txn: Transaction): Promise<ConfirmedTransaction> {

        let transactionInfo: TransactionInfo | AggregateTransactionInfo = txn.transactionInfo;
        let txnHash = transactionInfo instanceof AggregateTransactionInfo ?
            transactionInfo.aggregateHash : transactionInfo.hash;

        let blockHeight: number = 0;
        let txnBytes: number = 0;
        let deadline = null;

        // if (transactionInfo instanceof AggregateTransactionInfo) {
        //     //let aggregateTxn = await this.autoFindAggregateTransaction(txnHash);
        //     blockHeight = transactionInfo.height.compact();
        //     //txnBytes = aggregateTxn.serialize().length / 2;
        //     //deadline = aggregateTxn.deadline.adjustedValue.compact();
        // }
        // else if (txn.type === TransactionType.AGGREGATE_BONDED || txn.type === TransactionType.AGGREGATE_COMPLETE) {
        //     let aggregateTxn = await this.autoFindAggregateTransaction(txnHash);
        //     blockHeight = aggregateTxn.transactionInfo.height.compact();
        //     txnBytes = aggregateTxn.serialize().length / 2;
        //     deadline = aggregateTxn.deadline.adjustedValue.compact();
        // }
        // else {
        //     blockHeight = transactionInfo.height.compact();

        //     // wait SDK to fix
        //     try {
        //         txnBytes = txn.serialize().length / 2;
        //     } catch (error) {
        //         console.log(error);
        //     }

        //     deadline = txn.deadline.adjustedValue.compact();
        // }

        let blockInfo = await AppState.chainAPI.blockAPI.getBlockByHeight(blockHeight);

        let fee = txnBytes * blockInfo.feeMultiplier;

        let formattedTxn: ConfirmedTransaction = new ConfirmedTransaction(txnHash);
        formattedTxn.block = blockHeight;
        formattedTxn.deadline = deadline;
        formattedTxn.type = TransactionUtils.getTransactionTypeName(txn.type);
        formattedTxn.maxFee = transactionInfo instanceof AggregateTransactionInfo ?
            null : HomePageTransaction.convertToExactNativeAmount(txn.maxFee.compact());

        formattedTxn.signer = txn.signer.publicKey;
        formattedTxn.signerAddress = txn.signer.address.plain();

        formattedTxn.fee = HomePageTransaction.convertToExactNativeAmount(fee);

        if (transactionInfo instanceof AggregateTransactionInfo) {
            formattedTxn.fee = null;
        }

        formattedTxn.timestamp = new Date(blockInfo.timestamp.compact() + Deadline.timestampNemesisBlock * 1000).toISOString()

        return formattedTxn;
    }
}