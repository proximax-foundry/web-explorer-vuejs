import { TransactionCommon } from "../transactionCommon";

export class UnconfirmedTransaction extends TransactionCommon {
  constructor(txnHash: string) {
    super(txnHash, "unconfirmed");
  }

  static convertToSubClass(
    subclass: typeof UnconfirmedTransaction,
    instance: UnconfirmedTransaction
  ) {
    const newTxn = new subclass(instance.hash);

    Object.assign(newTxn, instance);
    return newTxn;
  }
}
