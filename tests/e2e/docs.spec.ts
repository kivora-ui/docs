import { expect, test } from "@playwright/test";
import { components, componentHref } from "../../app/docs/catalog";

test("every documented component and story renders without a playground error", async ({
  page,
}) => {
  test.setTimeout(240_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const doc of components) {
    await test.step(doc.name, async () => {
      const response = await page.goto(componentHref(doc));
      expect(response?.status()).toBe(200);
      await expect(
        page.getByRole("heading", { name: doc.name, exact: true, level: 1 }),
      ).toBeVisible();
      await expect(page.getByTestId("live-preview")).toBeVisible();
      await expect(
        page.getByTestId("live-preview").locator(":scope > *").first(),
      ).toBeAttached();
      await expect(page.getByTestId("playground-error")).toHaveCount(0);
      for (const story of doc.stories) {
        await page
          .getByRole("button", { name: story.name, exact: true })
          .click();
        await expect(
          page.getByTestId("live-preview").locator(":scope > *").first(),
        ).toBeAttached();
        await expect(page.getByTestId("playground-error")).toHaveCount(0);
      }
    });
  }
  expect(errors).toEqual([]);
});

test("editing, controls, error recovery, state and copying work", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/docs/componentes/button");
  const preview = page.getByTestId("live-preview");
  await expect(
    preview.getByRole("button", { name: "Crear proyecto" }),
  ).toBeVisible();
  await page
    .getByRole("combobox", { name: "variant", exact: true })
    .selectOption("outline");
  await expect(
    page.getByRole("textbox", { name: "Código editable de Button" }),
  ).toHaveValue(/variant="outline"/);
  await page.getByLabel("disabled", { exact: true }).check();
  await expect(preview.getByRole("button")).toBeDisabled();
  const editor = page.getByRole("textbox", {
    name: "Código editable de Button",
  });
  await editor.fill("<Button>Mi nueva idea</Button>");
  await expect(
    preview.getByRole("button", { name: "Mi nueva idea" }),
  ).toBeVisible();
  await editor.fill("<Button");
  await expect(page.getByTestId("playground-error")).toBeVisible();
  await page.getByRole("button", { name: "Restablecer ejemplo" }).click();
  await expect(
    preview.getByRole("button", { name: "Crear proyecto" }),
  ).toBeVisible();
  await expect(page.getByTestId("playground-error")).toHaveCount(0);
  await page.getByRole("button", { name: "Con estado", exact: true }).click();
  await preview.getByRole("button", { name: "Guardar cambios" }).click();
  await expect(
    preview.getByRole("button", { name: "Guardado ✓" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Copiar ejemplo completo" }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain('import { Button } from "@kivora/nextjs"');
  expect(copied).toContain("export default function Example()");
});

test("home navigation, search, guide links and theme persist through docs navigation", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Documentación", exact: true }).click();
  await expect(page).toHaveURL(/\/docs$/);
  await page.getByRole("button", { name: "Tema rosa" }).click();
  await page
    .getByRole("searchbox", { name: "Buscar en la documentación" })
    .fill("Dialog");
  await page.getByRole("link", { name: "Dialog", exact: true }).click();
  await expect(page.locator(".kivora-theme")).toHaveAttribute(
    "data-theme",
    "candy",
  );
  await page
    .getByTestId("live-preview")
    .getByRole("button", { name: "Abrir diálogo" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  const primary = await page
    .getByRole("dialog")
    .evaluate((el) =>
      getComputedStyle(el).getPropertyValue("--color-primary").trim(),
    );
  expect(primary).toBe("#a03872");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("link", { name: "Instalación", exact: true }).click();
  await page
    .getByRole("link", { name: "2. Añade los estilos", exact: true })
    .click();
  await expect(page).toHaveURL(/#estilos$/);
});

test("mobile navigation and pages fit the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/docs");
  await page.keyboard.press("Control+k");
  await expect(
    page.getByRole("searchbox", { name: "Buscar en la documentación" }),
  ).toBeFocused();
  await page
    .getByRole("searchbox", { name: "Buscar en la documentación" })
    .fill("Button");
  await page.getByRole("link", { name: "Button", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Abrir navegación" }),
  ).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByTestId("live-preview")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Tema oscuro" }).click();
  await expect(page.locator(".kivora-theme")).toHaveAttribute(
    "data-theme",
    "dark",
  );
});

test("code examples have syntax colors and line numbers in both themes", async ({
  page,
}) => {
  await page.goto("/docs/instalacion");
  const block = page.locator("#provider");
  await expect(
    block.locator(".react-syntax-highlighter-line-number").first(),
  ).toHaveText("1");
  const colors = await block
    .locator("code span[style]")
    .evaluateAll(
      (elements) =>
        new Set(elements.map((element) => getComputedStyle(element).color))
          .size,
    );
  expect(colors).toBeGreaterThan(3);
  await page.goto("/docs/componentes/button");
  const editor = page.getByRole("textbox", {
    name: "Código editable de Button",
  });
  await editor.fill('<Button variant="outline">\n  Guardar\n</Button>');
  await expect(
    page.getByTestId("live-preview").getByRole("button", { name: "Guardar" }),
  ).toBeVisible();
  const numbers = page.locator(
    'pre[aria-hidden="true"] > span > span[aria-hidden="true"]',
  );
  await expect(numbers).toHaveText(["1", "2", "3"]);
  const token = page.locator('pre[aria-hidden="true"] .token.tag').first();
  const lightColor = await token.evaluate(
    (element) => getComputedStyle(element).color,
  );
  await page.getByRole("button", { name: "Tema oscuro" }).click();
  await expect
    .poll(() => token.evaluate((element) => getComputedStyle(element).color))
    .not.toBe(lightColor);
  await expect(numbers).toHaveText(["1", "2", "3"]);
  await editor.focus();
  await page.keyboard.press("Tab");
  await expect(editor).not.toBeFocused();
});

test("installer command and platform-specific guides are discoverable", async ({ page, context, request }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await expect(page.locator("header")).not.toContainText("®");
  await page.getByRole("button", { name: "npx @kivora/init", exact: true }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe("npx @kivora/init");
  await page.goto("/docs");
  await expect(page.locator("header")).not.toContainText("®");
  await page.getByRole("link", { name: "Conoce el asistente de instalación" }).click();
  await expect(page).toHaveURL(/\/docs\/inicializador$/);
  await expect(page.locator("#inicio")).toContainText("npm install @kivora/init solo añade el paquete");
  await expect(page.locator("#requisitos")).toContainText("No ofrece una opción React/Vite");
  for (const [slug, heading] of [
    ["instalacion-react", "Instalación React web"],
    ["instalacion-react-native", "Instalación React Native"],
  ]) {
    await page.goto(`/docs/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    const markdown = await request.get(`/docs-markdown/${slug}.md`);
    expect(markdown.status()).toBe(200);
    expect(await markdown.text()).toContain(slug === "instalacion-react" ? 'from "react-dom/client"' : "npx @kivora/init --framework native");
  }
  await expect(page.locator("#compatibilidad")).toContainText("React Native >=0.85.3 <0.86");
  const index = await request.get("/llms.txt");
  expect(await index.text()).toContain("/docs-markdown/inicializador.md");
});
