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

import { StatsBar } from "./stats-bar";

describe("StatsBar", () => {
  it("shows the component families, platforms and themes stats", () => {
    render(<StatsBar />);

    expect(screen.getByText("116")).toBeInTheDocument();
    expect(screen.getByText(en.stats.componentFamiliesLabel)).toBeInTheDocument();
    // Platforms and themes both happen to be "2": assert the pair, not a single match.
    expect(screen.getAllByText("2")).toHaveLength(2);
    expect(screen.getByText(en.stats.platformsLabel)).toBeInTheDocument();
    expect(screen.getByText(en.stats.themesLabel)).toBeInTheDocument();
  });
});
