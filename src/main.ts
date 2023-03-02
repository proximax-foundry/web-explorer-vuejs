import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "animate.css";
import "./assets/main.scss";
import mitt from "mitt";
import PrimeVue from "primevue/config";
import "primeicons/primeicons.css";
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";
import ConfirmDialog from "primevue/confirmdialog";
import Toast from "primevue/toast";
import VueBlocksTree from "vue3-blocks-tree";
import { AppStateUtils } from "./state/utils/appStateUtils";
import {
  ChainProfile,
  ChainProfileConfig,
  ChainProfileNames,
  ThemeStyleConfig,
  type ChainProfileName,
} from "./models/stores";
import { NetworkStateUtils } from "./state/utils/networkStateUtils";
import { ChainUtils } from "./util/chainUtils";
import { ChainAPICall } from "./models/REST/chainAPICall";
import Tooltip from "primevue/tooltip";

const app = createApp(App);
const emitter = mitt();
app.config.globalProperties.emitter = emitter;
app.directive("tooltip", Tooltip);
app.use(router);
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(ToastService);
app.component("ConfirmDialog", ConfirmDialog);
app.component("Toast", Toast);
app.use(VueBlocksTree /* , {treeName:'blocks-tree'} */);
app.mount("#app");

const loadThemeConfig = async () => {
  AppStateUtils.addNewReadyStates("theme");
  try {
    const config = await fetch("./themeConfig.json", {
      headers: {
        "Cache-Control": "no-store",
        Pragma: "no-cache",
      },
    })
      .then((res) => res.json())
      .then((configInfo) => {
        return configInfo;
      });
    const themeConfig = new ThemeStyleConfig("ThemeStyleConfig");
    themeConfig.updateConfig(config);
    themeConfig.saveToLocalStorage();
    AppStateUtils.setStateReady("theme");
  } catch (e) {
    AppStateUtils.setStateReady("theme");
    console.error(e);
  }
};
loadThemeConfig();

const chainProfileIntegration = async () => {
  AppStateUtils.addNewReadyStates("chainProfile");
  try {
    const networksInfo = await fetch("./chainProfile.json", {
      headers: {
        "Cache-Control": "no-store",
        Pragma: "no-cache",
      },
    })
      .then((res) => res.json())
      .then((networksInfo) => {
        return networksInfo;
      });

    const chainProfilesData = networksInfo;
    const chainProfileNames = Object.keys(networksInfo);

    const chainProfileNamesStore = ChainProfileNames.createDefault();

    const chainNameArray: ChainProfileName[] = [];

    for (let i = 0; i < chainProfileNames.length; ++i) {
      chainNameArray.push({
        name: chainProfileNames[i],
        isPreset: true,
      });
    }

    try {
      const customChainProfile = chainProfileNamesStore.names.filter((data) => {
        if (typeof data === "string" || data instanceof String) {
          return false;
        } else {
          return !data.isPreset;
        }
      });

      chainNameArray.concat(customChainProfile);
    } catch (error) {
      throw error;
    }

    chainProfileNamesStore.names = chainNameArray;

    chainProfileNamesStore.saveToLocalStorage();

    for (const chainProfileName of chainProfileNames) {
      const chainProfileStore = new ChainProfile(chainProfileName);

      chainProfileStore.init();
      const chainProfileData = chainProfilesData[chainProfileName];

      if (chainProfileStore.getVersion() !== chainProfileData["version"]) {
        chainProfileStore.version = chainProfileData["version"];
        chainProfileStore.apiNodes = chainProfileData["apiNodes"];
        chainProfileStore.generationHash = chainProfileData["generationHash"];
        chainProfileStore.httpPort = chainProfileData["httpPort"];
        chainProfileStore.network = chainProfileData["network"];

        chainProfileStore.saveToLocalStorage();

        const endpoint = ChainUtils.buildAPIEndpoint(
          chainProfileStore.apiNodes[0],
          chainProfileStore.httpPort
        );

        const chainAPICall = new ChainAPICall(endpoint);

        try {
          const chainHeight = await chainAPICall.chainAPI.getBlockchainHeight();

          const config = await ChainUtils.getChainConfig(
            chainHeight,
            chainAPICall.chainConfigAPI.chainConfigHttp
          );

          const chainProfileConfigStore = new ChainProfileConfig(
            chainProfileName
          );

          chainProfileConfigStore.init();

          if (typeof config !== "string") {
            config.chainHeight = chainHeight;
            chainProfileConfigStore.updateConfig(config);
            chainProfileConfigStore.saveToLocalStorage();
          } else {
            console.error(config);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    NetworkStateUtils.refreshAvailableNetwork();
    NetworkStateUtils.checkDefaultNetwork();
  } catch (e) {
    console.error(e);
  }
  AppStateUtils.setStateReady("chainProfile");
};

chainProfileIntegration();
