"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useSyncExternalStore } from "react";

function subscribe() {

  return () => {};
}

function getSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!mounted) {
    return (
      <button
        type="button"
        className="p-2 border border-border bg-card hover:bg-accent hover:text-accent-foreground transition-colors"
        aria-label="Toggle theme"
      >
        <div className="h-4 w-4" />
      </button>
    );
  }

  const effectiveTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = effectiveTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(effectiveTheme === "dark" ? "light" : "dark")}
      className="p-2 border border-border bg-card hover:bg-accent hover:text-accent-foreground transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </button>
  );
}
