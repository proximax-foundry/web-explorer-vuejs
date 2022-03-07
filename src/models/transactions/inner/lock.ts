import { InnerTransaction } from "@/models/transactions/inner/innerTxn";

export class InnerLockTransaction extends InnerTransaction{

    lockHash: string = "";
    duration: number = 0;
    expired: boolean = null;
    isRefunded: boolean = null;
    amountLocking: number = 0;
  
    constructor(){
      super();
    }
}