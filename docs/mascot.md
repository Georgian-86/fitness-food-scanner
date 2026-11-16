# Chana, the mascot

Code: `web/src/mascot/` (`<Chana mood size accent />`, `CHANA_MOODS`, and a `MascotGallery` page for review).

## Who Chana is

Chana is a chickpea. Chana (chickpeas) is India's cheap, everyday protein staple, the food that best sums up our "protein per ₹100" idea. Chana is a small, round, beige bean with the tip a chickpea has on top, solid ink eyes, a little blush, stubby arms and feet, and a sweatband in the brand accent colour.

Chana is your **gym buddy**, not a coach and not a doctor. Chana is friendly, confident and a bit cheeky, and reacts to your scans the way a friend at the gym would: hyped when something fits your goal, honest when it does not, and never preachy.

## Art direction (neobrutalist, brand v1)

- **Flat fills only.** No gradients, no blur, no glow. The body is flat beige `#E8C98F` with one flat darker shape `#D2AE6E` (a crescent along the lower right) for volume. The chickpea tip and its crease stay.
- **One outline width everywhere:** 5 units in the 200 × 200 viewBox (1 px at 40 px), in `--ink`. Arms get the same visible width (a 10-unit ink pass under a beige fill pass).
- **Hard offset shadow:** the body and feet silhouette, filled `--ink`, offset 8, 8. It moves with the body, like a sticker.
- **Face:** solid ink oval eyes with one square-ish white catchlight, bold straight brows, mouths as thick ink strokes or flat ink shapes with a pink tongue. Face features are fixed dark `#0A0A0A` on every palette, because they sit on the beige body. Half-lidded looks use a flat beige lid with an ink edge.
- **Sweatband, knot and tails:** flat `accent` (default `--c1`) with an ink outline.
- **Props:** all flat with ink outlines. Scanner and camera in `--c2` with `--c3` glass; beam in translucent `--c3`; sparkles are 4-point stars in `--c2`/`--c3`; confetti are rectangles in `--c2`/`--c3`; the "?" and "…" bubbles are `--surface` with ink outlines; "z" letters in `--c2` with an ink outline; the sweat drop is `--c3`.
- **Colour rule:** Chana never uses the verdict hues (`#22C55E`, `#FACC15`, `#FB923C`, `#F43F5E`), mint or lime, anywhere. Blush and tongue are light pinks.
- **Night-shift:** `--ink` is cream there, so the outline and shadow turn cream and Chana reads as a sticker on dark. The face stays dark.
- Recognisable at 40 px: the silhouette (round bean, tip, band tails, shadow) carries it; below about 64 px the small props are decoration only.

## Personality: do and don't

| Do | Don't |
| --- | --- |
| Be warm, short and on your side: "Fits your cut!", "Maybe not this one." | Lecture, nag or guilt-trip. Chana never shames a food or a person. |
| Use the verdict labels exactly: **Fits your goal**, **Fine in moderation**, **Works against your goal**, **Avoid for you**. | Call any product "dangerous", "toxic", "unhealthy" or "bad". |
| Keep red calm and kind: a raised "hold on" palm, a slow head shake, calm half-lidded eyes. | Show Chana scared, sick, disgusted, crying, or use skulls, warning signs or alarm imagery. |
| Point to a better swap after an orange or red verdict. | Make medical or health claims ("prevents diabetes", "burns fat", "cures"…). |
| Celebrate effort: scanning, streaks, adding missing products. | Celebrate body weight or appearance, or compare users' bodies. |
| Carry the verdict with a text label and icon next to Chana. | Rely on Chana's mood alone to convey a verdict (colour-blind and screen-reader users need the label). |

Chana never wears a verdict colour (green, yellow, orange or red). Those are reserved for the verdict chips (`docs/brand.md`). The sweatband uses `--c1`, and the confetti and sparkles use `--c2` and `--c3`.

## Moods and when they play

Mood names are a public contract. The website, the app and the future Android animation all use these exact strings.

