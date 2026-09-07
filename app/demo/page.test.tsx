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
});
