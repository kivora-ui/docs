// app/not-found.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { en } from "@/lib/i18n";

// Header/Footer and the 404 page itself are client components that read the
// preferences context, which normally comes from the root layout's
// <Providers>, so the module is stubbed here.
vi.mock("@/providers/app-providers", () => ({
  usePreferences: () => ({
    locale: "en",
    dictionary: en,
    setLocale: vi.fn(),
    colorMode: "system",
    setColorMode: vi.fn(),
  }),
}));

import NotFound from "./not-found";

describe("NotFound", () => {
  it("renders the marketing header and footer around the message", () => {
    render(<NotFound />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: en.notFound.title })).toBeInTheDocument();
  });

  it("offers a way back to the home page", () => {
    render(<NotFound />);

    expect(screen.getByRole("link", { name: en.notFound.backToHome })).toHaveAttribute("href", "/");
  });
});
