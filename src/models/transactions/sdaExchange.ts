export interface TxnSdaExchange {
    sdaIdGet: string;
    sdaIdGive: string;
    sdaGetNamespace?: string;
    sdaGiveNamespace?: string;
    amountGet?: number;
    amountGive?: number;
    duration?: number;
  }