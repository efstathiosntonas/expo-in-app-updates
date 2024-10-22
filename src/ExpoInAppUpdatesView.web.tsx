import * as React from 'react';

import { ExpoInAppUpdatesViewProps } from './ExpoInAppUpdates.types';

export default function ExpoInAppUpdatesView(props: ExpoInAppUpdatesViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
