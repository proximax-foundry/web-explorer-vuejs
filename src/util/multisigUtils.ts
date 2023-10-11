import { AppState } from "@/state/appState";
import { type ModifyMultisigAccountTransaction, MultisigCosignatoryModificationType, MultisigAccountInfo, Address } from "tsjs-xpx-chain-sdk";

export class MultisigUtils {

    static findCosigners(multisigAccountsInfo: MultisigAccountInfo[]): string[] {

        let cosigners: string[] = [];
    
        /*for (let i = 0; i < multisigAccountsInfo.length; ++i) {
          if (multisigAccountsInfo[i].minApproval === 0 && multisigAccountsInfo[i].minRemoval === 0) {
            cosigners.push(multisigAccountsInfo[i].account.publicKey);
          }
        }*/

        if (multisigAccountsInfo[0].cosignatories.length > 0) {
          for(let j = 0; j < multisigAccountsInfo[0].cosignatories.length; ++j){
            cosigners.push(multisigAccountsInfo[0].cosignatories[j].publicKey);
          }
        }
    
        return cosigners;
      }

     static isFullySigned(multisigAccountInfo: MultisigAccountInfo, signedSigners: string[]): boolean {

        if (multisigAccountInfo.isMultisig()) {
          let minApproval = multisigAccountInfo.minApproval;
    
          let intersectedCosigners = multisigAccountInfo.cosignatories.filter(cosigner => signedSigners.includes(cosigner.publicKey));
    
          return intersectedCosigners.length >= minApproval;
    
        } else {
          return signedSigners.includes(multisigAccountInfo.account.publicKey);
        }
      }

  static async findAllLevelCosigners(address: Address): Promise<string[]> {

    let multisigAccountsInfoMap = (await AppState.chainAPI!.accountAPI.getMultisigAccountGraphInfo(address)).multisigAccounts;

    let cosigners: string[] = [];

    let allKeys = [...multisigAccountsInfoMap.keys()];

    for (let i = 0; i < allKeys.length; ++i) {
      let level = allKeys[i];

      let multisigAccountsInfo = multisigAccountsInfoMap.get(level);

      let thisLevelCosigners = MultisigUtils.findCosigners(multisigAccountsInfo!);
      cosigners = cosigners.concat(thisLevelCosigners);
    }

    cosigners = Array.from(new Set(cosigners));

    return cosigners;
  }


   static async getAllDeepModifyMultisigCosigners(modifyMultisigAccountTransaction: ModifyMultisigAccountTransaction): Promise<string[]> {
        let neededSigners: string[] = [];
    
        let addedPublicKeys = modifyMultisigAccountTransaction.modifications.filter(mod => mod.type === MultisigCosignatoryModificationType.Add).map(mod => mod.cosignatoryPublicAccount.publicKey);
        let oriCosigners: string[] = [];
        let searchingCosigners: string[] = [];
    
        let signer = modifyMultisigAccountTransaction.signer!.publicKey;
    
        try {
          let multisigInfo = await  AppState.chainAPI!.accountAPI.getMultisigAccountInfo(modifyMultisigAccountTransaction.signer!.address);
          oriCosigners = multisigInfo.cosignatories.map(cosigner => cosigner.publicKey);
    
        } catch (error) {
          neededSigners.push(signer);
        }
    
        searchingCosigners = oriCosigners.concat(addedPublicKeys);
    
        for (let i = 0; i < searchingCosigners.length; ++i) {
    
          try {
            let allCosigner = await MultisigUtils.findAllLevelCosigners(Address.createFromPublicKey(searchingCosigners[i], AppState.networkType));
    
            neededSigners = neededSigners.concat(allCosigner);
          } catch (error) {
            neededSigners.push(searchingCosigners[i]);
          }
        }
    
        neededSigners = Array.from(new Set(neededSigners));
    
        return neededSigners;
      }
    
      static async getAllFlatModifyMultisigCosigners(modifyMultisigAccountTransaction: ModifyMultisigAccountTransaction): Promise<string[]> {
        let neededSigners: string[] = [];
    
        let addedPublicKeys = modifyMultisigAccountTransaction.modifications.filter(mod => mod.type === MultisigCosignatoryModificationType.Add).map(mod => mod.cosignatoryPublicAccount.publicKey);
        let oriCosigners: string[] = [];
    
    
        try {
          let multisigInfo = await AppState.chainAPI!.accountAPI.getMultisigAccountInfo(modifyMultisigAccountTransaction.signer!.address);
          oriCosigners = multisigInfo.cosignatories.map(cosigner => cosigner.publicKey);
    
        } catch (error) {
    
        }
    
        neededSigners = oriCosigners.concat(addedPublicKeys);
    
        neededSigners = Array.from(new Set(neededSigners));
    
        return neededSigners;
      }
}