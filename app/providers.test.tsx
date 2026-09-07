import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const refresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));

const setLocaleCookie = vi.fn(async () => undefined);
const setColorModeCookie = vi.fn(async () => undefined);
vi.mock("@/lib/preferences-actions", () => ({
  setLocaleCookie: (...args: unknown[]) => setLocaleCookie(...args),
  setColorModeCookie: (...args: unknown[]) => setColorModeCookie(...args),
}));

import { es } from "@/lib/i18n";
import { Providers, usePreferences } from "./providers";

function Consumer() {
  const { locale, dictionary, setLocale, colorMode, setColorMode } = usePreferences();
  return (
    <div>
      <p>locale:{locale}</p>
      <p>colorMode:{colorMode}</p>
      <p>title:{dictionary.hero.title}</p>
      <button onClick={() => setLocale("es")}>switch-locale</button>
      <button onClick={() => setColorMode("dark")}>switch-color-mode</button>
    </div>
  );
}

describe("Providers / usePreferences", () => {
  it("exposes the initial locale and color mode, and updates optimistically", async () => {
    const user = userEvent.setup();
    render(
      <Providers locale="en" colorMode="system">
        <Consumer />
      </Providers>
    );

    expect(screen.getByText("locale:en")).toBeInTheDocument();
    expect(screen.getByText("colorMode:system")).toBeInTheDocument();

    await user.click(screen.getByText("switch-locale"));
    expect(screen.getByText("locale:es")).toBeInTheDocument();
    expect(screen.getByText(`title:${es.hero.title}`)).toBeInTheDocument();
    expect(setLocaleCookie).toHaveBeenCalledWith("es");

    await user.click(screen.getByText("switch-color-mode"));
    expect(screen.getByText("colorMode:dark")).toBeInTheDocument();
    expect(setColorModeCookie).toHaveBeenCalledWith("dark");
  });
});
