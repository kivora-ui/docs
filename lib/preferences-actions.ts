"use server";

import { cookies } from "next/headers";
import type { ColorMode } from "@kivora/theme";
import type { Locale } from "@/lib/i18n";
import { COLOR_MODE_COOKIE, LOCALE_COOKIE } from "@/lib/preferences";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export async function setLocaleCookie(locale: Locale): Promise<void> {
  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, { path: "/", maxAge: ONE_YEAR_IN_SECONDS });
}

export async function setColorModeCookie(colorMode: ColorMode): Promise<void> {
  const store = await cookies();
  store.set(COLOR_MODE_COOKIE, colorMode, { path: "/", maxAge: ONE_YEAR_IN_SECONDS });
}
