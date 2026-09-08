import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/docs",
}));

import { NavLink } from "./nav-link";

describe("NavLink", () => {
  it("marks the link matching the current path as active", () => {
    render(
      <>
        <NavLink href="/docs">Docs</NavLink>
        <NavLink href="/componentes">Componentes</NavLink>
      </>
    );

    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Componentes" })).not.toHaveAttribute("aria-current");
  });
});
