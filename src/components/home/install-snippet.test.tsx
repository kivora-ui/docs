// src/components/home/install-snippet.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { en } from "@/lib/i18n";

vi.mock("@/providers/app-providers", () => ({
  usePreferences: () => ({
    locale: "en",
    dictionary: en,
    setLocale: vi.fn(),
    colorMode: "system",
    setColorMode: vi.fn(),
  }),
}));

import { InstallSnippet } from "./install-snippet";

describe("InstallSnippet", () => {
  it("shows the install heading and the init command", () => {
    const { container } = render(<InstallSnippet />);

    expect(screen.getByText(en.install.heading)).toBeInTheDocument();
    // The syntax highlighter wraps the command in several nested elements
    // that all share the same textContent, so a single-element text query
    // would match more than one node; check the rendered output instead.
    expect(container.textContent).toContain("npx @kivora/init");
  });
});
