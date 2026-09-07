import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DemoDataProvider } from "@/components/demo/data-provider";
import { titleSeed } from "@/lib/demo/seed";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

// El stub de ResizeObserver que necesita el Player vive ahora en
// vitest.setup.ts, compartido con el gráfico del Dashboard.

// jsdom has no real media pipeline: it logs "Not implemented" console errors
// whenever the rendered <video>'s load()/pause() are invoked. Stub them to
// no-ops so the test's console output stays pristine.
//
// Asignación directa a propósito, no vi.spyOn(...).mockImplementation(): con
// el spy, ejecutar este fichero junto a otro vuelve a imprimir "Not
// implemented: HTMLMediaElement's load() method" (vitest restaura el espía
// alrededor del desmontaje), que es justo lo que se quería evitar. Y no hay
// nada que aislar: vitest corre cada fichero de test en su propio entorno
// jsdom (isolate: true por defecto), así que este prototipo no se comparte.
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
