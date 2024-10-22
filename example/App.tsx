import { StyleSheet, Text, View } from 'react-native';

import * as ExpoInAppUpdates from 'expo-in-app-updates';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{ExpoInAppUpdates.hello()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
