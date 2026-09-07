import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { en } from "@/lib/i18n";

vi.mock("@/app/providers", () => ({
  usePreferences: () => ({
    locale: "en",
    dictionary: en,
    setLocale: vi.fn(),
    colorMode: "system",
    setColorMode: vi.fn(),
  }),
}));

import { Hero } from "./hero";

describe("Hero", () => {
  it("renders the headline and both calls to action", () => {
    render(<Hero />);

    expect(screen.getByRole("heading", { level: 1, name: en.hero.title })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: en.hero.ctaPrimary })).toHaveAttribute(
      "href",
      "/componentes"
    );
    expect(screen.getByRole("link", { name: en.hero.ctaSecondary })).toHaveAttribute("href", "/docs");
  });
});
