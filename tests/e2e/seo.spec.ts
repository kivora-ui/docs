import { expect, test } from "@playwright/test";
import { components, guides, componentHref } from "../../app/docs/catalog";
import { absoluteUrl } from "../../app/_lib/seo";

test("sitemap and robots expose the public canonical routes", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("User-Agent: *");
  expect(await robots.text()).toContain(`Sitemap: ${absoluteUrl("/sitemap.xml")}`);
  const sitemap = await request.get("/sitemap.xml");
  const xml = await sitemap.text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
  const paths = ["/", "/docs", "/docs/componentes", ...guides.map(g => `/docs/${g.slug}`), ...components.map(componentHref)];
  expect(urls.sort()).toEqual(paths.map(absoluteUrl).sort());
  expect(new Set(urls).size).toBe(urls.length);
});

test("metadata and structured data are present without JavaScript", async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, locale: "es-ES" });
  const page = await context.newPage();
  for (const path of ["/", "/docs", "/docs/instalacion", "/docs/componentes/button"]) {
    await page.goto(`http://127.0.0.1:3100${path}`);
    expect(new URL((await page.locator('link[rel="canonical"]').getAttribute("href"))!).href).toBe(absoluteUrl(path));
    expect(new URL((await page.locator('meta[property="og:url"]').getAttribute("content"))!).href).toBe(absoluteUrl(path));
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    await expect(page.locator("h1")).toHaveCount(1);
    const schema = await page.locator('script[type="application/ld+json"]').textContent();
    expect(JSON.parse(schema!)["@context"]).toBe("https://schema.org");
  }
  await expect(page.locator('link[rel="alternate"][type="text/markdown"]')).toHaveAttribute("href", /\/docs-markdown\/componentes\/button.md$/);
  await page.getByText("Ejemplo en texto y Markdown", { exact: true }).click();
  await expect(page.locator("details").filter({ hasText: "Ejemplo en texto y Markdown" })).toContainText("Crear proyecto");
  const image = await request.get("/opengraph-image");
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toContain("image/png");
  await context.close();
});

test("AI index links resolve to text with examples and API, and unknown files return 404", async ({ request }) => {
  const response = await request.get("/llms.txt");
  expect(response.status()).toBe(200);
  const index = await response.text();
  expect(index).toContain("# Kivora");
  const urls = [...index.matchAll(/\]\((https?:\/\/[^)]+\/docs-markdown\/[^)]+)\)/g)].map(match => match[1]);
  expect(urls).toHaveLength(guides.length + components.length);
  for (const url of urls) {
    const doc = await request.get(new URL(url).pathname);
    expect(doc.status(), url).toBe(200);
    expect(doc.headers()["content-type"]).toContain("text/markdown");
    expect(await doc.text()).toContain("Fuente: " + absoluteUrl(new URL(url).pathname.replace("/docs-markdown/", "/docs/").replace(/\.md$/, "")));
  }
  const full = await request.get("/llms-full.txt");
  expect(await full.text()).toContain("## API: Button");
  expect(await full.text()).toContain("npm install @kivora/nextjs");
  expect((await request.get("/docs-markdown/no-existe.md")).status()).toBe(404);
  expect((await request.get("/docs/no-existe")).status()).toBe(404);
});
