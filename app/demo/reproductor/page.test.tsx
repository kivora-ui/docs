import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DemoDataProvider } from "@/components/demo/data-provider";
import { titleSeed } from "@/lib/demo/seed";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

// jsdom does not implement ResizeObserver. @kivora/nextjs's Player observes
// its root element unconditionally to detect a "small" (mobile) layout —
// without a stub the mount effect throws ReferenceError and the test fails
// before any assertion runs (same pre-existing jsdom gap noted for Task 5's
// recharts ResponsiveContainer, but here it's fatal rather than silent).
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal("ResizeObserver", ResizeObserverStub);

// jsdom also has no real media pipeline: it logs "Not implemented" console
// errors whenever the rendered <video>'s load()/pause() are invoked. Stub
// them to no-ops so the test's console output stays pristine; this has no
// bearing on the assertion below, which only checks the selected <option>.
HTMLMediaElement.prototype.load = () => {};
HTMLMediaElement.prototype.pause = () => {};

import ReproductorPage from "./page";

describe("Reproductor", () => {
  it("defaults to the first playable title and lists it as selected", () => {
    render(
      <DemoDataProvider>
        <ReproductorPage />
      </DemoDataProvider>
    );

    const firstPlayable = titleSeed.find((t) => t.playerSource);
    expect(screen.getByRole("option", { name: firstPlayable!.name, selected: true })).toBeInTheDocument();
  });

  it("gives the page an h1", () => {
    render(
      <DemoDataProvider>
        <ReproductorPage />
      </DemoDataProvider>
    );

    expect(screen.getByRole("heading", { level: 1, name: "Reproductor" })).toBeInTheDocument();
  });
});
