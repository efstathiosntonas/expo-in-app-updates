export type ExpoInAppUpdatesModuleType = {
  /** [Flexible Update](https://developer.android.com/guide/playcore/in-app-updates/kotlin-java#flexible) */
  FLEXIBLE: 0;

  /** [Immediate Update](https://developer.android.com/guide/playcore/in-app-updates/kotlin-java#immediate) */
  IMMEDIATE: 1;

  /**
   * Checks if an app update is available.
   *
   * @return A promise that resolves updateAvailable for Android and iOS, flexibleAllowed and immediateAllowed for Android
   */
  checkForUpdate: () => Promise<{
    /** If an update is available */
    updateAvailable: boolean;

    /** If an update is available */
    updateInProgress?: boolean;

    /**
     * If able to start a [Flexible Update](https://developer.android.com/guide/playcore/in-app-updates/kotlin-java#flexible)
     *
     * @platform android */
    flexibleAllowed?: boolean;

    /**
     * If able to start an [Immediate Update](https://developer.android.com/guide/playcore/in-app-updates/kotlin-java#immediate)
     * @platform android */
    immediateAllowed?: boolean;
  }>;

  /**
   * Starts an in-app update.
   *
   * @param updateType - Whether the update should be a [flexible update](https://developer.android.com/guide/playcore/in-app-updates/kotlin-java#flexible) or [immediate update](https://developer.android.com/guide/playcore/in-app-updates/kotlin-java#immediate).
   *
   * @return Whether the update was started successfully.
   */
  startUpdate: (
    /**
     * Must be one of the [AppUpdateType](../index.ts)
     * @platform android */
    updateType?: number
  ) => Promise<boolean>;
};
