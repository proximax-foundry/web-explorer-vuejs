import { AppState } from "@/state/appState";
import {
  UInt64,
  NamespaceId,
  NamespaceInfo,
} from "tsjs-xpx-chain-sdk";
import { ChainUtils } from "./chainUtils";
import { TransactionUtils } from '@/models/util/transactionUtils';
import { Helper } from "@/util/typeHelper";
import { pushScopeId } from "vue";

const namespaceIdFirstCharacterString = "89ABCDEF";

export interface aliasObj{
  id: string;
  type: number;
}

export interface levelObj{
  id: string;
  type: string;
}

export interface namespaceInfoFormatted{
  ownerAddress: string;
  ownerPublicKey: string;
  start: number;
  end: string;
  levels: levelObj[];
  alias: aliasObj;
  parentId?: string;
  depth: number;
  name: string;
  active: boolean;
  type: boolean;
}

export class NamespaceUtils{
  static async fetchNamespaceInfo(namespaceHex: string):Promise<namespaceInfoFormatted|boolean>{
    try{
      let ns_uint64 = UInt64.fromHex(namespaceHex);
      let ns:namespaceInfoFormatted;
      let namespaceId = new NamespaceId([ns_uint64.lower, ns_uint64.higher]);
      let namespaceInfo = await AppState.chainAPI.namespaceAPI.getNamespace(namespaceId);

      let namespaceName = await AppState.chainAPI.namespaceAPI.getNamespacesName([namespaceId]);
      let endHeight:string;
      if(typeof namespaceInfo.endHeight.compact() === 'number'){
        endHeight = namespaceInfo.endHeight.compact().toString();
      }else{
        endHeight = NamespaceUtils.preciseBigInt(namespaceInfo.endHeight.toHex());
      }
      ns = {
        ownerAddress: namespaceInfo.owner.address.pretty().toString(),
        ownerPublicKey: namespaceInfo.owner.publicKey,
        start: namespaceInfo.startHeight.compact(),
        end: endHeight,
        depth: namespaceInfo.depth,
        active: namespaceInfo.active,
        type: namespaceInfo.isRoot(),
        levels:[],
        name: namespaceName[0].name,
        alias: {
          id: '',
          type: 0
        }
      };

      if(namespaceInfo.levels.length > 0){
        let levels:any = [];
        for(let i = 0; i < namespaceInfo.levels.length; ++i){
          let levelNamespaceId = new NamespaceId([namespaceInfo.levels[i].id.lower, namespaceInfo.levels[i].id.higher]);
          let levelNamespace_name = await AppState.chainAPI.namespaceAPI.getNamespacesName([levelNamespaceId]);
          levels.push({
            id: namespaceInfo.levels[i].id.toHex(),
            name: levelNamespace_name[0].name
          })
        }
        ns.levels = levels;
      }

      if(namespaceInfo.alias){
        if(namespaceInfo.alias.type == 1){
          ns.alias.id = namespaceInfo.alias.mosaicId.toHex();
        }else if(namespaceInfo.alias.type == 2){
          ns.alias.id = namespaceInfo.alias.address.pretty();
        }
        ns.alias.type = namespaceInfo.alias.type;
      }

      if(!namespaceInfo.isRoot()){
        ns.parentId = namespaceInfo.parentNamespaceId().toHex();
      }
      return ns;
    }catch(error){
      console.log(error)
      return false;
    }
  }

  static isNamespace(namespaceHex: string): boolean{
    return Array.from(namespaceIdFirstCharacterString).includes(namespaceHex.toUpperCase().substring(0, 1));
  }

  static relativeTime = (timestamp:number) => {
    let current = new Date();
    let expired = new Date(timestamp);
    let timeDiff = {
      years: expired.getFullYear() - current.getFullYear(),
      months: expired.getMonth() - current.getMonth(),
      days: expired.getDate()  - current.getDate(),
      hours: expired.getHours() - current.getHours(),
      mins: expired.getMinutes() - current.getMinutes(),
    }

    if (timeDiff.mins < 0) {
      timeDiff.hours--;
      timeDiff.mins += 60;
    }
    if (timeDiff.hours < 0) {
      timeDiff.days--;
      timeDiff.hours += 24;
    }
    if (timeDiff.days < 0) {
      timeDiff.months--;
      // days = days left in current's month,
      //   plus days that have passed in expiry's month
      const copyCurrent = new Date(current.getTime());
      copyCurrent.setDate(32);
      timeDiff.days = 32 - current.getDate() - copyCurrent.getDate() + expired.getDate();
    }
    if (timeDiff.months < 0) {
      timeDiff.years--;
      timeDiff.months+=12;
    }
    if(timeDiff.years > 0){
      return timeDiff.years + ' ' + 'year' + ((timeDiff.years>1)?'s':'');
    }else if(timeDiff.months > 0){
      return timeDiff.months + ' ' + 'month' + ((timeDiff.months>1)?'s':'');
    }else if(timeDiff.days > 0){
      return timeDiff.days + ' ' + 'day' + ((timeDiff.days>1)?'s':'');
    }else if(timeDiff.hours > 0){
      return timeDiff.hours + ' ' + 'hour' + ((timeDiff.hours>1)?'s':'');
    }else{
      return timeDiff.mins + ' ' + 'minute' + ((timeDiff.mins>1)?'s':'');
    }
  }

  static preciseBigInt (hexNum:string) {
    /**
     * http://www.danvk.org/hex2dec.html
     */
    function add(x:number[], y:number[], base:number) {
        let z = [];
        let n = Math.max(x.length, y.length);
        let carry = 0;
        let i = 0;
        while (i < n || carry) {
            let xi = i < x.length ? x[i] : 0;
            let yi = i < y.length ? y[i] : 0;
            let zi = carry + xi + yi;
            z.push(zi % base);
            carry = Math.floor(zi / base);
            i++;
        }
        return z;
    }
    function multiplyByNumber(num:number, x:number[], base:number) {
        if (num < 0) return null;
        if (num == 0) return [];

        let result = [];
        let power = x;
        while (true) {
            if (num & 1) {
                result = add(result, power, base);
            }
            num = num >> 1;
            if (num === 0) break;
            power = add(power, power, base);
        }
        return result;
    }

    function parseToDigitsArray(str:string, base:number) {
        let digits = str.split('');
        let ary = [];
        for (let i = digits.length - 1; i >= 0; i--) {
            let n = parseInt(digits[i], base);
            if (isNaN(n)) return null;
            ary.push(n);
        }
        return ary;
    }
    function convertBase(str:string, fromBase:number, toBase:number) {
        let digits = parseToDigitsArray(str, fromBase);
        if (digits === null) return null;

        let outArray = [];
        let power = [1];
        for (let i = 0; i < digits.length; i++) {
            if (digits[i]) {
                outArray = add(outArray, multiplyByNumber(digits[i], power, toBase), toBase);
            }
            power = multiplyByNumber(fromBase, power, toBase);
        }

        let out = '';
        for (let i = outArray.length - 1; i >= 0; i--) {
            out += outArray[i].toString(toBase);
        }
        return out;
    }
    function decToHex(decStr) {
        let hex = convertBase(decStr, 10, 16);
        return hex ? '0x' + hex : null;
    }
    function hexToDec(hexStr:string) {
        if (hexStr.substring(0, 2) === '0x') hexStr = hexStr.substring(2);
        hexStr = hexStr.toLowerCase();
        return convertBase(hexStr, 16, 10);
    }
    let result = hexToDec(hexNum)
    return result
  }
}

