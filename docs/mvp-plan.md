# MVP prototype build plan

Written by the advisor before the build. The app lives in `app/` (Vite + React + TypeScript PWA).

## Key calls

- **One installable PWA** runs on Android Chrome and on the website. A Capacitor APK comes later.
- **OCR is out of this prototype.** The manual nutrition form is the label fallback, and it saves the product, so every miss still becomes a saved product.
- **The camera needs HTTPS.** Deploy to a static host (GitHub Pages, Vercel) to test on a phone. The app uses `HashRouter` and Vite `base: './'` so any host works.
- **The scoring rules had gaps.** Decisions D1–D14 resolve them; they are listed in `docs/scoring-rules.md` and need a dietitian check.

## 1. Scope

**In:**
- Onboarding: goal (fat loss / muscle gain), diet and allergens, all editable in Settings
- Camera scan (native `BarcodeDetector`, with a lazy-loaded `@zxing/browser` fallback) and manual barcode entry
- Lookup order: saved locally, then Open Food Facts, then bundled fixtures (on a network error or a miss), then the manual entry form, which saves the product locally
- Result card:
  - colour, headline and reason line
  - protein per 100 kcal, per serving and per ₹100 (price and pack size can be edited inline)
  - protein-washing flag
  - a "data missing" state
- History of scanned and saved products
- Installable PWA with an offline shell
- `/games` placeholder route for the future health and fitness mini-games

**Out:** OCR, "two better options", share of the daily sugar and sodium budget, other goals, accounts, backend and sync, uploading to Open Food Facts, a Capacitor APK, the games themselves, and drink-specific thresholds.

## 2. Layout

```
app/src/
  scoring/    pure TS, no imports outside this folder (types.ts is frozen)
  data/       off.ts (Open Food Facts mapper), lookup.ts, storage.ts, fixtures.ts
  scan/       Scanner.tsx, detector.ts
  pages/      Onboarding, Home, Result, ManualEntry, History, Settings, Games
  components/ VerdictCard, ...
app/e2e/smoke.spec.ts
```

## 3. Scoring

See `app/src/scoring/types.ts` and decisions D1–D14 in `docs/scoring-rules.md`. The public API:

- `scoreProduct(p, u): Verdict`
- `checkRed`
- `proteinPer100Kcal`
- `proteinPer100Inr`
- `isProteinWashing`
- `hasHydrogenatedOil`
- `saltG`

## 4. Tests

- **Vitest** unit tests for every decision. They include the anchor case: a product with 400 kcal, 33 g protein and 18 g sugar per 100 g and a 60 g serving is orange for fat loss and green for muscle gain.
- **Mapper test** for the Open Food Facts mapper in `off.test.ts`.
- **Playwright smoke test**, run with Open Food Facts blocked:
  1. Onboard with fat loss.
  2. Enter the fixture barcode: the verdict is orange.
  3. Switch the goal to muscle gain: the verdict is green.
  4. Enter an unknown barcode, fill the manual form and save: a verdict shows and the product is in History.
  5. The games placeholder loads.

## 5. Contract between the app and scoring

- The app imports only `scoreProduct` and the types from `src/scoring`.
- The app never re-implements a threshold, and it renders `headline`, `reason` and `notes` exactly as returned.
- Required test ids:
  - `verdict-card`, with `data-colour`
  - `verdict-reason`
  - `barcode-input`
  - `barcode-submit`
  - `manual-form`
  - `goal-fat_loss`
  - `goal-muscle_gain`

## 6. Definition of done

- `npm run test`, `npm run build` and `npm run e2e` all pass in `app/`.
- The app works with Open Food Facts blocked, using fixtures and manual entry.
- Settings and saved products persist across reloads.
- The scanner falls back to manual entry when the camera is missing or permission is refused.
- The app is installable, and the `/games` placeholder exists.
- No UI text says "dangerous" or makes a medical claim.
