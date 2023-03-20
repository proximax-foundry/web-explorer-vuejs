import type { SDA } from "../sda";
import { UnconfirmedTransaction } from "./unconfirmedTransaction";

export class UnconfirmedTransferTransaction extends UnconfirmedTransaction {
  sender: string | null = null;
  recipient: string | null = null;
  recipientNamespaceId: string | null = null;
  recipientNamespaceName: string | null = null;
  sda: SDA[] = [];
  amountTransfer: number = 0;
  message: string | null = null;
  messageType: number | null = null;
  messageTypeTitle?: string;

  constructor(txnHash: string) {
    super(txnHash);
  }
}
