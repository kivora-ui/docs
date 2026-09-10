import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, locale: 'es-ES', reducedMotion: 'reduce' });
  await page.clock.setFixedTime(new Date('2026-09-10T10:00:00Z'));
  await mkdir('public/showcase/screenshots', { recursive: true });
  for (const slug of ['chat', 'incidencias', 'nave', 'crm']) {
    await page.goto(`${process.env.SHOWCASE_BASE_URL || 'http://localhost:3101'}/showcase/${slug}`);
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(img => img.decode())); });
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await page.screenshot({ path: `public/showcase/screenshots/${slug}.png`, animations: 'disabled' });
  }
} finally { await browser.close(); }
