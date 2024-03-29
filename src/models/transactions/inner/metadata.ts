import { InnerTransaction } from "@/models/transactions/inner/innerTxn";

export class InnerMetadataTransaction extends InnerTransaction {
  metadataType: number = 0;
  metadataTypeName: string = "";
  scopedMetadataKey: string = "";
  targetPublicKey: string = "";
  targetId?: string = "";
  targetIdName?: string = "";
  sizeChanged: number = 0;
  valueChange: string = "";
  oldValue?: string = "";
  newValue?: string = "";
  value: string = "";
  constructor() {
    super();
  }
}
