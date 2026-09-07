import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ refresh: vi.fn() }),
}));
vi.mock("@/lib/preferences-actions", () => ({
  setLocaleCookie: vi.fn(async () => undefined),
  setColorModeCookie: vi.fn(async () => undefined),
}));

import { Providers } from "@/app/providers";
import { Header } from "./header";

describe("Header", () => {
  it("renders the four navigation links", () => {
    render(
      <Providers locale="en" colorMode="system">
        <Header />
      </Providers>
    );

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs");
    expect(screen.getByRole("link", { name: "Components" })).toHaveAttribute("href", "/componentes");
    expect(screen.getByRole("link", { name: "Demo" })).toHaveAttribute("href", "/demo");
  });
});
