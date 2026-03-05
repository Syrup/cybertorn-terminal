import { test, expect, describe, mock, beforeEach } from "bun:test";
import { renderHook } from "@testing-library/react";
import React from "react";
import { useFlags, DefaultFlags, ConfigCatFlags } from "../../src/lib/feature-flags";

// --- Mock configcat-react ---

let mockFlagValues: Record<string, { value: unknown; loading: boolean }> = {};

mock.module("configcat-react", () => ({
  useFeatureFlag: (key: string, defaultValue: unknown) => {
    return mockFlagValues[key] ?? { value: defaultValue, loading: false };
  },
  ConfigCatProvider: ({ children }: { children: React.ReactNode }) => children,
  PollingMode: { AutoPoll: 0 },
}));

beforeEach(() => {
  mockFlagValues = {};
});

// --- Tests ---

describe("useFlags (no provider / context default)", () => {
  test("returns safe defaults when used without any provider", () => {
    const { result } = renderHook(() => useFlags());

    expect(result.current.showGithubButton).toBe(true);
    expect(result.current.showThemeToggle).toBe(true);
    expect(result.current.maintenanceMode).toBe(false);
    expect(result.current.maintenanceMessage).toContain("scheduled maintenance");
    expect(result.current.loading).toBe(false);
  });
});

describe("DefaultFlags", () => {
  test("provides default values (all features on, maintenance off)", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <DefaultFlags>{children}</DefaultFlags>
    );

    const { result } = renderHook(() => useFlags(), { wrapper });

    expect(result.current.showGithubButton).toBe(true);
    expect(result.current.showThemeToggle).toBe(true);
    expect(result.current.maintenanceMode).toBe(false);
    expect(result.current.maintenanceMessage).toContain("scheduled maintenance");
    expect(result.current.loading).toBe(false);
  });
});

describe("ConfigCatFlags", () => {
  test("passes ConfigCat values through to context when loaded", () => {
    mockFlagValues = {
      showGithubButton: { value: true, loading: false },
      showThemeToggle: { value: true, loading: false },
      maintenanceMode: { value: false, loading: false },
      maintenanceMessage: { value: "default", loading: false },
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ConfigCatFlags>{children}</ConfigCatFlags>
    );

    const { result } = renderHook(() => useFlags(), { wrapper });

    expect(result.current.showGithubButton).toBe(true);
    expect(result.current.showThemeToggle).toBe(true);
    expect(result.current.maintenanceMode).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  test("shows buttons and hides maintenance while loading", () => {
    mockFlagValues = {
      showGithubButton: { value: false, loading: true },
      showThemeToggle: { value: false, loading: true },
      maintenanceMode: { value: true, loading: true },
      maintenanceMessage: { value: "We are down", loading: true },
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ConfigCatFlags>{children}</ConfigCatFlags>
    );

    const { result } = renderHook(() => useFlags(), { wrapper });

    // While loading, safe defaults should be used
    expect(result.current.showGithubButton).toBe(true);
    expect(result.current.showThemeToggle).toBe(true);
    expect(result.current.maintenanceMode).toBe(false);
    expect(result.current.loading).toBe(true);
  });

  test("hides buttons when flags are off and loaded", () => {
    mockFlagValues = {
      showGithubButton: { value: false, loading: false },
      showThemeToggle: { value: false, loading: false },
      maintenanceMode: { value: false, loading: false },
      maintenanceMessage: { value: "default", loading: false },
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ConfigCatFlags>{children}</ConfigCatFlags>
    );

    const { result } = renderHook(() => useFlags(), { wrapper });

    expect(result.current.showGithubButton).toBe(false);
    expect(result.current.showThemeToggle).toBe(false);
  });

  test("enables maintenance mode when flag is on and loaded", () => {
    mockFlagValues = {
      showGithubButton: { value: true, loading: false },
      showThemeToggle: { value: true, loading: false },
      maintenanceMode: { value: true, loading: false },
      maintenanceMessage: { value: "Server update in progress", loading: false },
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ConfigCatFlags>{children}</ConfigCatFlags>
    );

    const { result } = renderHook(() => useFlags(), { wrapper });

    expect(result.current.maintenanceMode).toBe(true);
    expect(result.current.maintenanceMessage).toBe("Server update in progress");
  });

  test("replaces 'default' message with built-in default", () => {
    mockFlagValues = {
      showGithubButton: { value: true, loading: false },
      showThemeToggle: { value: true, loading: false },
      maintenanceMode: { value: true, loading: false },
      maintenanceMessage: { value: "default", loading: false },
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ConfigCatFlags>{children}</ConfigCatFlags>
    );

    const { result } = renderHook(() => useFlags(), { wrapper });

    expect(result.current.maintenanceMessage).toContain("scheduled maintenance");
    expect(result.current.maintenanceMessage).not.toBe("default");
  });

  test("uses custom message when not 'default'", () => {
    mockFlagValues = {
      showGithubButton: { value: true, loading: false },
      showThemeToggle: { value: true, loading: false },
      maintenanceMode: { value: true, loading: false },
      maintenanceMessage: { value: "Downtime until 5 PM", loading: false },
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ConfigCatFlags>{children}</ConfigCatFlags>
    );

    const { result } = renderHook(() => useFlags(), { wrapper });

    expect(result.current.maintenanceMessage).toBe("Downtime until 5 PM");
  });

  test("only one flag loading still triggers safe defaults", () => {
    mockFlagValues = {
      showGithubButton: { value: false, loading: false },
      showThemeToggle: { value: false, loading: false },
      maintenanceMode: { value: true, loading: false },
      maintenanceMessage: { value: "test", loading: true }, // only this one loading
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ConfigCatFlags>{children}</ConfigCatFlags>
    );

    const { result } = renderHook(() => useFlags(), { wrapper });

    // Even if only one flag is loading, safe defaults apply
    expect(result.current.loading).toBe(true);
    expect(result.current.showGithubButton).toBe(true);
    expect(result.current.showThemeToggle).toBe(true);
    expect(result.current.maintenanceMode).toBe(false);
  });
});
