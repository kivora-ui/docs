import { expect, test } from "@playwright/test";

for (const width of [1440, 375, 320]) {
  test(`showcase navigation and cases at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.getByRole("link", { name: "Showcase", exact: true }).filter({ visible: true }).click();
    await expect(page).toHaveURL(/\/showcase$/);
    await expect(page.locator("main > div > a")).toHaveCount(4);
    for (const name of ["Chat", "Gestor de incidencias", "Nave espacial", "CRM"]) {
      await page.getByRole("link").filter({ has: page.getByRole("heading", { name, exact: true }) }).click();
      await expect(page.getByRole("main", { name, exact: true })).toBeVisible();
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page.getByRole("navigation", { name: "Navegación principal" })).toHaveCount(0);
      await expect(page.getByRole("link", { name: "Volver a Showcase", exact: true })).toHaveCount(0);
      const bounds = await page.getByRole("main").boundingBox();
      expect(bounds?.x).toBe(0);
      expect(bounds?.y).toBe(0);
      expect(bounds?.width).toBe(width);
      expect(bounds!.height).toBeGreaterThanOrEqual(900);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.goBack();
    }
  });
}

test("agent chat simulates replies and preserves separate conversations", async ({ page }) => {
  await page.clock.install();
  await page.goto("/showcase/chat");
  await expect(page.getByRole("log").locator("article")).toHaveCount(6);
  await page.getByRole("textbox", { name: "Escribe un mensaje" }).fill("Propuesta revisada");
  await page.getByRole("button", { name: "Enviar mensaje", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Pensando…");
  await page.getByRole("button", { name: /Agente de marketing/ }).click();
  await expect(page.getByRole("log")).not.toContainText("Propuesta revisada");
  await expect(page.getByRole("log").locator("article")).toHaveCount(8);
  await page.clock.fastForward(4000);
  await page.getByRole("button", { name: /Agente de desarrollo/ }).click();
  await expect(page.getByRole("log")).toContainText("Propuesta revisada");
  await expect(page.getByRole("log").locator("article")).toHaveCount(8);
  await expect(page.getByRole("status")).toHaveCount(0);
  await page.getByRole("textbox", { name: "Escribe un mensaje" }).fill("Segunda propuesta");
  await page.getByRole("textbox", { name: "Escribe un mensaje" }).press("Enter");
  await page.getByRole("button", { name: "Detener respuesta" }).click();
  await page.clock.fastForward(4000);
  await expect(page.getByRole("log").locator("article")).toHaveCount(9);

});

for (const width of [1440, 375, 320]) {
  test(`agent chat keeps the composer in view at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 812 });
    await page.goto("/showcase/chat");
    const input = page.getByRole("textbox", { name: "Escribe un mensaje" });
    await expect(input).toBeInViewport();
    const before = await input.boundingBox();
    await page.getByRole("log").evaluate(node => node.parentElement!.scrollTop = 0);
    expect((await input.boundingBox())?.y).toBe(before?.y);
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(812);
    if (width < 760) await page.getByRole("button", { name: "Abrir agentes" }).click();
    await page.getByRole("button", { name: /Agente de marketing/ }).filter({ visible: true }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Agente de marketing" })).toBeVisible();
    await expect(input).toBeInViewport();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("issues can be created, moved, and filtered", async ({ page }) => {
  await page.goto("/showcase/incidencias");
  await page.getByRole("button", { name: "Nueva incidencia" }).click();
  await page.getByRole("textbox", { name: "Título de la incidencia" }).fill("Revisar formulario de acceso");
  await page.getByRole("button", { name: "Crear incidencia", exact: true }).click();
  await page.getByRole("button", { name: "Revisar formulario de acceso", exact: true }).click();
  await page.getByRole("combobox", { name: "Estado", exact: true }).press("ArrowDown");
  await page.getByRole("option", { name: "Resuelta", exact: true }).click();
  await page.getByRole("button", { name: "Guardar cambios", exact: true }).click();
  await expect(page.getByRole("status", { name: "Estado del tablero" })).toContainText("KIV-105: Resuelta");
  await page.getByRole("textbox", { name: "Buscar incidencias" }).fill("Revisar formulario de acceso");
  await expect(page.getByRole("heading", { level: 4 })).toHaveCount(1);
});

test("spacecraft simulates telemetry, cabin controls, and system checks", async ({ page }) => {
  await page.clock.install();
  await page.goto("/showcase/satelites");
  await expect(page).toHaveURL(/\/showcase\/nave$/);
  await expect(page.getByRole("img", { name: "Nave espacial de la misión Odyssey", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Pausar telemetría" }).click();
  const paused = await page.getByTestId("mission-time").textContent();
  await page.clock.fastForward(5000);
  await expect(page.getByTestId("mission-time")).toHaveText(paused!);
  await page.getByRole("button", { name: "Reanudar telemetría" }).click();
  await page.clock.fastForward(2500);
  await expect(page.getByTestId("mission-time")).not.toHaveText(paused!);
  await page.getByRole("button", { name: "Comprobar sistemas", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Comprobación de sistemas en curso");
  await page.clock.fastForward(2000);
  await expect(page.getByRole("status")).toContainText("3 alertas requieren atención");
  await page.getByRole("button", { name: "Cabina", exact: true }).click();
  await page.getByRole("switch", { name: "Micrófonos de cabina" }).click();
  await expect(page.getByRole("status")).toContainText("Grabación de cabina pausada");
  await page.getByRole("button", { name: "Energía", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Distribución de energía");
  await page.getByRole("button", { name: "Abrir registro de vuelo", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("Grabación de cabina pausada");
  await page.getByRole("dialog").getByRole("button", { name: "Cerrar", exact: true }).click();
  await page.getByRole("button", { name: "Ampliar nave", exact: true }).click();
  await expect(page.getByRole("dialog").getByRole("img")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("CRM manages customers, filters, and records activity", async ({ page }) => {
  await page.goto("/showcase/crm");
  await page.getByRole("button", { name: "Añadir cliente", exact: true }).click();
  const modal = page.getByRole("dialog", { name: "Añadir cliente", exact: true });
  await modal.getByRole("textbox", { name: "Empresa", exact: true }).fill("Acme Test");
  await modal.getByRole("textbox", { name: "Dominio", exact: true }).fill("acme.example");
  await modal.getByRole("button", { name: "Crear cliente", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Cliente creado · Acme Test");
  await page.getByRole("textbox", { name: "Buscar clientes" }).fill("Acme Test");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.getByRole("button", { name: "Editar Acme Test", exact: true }).click();
  await page.getByRole("dialog").getByRole("combobox", { name: "Estado", exact: true }).press("ArrowDown");
  await page.getByRole("option", { name: "Cliente", exact: true }).click();
  await page.getByRole("button", { name: "Guardar cambios", exact: true }).click();
  await page.getByRole("textbox", { name: "Buscar clientes" }).fill("Acme Test");
  await expect(page.locator("tbody tr")).toContainText("Cliente");
  await page.getByRole("button", { name: "Eliminar Acme Test", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Cancelar", exact: true }).click();
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.getByRole("button", { name: "Eliminar Acme Test", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Eliminar", exact: true }).click();
  await expect(page.getByRole("heading", { name: "No se encontraron clientes" })).toBeVisible();
  await page.getByRole("navigation", { name: "Navegación del CRM" }).getByRole("button", { name: /Actividad/ }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Actividad" })).toBeVisible();
  await expect(page.getByText("Cliente creado", { exact: true })).toBeVisible();
});

test("CRM paginates, filters, exports, and selects rows", async ({ page }) => {
  await page.goto("/showcase/tienda");
  await expect(page).toHaveURL(/\/showcase\/crm$/);
  await expect(page.locator("tbody tr")).toHaveCount(7);
  await page.getByRole("button", { name: "Siguiente", exact: true }).click();
  await expect(page.locator("tbody tr")).toHaveCount(5);
  await page.getByRole("combobox", { name: "Filtrar por estado" }).press("ArrowDown");
  await page.getByRole("option", { name: "Potencial", exact: true }).click();
  await expect(page.locator("tbody tr")).toHaveCount(2);
  await page.getByRole("checkbox", { name: "Seleccionar página" }).check();
  await expect(page.getByText("2 seleccionados", { exact: true })).toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exportar", exact: true }).click();
  expect((await download).suggestedFilename()).toBe("orbit-clientes.csv");
  await page.getByRole("button", { name: "Eliminar seleccionados", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Eliminar", exact: true }).click();
  await expect(page.locator("tbody tr")).toHaveCount(0);
});

test("removed cases and unknown cases return 404", async ({ request }) => {
  for (const slug of ["workspace", "analytics", "studio", "commerce", "no-existe"]) {
    expect((await request.get(`/showcase/${slug}`)).status()).toBe(404);
  }
});

for (const width of [1440, 375]) {
  test(`create a custom agent and open its chat at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.clock.install();
    await page.goto("/showcase/chat");
    await expect(page.getByText("Orbit studio", { exact: true })).toHaveCount(0);
    if (width < 760) await page.getByRole("button", { name: "Abrir agentes" }).click();
    await page.getByRole("button", { name: "Crear nuevo agente", exact: true }).click();
    const modal = page.getByRole("dialog", { name: "Crear nuevo agente", exact: true });
    await expect(modal).toBeVisible();
    const create = modal.getByRole("button", { name: "Crear agente", exact: true });
    const next = modal.getByRole("button", { name: "Siguiente", exact: true });
    await expect(next).toBeDisabled();
    await modal.getByRole("textbox", { name: "Nombre del agente" }).fill("Estratega de producto");
    await modal.getByRole("textbox", { name: "Descripción", exact: true }).fill("Desarrollo y campañas para el próximo lanzamiento.");
    await next.click();
    await expect(next).toBeDisabled();
    await modal.getByRole("checkbox", { name: "Desarrollo", exact: true }).check();
    await modal.getByRole("checkbox", { name: "Marketing", exact: true }).check();
    await next.click();
    await modal.getByRole("button", { name: "Anterior", exact: true }).click();
    await expect(modal.getByRole("checkbox", { name: "Marketing", exact: true })).toBeChecked();
    await modal.getByRole("tab", { name: "1 Información" }).click();
    await expect(modal.getByRole("textbox", { name: "Nombre del agente" })).toHaveValue("Estratega de producto");
    await modal.getByRole("tab", { name: "3 Apariencia" }).click();
    await modal.getByRole("radio", { name: "Destellos", exact: true }).check();
    await modal.getByRole("radio", { name: "Verde", exact: true }).check();
    await create.click();
    await expect(modal).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 1, name: "Estratega de producto" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Escribe un mensaje" })).toBeFocused();
    await expect(page.getByRole("log").locator("article")).toHaveCount(0);
    await page.getByRole("textbox", { name: "Escribe un mensaje" }).fill("Prepara una propuesta");
    await page.getByRole("button", { name: "Enviar mensaje" }).click();
    await expect(page.getByRole("status")).toContainText("Pensando…");
    await page.clock.fastForward(4000);
    await expect(page.getByRole("log").locator("article")).toHaveCount(2);
    if (width < 760) await page.getByRole("button", { name: "Abrir agentes" }).click();
    await page.getByRole("button", { name: /Agente de desarrollo/ }).click();
    await expect(page.getByRole("log").locator("article")).toHaveCount(6);
  });
}

test("canceling agent creation preserves the conversation", async ({ page }) => {
  await page.goto("/showcase/chat");
  await page.getByRole("button", { name: "Crear nuevo agente", exact: true }).click();
  const modal = page.getByRole("dialog", { name: "Crear nuevo agente", exact: true });
  await modal.getByRole("textbox", { name: "Nombre del agente" }).fill("Sin guardar");
  await modal.getByRole("button", { name: "Cancelar", exact: true }).click();
  await expect(modal).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1, name: "Agente de desarrollo" })).toBeVisible();
  await expect(page.getByRole("log").locator("article")).toHaveCount(6);
  await page.getByRole("button", { name: "Crear nuevo agente", exact: true }).click();
  await expect(modal.getByRole("textbox", { name: "Nombre del agente" })).toHaveValue("");
  await page.keyboard.press("Escape");
  await expect(modal).toHaveCount(0);
});

for (const [width, height] of [[1920, 1080], [1440, 768], [1024, 600], [375, 812], [320, 568], [812, 375]]) {
  test(`spacecraft fills the viewport without page scroll at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto("/showcase/nave");
    expect(await page.evaluate(() => ({ width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }))).toEqual({ width, height });
    await expect(page.getByRole("navigation", { name: "Subsistemas de la nave" })).toBeInViewport();
    await expect(page.getByRole("button", { name: "Abrir registro de vuelo" })).toBeInViewport();
    await page.getByRole("button", { name: "Pausar telemetría" }).click();
    await expect(page.getByRole("status")).toContainText("Telemetría pausada");
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    await expect(page.getByRole("navigation", { name: "Subsistemas de la nave" })).toBeInViewport();
  });
}

test("issues support pointer drag, keyboard drag, cancellation and team filters", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/showcase/incidencias");
  const handle = page.getByRole("button", { name: "Mover incidencia KIV-104", exact: true });
  const start = await handle.boundingBox();
  const target = await page.getByTestId("issue-102").boundingBox();
  await page.mouse.move(start!.x + 8, start!.y + 8);
  await page.mouse.down();
  await page.mouse.move(target!.x + target!.width / 2, target!.y + target!.height / 2, { steps: 15 });
  await page.mouse.up();
  await expect(page.getByTestId("lane-En curso").getByTestId("issue-104")).toBeVisible();
  const keyboard = page.getByRole("button", { name: "Mover incidencia KIV-103", exact: true });
  await keyboard.focus();
  await keyboard.press("Space");
  await expect(keyboard).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("[id^=DndLiveRegion]")).toContainText("over droppable area 103");
  await keyboard.press("ArrowRight");
  await keyboard.press("Escape");
  await expect(page.getByTestId("lane-Pendiente").getByTestId("issue-103")).toBeVisible();
  await keyboard.focus();
  await keyboard.press("Space");
  await expect(keyboard).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("[id^=DndLiveRegion]")).toContainText("over droppable area 103");
  await keyboard.press("ArrowRight");
  await expect(page.locator("[id^=DndLiveRegion]")).not.toContainText("over droppable area 103");
  await keyboard.press("Space");
  await expect(page.getByTestId("lane-En curso").getByTestId("issue-103")).toBeVisible();
  await page.getByRole("combobox", { name: "Responsable", exact: true }).press("ArrowDown");
  await page.getByRole("option", { name: "Daniel Ruiz", exact: true }).click();
  await expect(page.getByRole("heading", { level: 4 })).toHaveCount(3);
  await page.getByRole("combobox", { name: "Prioridad", exact: true }).press("ArrowDown");
  await page.getByRole("option", { name: "Alta", exact: true }).click();
  await expect(page.getByRole("heading", { level: 4 })).toHaveCount(2);
});

for (const width of [1440, 375, 320]) {
  test(`issues fill the viewport without document scrolling at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 812 });
    await page.goto("/showcase/incidencias");
    expect(await page.evaluate(() => ({ width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }))).toEqual({ width, height: 812 });
    await expect(page.getByRole("button", { name: "Nueva incidencia", exact: true })).toBeInViewport();
    await page.getByRole("button", { name: "Nueva incidencia", exact: true }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Cancelar", exact: true }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });
}

test("issues can be dropped into an empty filtered column and reordered", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/showcase/incidencias");
  await page.getByRole("textbox", { name: "Buscar incidencias" }).fill("104");
  const handle = await page.getByRole("button", { name: "Mover incidencia KIV-104", exact: true }).boundingBox();
  const lane = await page.getByTestId("lane-Resuelta").boundingBox();
  await page.mouse.move(handle!.x + 8, handle!.y + 8);
  await page.mouse.down();
  await page.mouse.move(lane!.x + 100, lane!.y + 100, { steps: 15 });
  await page.mouse.up();
  await expect(page.getByTestId("lane-Resuelta").getByTestId("issue-104")).toBeVisible();
  await page.getByRole("textbox", { name: "Buscar incidencias" }).fill("");
  const from = await page.getByRole("button", { name: "Mover incidencia KIV-95", exact: true }).boundingBox();
  const to = await page.getByTestId("issue-100").boundingBox();
  await page.mouse.move(from!.x + 8, from!.y + 8);
  await page.mouse.down();
  await page.mouse.move(to!.x + 100, to!.y + 50, { steps: 15 });
  await page.mouse.up();
  await expect(page.getByTestId("lane-Resuelta").locator("article").first()).toHaveAttribute("data-testid", "issue-95");
});

test("issues support touch dragging", async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, viewport: { width: 1024, height: 900 }, locale: "es-ES" });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/showcase/incidencias");
  const handle = await page.getByRole("button", { name: "Mover incidencia KIV-104", exact: true }).boundingBox();
  const card = await page.getByTestId("issue-102").boundingBox();
  const session = await context.newCDPSession(page);
  const start = { x: handle!.x + 8, y: handle!.y + 8 };
  const end = { x: card!.x + 80, y: card!.y + 70 };
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [start] });
  for (let step = 1; step <= 12; step++) await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: start.x + (end.x - start.x) * step / 12, y: start.y + (end.y - start.y) * step / 12 }] });
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(page.getByTestId("lane-En curso").getByTestId("issue-104")).toBeVisible();
  await context.close();
});

test("site theme persists between home, showcase, docs and reloads", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Activar tema oscuro", exact: true }).click();
  for (const path of ["/showcase", "/docs", "/"]) {
    await page.goto(path);
    await expect(page.locator(".kivora-theme").first()).toHaveAttribute("data-theme", "dark");
    await page.reload();
    await expect(page.locator(".kivora-theme").first()).toHaveAttribute("data-theme", "dark");
  }
  await page.goto("/docs");
  await page.getByRole("button", { name: "Tema claro", exact: true }).click();
  await page.goto("/showcase");
  await expect(page.locator(".kivora-theme").first()).toHaveAttribute("data-theme", "light");
});

test("issue modal is centered and its library Select works", async ({ page }) => {
  await page.goto("/showcase/incidencias");
  await page.getByRole("button", { name: "Nueva incidencia", exact: true }).click();
  const box = await page.getByRole("dialog").boundingBox();
  const viewport = page.viewportSize()!;
  expect(Math.abs(box!.x + box!.width / 2 - viewport.width / 2)).toBeLessThan(2);
  expect(Math.abs(box!.y + box!.height / 2 - viewport.height / 2)).toBeLessThan(2);
  await expect(page.locator("select")).toHaveCount(0);
  await page.getByRole("dialog").getByRole("combobox", { name: "Estado", exact: true }).press("ArrowDown");
  await page.getByRole("option", { name: "En revisión", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("En revisión");
});

test("spacecraft alerts remain active when acknowledged and reset explicitly", async ({ page }) => {
  await page.goto("/showcase/nave");
  await expect(page.getByRole("region", { name: "Estado de las alertas" })).toContainText("3 ALERTAS ACTIVAS");
  for (const severity of ["warning", "error", "alarm"]) await expect(page.getByRole("meter").filter({ has: page.locator("svg") }).and(page.locator(`[data-severity=${severity}]`))).toHaveCount(1);
  await page.getByRole("button", { name: "Reconocer alertas", exact: true }).click();
  await expect(page.getByRole("region", { name: "Estado de las alertas" })).toContainText("3 ALERTAS ACTIVAS");
  await page.getByRole("button", { name: "Restablecer simulación", exact: true }).click();
  await expect(page.getByRole("region", { name: "Estado de las alertas" })).toContainText("SISTEMAS NOMINALES");
  await expect(page.locator('[data-severity="alarm"]')).toHaveCount(0);
});

test("showcase displays four real application screenshots", async ({ page }) => {
  await page.goto("/showcase");
  for (const name of ["Chat", "Gestor de incidencias", "Nave espacial", "CRM"]) {
    const screenshot = page.getByRole("img", { name: `Captura de ${name}`, exact: true });
    await screenshot.scrollIntoViewIfNeeded();
    await expect(screenshot).toBeVisible();
    await expect.poll(() => screenshot.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  }
});
