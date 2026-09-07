import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/demo/catalogo",
}));

import { DemoNavLink } from "./demo-nav-link";

describe("DemoNavLink", () => {
  it("marks the link matching the current path as active", () => {
    render(
      <>
        <DemoNavLink href="/demo/catalogo">Catálogo</DemoNavLink>
        <DemoNavLink href="/demo/suscriptores">Suscriptores</DemoNavLink>
      </>
    );

    expect(screen.getByRole("link", { name: "Catálogo" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Suscriptores" })).not.toHaveAttribute("aria-current");
  });
});
