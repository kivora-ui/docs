import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DemoDataProvider } from "@/components/demo/data-provider";
import { titleSeed } from "@/lib/demo/seed";
import CatalogoPage from "./page";

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
});
