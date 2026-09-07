import { describe, expect, it } from "vitest";
import { COLOR_MODE_COOKIE, LOCALE_COOKIE, resolveInitialPreferences } from "./preferences";

function cookieStoreWith(values: Record<string, string>) {
  return {
    get(name: string) {
      const value = values[name];
      return value === undefined ? undefined : { value };
    },
  };
}

describe("resolveInitialPreferences", () => {
  it("defaults to English and system color mode when no cookies are set", () => {
    expect(resolveInitialPreferences(cookieStoreWith({}))).toEqual({
      locale: "en",
      colorMode: "system",
    });
  });

  it("reads a valid locale and color mode from cookies", () => {
    const store = cookieStoreWith({ [LOCALE_COOKIE]: "es", [COLOR_MODE_COOKIE]: "dark" });
    expect(resolveInitialPreferences(store)).toEqual({ locale: "es", colorMode: "dark" });
  });

  it("falls back to defaults for invalid cookie values", () => {
    const store = cookieStoreWith({ [LOCALE_COOKIE]: "fr", [COLOR_MODE_COOKIE]: "purple" });
    expect(resolveInitialPreferences(store)).toEqual({ locale: "en", colorMode: "system" });
  });
});
