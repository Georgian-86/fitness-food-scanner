# Product strategy v1 (Nov 2026)

The evidence and sources behind this page are in [`reports/Food scanner strategy and expansion.md`](../reports/Food%20scanner%20strategy%20and%20expansion.md), with raw notes in `research_notes/`. This page holds the decisions.

## 1. The one-paragraph strategy

TruthIn now advertises goal-based red/yellow/green flags, so "the only goal-aware scanner" is no longer a claim we can make. We win by being **the food scanner built for gym-goers**. Every verdict is explained with fitness maths that generic scanners don't do: protein per 100 kcal, protein per ₹100 and a protein-washing flag. Scanning is free forever and no brand money ever touches a score. We win one metro through creators and trainers, and turn every scan miss into a verified Indian product record. That dataset, our trust and our coach-to-client clusters are what's left once barcode scanning is a commodity, so they are what we build.

## 2. Positioning (April Dunford format)

| Element | Our answer |
| --- | --- |
| Competitive alternatives | Reading the label yourself, asking a trainer, TruthIn or FactsScan, a calorie tracker, asking ChatGPT or Gemini |
| Unique attributes | A verdict tied to *your* fitness goal; fitness maths; offline in under a second; always the same answer; free scanning; no brand money |
| Value | "In 1 second I know if this fits my cut or bulk, and why, without doing maths in the aisle" |
| Best-fit customer | An 18–30-year-old metro gym-goer on a cut or bulk who buys protein bars, whey and snacks, often on quick commerce |
| Market category | Goal-based food scanner for gym-goers, a sub-segment of food scanners |

**Positioning statement:** For gym-goers in India who are cutting or bulking, [App] is the food scanner that tells you in one second whether a product fits *your* goal, and why. Unlike TruthIn or asking ChatGPT, every verdict is built on protein-per-calorie and protein-per-rupee maths, scanning is always free, and no brand pays to influence a score.

**Headline:** "Scan it. See if it fits *your* goal."
**Campaign hooks, not the brand:** "Is this 'high-protein' bar really high?", "Protein per ₹100 rankings"
**Never use:** "dangerous", "protein police", "personal food coach", or medical claims

## 3. Competitive set

| Tier | Who | What they mean for us |
| --- | --- | --- |
| Direct | TruthIn (1M+ downloads, goal flags, paywall, Buy on Amazon); FactsScan | Most dangerous. It could add fitness goals in weeks, so we have to win on fitness depth plus free plus independence |
| Indirect | Healthify (now merged with Berry Street, GLP-1 focus), MyFitnessPal + Cal AI, FITTR, Caddy | Trackers that don't judge products. FITTR is a partner candidate |
| Adjacent | Instamart, Zepto, Blinkit protein storefronts; Zomato Healthy Mode | They won't show "avoid" on what they sell, so we use their links as scan input and treat them as affiliate partners |
| Substitute | ChatGPT, Gemini in Google Lens, Meta AI in WhatsApp, iOS 27 label scan | Biggest long-term habit threat. Our counter is speed, offline use, the same answer every time, and a saved goal |

### Feature comparison (target at launch)

| Capability | Us | TruthIn | FactsScan | Healthify | ChatGPT/Lens |
| --- | --- | --- | --- | --- | --- |
| Goal-based verdict | Strong (fat loss / muscle gain) | Adequate (scope unverified) | Absent | Weak | Weak (no saved goal) |
| Fitness maths (protein/100 kcal, per ₹100, protein-washing) | Strong | Weak | Absent | Weak | Ad hoc |
| Free scanning and ingredients | Strong | Weak (paywall) | Adequate | Weak | Strong |
| Indian product coverage | Weak (to start) | Strong | Adequate | Adequate | Adequate |
| Speed, offline, same answer every time | Strong | Adequate | Adequate | Adequate | Weak |
| Independence (no brand money) | Strong (public pledge) | Weak (affiliate links, ambassador sells whey) | Unknown | Adequate | n/a |

Be honest about the "Indian product coverage" row. It is where we lose at launch, and it is why the data loop comes first.

### Nightmare scenarios and pre-planned responses

1. **TruthIn ships cut/bulk goals with protein maths.** We respond by staying free, publishing protein-per-₹100 leaderboards, and making the independence pledge plus open methodology the story.
2. **Google ships label verdicts at Android system level.** We go deeper into the things a generic assistant can't do: the saved pantry, the coach dashboard, verified supplement data, and quick-commerce price comparison.
3. **A brand sends a legal notice.** Every verdict already shows the published threshold and the label numbers, and is worded as goal fit. A brand correction channel exists from day 1. We never mock a named brand in marketing.

## 4. Our weak points, ranked, and what we do about each

