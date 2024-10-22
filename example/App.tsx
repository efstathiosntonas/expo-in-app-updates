import { useEffect } from "react";
import { Alert, Platform, StyleSheet, Text, View } from "react-native";

import * as ExpoInAppUpdates from "expo-in-app-updates";

const useInAppUpdates = () => {
  useEffect(() => {
    if (__DEV__) return;

    if (Platform.OS === "android") {
      ExpoInAppUpdates.checkAndStartUpdate(
        // If you want an immediate update that will cover the app with the update overlay, set it to true in .env before you build. More details : https://developer.android.com/guide/playcore/in-app-updates#update-flows
        process.env.EXPO_PUBLIC_IMMEDIATE_IN_APP_UPDATES === "true"
      );
    } else {
      ExpoInAppUpdates.checkForUpdate().then(({ updateAvailable }) => {
        if (!updateAvailable) return;

        Alert.alert(
          "Update available",
          "A new version of the app is available with many improvements and bug fixes. Would you like to update now?",
          [
            {
              text: "Update",
              isPreferred: true,
              async onPress() {
                await ExpoInAppUpdates.startUpdate();
              },
            },
            { text: "Cancel" },
          ]
        );
      });
    }
  }, []);
};

export default function App() {
  useInAppUpdates();

  return (
    <View style={styles.container}>
      <Text>Native in-app updates for Android and iOS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
