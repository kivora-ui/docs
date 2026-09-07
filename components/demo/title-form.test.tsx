import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MAX_POSTER_BYTES } from "@/lib/demo/constants";
import { TitleForm } from "./title-form";

function imageFile(name: string, bytes: number): File {
  return new File([new Uint8Array(bytes)], name, { type: "image/png" });
}

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

  it("rejects a poster over the size limit without reading it", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TitleForm onSubmit={onSubmit} />);

    await user.upload(
      screen.getByLabelText("Póster (opcional)"),
      imageFile("enorme.png", MAX_POSTER_BYTES + 1)
    );

    expect(await screen.findByText(/no puede superar/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText("Título"), "Sin póster");
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    const [submitted] = onSubmit.mock.calls[0];
    expect(submitted.posterUrl).toBeUndefined();
  });

  it("accepts a poster within the size limit and clears a previous error", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TitleForm onSubmit={onSubmit} />);
    const input = screen.getByLabelText("Póster (opcional)");

    await user.upload(input, imageFile("enorme.png", MAX_POSTER_BYTES + 1));
    expect(await screen.findByText(/no puede superar/i)).toBeInTheDocument();

    await user.upload(input, imageFile("pequeno.png", 64));
    await waitFor(() => expect(screen.queryByText(/no puede superar/i)).not.toBeInTheDocument());

    await user.type(screen.getByLabelText("Título"), "Con póster");
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    const [submitted] = onSubmit.mock.calls[0];
    expect(submitted.posterUrl).toMatch(/^data:image\/png;base64,/);
  });
});
