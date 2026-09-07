import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { en } from "@/lib/i18n";

const setLocale = vi.fn();
vi.mock("@/app/providers", () => ({
  usePreferences: () => ({
    locale: "en",
    dictionary: en,
    setLocale,
    colorMode: "system",
    setColorMode: vi.fn(),
  }),
}));

import { LocaleToggle } from "./locale-toggle";

describe("LocaleToggle", () => {
  it("switches to Spanish when ES is selected", async () => {
    const user = userEvent.setup();
    render(<LocaleToggle />);

    await user.click(screen.getByRole("radio", { name: "ES" }));
    expect(setLocale).toHaveBeenCalledWith("es");
  });
});
