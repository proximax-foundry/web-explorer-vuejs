import { StoreProperties } from "./storeProperties";


const key = "ChainProfilesName";

export interface ChainProfileName{
    name:string;
    isPreset: boolean;
}

export class ChainProfileNames extends StoreProperties {

    names: ChainProfileName[] = [];

    constructor(storeName: string){
        super(storeName);
    }

    static createDefault(): ChainProfileNames{
        const newObj = new ChainProfileNames(key);
        newObj.init();
        return newObj;
    }

    fetchFromLocalStorage(): void{
        this.init();
    }

    getIndexByName(name: string): number{
        return this.names.findIndex(currentName=> currentName.name == name)
    }
}