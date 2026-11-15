# Chana, the mascot

Code: `web/src/mascot/` (`<Chana mood size accent />`, `CHANA_MOODS`, and a `MascotGallery` page for review).

## Who Chana is

Chana is a chickpea. Chana (chickpeas) is India's cheap, everyday protein staple, the food that best sums up our "protein per ₹100" idea. Chana is a small, round, beige bean with the tip a chickpea has on top, big glossy eyes, a little blush, stubby arms and feet, and a sweatband in the brand accent colour.

Chana is your **gym buddy**, not a coach and not a doctor. Chana is friendly, confident and a bit cheeky, and reacts to your scans the way a friend at the gym would: hyped when something fits your goal, honest when it does not, and never preachy.

## Personality: do and don't

| Do | Don't |
| --- | --- |
| Be warm, short and on your side: "Fits your cut!", "Maybe not this one." | Lecture, nag or guilt-trip. Chana never shames a food or a person. |
| Use the verdict labels exactly: **Fits your goal**, **Fine in moderation**, **Works against your goal**, **Avoid for you**. | Call any product "dangerous", "toxic", "unhealthy" or "bad". |
| Keep red calm and kind: arms folded, a gentle "not for you" hand, a slow head shake. | Show Chana scared, sick, disgusted, crying, or use skulls, warning signs or alarm imagery. |
| Point to a better swap after an orange or red verdict. | Make medical or health claims ("prevents diabetes", "burns fat", "cures"…). |
| Celebrate effort: scanning, streaks, adding missing products. | Celebrate body weight or appearance, or compare users' bodies. |
| Carry the verdict with a text label and icon next to Chana. | Rely on Chana's mood alone to convey a verdict (colour-blind and screen-reader users need the label). |

Chana never wears a verdict colour (green, yellow, orange or red). Those are reserved for the verdict chips (`docs/brand.md`). The sweatband uses `--accent-1`, and the confetti and sparkles use the brand accents.

## Moods and when they play

Mood names are a public contract. The website, the app and the future Android animation all use these exact strings.

| Mood | Label | App moment (trigger) | Pose and motion |
| --- | --- | --- | --- |
| `idle` | Ready | Home screen, waiting for a scan | Gentle breathing squash and stretch, occasional blink |
| `scanning` | Scanning | Camera open, reading a barcode | Holds a tiny scanner, beam sweeps, eyes track, tongue-out focus |
| `thinking` | Checking | Product lookup and scoring in progress (loading) | Looks up, hand at cheek, three dots pulse in a bubble |
| `happy` | Fits your goal | **Green** verdict | Arms up, little hop, sparkles, big smile |
| `okay` | Fine in moderation | **Yellow** verdict | Neutral smile, small palms-up shrug |
| `caution` | Works against your goal | **Orange** verdict | Side-eye, one raised brow, small sweat drop |
| `avoid` | Avoid for you | **Red** verdict | One arm folded, calm "stop" palm, slow head shake. Firm but kind |
| `celebrate` | Celebrate | Streak kept, XP level-up, badge earned, green swap picked, product added | Double bicep flex, confetti in accent colours |
| `sleepy` | Sleepy | Offline, or the app has sat idle for a long time | Eyes closed, slow breathing, floating "z" |
| `lost` | Not found yet | Barcode not in the database (OCR fallback) | Holds a little camera, hopeful look, "?" bubble: invites you to add it |

A typical scan runs `idle → scanning → thinking → happy/okay/caution/avoid`, and then `celebrate` when the scan earns a streak day or a badge. A miss runs `scanning → thinking → lost`, and then `celebrate` once the label photo is saved.

## The gamification loop Chana fronts

1. **Scan → verdict + Chana reaction → +XP.** Every scan earns XP whatever the verdict (the hero shows "+10 XP"), so checking a red product is still rewarded. We reward looking, not "eating right".
2. **Daily scan streak.** One scan a day keeps the streak alive. Chana `celebrate`s when the streak grows and goes `sleepy` when you have been away, never sad or guilt-tripping. Missing a day just resets the count quietly.
3. **"Add a product" quest.** When a barcode is missing (Indian coverage is thin), Chana goes `lost` and asks for help: photograph the nutrition label, OCR reads it, you confirm the numbers, and the product is saved **for everyone**. That earns an XP bonus, and Chana `celebrate`s. Every miss becomes a saved product.
4. **Badges.** Badges are for streak milestones (for example 7 and 30 days), for products added, and for **picking a green swap** after an orange or red verdict. Badges reward behaviour the user chose, never body outcomes.

Exact XP amounts and badge thresholds are product decisions still to be made. Keep them in one config, not in Chana.

## Using the component

```tsx
import { Chana, CHANA_MOODS, type ChanaMood } from './mascot'

<Chana mood="happy" />                     // 160 px, sweatband = var(--accent-1)
<Chana mood="avoid" size={96} accent="#8B5CFF" />
```

- Pure SVG (200 × 200 viewBox) animated with Motion (`motion/react`). It needs no host CSS. It reads `--accent-1` and `--accent-2` if they are set, and otherwise falls back to the neon-pulse colours.
- The body has a darker brown outline, so it reads on dark (`#0B0B0B`) and light (`#F3EFE6`) backgrounds. Gadgets have a light rim, and bubbles have a dark rim.
- Accessible as `role="img"` with `aria-label="Chana, <mood>"`. Put the verdict text next to Chana, never only inside it.
- Mood changes spring the arms, lean, brows and eyes to the new pose, and cross-fade the expression and props. With `prefers-reduced-motion`, Chana shows each mood's static pose (props included) and runs no loops.
- It reads down to about 40 px (the nav). Below about 64 px the small props (dots, "z", "?") become decoration only.

## Porting to Android later

- The SVG is built from named parts: body, feet, sweatband and tails, eyes (with upper lids), brows, mouth variants, two-segment arms (shoulder, elbow, hand), held props (scanner, camera) and floating props (sparkles, sweat, dots, z, question bubble, confetti). Export the parts as separate layers into **Rive** (preferred: a state machine) or **Lottie**.
- Keep the **mood names identical** as the state machine's inputs (`idle`, `scanning`, `thinking`, `happy`, `okay`, `caution`, `avoid`, `celebrate`, `sleepy`, `lost`), so app code and analytics stay the same across web and Android.
- The pose table in `web/src/mascot/moods.ts` (shoulder, elbow and hand angles; eye offset and lid; brow lift and tilt; lean; loop keyframes and durations) is the animation spec. Recreate each mood as a Rive state with the same numbers, and use about 300 ms blended transitions between states.
- Honour the Android "Remove animations" setting the same way the web honours `prefers-reduced-motion`: static pose, no loops.
