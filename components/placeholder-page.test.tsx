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

import { PlaceholderPage } from "./placeholder-page";

describe("PlaceholderPage", () => {
  it("renders the title for the given key and the coming-soon message", () => {
    render(<PlaceholderPage titleKey="docsTitle" />);

    expect(screen.getByRole("heading", { name: en.placeholder.docsTitle })).toBeInTheDocument();
    expect(screen.getByText(en.placeholder.comingSoon)).toBeInTheDocument();
  });
});
