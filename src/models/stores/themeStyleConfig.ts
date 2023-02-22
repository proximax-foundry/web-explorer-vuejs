import type { JdenticonConfig } from "jdenticon";
import { StoreProperties } from "./storeProperties";

export class ThemeStyleConfig extends StoreProperties {
  jdenticonConfig: JdenticonConfig = {};

  constructor(storeName: string) {
    super(storeName);
  }

  updateConfig(config: JdenticonConfig): void {
    Object.assign(this, config);
  }
}
