import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ExpoInAppUpdatesViewProps } from './ExpoInAppUpdates.types';

const NativeView: React.ComponentType<ExpoInAppUpdatesViewProps> =
  requireNativeViewManager('ExpoInAppUpdates');

export default function ExpoInAppUpdatesView(props: ExpoInAppUpdatesViewProps) {
  return <NativeView {...props} />;
}
