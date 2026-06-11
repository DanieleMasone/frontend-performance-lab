import { useCallback, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark";

export const THEME_STORAGE_KEY = "frontend-performance-lab-theme";

export function readStoredTheme(storageKey = THEME_STORAGE_KEY): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = window.localStorage.getItem(storageKey);
  return stored === "dark" ? "dark" : "light";
}

export function applyTheme(theme: ThemeMode): void {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function usePersistentTheme(storageKey = THEME_STORAGE_KEY) {
  const [theme, setTheme] = useState<ThemeMode>(() => readStoredTheme(storageKey));

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(storageKey, theme);
  }, [storageKey, theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  return {
    theme,
    isDark: theme === "dark",
    toggleTheme
  };
}
