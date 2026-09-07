"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { KivoraProvider } from "@kivora/nextjs";
import type { ColorMode } from "@kivora/theme";
import { dictionaries, type Dictionary, type Locale } from "@/lib/i18n";
import { setColorModeCookie, setLocaleCookie } from "@/lib/preferences-actions";

interface PreferencesContextValue {
  locale: Locale;
  dictionary: Dictionary;
  setLocale: (locale: Locale) => void;
  colorMode: ColorMode;
  setColorMode: (colorMode: ColorMode) => void;
}

const PreferencesContext = React.createContext<PreferencesContextValue | null>(null);

export function usePreferences(): PreferencesContextValue {
  const context = React.useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within Providers");
  }
  return context;
}

export interface ProvidersProps {
  children: React.ReactNode;
  locale: Locale;
  colorMode: ColorMode;
}

export function Providers({ children, locale: initialLocale, colorMode: initialColorMode }: ProvidersProps) {
  const router = useRouter();
  const [locale, setLocaleState] = React.useState(initialLocale);
  const [colorMode, setColorModeState] = React.useState(initialColorMode);

  const setLocale = React.useCallback(
    (next: Locale) => {
      setLocaleState(next);
      void setLocaleCookie(next).then(() => router.refresh());
    },
    [router]
  );

  const setColorMode = React.useCallback(
    (next: ColorMode) => {
      setColorModeState(next);
      void setColorModeCookie(next).then(() => router.refresh());
    },
    [router]
  );

  const value = React.useMemo<PreferencesContextValue>(
    () => ({ locale, dictionary: dictionaries[locale], setLocale, colorMode, setColorMode }),
    [locale, setLocale, colorMode, setColorMode]
  );

  return (
    <PreferencesContext.Provider value={value}>
      <KivoraProvider colorMode={colorMode}>{children}</KivoraProvider>
    </PreferencesContext.Provider>
  );
}
