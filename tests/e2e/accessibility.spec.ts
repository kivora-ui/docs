import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
async function audit(page: Page, state: string) {
  const results = await new AxeBuilder({ page }).withTags(tags).analyze();
  return results.violations.map(violation => ({
    state, id: violation.id,
    nodes: violation.nodes.map(node => ({ target: node.target, summary: node.failureSummary })),
  }));
}

test("documentation has no automated A/AA violations in the reviewed pages and themes", async ({ page }, testInfo) => {
  test.setTimeout(180_000);
  const violations = [];
  for (const route of ["/docs", "/docs/instalacion", "/docs/componentes/button", "/docs/componentes/input", "/docs/componentes/dialog"]) {
    await page.goto(route);
    for (const theme of ["claro", "oscuro", "rosa", "verde"]) {
      await page.getByRole("button", { name: `Tema ${theme}`, exact: true }).click();
      await page.waitForTimeout(450);
      violations.push(...await audit(page, `${route} ${theme}`));
    }
  }
  await testInfo.attach("axe-violations", { body: JSON.stringify(violations, null, 2), contentType: "application/json" });
  expect(violations).toEqual([]);
});

test("home scenes and invitation retain accessible semantics and dialog focus", async ({ page }) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const violations = [];
  for (let index = 0; index < 4; index++) {
    await page.getByRole("tab").nth(index).click();
    await page.waitForTimeout(750);
    violations.push(...await audit(page, `home ${index}`));
  }
  await page.getByRole("tab").first().click();
  const invite = page.getByRole("button", { name: "Invitar", exact: true });
  await invite.click();
  await page.waitForTimeout(750);
  violations.push(...await audit(page, "invitation"));
  for (let index = 0; index < 12; index++) {
    await page.keyboard.press("Tab");
    expect(await page.getByRole("dialog").evaluate(element => element.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(invite).toBeFocused();
  expect(violations).toEqual([]);
});

test("short viewport allows reaching every scene and code can scroll by keyboard", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 256 });
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeGreaterThan(256);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  for (let index = 0; index < 4; index++) {
    const tab = page.getByRole("tab").nth(index);
    await tab.click();
    await expect(tab).toBeInViewport();
    const panel = page.getByRole("tabpanel");
    await expect(panel).toHaveCount(1);
    await panel.scrollIntoViewIfNeeded();
    await expect(panel).toBeInViewport();
  }
  await page.goto("/docs/componentes/dialog");
  const code = page.locator("#importacion").getByRole("region", { name: /Código/ });
  await code.focus();
  await expect(code).toBeFocused();
  const before = await code.evaluate(element => element.scrollLeft);
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => code.evaluate(element => element.scrollLeft)).toBeGreaterThan(before);
});
