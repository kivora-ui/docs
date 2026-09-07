import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { en } from "@/lib/i18n";

vi.mock("next/navigation", () => ({
  usePathname: () => "/demo",
}));

vi.mock("@/app/providers", () => ({
  usePreferences: () => ({
    locale: "en",
    dictionary: en,
    setLocale: vi.fn(),
    colorMode: "system",
    setColorMode: vi.fn(),
  }),
}));

import { DemoShell } from "./demo-shell";

describe("DemoShell", () => {
  it("wraps the sidebar links in a labelled navigation landmark", () => {
    render(<DemoShell>contenido</DemoShell>);

    const nav = screen.getByRole("navigation", { name: "Nébula" });
    expect(nav).toBeInTheDocument();
    expect(nav).toContainElement(screen.getByRole("link", { name: "Catálogo" }));
  });

  it("keeps the sidebar collapsed on narrow viewports until the menu is toggled", async () => {
    const user = userEvent.setup();
    render(<DemoShell>contenido</DemoShell>);

    const toggle = screen.getByRole("button", { name: "Abrir el menú" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    // Navegar cierra el cajón: si no, se quedaría tapando la página nueva.
    await user.click(screen.getByRole("link", { name: "Catálogo" }));
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("renders the theme toggle but not the inert locale toggle", () => {
    render(<DemoShell>contenido</DemoShell>);

    expect(screen.getByRole("radiogroup", { name: en.shell.themeToggleLabel })).toBeInTheDocument();
    expect(
      screen.queryByRole("radiogroup", { name: en.shell.localeToggleLabel })
    ).not.toBeInTheDocument();
  });
});
