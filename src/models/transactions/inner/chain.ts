import { InnerTransaction } from "@/models/transactions/inner/innerTxn";

export class InnerChainTransaction extends InnerTransaction{

  applyHeightDelta: number = null;
  networkConfig: string = null; // not assigning for dashboard
  supportedEntityVersions: string = null; // not assigning for dashboard
  newVersion: string = null;
  upgradePeriod: number = null;

  constructor(){
    super();
  }
}