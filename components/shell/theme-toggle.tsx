"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@kivora/nextjs";
import type { ColorMode } from "@kivora/theme";
import { usePreferences } from "@/app/providers";

export function ThemeToggle() {
  const { colorMode, setColorMode, dictionary } = usePreferences();

  return (
    <ToggleGroup
      type="single"
      value={colorMode}
      onValueChange={(value) => {
        if (value) setColorMode(value as ColorMode);
      }}
      aria-label={dictionary.shell.themeToggleLabel}
    >
      <ToggleGroupItem value="light" aria-label={dictionary.shell.themeLight}>
        <Sun className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label={dictionary.shell.themeDark}>
        <Moon className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="system" aria-label={dictionary.shell.themeSystem}>
        <Laptop className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
