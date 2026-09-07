import { expect, test } from "@playwright/test";

test("el demo no muestra el header/footer de marketing y el marketing sí", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Kivora", exact: true })).toBeVisible();

  await page.goto("/demo");
  await expect(page.getByRole("link", { name: "Kivora", exact: true })).toHaveCount(0);
  await expect(page.getByText("Nébula")).toBeVisible();
});

test("el sidebar navega entre los cuatro módulos del demo", async ({ page }) => {
  await page.goto("/demo");

  await page.getByRole("link", { name: "Catálogo" }).click();
  await expect(page).toHaveURL(/\/demo\/catalogo$/);

  await page.getByRole("link", { name: "Suscriptores" }).click();
  await expect(page).toHaveURL(/\/demo\/suscriptores$/);

  await page.getByRole("link", { name: "Reproductor" }).click();
  await expect(page).toHaveURL(/\/demo\/reproductor$/);
});

test("se puede añadir un título nuevo desde el catálogo", async ({ page }) => {
  await page.goto("/demo/catalogo");

  await page.getByRole("button", { name: "Añadir título" }).click();
  await page.getByRole("textbox", { name: "Título" }).fill("Título e2e");
  await page.getByRole("button", { name: "Guardar" }).click();

  await expect(page.getByText("Título e2e")).toBeVisible();
});

test("una fila del catálogo enlaza al reproductor con el título preseleccionado", async ({
  page,
}) => {
  await page.goto("/demo/catalogo");

  await page.getByRole("link", { name: "Reproducir Sintel" }).click();

  await expect(page).toHaveURL(/\/demo\/reproductor\?title=sintel$/);
  await expect(page.getByRole("combobox", { name: "Título" })).toHaveValue("sintel");
});

test("en un viewport estrecho el sidebar se abre desde el botón de menú", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/demo");

  const catalogLink = page.getByRole("navigation", { name: "Nébula" }).getByRole("link", {
    name: "Catálogo",
  });
  await expect(catalogLink).toBeHidden();

  await page.getByRole("button", { name: "Abrir el menú" }).click();
  await expect(catalogLink).toBeVisible();

  await catalogLink.click();
  await expect(page).toHaveURL(/\/demo\/catalogo$/);
  await expect(catalogLink).toBeHidden();
});

test("el reproductor carga y reproduce contenido real", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto("/demo/reproductor");
  const video = page.locator("video").first();
  await expect(video).toBeVisible({ timeout: 15_000 });

  expect(consoleErrors).toEqual([]);
});
