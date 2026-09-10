import { expect, test } from "@playwright/test";
import { components } from "../../app/docs/catalog";

const animations = components.filter((doc) => doc.group === "Animaciones");

test("animation examples render, replay, and stop loading", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const doc of animations) {
    await page.goto(`/docs/componentes/${doc.slug}`);
    const preview = page.getByTestId("live-preview");
    await expect(preview.locator(":scope > *").first()).toBeVisible();
    await expect(page.getByTestId("playground-error")).toHaveCount(0);
    if (doc.name !== "AnimatedLoader") {
      const replay = preview.getByRole("button", { name: "Repetir animación" });
      await replay.click();
      await expect(replay).toBeEnabled();
      await expect(page.getByTestId("playground-error")).toHaveCount(0);
    } else {
      await expect(preview.getByRole("status", { name: "Guardando" })).toBeVisible();
      await preview.getByRole("button", { name: "Finalizar carga" }).click();
      await expect(preview.getByRole("status", { name: "Guardando" })).toHaveCount(0);
      await expect(preview.getByRole("status")).toHaveText("Carga finalizada");
      await preview.getByRole("button", { name: "Iniciar carga" }).click();
      await expect(preview.getByRole("status", { name: "Guardando" })).toBeVisible();
    }
    await page.getByRole("button", { name: "Copiar ejemplo completo" }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain(doc.name);
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain('from "@kivora/nextjs"');
    for (const story of doc.stories) {
      await page.getByRole("button", { name: story.name, exact: true }).click();
      await expect(preview.locator(":scope > *").first()).toBeVisible();
      await expect(page.getByTestId("playground-error")).toHaveCount(0);
    }
  }
  expect(errors).toEqual([]);
});

test("reduced motion keeps animation content accessible on mobile", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 375, height: 812 });
  for (const doc of animations) {
    await page.goto(`/docs/componentes/${doc.slug}`);
    const preview = page.getByTestId("live-preview");
    await expect(preview.locator(":scope > *").first()).toBeVisible();
    await expect(page.getByTestId("playground-error")).toHaveCount(0);
    await expect.poll(() => preview.evaluate((element) =>
      element.getAnimations({ subtree: true }).filter((animation) => animation.playState === "running").length,
    )).toBe(0);
    if (doc.name === "AnimatedPath") await expect(preview.getByRole("img", { name: "Completado" })).toBeVisible();
    if (doc.name === "AnimatedLoader") await expect(preview.getByRole("status", { name: "Guardando" })).toBeVisible();
    if (doc.name === "AnimatedText") await expect(preview.getByRole("heading", { name: "Tu próxima idea, en movimiento." })).toBeVisible();
  }
});

test("animation guide and Markdown are available in both languages", async ({ request }) => {
  for (const locale of ["es", "en"]) {
    const headers = { "Accept-Language": locale };
    const guide = await request.get("/docs/animaciones", { headers });
    expect(guide.status()).toBe(200);
    expect(await guide.text()).toContain(locale === "es" ? "Movimiento reducido" : "Reduced motion");
    const markdown = await request.get("/docs-markdown/animaciones.md", { headers });
    expect(markdown.status()).toBe(200);
    expect(await markdown.text()).toContain("@kivora/nextjs@^0.3.0");
    for (const doc of animations) {
      const response = await request.get(`/docs-markdown/componentes/${doc.slug}.md`, { headers });
      expect(response.status()).toBe(200);
      const text = await response.text();
      expect(text).toContain(`API: ${doc.name}`);
      expect(text).toContain("duration");
    }
  }
});
