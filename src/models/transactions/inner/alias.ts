import { InnerTransaction } from "@/models/transactions/inner/innerTxn";

export class InnerAliasTransaction extends InnerTransaction {
  aliasName: string = "";
  aliasType: number = 0;
  aliasTypeName: string = "";
  address?: string = "";
  assetId?: string = "";

  constructor() {
    super();
  }
}
