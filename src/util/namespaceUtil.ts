import { AppState } from "@/state/appState";
import { UInt64, NamespaceId, Convert } from "tsjs-xpx-chain-sdk";

const namespaceIdFirstCharacterString = "89ABCDEF";

export interface aliasObj {
  id: string;
  type: number;
}

export interface levelObj {
  id: string;
  name: string;
}

export interface namespaceInfoFormatted {
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

export interface namespaceValidInfo {
  valid: boolean;
  namespaceIdHex: string;
  namespaceName: string;
}

export class NamespaceUtils {
  static async fetchNamespaceInfo(
    namespaceHex: string
  ): Promise<namespaceInfoFormatted | false> {
    if (!AppState.chainAPI) {
      throw new Error("Service Unavailable");
    }
    try {
      const ns_uint64 = UInt64.fromHex(namespaceHex);
      const namespaceId = new NamespaceId([ns_uint64.lower, ns_uint64.higher]);
      const namespaceInfo = await AppState.chainAPI.namespaceAPI.getNamespace(
        namespaceId
      );

      const namespaceName =
        await AppState.chainAPI.namespaceAPI.getNamespacesName([namespaceId]);
      let endHeight: string = "";
      if (typeof namespaceInfo.endHeight.compact() === "number") {
        endHeight = namespaceInfo.endHeight.compact().toString();
      } else {
        const bigInt = NamespaceUtils.preciseBigInt(
          namespaceInfo.endHeight.toHex()
        );
        if (bigInt) {
          endHeight = bigInt;
        }
      }
      const ns: namespaceInfoFormatted = {
        ownerAddress: namespaceInfo.owner.address.pretty().toString(),
        ownerPublicKey: namespaceInfo.owner.publicKey,
        start: namespaceInfo.startHeight.compact(),
        end: endHeight,
        depth: namespaceInfo.depth,
        active: namespaceInfo.active,
        type: namespaceInfo.isRoot(),
        levels: [],
        name: namespaceName[0].name,
        alias: {
          id: "",
          type: 0,
        },
      };

      if (namespaceInfo.levels.length > 0) {
        const levels: any = [];
        for (let i = 0; i < namespaceInfo.levels.length; ++i) {
          const levelNamespaceId = new NamespaceId([
            namespaceInfo.levels[i].id.lower,
            namespaceInfo.levels[i].id.higher,
          ]);
          const levelNamespace_name =
            await AppState.chainAPI.namespaceAPI.getNamespacesName([
              levelNamespaceId,
            ]);
          levels.push({
            id: namespaceInfo.levels[i].id.toHex(),
            name: levelNamespace_name[0].name,
          });
        }
        ns.levels = levels;
      }

      if (namespaceInfo.alias) {
        if (namespaceInfo.alias.type == 1) {
          const mosaicId = namespaceInfo.alias.mosaicId;
          if (!mosaicId) {
            ns.alias.id = "";
          } else {
            ns.alias.id = mosaicId.toHex();
          }
        } else if (namespaceInfo.alias.type == 2) {
          const address = namespaceInfo.alias.address;
          if (!address) {
            ns.alias.id = "";
          } else {
            ns.alias.id = address.pretty();
          }
        }
        ns.alias.type = namespaceInfo.alias.type;
      }

      if (!namespaceInfo.isRoot()) {
        ns.parentId = namespaceInfo.parentNamespaceId().toHex();
      }
      return ns;
    } catch (error) {
      // console.log(error)
      return false;
    }
  }

  static isNamespaceHex(namespaceHex: string): boolean {
    if (namespaceHex.length !== 16 || !Convert.isHexString(namespaceHex)) {
      return false;
    }
    return Array.from(namespaceIdFirstCharacterString).includes(
      namespaceHex.toUpperCase().substring(0, 1)
    );
  }

