import { reactive } from "vue";
import type { BuildTransactions } from "../util/buildTransactions";
import type { ChainAPICall } from "../models/REST/chainAPICall";
import { NetworkType } from "tsjs-xpx-chain-sdk";

interface NativeToken {
  label: string;
  fullNamespace: string;
  assetId: string;
  divisibility: number;
}

interface RegisteredToken {
  label: string;
  fullNamespace: string;
}

interface storeFailedTxnHashs {
  networkName: string;
  txnHash: string;
}

interface appStateInterface {
  buildTxn: BuildTransactions | null;
  nativeToken: NativeToken;
  registeredToken: RegisteredToken[];
  chainAPI: ChainAPICall | null;
  networkType: NetworkType;
  nodeFullURL: string;
  nodeURL: string;
  wsNodeFullURL: string;
  readyStates: Map<string, boolean>;
  isReady: boolean;
  isPendingTxnAnnounce: boolean;
  labelFailedTxn: storeFailedTxnHashs[];
}

export const AppState = reactive<appStateInterface>({
  buildTxn: null,
  nativeToken: {
    assetId: "",
    divisibility: 6,
    fullNamespace: "prx.xpx",
    label: "XPX",
  },
  registeredToken: [
    {
      label: "METX",
      fullNamespace: "prx.metx",
    },
    {
      label: "XAR",
      fullNamespace: "xarcade.xar",
    },
  ],
  chainAPI: null,
  networkType: NetworkType.TEST_NET,
  nodeFullURL: "",
  nodeURL: "",
  wsNodeFullURL: "",
  readyStates: new Map(),
  isReady: false,
  isPendingTxnAnnounce: false,
  labelFailedTxn: [],
});
