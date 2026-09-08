// src/components/shell/footer.test.tsx
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

import { Providers } from "@/providers/app-providers";
import { Footer } from "./footer";

describe("Footer", () => {
  it("links to the four published npm packages", () => {
    render(
      <Providers locale="en" colorMode="system">
        <Footer />
      </Providers>
    );

    expect(screen.getByRole("link", { name: "@kivora/nextjs" })).toHaveAttribute(
      "href",
      "https://www.npmjs.com/package/@kivora/nextjs"
    );
    expect(screen.getByRole("link", { name: "@kivora/native" })).toHaveAttribute(
      "href",
      "https://www.npmjs.com/package/@kivora/native"
    );
    expect(screen.getByRole("link", { name: "@kivora/theme" })).toHaveAttribute(
      "href",
      "https://www.npmjs.com/package/@kivora/theme"
    );
    expect(screen.getByRole("link", { name: "@kivora/init" })).toHaveAttribute(
      "href",
      "https://www.npmjs.com/package/@kivora/init"
    );
  });

  it("shows a decorative icon next to every package link", () => {
    render(
      <Providers locale="en" colorMode="system">
        <Footer />
      </Providers>
    );

    for (const name of ["@kivora/nextjs", "@kivora/native", "@kivora/theme", "@kivora/init"]) {
      const link = screen.getByRole("link", { name });
      expect(link.querySelector("svg")).not.toBeNull();
    }
  });
});
