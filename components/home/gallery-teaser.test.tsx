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

import { GalleryTeaser } from "./gallery-teaser";

describe("GalleryTeaser", () => {
  it("renders every teaser card and a closing CTA, all linking to /componentes", () => {
    render(<GalleryTeaser />);

    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThanOrEqual(11); // 10 tarjetas + el CTA "ver todos"
    for (const link of links) {
      expect(link).toHaveAttribute("href", "/componentes");
    }
    expect(screen.getByRole("link", { name: en.gallery.ctaLabel })).toBeInTheDocument();
  });

  it("shows a decorative icon on every component card", () => {
    render(<GalleryTeaser />);

    const ctaLink = screen.getByRole("link", { name: en.gallery.ctaLabel });
    const cardLinks = screen.getAllByRole("link").filter((link) => link !== ctaLink);

    expect(cardLinks).toHaveLength(10);
    for (const link of cardLinks) {
      expect(link.querySelector("svg")).not.toBeNull();
    }
  });
});
