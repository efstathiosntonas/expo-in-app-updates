import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ExpoInAppUpdates.web.ts
// and on native platforms to ExpoInAppUpdates.ts
import ExpoInAppUpdatesModule from './ExpoInAppUpdatesModule';
import ExpoInAppUpdatesView from './ExpoInAppUpdatesView';
import { ChangeEventPayload, ExpoInAppUpdatesViewProps } from './ExpoInAppUpdates.types';

// Get the native constant value.
export const PI = ExpoInAppUpdatesModule.PI;

export function hello(): string {
  return ExpoInAppUpdatesModule.hello();
}

export async function setValueAsync(value: string) {
  return await ExpoInAppUpdatesModule.setValueAsync(value);
}

const emitter = new EventEmitter(ExpoInAppUpdatesModule ?? NativeModulesProxy.ExpoInAppUpdates);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ExpoInAppUpdatesView, ExpoInAppUpdatesViewProps, ChangeEventPayload };
