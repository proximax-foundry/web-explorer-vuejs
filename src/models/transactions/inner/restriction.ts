import { InnerTransaction } from "@/models/transactions/inner/innerTxn";
import { RestrictionModification } from "@/models/transactions/restrictionModification";

export class InnerRestrictionTransaction extends InnerTransaction{

    restrictionTypeOutput: string = ""; // Allow / Block
    restrictionType: number = 0;
    modification: RestrictionModification[] = [];
  
    constructor(){
      super();
    }
}