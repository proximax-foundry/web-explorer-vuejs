import { InnerTransaction } from "@/models/transactions/inner/innerTxn";
import type { TxnSdaExchange } from "@/models/transactions/sdaExchange";

export class InnerSdaExchangeTransaction extends InnerTransaction {
    sdaExchange: TxnSdaExchange[] = [];

  constructor() {
    super();
  }
}