import { ConfirmedTransaction } from "./confirmedTransaction";
import type { TxnSdaExchange } from "../sdaExchange";

export class ConfirmedSdaExchangeTransaction extends ConfirmedTransaction {
    sdaExchange: TxnSdaExchange[] = [];

  constructor(txnHash: string) {
    super(txnHash);
  }
}