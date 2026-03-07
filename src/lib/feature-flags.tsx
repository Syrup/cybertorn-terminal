"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useFeatureFlag } from "configcat-react";

/**
 * Feature flag keys used in the app.
 * Create these flags in your ConfigCat dashboard.
 */
export const FLAGS = {
  /** Show/hide the GitHub repository button */
  SHOW_GITHUB_BUTTON: "showGithubButton",
  /** Show/hide the theme toggle */
  SHOW_THEME_TOGGLE: "showThemeToggle",
  /** Enable maintenance mode overlay */
  MAINTENANCE_MODE: "maintenanceMode",
  /** Custom maintenance message (string flag) */
  MAINTENANCE_MESSAGE: "maintenanceMessage",
  /** Show/hide global announcement banner */
  SHOW_ANNOUNCEMENT: "showAnnouncement",
  /** Announcement message content */
  ANNOUNCEMENT_MESSAGE: "announcementMessage",
  /** Unix timestamp (in milliseconds) when maintenance started */
  MAINTENANCE_START_TIME: "maintenanceStartTime",
} as const;

interface FeatureFlagsValue {
  showGithubButton: boolean;
  showThemeToggle: boolean;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  maintenanceStartTime: number | null;
  showAnnouncement: boolean;
  announcementMessage: string;
  loading: boolean;
}

const DEFAULT_MAINTENANCE_MSG =
  "System is undergoing scheduled maintenance. Please check back shortly.";

const DEFAULTS: FeatureFlagsValue = {
  showGithubButton: true,
  showThemeToggle: true,
  maintenanceMode: false,
  maintenanceMessage: DEFAULT_MAINTENANCE_MSG,
  maintenanceStartTime: null,
  showAnnouncement: false,
  announcementMessage: "",
  loading: false,
};

const FeatureFlagsContext = createContext<FeatureFlagsValue>(DEFAULTS);

/**
 * Hook to access all feature flags.
 * Always safe to call — returns defaults when ConfigCat is not configured.
 */
export function useFlags(): FeatureFlagsValue {
  return useContext(FeatureFlagsContext);
}

/**
 * Reads flags from ConfigCat via hooks.
 * Must be rendered inside a <ConfigCatProvider>.
 */
export function ConfigCatFlags({ children }: { children: ReactNode }) {
  const { value: showGithubButton, loading: l1 } = useFeatureFlag(FLAGS.SHOW_GITHUB_BUTTON, true);
  const { value: showThemeToggle, loading: l2 } = useFeatureFlag(FLAGS.SHOW_THEME_TOGGLE, true);
  const { value: maintenanceMode, loading: l3 } = useFeatureFlag(FLAGS.MAINTENANCE_MODE, false);
  const { value: rawMaintenanceMsg, loading: l4 } = useFeatureFlag(FLAGS.MAINTENANCE_MESSAGE, DEFAULT_MAINTENANCE_MSG as string);
  const { value: showAnnouncement, loading: l5 } = useFeatureFlag(FLAGS.SHOW_ANNOUNCEMENT, false);
  const { value: announcementMessage, loading: l6 } = useFeatureFlag(FLAGS.ANNOUNCEMENT_MESSAGE, "");
  const { value: maintenanceStartTimeStr, loading: l7 } = useFeatureFlag(FLAGS.MAINTENANCE_START_TIME, "");

  const loading = l1 || l2 || l3 || l4 || l5 || l6 || l7;

  const maintenanceMessage =
    rawMaintenanceMsg === "default" ? DEFAULT_MAINTENANCE_MSG : rawMaintenanceMsg;

  const maintenanceStartTime =
    maintenanceStartTimeStr && typeof maintenanceStartTimeStr === "string"
      ? parseInt(maintenanceStartTimeStr, 10)
      : null;

  return (
    <FeatureFlagsContext.Provider
      value={{

        showGithubButton: loading ? true : showGithubButton,
        showThemeToggle: loading ? true : showThemeToggle,
        maintenanceMode: loading ? false : maintenanceMode,
        maintenanceMessage: loading ? DEFAULT_MAINTENANCE_MSG : maintenanceMessage,
        maintenanceStartTime: loading ? null : maintenanceStartTime,
        showAnnouncement: loading ? false : showAnnouncement,
        announcementMessage: loading ? "" : announcementMessage,
        loading,
      }}
    >
      {children}
    </FeatureFlagsContext.Provider>
  );
}

/**
 * Provides default flag values when ConfigCat is not configured.
 */
export function DefaultFlags({ children }: { children: ReactNode }) {
  return (
    <FeatureFlagsContext.Provider value={DEFAULTS}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}
