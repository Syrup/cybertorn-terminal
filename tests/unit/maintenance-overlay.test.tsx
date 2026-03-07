import { test, expect, describe, mock } from "bun:test";
import { render } from "@testing-library/react";
import React, { type ReactNode } from "react";

mock.module("configcat-react", () => ({
  useFeatureFlag: () => ({ value: false, loading: false }),
  ConfigCatProvider: ({ children }: { children: ReactNode }) => children,
  PollingMode: { AutoPoll: 0 },
}));

import { MaintenanceOverlay } from "../../src/components/MaintenanceOverlay";

let flagOverrides: Record<string, unknown> = {};

mock.module("../../src/lib/feature-flags", () => {
  const DEFAULTS = {
    showGithubButton: true,
    showThemeToggle: true,
    maintenanceMode: false,
    maintenanceMessage: "System is undergoing scheduled maintenance. Please check back shortly.",
    loading: false,
  };

  return {
    FLAGS: {
      SHOW_GITHUB_BUTTON: "showGithubButton",
      SHOW_THEME_TOGGLE: "showThemeToggle",
      MAINTENANCE_MODE: "maintenanceMode",
      MAINTENANCE_MESSAGE: "maintenanceMessage",
    },
    useFlags: () => ({ ...DEFAULTS, ...flagOverrides }),
    DefaultFlags: ({ children }: { children: ReactNode }) => children,
    ConfigCatFlags: ({ children }: { children: ReactNode }) => children,
  };
});

function setFlags(overrides: Record<string, unknown>) {
  flagOverrides = overrides;
}

describe("MaintenanceOverlay", () => {
  test("renders nothing when maintenanceMode is off", () => {
    setFlags({ maintenanceMode: false });

    const { container } = render(<MaintenanceOverlay />);
    expect(container.innerHTML).toBe("");
  });

  test("renders overlay when maintenanceMode is on", () => {
    setFlags({ maintenanceMode: true });

    const { container } = render(<MaintenanceOverlay />);
    expect(container.innerHTML).not.toBe("");
    expect(container.textContent).toContain("MAINTENANCE MODE");
  });

  test("displays the provided maintenance message", () => {
    setFlags({
      maintenanceMode: true,
      maintenanceMessage: "Back at 3 PM",
    });

    const { container } = render(<MaintenanceOverlay />);
    expect(container.textContent).toContain("Back at 3 PM");
  });

  test("displays default maintenance message when maintenanceMessage is default text", () => {
    setFlags({
      maintenanceMode: true,
      maintenanceMessage: "System is undergoing scheduled maintenance. Please check back shortly.",
    });

    const { container } = render(<MaintenanceOverlay />);
    expect(container.textContent).toContain("scheduled maintenance");
  });
});
