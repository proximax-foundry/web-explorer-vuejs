import { TransactionCommon } from "../transactionCommon";

export class PartialTransaction extends TransactionCommon {
  cosignedPublickKey: string[] = [];
  allCosignerPublicKey: string[] = [];
  pendingCosignPublicKey: string[] = [];

  constructor(txnHash: string) {
    super(txnHash, "partial");
  }

  static convertToSubClass(
    subclass: typeof PartialTransaction,
    instance: PartialTransaction
  ) {
    const newTxn = new subclass(instance.hash);

    Object.assign(newTxn, instance);
    return newTxn;
  }
}
