# Competitor research summary (Nov 2026)

Full version with sources: https://claude.ai/artifact/MkrPxtDXtdKmz7SK7eiHLr

## The gap

- **Quality scanners** (Yuka, Bobby Approved, EWG, TruthIn, FactsScan) judge a product the same way for everyone.
- **Trackers** (MyFitnessPal, Cal AI, HealthifyMe, FITTR) know your goal but don't judge the product.
- Update (Nov 2026): TruthIn now advertises personal health goals and red/yellow/green flags, so the gap is narrower. No app yet joins goal verdicts with *fitness-specific maths* (protein per 100 kcal, per ₹100, protein-washing). Yuka (90M users) is still not available in India. See `docs/strategy.md`.

## Key competitors

| App | Market | Scale | What it does | Weak spot |
| --- | --- | --- | --- | --- |
| Yuka | Global (not India) | 90M users (2026), 28M in the US | 0–100 score (60% nutrition, 30% additives, 10% organic), alternatives | One score for everyone |
| Bobby Approved | US | 4.9 stars, 138K App Store ratings | Creator's ingredient verdicts | One person's opinions |
| MyFitnessPal + Cal AI | Global | 20M-food database; MyFitnessPal acquired Cal AI (Mar 2026, $30–40M annual revenue) | Calorie and macro goals, photo logging | Barcode scan paywalled; no quality judgement |
| TruthIn | India | 1M+ Play downloads, 4.3★ | 1–5 rating, goal flags (Nov 2026), Buy on Amazon; Foodpharmer as ambassador | Paywall backlash; ambassador now sells his own whey; fitness-macro depth unverified |
| FactsScan | India | About 22.5K Android installs | 0–100 score, A–E grade, diet filters | Same grade for everyone |
| Healthify (HealthifyMe) | India/US | Claims 45M; merged with Berry Street (Aug 2026), GLP-1 focus | Tracker, AI coach, barcode scan | Doesn't judge products |
| FITTR | India | 3M+ community | Macros, coaches, gym community | No product scoring; possible partner |

## Our edge

1. A verdict tied to the user's goal, with a one-line reason
2. Fitness-first numbers: protein per 100 kcal, protein per ₹100, a protein-washing flag
3. An Indian data moat: an OCR fallback that adds each missing product (caveat: data derived from Open Food Facts is under the ODbL share-alike licence, so the proprietary parts are verification, prices and behaviour data)
4. Coverage beyond the aisle: quick-commerce links and screenshots, a WhatsApp bot (a channel, not a moat)
5. A verdict in under one second, offline
6. No brand money in ratings; gym and creator partnerships
7. Scanning is always free; charge for extras

## Data reality

Open Food Facts India had about 20,000 products in Feb 2026 and about 26,100 on 13 Nov 2026. Only 2% of India-listed products had a Nutri-Score in Nov 2024.

## Habit target

Aim for "80% of our active users scan before buying", not 80% of all shoppers. Track the share of shopping trips with a scan, scans per user per week, and the put-back rate.
