import { expect, test } from "@playwright/test";
const storageKey = "kivora.workspace.team.v1";

test("team search, invitation, editing and deletion persist within the session", async ({
  page,
}) => {
  await page.goto("/");
  const search = page.getByRole("searchbox", { name: "Buscar en el equipo" });
  const list = page.getByRole("list", { name: "Miembros del equipo" });
  await search.fill("sofia");
  await expect(list.getByRole("listitem")).toHaveCount(1);
  await expect(list).toContainText("Sofía Martín");
  await search.fill("Frontend");
  await expect(list).toContainText("Lucas García");
  await search.fill("nadie@equipo.com");
  await expect(
    page.getByText("No hay personas que coincidan con tu búsqueda."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Invitar", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(
    dialog.getByRole("heading", { name: "Invitar al equipo" }),
  ).toBeVisible();
  await dialog.getByLabel("Nombre", { exact: true }).fill("Ana Torres");
  await dialog.getByLabel("Email", { exact: true }).fill("ana@equipo.com");
  await dialog.getByLabel("Rol", { exact: true }).fill("Product manager");
  await dialog.getByRole("button", { name: "Añadir al equipo" }).click();
  await expect(dialog).toHaveCount(0);
  await expect(list).toContainText("Ana Torres");
  await expect(
    page.getByText("5 personas, infinitas posibilidades."),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Página siguiente del equipo" })
    .click();
  await expect(list).toContainText("Leo Fernández");
  await page.reload();
  await expect(list).toContainText("Ana Torres");
  await page.getByRole("button", { name: "Editar a Ana Torres" }).click();
  await dialog.getByLabel("Nombre", { exact: true }).fill("Ana Gómez");
  await dialog.getByLabel("Rol", { exact: true }).fill("Design lead");
  await dialog.getByRole("button", { name: "Guardar cambios" }).click();
  await search.fill("Design lead");
  await expect(list).toContainText("Ana Gómez");
  await page.reload();
  await expect(list).toContainText("Ana Gómez");
  await page.getByRole("button", { name: "Eliminar a Ana Gómez" }).click();
  await dialog.getByRole("button", { name: "Cancelar", exact: true }).click();
  await expect(list).toContainText("Ana Gómez");
  await page.getByRole("button", { name: "Eliminar a Ana Gómez" }).click();
  await dialog
    .getByRole("button", { name: "Eliminar persona", exact: true })
    .click();
  await expect(list).not.toContainText("Ana Gómez");
  await page.reload();
  await expect(list).not.toContainText("Ana Gómez");
  const saved = await page.evaluate(
    (key) => JSON.parse(sessionStorage.getItem(key)!),
    storageKey,
  );
  expect(saved.members).toHaveLength(4);
  expect(
    saved.members.some(
      (member: { email: string }) => member.email === "ana@equipo.com",
    ),
  ).toBe(false);
});

test("duplicate emails are rejected, and an empty team remains empty after reload", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Invitar", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Nombre", { exact: true }).fill("Otra Sofía");
  await dialog.getByLabel("Email", { exact: true }).fill("SOFIA@equipo.com");
  await dialog.getByLabel("Rol", { exact: true }).fill("Developer");
  await dialog.getByRole("button", { name: "Añadir al equipo" }).click();
  await expect(dialog.getByRole("alert")).toHaveText(
    "Ya existe una persona con este email.",
  );
  await dialog.getByRole("button", { name: "Cancelar", exact: true }).click();
  for (const name of [
    "Sofía Martín",
    "Lucas García",
    "Emma Wilson",
    "Leo Fernández",
  ]) {
    await page.getByRole("button", { name: `Eliminar a ${name}` }).click();
    await dialog
      .getByRole("button", { name: "Eliminar persona", exact: true })
      .click();
  }
  await page.reload();
  await expect(
    page.getByText("Tu equipo está vacío. Invita a la primera persona."),
  ).toBeVisible();
});

test("mobile invitation and corrupt session recovery", async ({ page }) => {
  await page.addInitScript(
    (key) => sessionStorage.setItem(key, "{not-json"),
    storageKey,
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(
    page
      .getByRole("list", { name: "Miembros del equipo" })
      .getByRole("listitem"),
  ).toHaveCount(4);
  await page.getByRole("button", { name: "Invitar", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Añadir al equipo" }),
  ).toBeInViewport();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Invitar", exact: true }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Invitar", exact: true }).click();
  await dialog.getByLabel("Nombre", { exact: true }).fill("Ana Torres");
  await dialog.getByLabel("Email", { exact: true }).fill("ana@equipo.com");
  await dialog.getByLabel("Rol", { exact: true }).fill("Designer");
  await dialog.getByRole("button", { name: "Añadir al equipo" }).click();
  await expect(dialog).toHaveCount(0);
  await page.setViewportSize({ width: 375, height: 667 });
  const next = page.getByRole("button", {
    name: "Página siguiente del equipo",
  });
  await expect(next).toBeInViewport();
  await next.click();
  await expect(
    page.getByRole("list", { name: "Miembros del equipo" }),
  ).toContainText("Leo Fernández");
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <= innerWidth &&
        document.documentElement.scrollHeight <= innerHeight,
    ),
  ).toBe(true);
});
