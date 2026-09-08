import { describe, expect, it, vi } from "vitest";

const setMock = vi.fn();
vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({ set: setMock })),
}));

import { setColorModeCookie, setLocaleCookie } from "./preferences-actions";
import { COLOR_MODE_COOKIE, LOCALE_COOKIE } from "./preferences";

describe("preferences actions", () => {
  it("persists the locale cookie for one year, site-wide", async () => {
    await setLocaleCookie("es");
    expect(setMock).toHaveBeenCalledWith(LOCALE_COOKIE, "es", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  });

  it("persists the color mode cookie for one year, site-wide", async () => {
    await setColorModeCookie("dark");
    expect(setMock).toHaveBeenCalledWith(COLOR_MODE_COOKIE, "dark", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  });
});
