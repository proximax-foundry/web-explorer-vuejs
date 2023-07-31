import { UnconfirmedTransaction } from "./unconfirmedTransaction";
import type { TxnSdaExchange } from "../sdaExchange";

export class UnconfirmedSdaExchangeTransaction extends UnconfirmedTransaction {
    sdaExchange: TxnSdaExchange[] = [];

  constructor(txnHash: string) {
    super(txnHash);
  }
}