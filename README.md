# Fitness Food Scanner

Scan a packaged food's barcode and get a colour verdict against **your** saved fitness goal: the same product can be green for a bulk and orange for a cut.

## Status

Working MVP prototype: an installable PWA in [`app/`](app/) (Vite + React + TypeScript). It covers fat-loss and muscle-gain goals, camera and manual barcode entry, Open Food Facts lookup with built-in demo products as a fallback, and a manual label form that saves every miss. The scoring thresholds still need a dietitian review. See [docs/mvp-plan.md](docs/mvp-plan.md).

## Run the prototype

```bash
cd app
npm install
npm run dev     # local dev server (http://localhost:5173)
npm run test    # Vitest unit tests (scoring + data layer)
npm run build   # type-check and production build into app/dist
npm run e2e     # Playwright smoke test (builds, serves on :4173, blocks Open Food Facts)
```

No phone handy? Open **Scan → Try a demo product**, or type a demo barcode such as `8901000000019` (protein bar).

## Test on Android

1. Run `npm run build` and deploy `app/dist/` to any static host **over HTTPS**, e.g. GitHub Pages or Vercel. The app uses hash routing and relative paths, so any sub-path works.
2. Open the URL in Chrome on the phone, allow camera access, and scan a pack.
3. Chrome menu → **Add to Home screen** installs it as an app; the shell then works offline.

The camera only works on HTTPS (or `localhost`). Over plain HTTP the app says so and keeps manual barcode entry available.

## What's in the prototype

- **In:** onboarding (goal, diet, allergens; editable in Settings), camera scan (native `BarcodeDetector`, `@zxing/browser` fallback), manual barcode entry, lookup order *saved on phone → Open Food Facts → demo products → manual label form*, result card (colour, headline, reason, protein per 100 kcal / per serving / per ₹100 with an inline price and pack-size editor, protein-washing flag, missing-data list, source), history, installable PWA, `/games` placeholder.
- **Out (for now):** OCR of the label, "two better options", daily sugar/sodium budget share, other goals, accounts and sync, uploading to Open Food Facts, a native APK, the games themselves.

## Known limitations

- Thresholds are per 100 g; there are no drink-specific thresholds yet, so drinks are judged like solid food.
- The scoring rules still need a dietitian review before launch.
- OCR of the nutrition label comes later; for now the manual form is the label fallback.
- A Capacitor APK for the Play Store comes later; today it is a PWA.
- Open Food Facts coverage of Indian products is thin, so many scans will end at the manual form. Saved products live only on that phone (localStorage).
- The demo products are made up (brands and barcodes are not real).

## Core idea

- **Scan:** barcode → product lookup (Open Food Facts first), with OCR of the nutrition label as a fallback when the barcode isn't found.
- **Score:** hard limits (allergens, diet conflicts, trans fat, multiple "high" nutrients) decide red; then the user's goal decides green / yellow / orange.
- **Explain:** a one-line reason, protein per ₹100, a "protein-washing" flag, and two better options in the same category.

| Colour | Meaning |
| --- | --- |
| 🟢 Green | Fits your goal |
| 🟡 Yellow | Fine in moderation |
| 🟠 Orange | Works against your goal |
| 🔴 Red | Avoid: hits a limit you set |

## Docs

- [Competitor research and strategy](docs/research.md)
- [Scoring rules v1](docs/scoring-rules.md)
- Full research doc: https://claude.ai/artifact/MkrPxtDXtdKmz7SK7eiHLr

## MVP scope

1. Barcode scan with on-device decoding
2. Open Food Facts lookup plus an OCR label fallback that saves new products
3. Goal setup for **fat loss** and **muscle gain** only
4. Result card: colour, reason line, protein per ₹100
5. Pilot with one gym (about 50 members) for four weeks