| # | Weak point | Mitigation |
| --- | --- | --- |
| 1 | **Thin data.** Open Food Facts has about 26K Indian products, so OCR becomes the main path | A two-photo contribution flow where the user confirms OCR values. Seed whey, bars and creatine by hand in the pilot city |
| 2 | **Labels themselves are wrong.** About 70% of tested Indian protein supplements were mislabelled | Show values as "as declared by brand"; run an energy plausibility check (P×4 + C×4 + F×9 against kcal); link to third-party lab results |
| 3 | **Retention.** Fitness apps keep about 5% of users at day 30, and people scan only when they're buying | Hooks outside the scan: goal-scored grocery list, saved pantry, swaps, a weekly "your cart was 70% green" summary |
| 4 | **Legal.** Brand injunctions (the Mondelez v. Foodpharmer precedent), ASCI, DPDP | Goal-fit wording, visible evidence, correction channel, DPDP consent and deletion from v1, a lawyer review before launch |
| 5 | **Low willingness to pay** in India | Scanning stays free; extras cost under about ₹100/month (to be tested); only disclosed affiliate links, only on items that are green for the user |
| 6 | **Copyable logic and open-licensed data** (the ODbL share-alike licence) | The moat is verification status, price history, put-back data and coach clusters, not the rules |

## 5. Go-to-market: first 90 days after launch

1. **One metro** (pick the founder's city). Concentrated scans fill the database fastest where our users actually are.
2. Channels, in order:
   1. Micro-creators with 10K–200K followers making "scan my protein bar" Reels.
   2. Trainers at independent gyms, with a QR code at the front desk.
   3. A WhatsApp share card of the verdict.
   4. College gyms.
3. **No paid ads** until activation and day-30 retention are proven. Health and fitness installs cost a median of about ₹31.
4. Language: English plus Hinglish microcopy at launch, Hindi in the second wave.

## 6. Metrics

| Metric | Why | Pilot target (assumption, to be calibrated) |
| --- | --- | --- |
| **North star: shopping trips with a scan per active user per week** | Captures the habit we want | ≥ 1.5 |
| Miss → contribution rate | Health of the data moat. No benchmark exists, so it's ours to set | ≥ 30% |
| Put-back rate (scan red or orange, then don't buy) | Proves the verdict changes behaviour | Measure first |
| Day 30 retention | Beat the category's 5% | ≥ 10% |
| Share of verdicts disputed by users or brands | Trust and legal early warning | < 1% |

## 7. Expansion roadmap: grow along the data, not the camera

Each stage starts only when its trigger is met. That keeps a small team focused.

| Stage | Build | Trigger to start | Moat it adds |
| --- | --- | --- | --- |
| 0–1 (now) | Packaged-food scanner plus contribution loop; supplements (whey, creatine) early; scanning quick-commerce links and screenshots | — | Data network effect |
| 2 | Indian meal-photo logging; WhatsApp entry point; grocery list and pantry | Contribution rate ≥ 30% and the pilot city's top-500 fitness SKUs are covered | A corpus of user-corrected Indian dishes |
| 3 | Coach and gym dashboard: clients' goal fit, shared plans | 50+ trainers using the app organically | Switching costs, user clusters |
| 4 | Indian nutrition-data API (quick commerce, ONDC apps, insurer wellness apps); anonymised demand reports | 100K+ verified products; ODbL boundary cleared with a lawyer | Data and scale |
| 5 (optional) | Horizontal: personal care or cosmetics scanning on the same trusted score, the way Yuka expanded | A strong brand and a profitable core | Brand |

**Explicitly not doing:**
- **Restaurant dish scoring:** Zomato Healthy Mode already does it.
- **Browser or cart overlays:** fragile, and they invite terms-of-service fights.
- **Our own lab testing:** Trustified shows the legal and trust risk.
- **Paid "approved" badges.**
- **Anything medical or GLP-1:** that's Noom's path.

## 8. Open questions to settle next (in order)

1. Install TruthIn and test a muscle-gain profile by hand. Does it do protein maths or only diet and allergen flags?
2. Interview 15–20 gym-goers: how many packaged-food or supplement buying decisions do they make each week? Retention and pricing both depend on this.
3. Get a lawyer's view on goal-based ratings without a registered dietitian, and on which data we can keep proprietary under ODbL.
4. Run a one-city pilot and measure the miss → contribution rate.
5. Run a cheap Instagram A/B test of the headline against the "protein truth" hook.

## 9. What to watch each month

- TruthIn's Play listing and changelog
- Google Lens / Gemini and Meta AI feature launches
- FSSAI front-of-pack rules (not mandatory before July 2028)
- Instamart, Zepto and Blinkit protein storefronts
- Funding news for Indian label or supplement-testing startups
