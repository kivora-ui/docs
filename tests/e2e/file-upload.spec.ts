import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

test("advanced upload opens and manages local files without an upload server", async ({ page }) => {
  const transfers: string[] = [];
  page.on("request", request => {
    if (new URL(request.url()).pathname.startsWith("/api/uploads")) transfers.push(request.url());
  });
  await page.goto("/docs/componentes/file-upload");
  const trigger = page.getByTestId("live-preview").getByRole("button", { name: "Seleccionar archivos" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Añadir archivos", exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(".uppy-Dashboard")).toBeVisible();
  await expect(dialog.getByRole("alert")).toHaveCount(0);
  for (const source of ["MyDevice", "Webcam", "Audio", "ScreenCapture"]) {
    await expect(dialog.locator(`[data-uppy-acquirer-id="${source}"]`).first()).toBeVisible();
  }
  await dialog.locator('input[type="file"]').first().setInputFiles({
    name: "ejemplo.png", mimeType: "image/png", buffer: readFileSync("public/kivora-icon.png"),
  });
  await expect(dialog.getByRole("listitem")).toContainText("ejemplo.png");
  await expect(dialog.getByRole("status").filter({ hasText: "Preparado" })).toBeVisible();
  await dialog.getByRole("button", { name: "Vista de lista", exact: true }).click();
  await expect(dialog.getByRole("button", { name: "Vista de lista", exact: true })).toHaveAttribute("aria-pressed", "true");
  await dialog.getByRole("button", { name: "Editar imagen: ejemplo.png" }).click();
  await expect(dialog.locator(".uppy-ImageCropper")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(dialog.getByRole("listitem")).toContainText("ejemplo.png");
  await dialog.getByRole("button", { name: "Eliminar: ejemplo.png" }).click();
  await expect(dialog.getByRole("listitem")).toHaveCount(0);
  await expect(dialog.locator(".uppy-Dashboard")).toBeVisible();
  expect(transfers).toEqual([]);
});

for (const failure of [400, 413, 500, "offline"] as const) {
  test(`upload failure ${failure} stays readable and can be retried`, async ({ page }) => {
    test.setTimeout(90_000);
    let recover = false;
    const pageErrors: string[] = [];
    page.on("pageerror", error => pageErrors.push(error.message));
    await page.route("**/api/uploads**", async route => {
      if (!recover) {
        if (failure === "offline") return route.abort("failed");
        return route.fulfill({ status: failure, contentType: "text/html", body: "<!DOCTYPE html><html>PRIVATE_SERVER_TRACE response text internal upload error</html>" });
      }
      if (route.request().method() === "POST") return route.fulfill({ status: 201, headers: { "Tus-Resumable": "1.0.0", Location: "/api/uploads/test-file" } });
      return route.fulfill({ status: 204, headers: { "Tus-Resumable": "1.0.0", "Upload-Offset": "4" } });
    });
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/docs/componentes/file-upload");
    const trigger = page.getByTestId("live-preview").getByRole("button", { name: "Seleccionar archivos" });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Añadir archivos", exact: true });
    await dialog.locator('input[type="file"]').first().setInputFiles({ name: "prueba.txt", mimeType: "text/plain", buffer: Buffer.from("demo") });
    await dialog.getByRole("button", { name: "Subir", exact: true }).click();
    await expect(dialog.getByRole("alert").first()).toHaveText("No se pudo subir el archivo. Puedes reintentar o eliminarlo.", { timeout: 30_000 });
    await expect(dialog).not.toContainText(/PRIVATE_SERVER_TRACE|response text|tus:|DOCTYPE|unexpected response/);
    const size = await dialog.evaluate(element => ({ content: element.scrollWidth, visible: element.clientWidth }));
    expect(size.content).toBeLessThanOrEqual(size.visible + 1);
    await dialog.getByRole("button", { name: "Cerrar", exact: true }).click();
    await expect(trigger).toBeFocused();
    await trigger.click();
    await expect(dialog.getByRole("alert").first()).toBeVisible();
    recover = true;
    await dialog.getByRole("button", { name: "Reintentar: prueba.txt" }).click();
    await expect(dialog.getByRole("status").filter({ hasText: "Completado" })).toBeVisible();
    await expect(dialog.getByRole("alert")).toHaveCount(0);
    await dialog.getByRole("button", { name: "Eliminar: prueba.txt" }).click();
    await expect(dialog.getByRole("listitem")).toHaveCount(0);
    expect(pageErrors).toEqual([]);
  });
}
