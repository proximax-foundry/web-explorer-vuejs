import { NamespaceId, Convert, AliasType } from "tsjs-xpx-chain-sdk";
import { TransactionUtils } from "@/util/transactionUtils";
import { NamespaceUtils } from "@/util/namespaceUtil";
import type { namespaceInfoFormatted } from "@/util/namespaceUtil";
import { AccountUtils } from "@/util/accountUtil";
import { AssetUtils } from "@/util/assetUtil";
import { BlockUtils } from "@/util/blockUtil";

export interface searchResult {
  valid: boolean;
  searchType: string;
  param: string; // 'PublicKeyOrHash', 'AssetOrNamespace', 'Address', 'Block'
}

const regexNumeric = /^[0-9]+$/;

export class SearchService {
  searchString: string = "";
  filter: string = "";

  async search(_searchString: string, _filter: string): Promise<searchResult> {
    this.searchString = _searchString.trim();
    this.filter = _filter;
    try {
      switch (this.filter) {
        case "all":
          if (
            this.searchString.length == 64 &&
            Convert.isHexString(this.searchString)
          ) {
            // Public key or Txn hash
            // verify if it is txn hash
            const transactionSearch = await this.searchTxn();
            if (transactionSearch.valid) {
              return transactionSearch;
            } else {
              return this.searchPublicKey("PublicKeyOrHash");
            }
          } else if (
            this.searchString.length == 40 ||
            this.searchString.length == 46
          ) {
            // address
            return this.searchAddress();
          } else if (
            this.searchString.length == 16 &&
            Convert.isHexString(this.searchString)
          ) {
            // asset and namespace
            // search asset
            if (NamespaceUtils.isNamespaceHex(this.searchString)) {
              return this.searchNamespace();
            } else {
              return this.searchAsset();
            }
          } else if (regexNumeric.test(this.searchString)) {
            // block
            return this.searchBlock();
          } else {
            // search alias
            return this.searchAlias();
          }
        case "tx":
          if (
            this.searchString.length == 64 &&
            Convert.isHexString(this.searchString)
          ) {
            return this.searchTxn();
          } else {
            return {
              valid: false,
              searchType: "Hash",
              param: this.searchString,
            };
          }
        case "block":
          if (regexNumeric.test(this.searchString)) {
            // block
            return this.searchBlock();
            // return {
            //   valid: true,
            //   searchType: 'Block',
            //   param: this.searchString,
            // };
          } else {
            return {
              valid: false,
              searchType: "Block",
              param: this.searchString,
            };
          }
        case "assetID":
          if (
            this.searchString.length == 16 &&
            Convert.isHexString(this.searchString)
          ) {
            return this.searchAsset();
          } else {
            return this.searchAssetAlias();
          }
        case "namespaceID":
          if (
            this.searchString.length == 16 &&
            Convert.isHexString(this.searchString)
          ) {
            return this.searchNamespace();
          } else {
            return this.searchAlias();
          }
        case "address":
          if (
            this.searchString.length == 40 ||
            this.searchString.length == 46
          ) {
            return this.searchAddress();
          } else {
            return {
              valid: false,
              searchType: "Address",
              param: this.searchString,
            };
          }
        case "publicKey":
          if (
            this.searchString.length == 64 &&
            Convert.isHexString(this.searchString)
          ) {
            return this.searchPublicKey("PublicKey");
          } else {
            return {
              valid: false,
              searchType: "PublicKey",
              param: this.searchString,
            };
          }
        default:
          return {
            valid: false,
            searchType: "all",
            param: this.searchString,
          };
      }
    } catch (error) {
      return {
        valid: false,
        searchType: "all",
        param: this.searchString,
      };
    }
  }

  async searchAsset(): Promise<searchResult> {
    const asset = await AssetUtils.getAssetProperties(this.searchString);
    if (asset) {
      return {
        valid: true,
        searchType: "Asset",
        param: this.searchString,
      };
    } else {
      return {
        valid: false,
        searchType: "Asset",
        param: this.searchString,
      };
    }
  }

