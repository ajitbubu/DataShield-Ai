"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ScannerTheme = "light" | "dark";

type ScannerThemeContextValue = {
  theme: ScannerTheme;
  toggleTheme: () => void;
};

const ScannerThemeContext = createContext<ScannerThemeContextValue | null>(null);

export function ScannerThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ScannerTheme>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem("scanner-theme") as ScannerTheme | null;
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
      return;
    }

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("scanner-theme", theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((prev) => (prev === "light" ? "dark" : "light"))
    }),
    [theme]
  );

  return (
    <ScannerThemeContext.Provider value={value}>
      <div className={theme === "dark" ? "dark" : ""}>{children}</div>
    </ScannerThemeContext.Provider>
  );
}

export function useScannerTheme() {
  const context = useContext(ScannerThemeContext);
  if (!context) {
    throw new Error("useScannerTheme must be used within ScannerThemeProvider");
  }

  return context;
}
