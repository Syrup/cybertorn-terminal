"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useMemo } from "react";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const effectiveTheme = useMemo(
    () => (theme === "system" ? resolvedTheme : theme),
    [theme, resolvedTheme]
  );

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 border border-border bg-card hover:bg-accent hover:text-accent-foreground transition-colors"
      aria-label="Toggle theme"
      suppressHydrationWarning
    >
      <span suppressHydrationWarning>
        {effectiveTheme === "dark" ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </span>
    </button>
  );
}
