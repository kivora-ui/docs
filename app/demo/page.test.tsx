import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { subscriberSeed, titleSeed } from "@/lib/demo/seed";
import { DemoDataProvider } from "@/components/demo/data-provider";
import DemoPage from "./page";

describe("Demo dashboard", () => {
  it("shows active subscribers, MRR and the top title", () => {
    render(
      <DemoDataProvider>
        <DemoPage />
      </DemoDataProvider>
    );

    const activeCount = subscriberSeed.filter((s) => s.status === "active").length;
    expect(screen.getByText(String(activeCount))).toBeInTheDocument();

    const topTitle = [...titleSeed].sort((a, b) => b.viewsLast30Days - a.viewsLast30Days)[0];
    expect(screen.getByText(topTitle.name)).toBeInTheDocument();
  });

  it("gives the page an h1 and each section an h2", () => {
    render(
      <DemoDataProvider>
        <DemoPage />
      </DemoDataProvider>
    );

    expect(screen.getByRole("heading", { level: 1, name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual([
      "Indicadores",
      "Altas de suscriptores (últimos 6 meses)",
      "Contenido más visto",
    ]);
  });
});