  static isValidNamespaceString(namespace: string): namespaceValidInfo {
    const data: namespaceValidInfo = {
      valid: false,
      namespaceIdHex: "",
      namespaceName: "",
    };

    const validNamespaceHex = NamespaceUtils.isNamespaceHex(namespace);

    if (validNamespaceHex) {
      data.valid = true;
      data.namespaceIdHex = namespace;
    } else {
      try {
        const namespaceId = new NamespaceId(namespace);

        data.valid = true;
        data.namespaceName = namespace;
        data.namespaceIdHex = namespaceId.toHex();
      } catch (error) {
        // invalid namespace name format
      }
    }

    return data;
  }

  static relativeTime = (timestamp: number) => {
    const current = new Date();
    const expired = new Date(timestamp);
    const timeDiff = {
      years: expired.getFullYear() - current.getFullYear(),
      months: expired.getMonth() - current.getMonth(),
      days: expired.getDate() - current.getDate(),
      hours: expired.getHours() - current.getHours(),
      mins: expired.getMinutes() - current.getMinutes(),
    };

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
      timeDiff.days =
        32 - current.getDate() - copyCurrent.getDate() + expired.getDate();
    }
    if (timeDiff.months < 0) {
      timeDiff.years--;
      timeDiff.months += 12;
    }
    if (timeDiff.years > 0) {
      return timeDiff.years + " " + "year" + (timeDiff.years > 1 ? "s" : "");
    } else if (timeDiff.months > 0) {
      return timeDiff.months + " " + "month" + (timeDiff.months > 1 ? "s" : "");
    } else if (timeDiff.days > 0) {
      return timeDiff.days + " " + "day" + (timeDiff.days > 1 ? "s" : "");
    } else if (timeDiff.hours > 0) {
      return timeDiff.hours + " " + "hour" + (timeDiff.hours > 1 ? "s" : "");
    } else {
      return timeDiff.mins + " " + "minute" + (timeDiff.mins > 1 ? "s" : "");
    }
  };

  static preciseBigInt(hexNum: string) {
    /**
     * http://www.danvk.org/hex2dec.html
     */
    function add(x: number[], y: number[], base: number) {
      const z = [];
      const n = Math.max(x.length, y.length);
      let carry = 0;
      let i = 0;
      while (i < n || carry) {
        const xi = i < x.length ? x[i] : 0;
        const yi = i < y.length ? y[i] : 0;
        const zi = carry + xi + yi;
        z.push(zi % base);
        carry = Math.floor(zi / base);
        i++;
      }
      return z;
    }
    function multiplyByNumber(num: number, x: number[], base: number) {
      if (num < 0) return null;
      if (num == 0) return [];

      let result: number[] = [];
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

    function parseToDigitsArray(str: string, base: number) {
      const digits = str.split("");
      const ary = [];
      for (let i = digits.length - 1; i >= 0; i--) {
        const n = parseInt(digits[i], base);
        if (isNaN(n)) return null;
        ary.push(n);
      }
      return ary;
    }
    function convertBase(str: string, fromBase: number, toBase: number) {
      const digits = parseToDigitsArray(str, fromBase);
      if (digits === null) return null;

      let outArray: number[] = [];
      let power = [1];
      for (let i = 0; i < digits.length; i++) {
        if (digits[i]) {
          const y = multiplyByNumber(digits[i], power, toBase);
          if (y) {
            outArray = add(outArray, y, toBase);
          }
        }
        const z = multiplyByNumber(fromBase, power, toBase);
        if (z) {
          power = z;
        }
      }

      let out = "";
      for (let i = outArray.length - 1; i >= 0; i--) {
        out += outArray[i].toString(toBase);
      }
      return out;
    }
    function hexToDec(hexStr: string) {
      if (hexStr.substring(0, 2) === "0x") hexStr = hexStr.substring(2);
      hexStr = hexStr.toLowerCase();
      return convertBase(hexStr, 16, 10);
    }
    const result = hexToDec(hexNum);
    return result;
  }
}
