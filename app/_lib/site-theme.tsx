"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { KivoraProvider } from "@kivora/nextjs";
export type SiteTheme = "light" | "dark" | "candy" | "mint";
export function isSiteTheme(value: unknown): value is SiteTheme { return ["light", "dark", "candy", "mint"].includes(value as string); }
const ThemeContext = createContext<{ theme: SiteTheme; setTheme: (theme: SiteTheme) => void }>({ theme: "light", setTheme: () => {} });
export const useSiteTheme = () => useContext(ThemeContext);
export function SiteThemeProvider({ initialTheme, children }: { initialTheme: SiteTheme; children: ReactNode }) {
  const [theme, updateTheme] = useState(initialTheme);
  function setTheme(value: SiteTheme) {
    updateTheme(value);
    document.cookie = `kivora-theme=${value}; Path=/; Max-Age=31536000; SameSite=Lax`;
    try { localStorage.setItem("kivora-theme", value); } catch { /* Cookies still preserve the preference. */ }
  }
  useEffect(() => {
    const sync = (event: StorageEvent) => { if (event.key === "kivora-theme" && isSiteTheme(event.newValue)) setTheme(event.newValue); };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  return <ThemeContext.Provider value={{ theme, setTheme }}><KivoraProvider colorMode={theme === "dark" ? "dark" : "light"}>{children}</KivoraProvider></ThemeContext.Provider>;
}
export function ThemeSurface({ children, className }: { children: ReactNode; className: string }) {
  const { theme } = useSiteTheme();
  return <div className={`kivora-theme ${className}`} data-theme={theme}>{children}</div>;
}
