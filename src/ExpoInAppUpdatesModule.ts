import { requireNativeModule } from "expo-modules-core";
import { ExpoInAppUpdatesModuleType } from "./ExpoInAppUpdates.types";

export default requireNativeModule<ExpoInAppUpdatesModuleType>(
  "ExpoInAppUpdates"
);
