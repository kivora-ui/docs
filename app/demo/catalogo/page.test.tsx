import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DemoDataProvider } from "@/components/demo/data-provider";
import { titleSeed } from "@/lib/demo/seed";
import CatalogoPage from "./page";

// Debe coincidir con el pageSize que la página pasa a la DataTable: las
// aserciones sobre miniaturas y acciones solo ven la primera página.
const PAGE_SIZE = 8;

describe("Catálogo", () => {
  it("lists the seeded titles and adds a new one through the form", async () => {
    const user = userEvent.setup();
    render(
      <DemoDataProvider>
        <CatalogoPage />
      </DemoDataProvider>
    );

    expect(screen.getByText(titleSeed[0].name)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Añadir título" }));
    await user.type(screen.getByLabelText("Título"), "Serie de prueba");
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(screen.getByText("Serie de prueba")).toBeInTheDocument();
  });

  it("shows a poster thumbnail for titles that have one and a placeholder for the rest", () => {
    const { container } = render(
      <DemoDataProvider>
        <CatalogoPage />
      </DemoDataProvider>
    );

    const firstPage = titleSeed.slice(0, PAGE_SIZE);
    const withPoster = firstPage.filter((title) => title.posterUrl);

    const thumbnails = [...container.querySelectorAll<HTMLImageElement>("tbody img")];
    expect(thumbnails).toHaveLength(withPoster.length);
    expect(thumbnails.map((img) => img.getAttribute("src"))).toContain(withPoster[0].posterUrl);

    // Los títulos sin póster no dejan la celda vacía: muestran la inicial.
    const withoutPoster = firstPage.find((title) => !title.posterUrl)!;
    expect(
      screen.getAllByText(withoutPoster.name.charAt(0), { selector: "[aria-hidden='true']" }).length
    ).toBeGreaterThan(0);
  });

  it("links playable titles to the player with a ?title= deep link", () => {
    render(
      <DemoDataProvider>
        <CatalogoPage />
      </DemoDataProvider>
    );

    const playable = titleSeed.find((title) => title.playerSource)!;
    expect(screen.getByRole("link", { name: `Reproducir ${playable.name}` })).toHaveAttribute(
      "href",
      `/demo/reproductor?title=${playable.id}`
    );

    // Un título sin fuente reproducible no ofrece la acción.
    const notPlayable = titleSeed.slice(0, PAGE_SIZE).find((title) => !title.playerSource)!;
    expect(
      screen.queryByRole("link", { name: `Reproducir ${notPlayable.name}` })
    ).not.toBeInTheDocument();
  });
});
