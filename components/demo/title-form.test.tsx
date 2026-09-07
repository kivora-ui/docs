import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TitleForm } from "./title-form";

describe("TitleForm", () => {
  it("submits a new title with the entered name and defaults", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TitleForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Título"), "Mi nueva serie");
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const [submitted] = onSubmit.mock.calls[0];
    expect(submitted.name).toBe("Mi nueva serie");
    expect(submitted.viewsLast30Days).toBe(0);
    expect(typeof submitted.id).toBe("string");
  });
});
