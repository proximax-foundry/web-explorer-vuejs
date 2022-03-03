import { InnerTransaction } from "@/models/transactions/inner/innerTxn";
import { TxnExchangeOffer } from "@/models/transactions/exchangeOffer";

export class InnerExchangeTransaction extends InnerTransaction{

  exchangeOffers: TxnExchangeOffer[] = [];
  isTakingOffer: boolean = false;

  constructor(){
    super();
  }
}