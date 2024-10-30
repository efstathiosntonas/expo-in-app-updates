# expo-in-app-updates

Native in-app updates for Android and iOS.

This module uses the Android native [in-app updates](https://developer.android.com/guide/playcore/in-app-updates) library on Android and [iTunes Search API](https://performance-partners.apple.com/search-api) on iOS.

On Android, it will show a native overlay like the screenshots below but on iOS it opens the app in the App Store on a modal to update the app, since iOS does not have any in-app update solution. You may want to show an alert or custom UI on iOS. See the [example](#example) at the bottom.

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
    }
  }
}
```

> For bare React Native projects, you must ensure that you have [installed and configured the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before continuing.
> Run `npx pod-install` after installing the npm package for iOS.

```
npx expo run:android | run:ios
```

## Usages

### Check for updates :

```ts
const { 
  updateAvailable,
  flexibleAllowed,
  immediateAllowed
} = await ExpoInAppUpdates.checkForUpdate();
```

Checks if an app update is available. Return a promise that resolves `updateAvailable` for Android and iOS, `flexibleAllowed` and `immediateAllowed` for Android.

- `updateAvailable`: If an update is available.
- `flexibleAllowed`: If able to start a [Flexible Update](https://developer.android.com/guide/playcore/in-app-updates/kotlin-java#flexible)
- `immediateAllowed`: If able to start an [Immediate Update](https://developer.android.com/guide/playcore/in-app-updates/kotlin-java#immediate)
- `storeVersion`: Returns the latest version from the App/Play Store

### Start an in-app update :

```ts
const isUpdateStarted = await ExpoInAppUpdates.startUpdate();
```

Starts an in-app update. Return a boolean whether the update was started successfully.

> [!NOTE]
> If you want an [Immediate Update](https://developer.android.com/guide/playcore/in-app-updates/kotlin-java#immediate) that will cover the app with the update overlay, pass true to this function. By default, it will start a [Flexible Update](https://developer.android.com/guide/playcore/in-app-updates/kotlin-java#flexible). More details : https://developer.android.com/guide/playcore/in-app-updates#update-flows
>
> ```ts
> const isUpdateStarted = await ExpoInAppUpdates.startUpdate(true);
> ```

### Check and start an in-app update :

```ts
const isUpdateStarted = await ExpoInAppUpdates.checkAndStartUpdate();
```

Checks if an app update is available and starts the update process if necessary. Return a boolean whether the update was started successfully.

> [!NOTE]
> If you want an [Immediate Update](https://developer.android.com/guide/playcore/in-app-updates/kotlin-java#immediate) that will cover the app with the update overlay, pass true to this function. By default, it will start a [Flexible Update](https://developer.android.com/guide/playcore/in-app-updates/kotlin-java#flexible). More details : https://developer.android.com/guide/playcore/in-app-updates#update-flows
>
> ```ts
> const isUpdateStarted = await ExpoInAppUpdates.checkAndStartUpdate(true);
> ```

> [!TIP]
> You may want to check for updates and show an alert or custom UI on iOS. Since iOS does not have any in-app update solution, it just opens the app in the App Store on a modal to update the app. See the [example](#example) below.

### Example

```tsx
import { useEffect } from "react";
import { Alert, Platform, Text, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as ExpoInAppUpdates from "expo-in-app-updates";

const useInAppUpdates = () => {
  useEffect(() => {
    if (__DEV__ || Platform.OS === "web") return;
    
      ExpoInAppUpdates.checkForUpdate().then(async ({ updateAvailable, storeVersion, immediateAllowed }) => {
        if (!updateAvailable) return;
        
        /* use storeVersion to check against AsyncStorage/MMKV and prevent showing the alert
         * on every app cold boot for the same version 
         */
        const storedAppVersion = await AsyncStorage.getItem("latestVersion")
        
        if(storedAppVersion === storeVersion) {
            return
        }
        
        if(Platform.OS === 'android') {
            ExpoInAppUpdates.startUpdate(
                // If you want an immediate update that will cover the app with the update overlay, set it to true.
                // More details : https://developer.android.com/guide/playcore/in-app-updates#update-flows
                immediateAllowed // or false
            )
            await AsyncStorage.setItem("latestVersion", storeVersion)
            return;
        }

        Alert.alert(
          "Update available",
          "A new version of the app is available with many improvements and bug fixes. Would you like to update now?",
          [
            {
              text: "Update",
              isPreferred: true,
              async onPress() {
                await ExpoInAppUpdates.startUpdate();
                await AsyncStorage.setItem("latestVersion", storeVersion)
              },
            },
            { 
             text: "Cancel",
             async onPress() {
                await AsyncStorage.setItem("latestVersion", storeVersion)
              } 
            },
          ]
        );
      });
  }, []);
};

export default function App() {
  useInAppUpdates();

  return (
    <View>
      <Text>Native in-app updates for Android and iOS</Text>
    </View>
  );
}
```
