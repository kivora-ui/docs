import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SubscriberForm } from "./subscriber-form";

describe("SubscriberForm", () => {
  it("submits a new active subscriber with the entered name and email", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SubscriberForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Nombre"), "Ana Pérez");
    await user.type(screen.getByLabelText("Email"), "ana.perez@example.com");
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const [submitted] = onSubmit.mock.calls[0];
    expect(submitted.name).toBe("Ana Pérez");
    expect(submitted.email).toBe("ana.perez@example.com");
    expect(submitted.status).toBe("active");
  });
});
