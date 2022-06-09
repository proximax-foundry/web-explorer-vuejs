import { ConfirmedTransaction } from "./confirmedTransaction";

export class ConfirmedAssetTransaction extends ConfirmedTransaction{

    assetId: string = "";
    nonce?: number = null;
    namespaceName? : string = null;
    levyAssetId?: string = null;
    levyAssetAmount?: number = null;
    levyAssetAmountIsRaw?: boolean = null;
    levyType?: number = null;
    levyRecipient?: string = null;
    levyAssetName?: string = null;
    supplyDelta?: number = null;
    supplyDirection?: number = null;
    divisibility?: number = null;
    transferable?: boolean = null;
    supplyMutable?: boolean = null;
    duration?: number = null;

    constructor(txnHash: string){
      super(txnHash);
    }
}