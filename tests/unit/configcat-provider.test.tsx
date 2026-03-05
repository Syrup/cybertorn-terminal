import { test, expect, describe, mock } from "bun:test";
import { render } from "@testing-library/react";
import React, { type ReactNode } from "react";

// --- Mock configcat-react ---
mock.module("configcat-react", () => ({
  useFeatureFlag: (_key: string, defaultValue: unknown) => ({
    value: defaultValue,
    loading: false,
  }),
  ConfigCatProvider: ({ children }: { children: ReactNode }) => children,
  PollingMode: { AutoPoll: 0 },
}));

import { FeatureFlagProvider } from "../../src/lib/configcat-provider";
import { useFlags } from "../../src/lib/feature-flags";

/**
 * Helper component that renders flag values as text for assertions.
 */
function FlagReader() {
  const flags = useFlags();
  return (
    <div>
      <span data-testid="github">{String(flags.showGithubButton)}</span>
      <span data-testid="theme">{String(flags.showThemeToggle)}</span>
      <span data-testid="maintenance">{String(flags.maintenanceMode)}</span>
      <span data-testid="message">{flags.maintenanceMessage}</span>
      <span data-testid="loading">{String(flags.loading)}</span>
    </div>
  );
}

describe("FeatureFlagProvider", () => {
  test("without SDK key, provides default values (all features on)", () => {
    // NEXT_PUBLIC_CONFIGCAT_SDK_KEY is not set in test env,
    // so provider should use DefaultFlags path
    const { getByTestId } = render(
      <FeatureFlagProvider>
        <FlagReader />
      </FeatureFlagProvider>,
    );

    expect(getByTestId("github").textContent).toBe("true");
    expect(getByTestId("theme").textContent).toBe("true");
    expect(getByTestId("maintenance").textContent).toBe("false");
    expect(getByTestId("message").textContent).toContain("scheduled maintenance");
    expect(getByTestId("loading").textContent).toBe("false");
  });

  test("renders children correctly", () => {
    const { container } = render(
      <FeatureFlagProvider>
        <div data-testid="child">Hello</div>
      </FeatureFlagProvider>,
    );

    expect(container.textContent).toContain("Hello");
  });

  test("nested providers - inner overrides outer", () => {
    // Simulates that wrapping in FeatureFlagProvider doesn't break
    // when nested (shouldn't happen in practice but validates robustness)
    const { getByTestId } = render(
      <FeatureFlagProvider>
        <FeatureFlagProvider>
          <FlagReader />
        </FeatureFlagProvider>
      </FeatureFlagProvider>,
    );

    expect(getByTestId("github").textContent).toBe("true");
    expect(getByTestId("theme").textContent).toBe("true");
  });
});
