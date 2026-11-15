# Brand and hero brief v0

Working decisions for the marketing hero. The product name is a placeholder until the owner picks one; the mascot is called **Chana**.

## What the brand stands for

- **Personal, not preachy:** the same food gets a different verdict for a different goal. We never shame a food or a person.
- **Honest numbers:** protein per ₹100, a protein-washing flag, one plain reason line.
- **Indian and gym-first:** desi staples, rupees, Android, quick-commerce.
- **Playful:** scanning should feel like a game (XP, streaks, a mascot who reacts), never like a lecture.
- **Never fear-based:** red means "avoid for you". No "dangerous", no medical claims.

## Verdict colours (fixed in every palette)

These are the product's core signal. Brand accents must never be mistaken for them, and every verdict chip carries a text label and an icon as well as the colour.

| Verdict | Hex | Label |
| --- | --- | --- |
| Green | `#22C55E` | Fits your goal |
| Yellow | `#FACC15` | Fine in moderation |
| Orange | `#FB923C` | Works against your goal |
| Red | `#F43F5E` | Avoid for you |

## Palettes (three directions to compare)

| Token | `neon-pulse` (owner's reference) | `ultraviolet` | `cobalt-chalk` (light) |
| --- | --- | --- | --- |
| `--bg` | `#0B0B0B` | `#0D0A1F` | `#F3EFE6` |
| `--surface` | `#161616` | `#17122E` | `#FFFFFF` |
| `--ink` | `#F5F5F0` | `#EEEAFE` | `#111111` |
| `--muted` | `#A3A39B` | `#A59FC9` | `#55524B` |
| `--accent-1` | `#FF2DAB` hot pink | `#8B5CFF` violet | `#2340FF` cobalt |
| `--on-accent-1` | `#0B0B0B` | `#0D0A1F` | `#FFFFFF` |
| `--accent-2` | `#D4FF3F` chartreuse | `#3DF5FF` cyan | `#B9C3FF` periwinkle |
| `--on-accent-2` | `#0B0B0B` | `#0D0A1F` | `#111111` |

`neon-pulse` caveat: chartreuse sits close to the green and yellow verdicts. Use it for headline type, blobs and buttons, never next to a verdict chip without the chip's label.

## Type

- Display: **Barlow Condensed** 800, uppercase, tight tracking (sporty, like gym signage).
- Body: **Barlow** 400/500/600.
- Picked with the UI/UX Pro Max skill (fitness, athletic, energetic).

## Hero copy

- Eyebrow: Made for Indian gym-goers
- Headline: **Same snack. Different verdict.**
- Sub: Scan a packaged food and see whether it fits *your* goal, cutting or bulking, in about a second.
- Primary button: Join the Android beta
- Secondary button: How the colours work
- Small print: Scanning is always free.

## Demo product (checked against `docs/scoring-rules.md`)

A generic protein bar with no brand: 60 g bar, ₹60.

| Per 100 g | Value |
| --- | --- |
| Energy | 400 kcal |
| Protein | 25 g |
| Sugar | 18 g |
| Saturated fat | 4 g |
| Salt | 0.6 g |

- **Red check:** only sugar is anywhere near "high" (18 < 22.5 g), so it is not red.
- **Fat loss → 🟠 orange.** Reason: "18 g sugar per 100 g: high for your cut."
- **Muscle gain → 🟢 green.** Reason: "15 g protein per bar: fits your bulk."
- **Protein per ₹100:** 25 g. No protein-washing flag (protein is 25% of calories).

## Hero motion graphic (one loop, about 8 seconds)

1. Two soft organic blobs in `--accent-1` and `--accent-2` drift slowly behind everything.
2. A phone frame holds the unbranded protein bar; a scan beam sweeps across its barcode.
3. A result card slides up. Goal: **Fat loss** → orange chip with its reason line.
4. The goal toggle flips to **Muscle gain** → the chip turns green, and the reason changes.
5. Chana reacts beside the phone: caution, then happy, and a "+10 XP" chip pops.

The Higgsfield video (prompts in `docs/hero-video-prompts.md`) shows the same scene, without the UI text, so it can replace the coded graphic later without a redesign.
