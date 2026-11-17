// Exports reference stills to docs/reference/. Starts nothing itself:
//   npm run build && npx vite preview --port 4173   (then, in another shell)   npm run export:stills
import { createRequire } from 'node:module'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
let chromium
try { ({ chromium } = require('playwright')) } catch { ({ chromium } = require(path.join(process.env.NODE_PATH ?? '', 'playwright'))) }

const BASE = process.env.STILLS_BASE ?? 'http://localhost:4173'
const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../docs/reference')
const PALETTES = ['bubblegum', 'cobalt-punch', 'night-shift', 'ube-chai', 'ink-lilac']
const MOODS = ['idle', 'scanning', 'thinking', 'happy', 'okay', 'caution', 'avoid', 'celebrate', 'sleepy', 'lost']
const FORMATS = [
  ['chana', 'chana-ref.png', 2048, 2048],
  ['desktop', 'desktop-still.png', 1920, 1080],
  ['mobile', 'mobile-still.png', 1080, 1920],
  ['social', 'social-still.png', 1080, 1920],
]

const browser = await chromium.launch()
async function shoot(query, w, h, file, transparent = false) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto(`${BASE}/?view=stills&${query}`, { waitUntil: 'load' })
  await page.waitForSelector('#still')
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(400)
  await mkdir(path.dirname(file), { recursive: true })
  await page.screenshot({ path: file, omitBackground: transparent, clip: { x: 0, y: 0, width: w, height: h } })
  await ctx.close()
  console.log('wrote', path.relative(process.cwd(), file))
}

try {
  for (const palette of PALETTES) {
    for (const [format, name, w, h] of FORMATS) {
      await shoot(`palette=${palette}&format=${format}`, w, h, path.join(OUT, palette, name))
    }
  }
  for (const mood of MOODS) {
    await shoot(`palette=bubblegum&format=mood&mood=${mood}&bg=0`, 1024, 1024, path.join(OUT, 'moods', `chana-${mood}.png`), true)
  }
} finally {
  await browser.close()
}
