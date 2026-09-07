import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DemoDataProvider } from "@/components/demo/data-provider";
import { subscriberSeed } from "@/lib/demo/seed";
import SuscriptoresPage from "./page";

describe("Suscriptores", () => {
  it("lists the seeded subscribers and adds a new one through the form", async () => {
    const user = userEvent.setup();
    render(
      <DemoDataProvider>
        <SuscriptoresPage />
      </DemoDataProvider>
    );

    expect(screen.getByText(subscriberSeed[0].name)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Añadir suscriptor" }));
    await user.type(screen.getByLabelText("Nombre"), "Cliente de prueba");
    await user.type(screen.getByLabelText("Email"), "prueba@example.com");
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(screen.getByText("Cliente de prueba")).toBeInTheDocument();
  });
});
