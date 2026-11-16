// Renders public/icon.svg to PNG icons with the preinstalled Playwright Chromium.
// Usage: node scripts/make-icons.mjs
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const pub = fileURLToPath(new URL('../public/', import.meta.url));
const svg = readFileSync(pub + 'icon.svg', 'utf8');
const browser = await chromium.launch();
for (const [size, name, pad] of [[192, 'pwa-192.png', 0], [512, 'pwa-512.png', 0], [512, 'maskable-512.png', 0.1], [180, 'apple-touch-icon.png', 0]]) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  const inner = Math.round(size * (1 - pad * 2));
  await page.setContent(
    `<html><body style="margin:0;background:${pad ? '#0b6e4f' : 'transparent'};display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px">` +
      `<div style="width:${inner}px;height:${inner}px">${svg.replace('<svg ', `<svg width="${inner}" height="${inner}" `)}</div></body></html>`,
  );
  await page.screenshot({ path: pub + name, omitBackground: !pad });
  await page.close();
  console.log('wrote', name);
}
await browser.close();
