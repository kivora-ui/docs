// app/not-found.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { en } from "@/lib/i18n";

// Header/Footer are client components that read the preferences context,
// which normally comes from the root layout's <Providers>. The 404 page
// itself is a server component, so only its children need the stub.
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
    expect(screen.getByRole("heading", { name: "Página no encontrada" })).toBeInTheDocument();
  });

  it("offers a way back to the home page", () => {
    render(<NotFound />);

    expect(screen.getByRole("link", { name: "Volver al inicio" })).toHaveAttribute("href", "/");
  });
});
