import { UnconfirmedTransaction } from "./unconfirmedTransaction";

export class UnconfirmedAssetTransaction extends UnconfirmedTransaction {
  assetId: string = "";
  nonce?: number | null = null;
  namespaceName?: string | null = null;
  levyAssetId?: string | null = null;
  levyAssetAmount?: number | null = null;
  levyAssetAmountIsRaw?: boolean | null = null;
  levyType?: number | null = null;
  levyRecipient?: string | null = null;
  levyAssetName?: string | null = null;
  supplyDelta?: number | null = null;
  supplyDirection?: number | null = null;
  divisibility?: number | null = null;
  supplyMutable?: boolean | null = null;
  transferable?: boolean | null = null;
  restrictable?: boolean | null = null;
  supplyForceImmutable?: boolean | null = null;
  disableLocking?: boolean | null = null;
  duration?: number | null = null;

  constructor(txnHash: string) {
    super(txnHash);
  }
}
