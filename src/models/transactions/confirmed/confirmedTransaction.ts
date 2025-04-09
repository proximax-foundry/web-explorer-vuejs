import { TransactionCommon } from "../transactionCommon";

export class ConfirmedTransaction extends TransactionCommon {
  timestamp: string = "";
  block: number = 0;
  fee: number | null = 0;
  feeMultiplier: number = 0;

  constructor(txnHash: string) {
    super(txnHash, "confirmed");
  }

  static convertToSubClass(
    subclass: typeof ConfirmedTransaction,
    instance: ConfirmedTransaction
  ) {
    const newTxn = new subclass(instance.hash);

    Object.assign(newTxn, instance);
    return newTxn;
  }
}
