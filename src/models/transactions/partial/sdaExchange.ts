import { PartialTransaction } from "./partialTransaction";
import type { TxnSdaExchange } from "../sdaExchange";

export class PartialSdaExchangeTransaction extends PartialTransaction {
    sdaExchange: TxnSdaExchange[] = [];

  constructor(txnHash: string) {
    super(txnHash);
  }
}