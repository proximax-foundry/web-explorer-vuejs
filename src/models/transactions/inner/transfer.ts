import {SDA} from "@/models/transactions/sda";
import { InnerTransaction } from "@/models/transactions/inner/innerTxn";

export class InnerTransferTransaction extends InnerTransaction{

    sender: string | null = null;
    recipient: string | null = null;
    recipientNamespaceId: string | null = null;
    recipientNamespaceName: string | null = null;    
    sda: SDA[] = [];
    amountTransfer: number = 0;
    message: string | null = null;
    messageType: number | null = null;
    messageTypeTitle?: string;
  
    constructor(){
      super();
    }
}