  async searchPublicKey(invalidLabel: string): Promise<searchResult> {
    const address: string | boolean = AccountUtils.getAddressFromPublicKey(
      this.searchString
    );
    if (address != false) {
      const addressStr = address.toString();
      const account = await AccountUtils.getAccountFromAddress(addressStr);
      if (account != false) {
        return {
          valid: true,
          searchType: "PublicKey",
          param: this.searchString,
        };
      } else {
        return {
          valid: false,
          searchType: invalidLabel,
          param: this.searchString,
        };
      }
    } else {
      return {
        valid: false,
        searchType: invalidLabel,
        param: this.searchString,
      };
    }
  }

  async searchAddress(): Promise<searchResult> {
    const account = await AccountUtils.getAccountFromAddress(this.searchString);
    if (account != false) {
      return {
        valid: true,
        searchType: "Address",
        param: this.searchString,
      };
    } else {
      return {
        valid: false,
        searchType: "Address",
        param: this.searchString,
      };
    }
  }

  async searchTxn(): Promise<searchResult> {
    const transaction = await TransactionUtils.getTransaction(
      this.searchString
    );
    if (transaction.isFound === true) {
      return {
        valid: true,
        searchType: "Hash",
        param: this.searchString,
      };
    } else {
      return {
        valid: false,
        searchType: "Hash",
        param: this.searchString,
      };
    }
  }

  async searchAlias(): Promise<searchResult> {
    const ns = new NamespaceId(this.searchString.toLowerCase());
    const formattedNs: namespaceInfoFormatted | boolean =
      await NamespaceUtils.fetchNamespaceInfo(ns.toHex());
    if (typeof formattedNs === "boolean") {
      const namespace = await NamespaceUtils.fetchNamespaceInfo(ns.toHex());
      if (namespace != false) {
        return {
          valid: true,
          searchType: "Namespace",
          param: ns.toHex(),
        };
      } else {
        return {
          valid: false,
          searchType: "Namespace",
          param: this.searchString,
        };
      }
    } else {
      if (formattedNs.alias.type == 2) {
        return {
          valid: true,
          searchType: "Address",
          param: formattedNs.alias.id,
        };
      } else if (formattedNs.alias.type == 1) {
        return {
          valid: true,
          searchType: "Asset",
          param: formattedNs.alias.id,
        };
      } else {
        return {
          valid: true,
          searchType: "Namespace",
          param: ns.toHex(),
        };
      }
    }
  }

  async searchNamespace(): Promise<searchResult> {
    const namespace = await NamespaceUtils.fetchNamespaceInfo(
      this.searchString
    );
    if (namespace != false) {
      return {
        valid: true,
        searchType: "Namespace",
        param: this.searchString,
      };
    } else {
      return {
        valid: false,
        searchType: "Namespace",
        param: this.searchString,
      };
    }
  }

  async searchAssetAlias() {
    const ns = new NamespaceId(this.searchString.toLowerCase());
    const returnData = {
      valid: false,
      searchType: "Asset",
      param: this.searchString,
    };
    const formattedNs: namespaceInfoFormatted | boolean =
      await NamespaceUtils.fetchNamespaceInfo(ns.toHex());
    if (typeof formattedNs !== "boolean") {
      if (formattedNs.alias.type == AliasType.Mosaic) {
        returnData.valid = true;
        returnData.param = formattedNs.alias.id;
      }
    }
    return returnData;
  }

  async searchBlock() {
    const block = await BlockUtils.getBlockByHeight(
      parseInt(this.searchString)
    );
    if (block) {
      return {
        valid: true,
        searchType: "Block",
        param: this.searchString,
      };
    } else {
      return {
        valid: false,
        searchType: "Block",
        param: this.searchString,
      };
    }
  }
}
