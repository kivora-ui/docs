import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { subscriberSeed, titleSeed } from "@/lib/demo/seed";
import type { Title } from "@/lib/demo/types";
import { DemoDataProvider, useDemoData } from "./data-provider";

const STORAGE_KEY = "kivora-demo-ott-v1";

const newTitle: Title = {
  id: "nueva-serie",
  name: "Nueva Serie",
  genre: "Drama",
  type: "Serie",
  releaseYear: 2026,
  durationMinutes: 40,
  viewsLast30Days: 0,
};

function Consumer() {
  const { titles, subscribers, addTitle } = useDemoData();
  return (
    <div>
      <p>titles:{titles.length}</p>
      <p>subscribers:{subscribers.length}</p>
      <button onClick={() => addTitle(newTitle)}>add-title</button>
    </div>
  );
}

describe("DemoDataProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("starts from the seed data", () => {
    render(
      <DemoDataProvider>
        <Consumer />
      </DemoDataProvider>
    );

    expect(screen.getByText(`titles:${titleSeed.length}`)).toBeInTheDocument();
    expect(screen.getByText(`subscribers:${subscriberSeed.length}`)).toBeInTheDocument();
  });

  it("adds a title and persists it to localStorage", async () => {
    const user = userEvent.setup();
    render(
      <DemoDataProvider>
        <Consumer />
      </DemoDataProvider>
    );

    await user.click(screen.getByText("add-title"));
    expect(screen.getByText(`titles:${titleSeed.length + 1}`)).toBeInTheDocument();

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
    expect(stored?.titles).toHaveLength(titleSeed.length + 1);
  });

  it("hydrates from a previously persisted store instead of the seed", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ titles: [newTitle], subscribers: [] })
    );

    render(
      <DemoDataProvider>
        <Consumer />
      </DemoDataProvider>
    );

    expect(screen.getByText("titles:1")).toBeInTheDocument();
    expect(screen.getByText("subscribers:0")).toBeInTheDocument();
  });
});
