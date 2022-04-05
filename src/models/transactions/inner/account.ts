import { InnerTransaction } from "@/models/transactions/inner/innerTxn";

export class InnerAccountTransaction extends InnerTransaction{

    approvalDelta: number = 0;
    removalDelta: number = 0;
    oldApprovalNumber?: number = null;
    oldRemovalNumber?: number = null;
    addedCosigner: string[] = [];
    removedCosigner: string[] = [];
    modifyingAccountPublicKey: string = "";
  
    constructor(){
      super();
    }
}