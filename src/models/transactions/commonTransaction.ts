export class CommonTransaction{
  
    hash: string;
    type: number = 0;
    typeName: string = "";
    maxFee?: number | null = 0;
    signer: string = "";
    signerAddress: string = "";
    signerName: string = "";
    deadline: number | null = null;
    unknownData: Object = {};
  
    constructor(txnHash: string){
      this.hash = txnHash;
    }
}
