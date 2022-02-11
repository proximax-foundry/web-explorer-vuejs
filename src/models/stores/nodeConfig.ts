import { StoreProperties } from "./storeProperties";
// import { Network } from "../network";
// import { ChainExplorer } from "../chainExplorer";

export class nodeConfig extends StoreProperties{

    constructor(storeName: string){
        super(storeName);
    }

    updateConfig(config: any): void {
        Object.assign(this, config);
    }
}