export class TransactionCommon{
  
    hash: string;
    type: number = 0;
    typeName: string = "";
    maxFee?: number | null = 0;
    signer: string = "";
    signerAddress: string = "";
    signerName: string = "";
    deadline: number | null = null;
    unknownData: Object = {};
    groupType: string;
    version: number = 0;
    derivationScheme: number = 0;
  
    constructor(txnHash: string, groupType: string){
      this.hash = txnHash;
      this.groupType = groupType;
    }

    
}
