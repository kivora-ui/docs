"use client";

import { ToggleGroup, ToggleGroupItem } from "@kivora/nextjs";
import type { Locale } from "@/lib/i18n";
import { usePreferences } from "@/providers/app-providers";

export function LocaleToggle() {
  const { locale, setLocale, dictionary } = usePreferences();

  return (
    <ToggleGroup
      type="single"
      value={locale}
      onValueChange={(value) => {
        if (value) setLocale(value as Locale);
      }}
      aria-label={dictionary.shell.localeToggleLabel}
    >
      <ToggleGroupItem value="en">EN</ToggleGroupItem>
      <ToggleGroupItem value="es">ES</ToggleGroupItem>
    </ToggleGroup>
  );
}
