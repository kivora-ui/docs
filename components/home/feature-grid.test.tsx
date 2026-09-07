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

import { FeatureGrid } from "./feature-grid";

describe("FeatureGrid", () => {
  it("renders the five feature cards", () => {
    render(<FeatureGrid />);

    expect(screen.getByText(en.features.forms.title)).toBeInTheDocument();
    expect(screen.getByText(en.features.tables.title)).toBeInTheDocument();
    expect(screen.getByText(en.features.player.title)).toBeInTheDocument();
    expect(screen.getByText(en.features.uploads.title)).toBeInTheDocument();
    expect(screen.getByText(en.features.theming.title)).toBeInTheDocument();
  });

  it("shows a decorative icon on every feature card", () => {
    render(<FeatureGrid />);

    const titles = screen.getAllByRole("heading", { level: 3 });
    expect(titles).toHaveLength(5);
    for (const title of titles) {
      expect(title.parentElement?.querySelector("svg")).not.toBeNull();
    }
  });
});