| Mood | Label | App moment (trigger) | Pose and motion |
| --- | --- | --- | --- |
| `idle` | Ready | Home screen, waiting for a scan | Slow breathing squash and stretch, occasional blink, cheeky half-smile |
| `scanning` | Scanning | Camera open, reading a barcode | Holds a tiny scanner, beam sweeps, eyes and face follow the beam, tongue-out focus |
| `thinking` | Checking | Product lookup and scoring in progress (loading) | Looks up, hand at cheek, slow sway, three dots pulse in a bubble |
| `happy` | Fits your goal | **Green** verdict | Arms up, hop with anticipation squash, stretch, landing squash and rebound; sparkles, big smile |
| `okay` | Fine in moderation | **Yellow** verdict | Neutral smile, palms-up shrug that rises and falls with a small bob |
| `caution` | Works against your goal | **Orange** verdict | Side-eye, one raised brow, slow lean, small sweat drop |
| `avoid` | Avoid for you | **Red** verdict | Raised "hold on" palm that wags gently, slow head shake, calm half-lidded eyes. Firm but kind |
| `celebrate` | Celebrate | Streak kept, XP level-up, badge earned, green swap picked, product added | Double bicep flex pumping on two little bounces, confetti rectangles in `--c2`/`--c3` |
| `sleepy` | Sleepy | Offline, or the app has sat idle for a long time | Eyes closed, slow breathing, leaning, floating "z" |
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

<Chana mood="happy" />                       // 160 px, sweatband = var(--c1)
<Chana mood="avoid" size={96} accent="#6B5BFF" />
```

- Pure SVG (200 × 200 viewBox) animated with Motion (`motion/react`). It needs no host CSS. It reads the brand tokens `--ink`, `--surface`, `--c1`, `--c2` and `--c3` when they are set, and falls back to bubblegum otherwise.
- Accessible as `role="img"` with `aria-label="Chana, <mood>"`. Put the verdict text next to Chana, never only inside it.
- `?view=mascot` on the web app shows the `MascotGallery` review page.

## Animation rules

- **Channels, not keyframes on elements.** Every moving number (body lift, lean, squash, gaze, lids, brows, shoulders, elbows, hands, scanner beam) is one Motion value, driven by `useMoodMotion.ts`. React re-renders never restart an animation.
- **Blend, never jump.** On a mood change each channel springs from its current value to the new pose. A looping channel springs to its loop's first frame, and then all loops of that mood start together on the same frame, so the hop and its squash stay in phase. Switching mid-hop flows straight into the new pose (measured: no frame-to-frame jump beyond the hop's own speed; the old build jumped up to about 30 px at 240 px size).
- **One easing family.** Poses use one spring (stiffness 260, damping 22). Loops are 1.6–3 s sine-like ease-in-out keyframes. Follow-through uses one softer spring (stiffness 150, damping 12).
- **Squash and stretch** on the happy hop: anticipation squash, take-off stretch, hang, fall, landing squash, small rebound, rest. The pivot is at the feet.
- **Overlapping action:** the band tails and the arms are not keyframed for it; they lag behind the body's own velocity through the follow-through spring.
- **Cheap to run:** transform and opacity only, no filter or layout animation; the whole body is one transformed group; expressions and props cross-fade in 200 ms.
- **Reduced motion:** with `prefers-reduced-motion`, each mood is a static pose (props included), loops do not run and swaps are instant.

## Porting to Android later

- The SVG is built from named parts: shadow, feet, band tails, body (fill, shade crescent, band, crease, outline, knot), face (eyes with lids, brows, mouth variants), two-segment arms (shoulder, elbow, hand) and props (scanner with beam, camera, sparkles, sweat, dots bubble, z, question bubble, confetti). Export them as separate layers into **Rive** (preferred: a state machine) or **Lottie**.
- Keep the **mood names identical** as the state machine's inputs (`idle`, `scanning`, `thinking`, `happy`, `okay`, `caution`, `avoid`, `celebrate`, `sleepy`, `lost`), so app code and analytics stay the same across web and Android.
- The pose table in `web/src/mascot/moods.ts` (body, gaze, lid, brows, arms and beam per mood; fixed targets or loops with frames, times, eases and durations) is the animation spec. In Rive, blend from the current state into each new state rather than resetting to neutral, and drive tail and arm lag from the body's motion.
- Honour the Android "Remove animations" setting the same way the web honours `prefers-reduced-motion`: static pose, no loops.
