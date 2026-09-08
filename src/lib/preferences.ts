import type { ColorMode } from "@kivora/theme";
import type { Locale } from "@/lib/i18n";

export const LOCALE_COOKIE = "kivora-locale";
export const COLOR_MODE_COOKIE = "kivora-color-mode";

const LOCALES: readonly Locale[] = ["en", "es"];
const COLOR_MODES: readonly ColorMode[] = ["light", "dark", "system"];

export interface CookieReader {
  get(name: string): { value: string } | undefined;
}

export interface InitialPreferences {
  locale: Locale;
  colorMode: ColorMode;
}

function isLocale(value: string | undefined): value is Locale {
  return (LOCALES as readonly string[]).includes(value ?? "");
}

function isColorMode(value: string | undefined): value is ColorMode {
  return (COLOR_MODES as readonly string[]).includes(value ?? "");
}

export function resolveInitialPreferences(cookieStore: CookieReader): InitialPreferences {
  const rawLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const rawColorMode = cookieStore.get(COLOR_MODE_COOKIE)?.value;

  return {
    locale: isLocale(rawLocale) ? rawLocale : "en",
    colorMode: isColorMode(rawColorMode) ? rawColorMode : "system",
  };
}
