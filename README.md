# expo-in-app-updates

Native in-app updates for Android and iOS

<a href="https://developer.android.com/guide/playcore/in-app-updates#flexible"><img src="https://developer.android.com/static/images/app-bundle/flexible_flow.png" alt="Example flexible updates" height="400"/></a>

<a href="https://developer.android.com/guide/playcore/in-app-updates#immediate"><img src="https://developer.android.com/static/images/app-bundle/immediate_flow.png" alt="Example immediate updates" height="400"/></a>

## Installation

```
npm install expo-in-app-updates
```

For iOS, add your AppStoreID (the id in your app store link, e.g https://apps.apple.com/pl/app/example/id1234567890) in `infoPlist` in your `app.json`

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "AppStoreID": "1234567890"
      }
    },
  }
}

```

> Run `npx pod-install` after installing the npm package for iOS.

> For bare React Native projects, you must ensure that you have [installed and configured the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before continuing.

```
npx expo run:android | run:ios
```

## Usages

```tsx
import * as ExpoInAppUpdates from "expo-in-app-updates";

const useInAppUpdates = () => {
  useEffect(() => {
    if (__DEV__) return;

    if (Platform.OS === "android") {
      ExpoInAppUpdates.checkAndStartUpdate(
        // If you want an immediate update that will cover the app with the update overlay, set it to true.
        // More details : https://developer.android.com/guide/playcore/in-app-updates#update-flows
        false
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
```
