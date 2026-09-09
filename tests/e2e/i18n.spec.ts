import { expect, test } from "@playwright/test";
import { getDocs } from "../../app/docs/localized";

test("server renders the preferred language and falls back to English without changing URLs", async ({
  browser,
}) => {
  for (const [locale, lang, headline] of [
    ["es-MX", "es", "Tu web y tu app."],
    ["en-GB", "en", "Your web and your app."],
    ["fr-FR", "en", "Your web and your app."],
  ]) {
    const context = await browser.newContext({
      locale,
      javaScriptEnabled: false,
    });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:3100/");
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await expect(page.locator("h1")).toContainText(headline);
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
      "content",
      lang === "es" ? "es_ES" : "en_US",
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      lang === "es"
        ? /Componentes para React/
        : /React and React Native components/,
    );
    expect(new URL(page.url()).pathname).toBe("/");
    await page.goto("http://127.0.0.1:3100/docs/instalacion-react-native");
    await expect(page.locator("h1")).toHaveText(
      lang === "es" ? "Instalación React Native" : "React Native installation",
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://kivora.pro/docs/instalacion-react-native",
    );
    await context.close();
  }
});

test("language selection survives navigation and reload, retaining the URL and theme", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page
    .getByRole("button", { name: "Cambiar a inglés", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("h1")).toContainText("Your web and your app.");
  await expect(page).toHaveURL("http://127.0.0.1:3100/");
  await page.getByRole("link", { name: "Documentation", exact: true }).click();
  await expect(page.locator("h1")).toHaveText("Build something uniquely yours.");
  await page.getByRole("button", { name: "pink theme", exact: true }).click();
  await page
    .getByRole("searchbox", { name: "Search documentation", exact: true })
    .fill("React Native installation");
  await page
    .getByRole("link", { name: "React Native installation", exact: true })
    .click();
  await expect(page.locator("h1")).toHaveText("React Native installation");
  const url = page.url();
  await page
    .getByRole("button", { name: "Switch to Spanish", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.locator("h1")).toHaveText("Instalación React Native");
  await expect(page.locator(".kivora-theme")).toHaveAttribute(
    "data-theme",
    "candy",
  );
  expect(page.url()).toBe(url);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  expect(errors).toEqual([]);
});

test("English team dialogs and editor remain functional on mobile", async ({
  page,
}) => {
  await page
    .context()
    .addCookies([
      { name: "kivora-locale", value: "en", domain: "127.0.0.1", path: "/" },
    ]);
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/");
  await expect(page.getByText("4 people, endless possibilities.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Invite", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading")).toHaveText("Invite to team");
  await dialog
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Taylor");
  await dialog
    .getByRole("textbox", { name: "Email", exact: true })
    .fill("taylor@example.com");
  await dialog
    .getByRole("textbox", { name: "Role", exact: true })
    .fill("Designer");
  await dialog
    .getByRole("button", { name: "Add to team", exact: true })
    .click();
  await page
    .getByRole("searchbox", { name: "Search the team", exact: true })
    .fill("Taylor");
  await expect(page.getByRole("list", { name: "Team members" })).toContainText(
    "Taylor",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.goto("/docs/componentes/button");
  const preview = page.getByTestId("live-preview");
  await expect(
    preview.getByRole("button", { name: "Create project", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Editable code for Button", exact: true })
    .fill("<Button>My idea</Button>");
  await expect(preview.getByRole("button", { name: "My idea" })).toBeVisible();
  await page
    .getByRole("button", { name: "Reset example", exact: true })
    .click();
  await expect(
    preview.getByRole("button", { name: "Create project", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("Markdown and AI endpoints negotiate language without leaking cached translations", async ({
  request,
}) => {
  for (const [language, expected] of [
    ["es-ES", "es"],
    ["en-US", "en"],
    ["de-DE", "en"],
    ["", "en"],
  ]) {
    const response = await request.get("/docs-markdown/instalacion-react.md", {
      headers: { "Accept-Language": language },
    });
    expect(response.headers()["content-language"]).toBe(expected);
    expect(response.headers()["vary"]).toContain("Accept-Language");
    expect(await response.text()).toContain(
      expected === "es"
        ? "# Instalación React web"
        : "# React web installation",
    );
    const index = await request.get("/llms.txt", {
      headers: { "Accept-Language": language },
    });
    expect(await index.text()).toContain(
      expected === "es" ? "## Guías" : "## Guides",
    );
  }
});

test("every English component example renders without runtime errors", async ({
  page,
}) => {
  test.setTimeout(240_000);
  await page
    .context()
    .addCookies([
      { name: "kivora-locale", value: "en", domain: "127.0.0.1", path: "/" },
    ]);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const doc of getDocs("en").components) {
    await test.step(doc.name, async () => {
      await page.goto(`/docs/componentes/${doc.slug}`);
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
