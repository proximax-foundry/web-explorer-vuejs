export interface TxnSdaExchange {
    assetIdGet: string;
    assetIdGive: string;
    assetSdaGetNamespace?: string;
    assetSdaGiveNamespace?: string;
    amountGet: number;
    amountGive: number;
    duration?: number;
  }