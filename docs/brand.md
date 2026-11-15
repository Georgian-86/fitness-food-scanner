# Brand identity v1: neobrutalist

Replaces v0 (the dark neon hero). The product name is still a placeholder; the wordmark is **chana.** after the mascot.

## What the brand stands for

| Value | What it means on the page |
| --- | --- |
| **Personal** | The same food gets a different verdict for a different goal. Never shame a food or a person. |
| **Honest** | Show the rules, name the data source, take no brand money. No invented numbers, reviews or logos. |
| **Desi and gym-first** | Rupees, Indian staples, Android, quick-commerce, a little Hinglish where it lands naturally. |
| **Playful but sharp** | Stickers, a mascot, XP and streaks, but the information is precise and fast. |
| **Never fear-based** | Red means "avoid for you". No "dangerous", no "toxic", no medical claims. |

Voice: a gym buddy who has read the label for you. Short sentences, numbers first, no lectures. Example: "18 g sugar per 100 g. Not for your cut."

## The hard colour rule

The four verdict colours are the product's core signal, and neobrutalism's usual primaries (yellow, red, green) are those same colours. Decorative colour therefore never uses the verdict hues, and mint and lime are out too (they read as green). Brand colour lives in pink, violet, cobalt, sky, chai and ink.

| Verdict | Hex | Label | Icon |
| --- | --- | --- | --- |
| Green | `#22C55E` | Fits your goal | check |
| Yellow | `#FACC15` | Fine in moderation | minus |
| Orange | `#FB923C` | Works against your goal | arrow down |
| Red | `#F43F5E` | Avoid for you | cross |

Verdict chips always carry the label and the icon, in fixed dark text `#0A0A0A`.

The owner's earlier reference (black, hot pink, chartreuse) is not offered: chartreuse sits between the green and yellow verdicts.

## Palettes (five directions to compare)

| Token | `bubblegum` | `cobalt-punch` | `night-shift` (dark) | `ube-chai` | `ink-lilac` |
| --- | --- | --- | --- | --- | --- |
| `--bg` | `#FFF4E6` cream | `#EEF0FF` ice | `#111111` | `#F3E9DC` chai | `#FAFAF7` paper |
| `--surface` | `#FFFFFF` | `#FFFFFF` | `#1C1C1C` | `#FFFBF5` | `#FFFFFF` |
| `--ink` (text, borders, shadows) | `#0A0A0A` | `#0A0A0A` | `#F7F3EA` | `#1B1030` | `#0A0A0A` |
| `--muted` | `#4A4540` | `#3F4360` | `#B9B4A8` | `#4E4060` | `#55534D` |
| `--c1` | `#FF4FD8` magenta | `#2F3BFF` cobalt | `#B79CFF` lavender | `#7B2FF7` ube | `#0A0A0A` ink block |
| `--on-c1` | `#0A0A0A` | `#FFFFFF` | `#111111` | `#FFFFFF` | `#FFFFFF` |
| `--c2` | `#6B5BFF` violet | `#FF7AC6` pink | `#FF4FD8` magenta | `#FFB3E6` candy | `#D9C8FF` lilac |
| `--on-c2` | `#FFFFFF` | `#0A0A0A` | `#111111` | `#1B1030` | `#0A0A0A` |
| `--c3` | `#9BE7FF` sky | `#C8B6FF` lilac | `#7FD8FF` sky | `#2A2AFF` cobalt | `#FF4FD8` magenta (sparingly) |
| `--on-c3` | `#0A0A0A` | `#0A0A0A` | `#111111` | `#FFFFFF` | `#0A0A0A` |

Default for the base branch: `bubblegum`. On `night-shift`, borders and hard shadows use `--ink` (cream) on dark, which keeps the neobrutalist look.

## Type

- **Archivo** (Google Fonts, variable: weight 400–900, width 62–125). Display: weight 900 at width 112–125 (expanded), tight tracking, often uppercase. Body: weight 400/500/600 at width 100.
- **JetBrains Mono** 500/700 for numbers, labels and nutrition-table rows (feels like a printed label).
- Display sizes use `clamp()`; body never below 16 px on mobile.

## System tokens

| Token | Value |
| --- | --- |
| `--bw` border width | 3px (2px under 640 px) |
| `--sh` hard shadow offset | 6px 6px (4px small, 10px for hero objects) |
| Shadow colour | `--ink`, no blur, ever |
| `--r` radius | 14px cards, 999px pills, 0 for tables |
| Motion easing | entrances `expo.out` 0.7s; hovers 150 ms `power2.out`; scroll scrubs linear (`none`) |
| Hover / press | button lifts: translate(-2px,-2px) with shadow growing; press: translate(shadow) with shadow 0 (done as a separate shadow layer, never by animating `box-shadow`) |

Decorative vocabulary: tilted sticker labels (±3°), nutrition-label tables, barcode stripes, star bursts, chunky arrows, grid paper texture (CSS, very faint). No gradients, no blur, no glassmorphism.

## Wordmark and mascot

- Wordmark: `chana.` lowercase, Archivo 900 expanded, the dot in `--c1`.
- Mark: Chana's head in a rounded square with a 3 px border and hard shadow.
- Chana is redrawn neobrutalist: flat fills, thick ink outline, hard offset shadow (see `docs/mascot.md`).

## Trust rules for all copy (no exceptions)

Allowed: the scoring rules published openly, Open Food Facts named as the data source, "no brand money in our ratings", "scanning is free forever", a founder note from Golu, "a pilot with one gym is starting".

Not allowed until real: user counts, star ratings, testimonials, press or partner logos, "#1", "dietitian-approved" (the dietitian review in `docs/scoring-rules.md` has not happened), claims about named competitors. Compare categories instead: "scanners that give everyone the same score", "trackers that don't judge the food".

## Demo product (checked against `docs/scoring-rules.md`)

Unbranded protein bar, 60 g, ₹60. Per 100 g: 400 kcal, 25 g protein, 18 g sugar, 4 g saturated fat, 0.6 g salt.

- Not red: only sugar is near "high" (18 < 22.5 g).
- Fat loss → orange: "18 g sugar per 100 g: high for your cut."
- Muscle gain → green: "15 g protein per bar: fits your bulk."
- 25 g protein per ₹100. No protein-washing flag (protein is 25% of calories).

Illustrative protein-washing example (label it "example"): a "high protein" cookie with 400 kcal and 12 g protein per 100 g. Protein is 12% of calories, under the 20% line, so the flag shows.
