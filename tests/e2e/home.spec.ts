import { expect, test } from "@playwright/test";

test("la home carga y el nav no da 404", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  const homeResponse = await page.goto("/");
  expect(homeResponse?.ok()).toBe(true);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  for (const path of ["/docs", "/componentes", "/demo"]) {
    const response = await page.goto(path);
    expect(response?.ok()).toBe(true);
  }

  expect(consoleErrors).toEqual([]);
});

test("una URL inexistente devuelve un 404 con el cromado de marketing", async ({ page }) => {
  const response = await page.goto("/no-existe-esta-pagina");
  expect(response?.status()).toBe(404);

  await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();
  await expect(page.getByRole("link", { name: "Back to home" })).toBeVisible();
});

test("el selector de tema aplica la clase dark al elemento html", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).not.toHaveClass(/dark/);

  await page.getByRole("radio", { name: "Dark" }).click();
  await expect(html).toHaveClass(/dark/);
});

test("el selector de idioma cambia el titular visible", async ({ page }) => {
  await page.goto("/");
  const englishHeading = await page.getByRole("heading", { level: 1 }).textContent();

  await page.getByRole("radio", { name: "ES" }).click();
  await expect(page.getByRole("heading", { level: 1 })).not.toHaveText(englishHeading ?? "");
});
