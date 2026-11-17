# Hero motion video prompts (Google Gemini)

> **Want the finished prompts?** Copy them from `docs/gemini-paste-prompts.md`. This file explains why they are written that way, plus export steps.

Prompts and a full pipeline for the landing page's looping, silent hero clip, in the v1 neobrutalist brand (`docs/brand.md`, `docs/mascot.md`). Default palette: `bubblegum`. Checked against Google's own pages on 17 Nov 2026 (sources at the end).

## Two things that changed since this was asked for

1. **The current model is Gemini Omni Flash 1.2, not Veo.** The Gemini app, Google Flow and the API (`gemini-omni-1.2-flash`) all generate video with it. The Veo 3.1 Preview API was shut down on 22 Oct 2026. In Flow, Veo 3.1 Fast and Quality retire on 5 Dec 2026; only **Veo 3.1 Lite** stays, and it is a usable low-cost fallback here.
2. **In India a visible watermark is added automatically.** Google's help pages say so directly:
   - Gemini app: the "Media Watermark" switch only exists for AI Ultra subscribers in India; everyone else gets visible watermarks on all images and videos.
   - Flow: a visible watermark is applied automatically for users in India who are not on the Ultra 20x plan.
   - Gemini API: the docs mention only the invisible SynthID mark. Whether API output carries a visible mark is **not verified**; check the first clip.

   Do not crop, blur or paint out a visible watermark. Options are listed under "Watermarks" in section 5.

## What Gemini can and cannot do (verified)

| Question | Answer |
| --- | --- |
| Video model | Gemini Omni Flash 1.2 (`gemini-omni-1.2-flash`). Flow fallback: Veo 3.1 Lite |
| Image model | Nano Banana 2.1 (`gemini-nano-banana-2.1`) is the one Google recommends. Flow also offers Nano Banana Pro and 2 Lite (its free default) |
| Video aspect ratios | **16:9 and 9:16 only.** No 1:1, 4:5 or 21:9. Images can be any of 1:1, 4:5, 9:16, 16:9, 21:9 and more |
| Clip length | Omni: 3 to 10 s (11 to 15 s needs a paid plan). With a start **and** end frame the API caps at 10 s. Veo 3.1 Lite: 4, 6 or 8 s |
| Resolution | 360p or 720p native. 1080p and 4K are upscales (Flow: paid plans; API: `resolution`) |
| Frame rate | Not documented. 24 fps appears only inside an example. Measure the file (section 5) |
| Audio | Always generated. There is **no switch to turn it off**. Ask for silence in the prompt, then strip the track with ffmpeg |
| Start frame, end frame | Yes. Flow web: Video → Frames → "Add start frame" / "Add end frame". API: two images in `input`. Using the **same** image for both is not documented; it is the plan here, so check the result |
| Reference images ("ingredients") | Yes, up to 6 in the API. Flow has a separate Ingredients mode. Combining Ingredients with Frames in one generation is not documented |
| Extend | Yes, 3 to 10 s per step, up to 30 s total, paid plans only in Flow. Not needed for this clip |
| Negative prompt | **No such field.** Google's guidance: write negatives as plain sentences ("No dialogue") |
| Timing | Timecodes like `[0-2s]` in the prompt are documented and used below |
| SynthID | Invisible, on every image and video, on every surface |

### Limits and cost

| Surface | What you get |
| --- | --- |
| **Flow, no plan** | 50 credits a day. Omni 1.2: 1 credit per second at 360p, 3 per second at 720p. So an 8 s draft costs 8 credits and an 8 s 720p final costs 24: about two finals, or six drafts, a day. Veo 3.1 Lite: 10 credits for a 4, 6 or 8 s 720p clip. No extend, no upscale |
| **Flow, paid** | Same 50 a day plus monthly credits: Plus 200, Pro 1,000, Ultra 10,000 or 25,000. Upscale to 1080p costs 0 credits for clips up to 10 s |
| **Gemini app** | Video needs a paid Google AI plan. No per-day video count is published: limits are compute-based, refresh every 5 hours and have a weekly cap. 3 to 10 s (15 s on Ultra) |
| **Gemini API** | Paid tier only, no free tier. About $0.07 per second at 720p (8 s ≈ $0.56), $0.023 at 360p, $0.104 at 1080p upscaled. Nano Banana 2.1 images: about $0.034 (1K) or $0.05 (2K) each |

Not verified: Flow credit cost of image generation; the Gemini app's video resolution and download format; whether the AI Studio playground exposes Omni video. Two Google pages disagree with the rest: a search excerpt of the subscriptions page (gemini.google/subscriptions, not read in full) still mentions "video generation with Veo 3.1", and the Gemini app's feature table says "Nano Banana 2" where Flow and the API say 2.1.

## 1. Read me first: five rules

1. **One idea.** Scan the bar, the panel flips orange then green, Chana reacts. Nothing else happens. No second character, no scene change, no camera move.
2. **Say "flat" in words the model cannot misread.** Flat 2D vector, cut-paper stickers, solid fills, thick outline, hard shadow with zero blur. Name what to stay away from as well: no 3D, no clay, no gloss, no gradients, no photorealism.
3. **Match the page background.** The clip's background is the palette's `--bg`, flat and empty, so the video's edges vanish into the page. The faint grid paper comes from CSS on top, never baked into the website clip (a baked grid will not line up with the page's).
4. **Loop by design.** The same still is the start frame and the end frame, and the action is a round trip that returns to it. That still is also the poster and the reduced-motion fallback.
5. **Silent and wordless.** Ask for silence, then strip the audio track anyway. No letters, numbers, logos or labels in frame: every word is HTML on top.

The hard colour rule applies inside the video too: orange `#FB923C` and green `#22C55E` appear **only** on the phone's panel. Stickers, sparkles and the beam use `--c1`, `--c2`, `--c3`. AI models like to make star bursts yellow and scan beams red; the prompts forbid both.

## 2. Workflow

### The rest frame (decide this before anything else)

Everything that moves must already be visible in the start still, or the model will invent it. So the rest frame shows the whole cast: the phone card with a **blank white panel**, the bar parked beside it, Chana standing in the `idle` pose, three small stickers. In the clip the bar slides to the viewfinder and back, Chana's "pop up" is a squash and hop on the spot, and the stickers bounce where they sit. The panel is blank at rest so the poster never shows a verdict colour without its label.

### (a) Make the stills

**Best option: do not generate them.** The page already draws Chana, the bar and the phone as flat SVG. Screenshot `?view=mascot` for the Chana reference, and ask the main session to build a rest-frame page to screenshot at 1920×1080 and 1080×1920. Those stills have exact brand colours and no watermark.

**Otherwise generate them** with Nano Banana 2.1 (Flow, the Gemini app, or the API) using the prompts in section 3. Generate each still at the video's ratio (16:9 or 9:16), 2K if offered. In India, stills made in the Gemini app or Flow carry the visible watermark unless you are on Ultra, and a watermarked start frame bakes the mark into the video.

Order: Chana reference first (1:1), then each style frame with the Chana reference attached and the line "Draw Chana exactly as in the attached reference image."

Check every still before going on: no stray letters or digits, no gradients, no soft shadows, no yellow, red, orange or green, background flat and empty where the text will sit.

### (b) Image to video

**Route 1, Flow on the web (flow.google.com). Use this first:** it is the only surface with explicit start and end frame slots, and it has free daily credits.

1. New project. In the prompt box click the model name → **Video** → **Frames**.
2. Drag the style frame to "Add start frame" and the **same file** to "Add end frame".
3. Settings: model **Omni Flash 1.2**, aspect ratio 16:9 or 9:16, length **8 s**, outputs 1, resolution 360p for drafts.
4. Paste the video prompt followed by the keep-out lines (section 3). Generate.
5. When a draft's motion is right, run the same thing at 720p.
   - If the clip comes out almost static (identical start and end frames can do that), remove the end frame, keep the start frame, and fix the loop with the crossfade in section 5.
6. If Omni keeps drifting off-style, switch the model to **Veo 3.1 Lite**, 8 s, same frames. It costs fewer credits than an Omni 720p clip.

**Route 2, the API (paid).** Same prompts. Two images then the text in `input`; the docs give this shape for start and end frames, and the `response_format` fields are documented separately. Assembled from those samples, not run here:

```python
import base64
from google import genai

client = genai.Client()
still = base64.b64encode(open("bubblegum-desktop-still.png", "rb").read()).decode()
prompt = open("video-prompt-desktop.txt").read()  # video prompt + keep-out lines

interaction = client.interactions.create(
    model="gemini-omni-1.2-flash",
    input=[
        {"type": "image", "data": still, "mime_type": "image/png"},  # first frame
        {"type": "image", "data": still, "mime_type": "image/png"},  # last frame
        {"type": "text", "text": prompt},
    ],
    response_format={"type": "video", "aspect_ratio": "16:9", "resolution": "720p", "duration": "8s"},
)
open("raw-desktop.mp4", "wb").write(base64.b64decode(interaction.output_video.data))
```

Do not put tags like `<FIRST_FRAME>` in the prompt; Google has deprecated them.

**Route 3, the Gemini app (paid plan).** Upload the still and paste the prompt. The app speaks only of "references" (up to 5 images), has no documented end-frame slot, and takes the aspect ratio from the uploaded image. Expect to need the crossfade in section 5.

### (c) Review checklist

Watch each clip three times on loop, then check:

- [ ] Looks like flat stickers the whole way through: no shading, gloss, depth, blur or soft shadow appears mid-clip.
- [ ] Outline thickness and the hard shadow offset stay constant.
- [ ] No letters, digits, logos or pseudo-text appear, including on the bar label and the phone.
- [ ] Orange and green appear only on the panel. No yellow, red, lime or mint anywhere.
- [ ] Chana stays on model: beige body, tip, sweatband in the accent colour, dark oval eyes. The first reaction reads as a side-eye, never scared, sad or sick.
- [ ] The calm area (left 45% on desktop, bottom 40% on mobile) is empty in every frame.
- [ ] The camera never moves.
- [ ] Last frame matches the first (section 5 has a command that measures it).
- [ ] Background colour is within a few points of `--bg` (section 5 has a command that reads it).
- [ ] Nothing in frame signals alarm: no warning signs, crosses, skulls or flashing.

### (d) Export

Download the 720p file as generated. On a paid Flow plan, upscale to 1080p there (0 credits up to 10 s); otherwise let ffmpeg upscale, which is clean on flat artwork. Keep the raw downloads outside the repo; only the encoded files in section 5 go into `web/public/hero/`.

## 3. Master prompts: `bubblegum`

Palette phrases are written the same way everywhere so section 4's find-and-replace works. Do not reword them.

### Chana reference still (1:1, once per palette)

```text
Flat 2D vector illustration in neobrutalist sticker style. One character, full body, front view, centred, on a plain flat warm cream (#FFF4E6) background with nothing else in frame.

Chana, a small round chickpea mascot: flat beige (#E8C98F) body with one flat darker crescent (#D2AE6E) along the lower right, a small pointed chickpea tip on top with a short crease, solid dark-ink oval eyes (always #0A0A0A) each with one square white catchlight, short bold straight brows, a cheeky half-smile, two small light-pink blush marks, stubby arms and feet, and a sweatband in hot magenta (#FF4FD8) with a knot and two short tails on one side. Relaxed standing pose.

Thick uniform black (#0A0A0A) outline on every shape. A hard offset drop shadow in solid black (#0A0A0A): the body silhouette shifted down and to the right, zero blur. Solid flat fills only. No gradients, no shading, no highlights, no glow, no texture, no 3D, no clay or vinyl look. No text, letters, numbers or logos.
```

### Block A: style and cast (paste first in every style-frame prompt)

```text
Flat 2D vector illustration in neobrutalist sticker style, like cut-paper stickers laid on a desk. Every shape has a solid flat fill, a thick uniform black (#0A0A0A) outline, and a hard offset drop shadow in solid black (#0A0A0A) shifted down and to the right with zero blur. No gradients, no soft shadows, no glow, no texture, no perspective, no 3D. Background: one flat, even, empty field of warm cream (#FFF4E6), edge to edge.

The cast, all drawn in this same style:
1. PHONE CARD: an upright rounded rectangle with a white (#FFFFFF) face, tilted 3 degrees. Inside it, at the top, a square viewfinder marked by four chunky corner brackets; below it one wide rounded blank panel in white (#FFFFFF) with the same outline.
2. BAR: an unbranded protein-bar wrapper, pale grey with crimped zigzag ends, a violet (#6B5BFF) band holding one blank white star burst, and a white label with plain black barcode stripes of varying width. Tilted minus 4 degrees.
3. CHANA: a small round chickpea mascot. Flat beige (#E8C98F) body with one flat darker crescent (#D2AE6E) along the lower right, a small pointed chickpea tip on top, solid dark-ink oval eyes (always #0A0A0A) each with one square white catchlight, short bold brows, a cheeky half-smile, two small light-pink blush marks, stubby arms and feet, and a sweatband in hot magenta (#FF4FD8) with a knot and two short tails. Standing relaxed.
4. STICKERS: three small chunky shapes: an eight-point star burst in violet (#6B5BFF), a blank tilted rectangular label in hot magenta (#FF4FD8), and a blank pill in sky blue (#9BE7FF).

Use only the colours named above. No yellow, no red, no orange, no green, no lime, no mint anywhere. Absolutely no text, letters, numbers, symbols, logos, brand names or watermarks: every label and panel is blank.
```

### Keep-out lines (paste last in every video prompt)

This is the "negative prompt": Gemini has no negative field, so it goes in as plain sentences.

```text
No dialogue. No music. No sound effects. Completely silent. No text, letters, numbers, logos or labels appear at any time. Do not add any new object or character. No camera movement, no zoom, no cuts. No 3D, no depth of field, no motion blur, no gradients, no glow, no soft shadows, no photorealism, no clay or plastic look. Orange and green appear only on the phone's panel. No yellow, red, lime or mint anywhere. Chana never eats, chews, drinks, licks or blows anything: no gum, no bubbles, no balloons, no candy, nothing in the mouth. Nothing bursts, pops, splashes or explodes: no liquid, goo, slime, paint or splatter, and no confetti. Chana's face and body stay clean and unchanged; the only expressions are a side-eye and a happy smile. Follow the timed beats exactly; do not invent extra actions or jokes.
```

### Desktop hero, 16:9

Subject in the right 55%, left 45% calm for the HTML headline.

**Still** = Block A, then:

```text
Composition: wide 16:9 frame. The left 45% of the frame is completely empty background: no shapes, no shadows. The whole cast sits in the right 55%, inside the middle 70% of the frame's height. The PHONE CARD is centred about 70% of the way across. The BAR rests at the phone's lower left, overlapping its bottom-left corner. CHANA stands at the phone's right side, about one third of the phone's height, feet level with the phone's bottom edge. The three STICKERS are small and sit near the phone's top-left corner, top-right corner and bottom-right corner; none crosses into the left 45%. Clear background margin along the top, bottom and right edges.
```

**Video** (8 s, Frames mode, same still as start and end), then the keep-out lines:

```text
Animate this exact illustration as a flat 2D motion graphic, like cut-paper stickers: snappy moves that ease out, overshoot and settle, with squash and stretch, at smooth 24 fps. Locked camera, flat even lighting. Fills, outlines and hard shadows stay exactly as drawn. The left 45% of the frame stays empty and still throughout.
[0-1s] The bar slides up to the phone's viewfinder and settles with a small bounce.
[1-2.5s] A chunky translucent sky blue (#9BE7FF) beam sweeps across the barcode and back.
[2.5-4s] The phone's blank panel flips like a card to flat orange (#FB923C). Chana side-eyes it, one brow raised.
[4-6s] The panel flips to flat green (#22C55E). Chana squashes, hops with both arms up and lands with a bounce; the three stickers bounce once.
[6-8s] The panel flips back to blank, the bar slides back, and everything returns to its exact starting position and holds still.
```

### Mobile hero, 9:16

Subject in the upper 55%, bottom 40% calm for the headline and form overlay. (If the page ends up with the text above the visual, swap "upper" and "bottom" in both prompts.)

**Still** = Block A, then:

```text
Composition: tall 9:16 frame. The bottom 40% of the frame is completely empty background: no shapes, no shadows. The whole cast sits in the upper 55%, with a clear margin at the top and sides. The PHONE CARD is centred horizontally, its centre about 30% of the way down the frame. The BAR rests at the phone's lower left, overlapping its bottom-left corner. CHANA stands at the phone's lower right, about one third of the phone's height, feet level with the phone's bottom edge. The three STICKERS are small and sit near the phone's top-left corner, top-right corner and left side; none drops into the bottom 40%.
```

**Video** (8 s, Frames mode), then the keep-out lines:

```text
Animate this exact illustration as a flat 2D motion graphic, like cut-paper stickers: snappy moves that ease out, overshoot and settle, with squash and stretch, at smooth 24 fps. Locked camera, flat even lighting. Fills, outlines and hard shadows stay exactly as drawn. The bottom 40% of the frame stays empty and still throughout.
[0-1s] The bar slides up to the phone's viewfinder and settles with a small bounce.
[1-2.5s] A chunky translucent sky blue (#9BE7FF) beam sweeps across the barcode and back.
[2.5-4s] The phone's blank panel flips like a card to flat orange (#FB923C). Chana side-eyes it, one brow raised.
[4-6s] The panel flips to flat green (#22C55E). Chana squashes, hops with both arms up and lands with a bounce; the three stickers bounce once.
[6-8s] The panel flips back to blank, the bar slides back, and everything returns to its exact starting position and holds still.
```

### Social master, 9:16 (Reels, Shorts, Stories), also the source for 1:1 and 4:5

One generation serves all three social formats. The cast sits inside the middle 50% of the height, comfortably within the frame's **central square** (the middle 56%), so the 4:5 and 1:1 versions are plain centre crops (section 5) with room left for Chana's hop.

**Still** = Block A, then:

```text
Composition: tall 9:16 frame. The whole cast is grouped tightly in the centre of the frame, inside the middle 50% of the height and the middle 70% of the width, with the PHONE CARD in the middle, the BAR at its lower left, CHANA at its lower right and the three STICKERS close around it. The top 25% and the bottom 25% of the frame are empty background, and so is a 15% strip down the left and right edges. The background carries a very faint grid-paper pattern of thin lines only slightly different in tone from the background.
```

Drop the last sentence for a plain background. The grid is allowed here because nothing is laid over a social clip.

**Video** (8 s, Frames mode), then the keep-out lines:

```text
Animate this exact illustration as a flat 2D motion graphic, like cut-paper stickers: snappy moves that ease out, overshoot and settle, with squash and stretch, at smooth 24 fps. Locked camera, flat even lighting. Fills, outlines and hard shadows stay exactly as drawn. All motion stays inside the frame's central square; nothing else moves.
[0-1s] The bar slides up to the phone's viewfinder and settles with a small bounce.
[1-2.5s] A chunky translucent sky blue (#9BE7FF) beam sweeps across the barcode and back.
[2.5-4s] The phone's blank panel flips like a card to flat orange (#FB923C). Chana side-eyes it, one brow raised.
[4-6s] The panel flips to flat green (#22C55E). Chana squashes, hops with both arms up and lands with a bounce; the three stickers bounce once.
[6-8s] The panel flips back to blank, the bar slides back, and everything returns to its exact starting position and holds still.
```

Safe zones (rule of thumb, not re-checked against each platform this session): Reels, Shorts and Stories cover roughly the top 14% and the bottom 20 to 35% of a 9:16 frame with their own UI, plus a strip of buttons down the right edge. The composition above clears the top band, the right strip and the bottom 25%. On platforms whose caption area reaches higher, the lowest part of the group (Chana's feet, the bar) can still be covered, so preview in the app before posting. A social clip needs words to make sense (cutting → "Works against your goal", bulking → "Fits your goal"); add them as real text in CapCut or the platform editor, using the verdict labels exactly as written in `docs/brand.md`.

### Square post 1:1 and portrait feed 4:5

Gemini video cannot output these ratios. Crop the social master: 4:5 keeps the middle 70% of its height, 1:1 the middle 56%. Commands are in section 5. Flow also lists a "Video Resizer" tool ("Resize your videos into any aspect ratio"); how it resizes is not verified, so check its output against the review checklist.

For a **static** 1:1 or 4:5 post, Nano Banana does support those ratios: use Block A plus "Composition: square 1:1 frame (or portrait 4:5 frame). The whole cast is grouped in the centre with an even margin on all sides."

### Ultrawide and large screens

Generate nothing extra. Use the 16:9 desktop file with `object-fit: cover` and `object-position: 75% 50%`. On a 21:9 box only the middle 76% of the video's height is visible (50% on 32:9), which is why the desktop still keeps the cast inside the middle 70% of the height. The focal point (phone and Chana) stays about 70% across and vertically centred. Simpler still: cap the video box at 16:9 so it never crops. On 4K screens the 1080p file is enough for flat art; a 4K upscale is Ultra-only in Flow and not worth the bytes.

### No start frame available (text to video)

Paste Block A, then the format's composition paragraph, then its video prompt with the first sentence changed to "Animate this illustration as a flat 2D motion graphic…", then the keep-out lines. Expect less faithful colours and a loop that needs the crossfade.

## 4. Palette swaps

Find and replace these exact phrases in the Chana reference, Block A, the compositions and the video prompts. Verdict colours `#FB923C` and `#22C55E`, Chana's body, the pale grey wrapper, the white barcode label with black stripes and Chana's dark-ink face never change.

| Find (bubblegum) | `cobalt-punch` | `night-shift` | `ube-chai` | `ink-lilac` |
| --- | --- | --- | --- | --- |
| `warm cream (#FFF4E6)` | `pale ice blue (#EEF0FF)` | `near-black (#111111)` | `chai beige (#F3E9DC)` | `paper white (#FAFAF7)` |
| `black (#0A0A0A)` | `black (#0A0A0A)` | `cream (#F7F3EA)` | `deep aubergine (#1B1030)` | `black (#0A0A0A)` |
| `white (#FFFFFF)` | `white (#FFFFFF)` | `charcoal (#1C1C1C)` | `warm white (#FFFBF5)` | `white (#FFFFFF)` |
| `hot magenta (#FF4FD8)` | `cobalt blue (#2F3BFF)` | `lavender (#B79CFF)` | `ube purple (#7B2FF7)` | `solid black (#0A0A0A)` |
| `violet (#6B5BFF)` | `pink (#FF7AC6)` | `hot magenta (#FF4FD8)` | `candy pink (#FFB3E6)` | `lilac (#D9C8FF)` |
| `sky blue (#9BE7FF)` | `lilac (#C8B6FF)` | `sky blue (#7FD8FF)` | `cobalt blue (#2A2AFF)` | `hot magenta (#FF4FD8)` |

Replace in this order so a new value is never replaced twice: background, then `black (#0A0A0A)`, then `white (#FFFFFF)`, then hot magenta, then violet, then sky blue.

Extra lines to add per palette:

- **`night-shift`**: add to Block A: "This is a dark theme: all outlines and all hard shadows are cream (#F7F3EA) on the near-black background, so every shape reads as a sticker on dark. Chana's eyes, brows and mouth stay dark ink (#0A0A0A) on the beige body."
- **`ube-chai`**: no extra line.
- **`cobalt-punch`**: no extra line.
- **`ink-lilac`**: add "Hot magenta (#FF4FD8) is used sparingly: only the small pill sticker and the scan beam." The sweatband and the tilted label become solid black.

File names follow the palette: `night-shift-desktop.mp4` and so on. Two values in section 5 are bubblegum-only and need the palette's `--bg` hex: the expected background reading (`ff f4 e6`) and the pad colour (`color=0xFFF4E6`).

## 5. Post-production for the website

All commands below were run with ffmpeg 6.1 on synthetic test clips (sizes, durations and missing audio checked with ffprobe). They have not been run on real Gemini output. Input names: `raw-desktop.mp4`, `raw-mobile.mp4`, `raw-social.mp4`.

### Inspect the download

```bash
# size, frame rate, duration, and whether there is an audio stream
ffprobe -v error -show_entries stream=codec_type,width,height,r_frame_rate:format=duration -of compact raw-desktop.mp4

# background colour near the top-left corner, as three hex bytes (bubblegum should read close to: ff f4 e6)
ffmpeg -v error -i raw-desktop.mp4 -vf "crop=32:32:16:16,scale=1:1:flags=area,format=rgb24" -frames:v 1 -f rawvideo - | od -An -tx1

# does the last frame match the first? higher is better; under about 30 dB the seam will show
ffmpeg -v error -y -i raw-desktop.mp4 -frames:v 1 -update 1 first.png
ffmpeg -v error -y -sseof -0.05 -i raw-desktop.mp4 -frames:v 1 -update 1 last.png
ffmpeg -i first.png -i last.png -lavfi psnr -f null - 2>&1 | grep -o "average:[^ ]*"
```

If the background is more than a few points off `--bg`, regenerate, or tell the main session the measured hex so the video can sit in a bordered sticker card instead of bleeding into the page.

### Make the loop seamless (only if the seam shows)

Crossfades the end of the clip into its own beginning. `F` is the fade length, `D` the clip's duration. The output is `D − F` long, and its last frame leads straight into its first (checked on a moving test clip). Shown for `D = 8`, `F = 0.5` (offset = `D − 2F` = 7):

```bash
ffmpeg -y -i raw-desktop.mp4 -filter_complex \
"[0:v]trim=start=0.5,setpts=PTS-STARTPTS[main];[0:v]trim=end=0.5,setpts=PTS-STARTPTS[head];[main][head]xfade=transition=fade:duration=0.5:offset=7[v]" \
-map "[v]" -an -c:v libx264 -crf 12 -preset slow -pix_fmt yuv420p loop-desktop.mp4
```

This only looks clean because both ends of the clip are near the rest pose. If shapes are still moving at the end, regenerate.

### Trim (only if needed)

```bash
ffmpeg -y -ss 0 -t 8 -i raw-desktop.mp4 -an -c:v libx264 -crf 12 -preset slow -pix_fmt yuv420p trim-desktop.mp4
```

### Encode for the site

`-an` removes the audio track. Use `loop-desktop.mp4` as the input instead if you made one.

```bash
# Desktop 1920x1080: H.264 MP4, then VP9 WebM, then (optional) AV1 WebM
ffmpeg -y -i raw-desktop.mp4 -an -vf "scale=1920:1080:flags=lanczos,fps=24" -c:v libx264 -crf 23 -preset slow -profile:v high -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -movflags +faststart bubblegum-desktop.mp4
ffmpeg -y -i raw-desktop.mp4 -an -vf "scale=1920:1080:flags=lanczos,fps=24" -c:v libvpx-vp9 -crf 32 -b:v 0 -row-mt 1 -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 bubblegum-desktop.webm
ffmpeg -y -i raw-desktop.mp4 -an -vf "scale=1920:1080:flags=lanczos,fps=24" -c:v libsvtav1 -crf 34 -preset 6 -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 bubblegum-desktop.av1.webm

# Mobile 1080x1920
ffmpeg -y -i raw-mobile.mp4 -an -vf "scale=1080:1920:flags=lanczos,fps=24" -c:v libx264 -crf 23 -preset slow -profile:v high -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -movflags +faststart bubblegum-mobile.mp4
ffmpeg -y -i raw-mobile.mp4 -an -vf "scale=1080:1920:flags=lanczos,fps=24" -c:v libvpx-vp9 -crf 32 -b:v 0 -row-mt 1 -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 bubblegum-mobile.webm

# Posters from the first frame of the encoded file, so poster and video match exactly
ffmpeg -y -i bubblegum-desktop.mp4 -frames:v 1 -c:v libwebp -quality 82 bubblegum-poster-desktop.webp
ffmpeg -y -i bubblegum-desktop.mp4 -frames:v 1 -q:v 3 -update 1 bubblegum-poster-desktop.jpg
ffmpeg -y -i bubblegum-mobile.mp4 -frames:v 1 -c:v libwebp -quality 82 bubblegum-poster-mobile.webp
ffmpeg -y -i bubblegum-mobile.mp4 -frames:v 1 -q:v 3 -update 1 bubblegum-poster-mobile.jpg
```

- If the source is not 24 fps, change `fps=24` to its real rate (from the ffprobe line).
- **Targets:** under 3 MB desktop, under 2 MB mobile. Flat artwork compresses well, so 8 s should land well under both. If a file is over, raise `-crf` in steps of 2 (H.264 up to 28, VP9 up to 38) or encode mobile at `scale=720:1280`.
- The `bt709` tags stop browsers guessing the colour space, which is what shifts a matched background.

### Social crops from the 9:16 master

```bash
# 4:5 portrait feed, 1080x1350
ffmpeg -y -i raw-social.mp4 -an -vf "crop=iw:iw*5/4,scale=1080:1350:flags=lanczos" -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -movflags +faststart bubblegum-social-4x5.mp4
# 1:1 square, 1080x1080
ffmpeg -y -i raw-social.mp4 -an -vf "crop=iw:iw,scale=1080:1080:flags=lanczos" -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -movflags +faststart bubblegum-social-1x1.mp4
# 9:16 Reels, Shorts, Stories, 1080x1920
ffmpeg -y -i raw-social.mp4 -an -vf "scale=1080:1920:flags=lanczos" -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -movflags +faststart bubblegum-social-9x16.mp4
# Alternative square: pad the 16:9 desktop clip with the background colour instead of cropping
ffmpeg -y -i raw-desktop.mp4 -an -vf "scale=1080:-2:flags=lanczos,pad=1080:1080:0:(oh-ih)/2:color=0xFFF4E6" -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -movflags +faststart bubblegum-social-1x1-padded.mp4
# Some platforms reject files with no audio stream: add a silent one
ffmpeg -y -i bubblegum-social-4x5.mp4 -f lavfi -i anullsrc=r=48000:cl=stereo -c:v copy -c:a aac -b:a 96k -shortest -movflags +faststart bubblegum-social-4x5-silent.mp4
```

CapCut does the same crops by hand: set the canvas ratio, scale the clip to fill, export 1080p.

### File names

Ship these in `web/public/hero/` (the folder does not exist yet):

```text
bubblegum-desktop.mp4        bubblegum-desktop.webm        (optional) bubblegum-desktop.av1.webm
bubblegum-mobile.mp4         bubblegum-mobile.webm
bubblegum-poster-desktop.webp   bubblegum-poster-desktop.jpg
bubblegum-poster-mobile.webp    bubblegum-poster-mobile.jpg
```

Raw downloads, stills and the `bubblegum-social-*` files stay out of the repo.

### Watermarks

- **SynthID** is invisible and is in every Gemini image and video. It does not affect how the clip looks. Leave it alone.
- **Visible watermark:** in India it is on by default in the Gemini app (unless AI Ultra) and in Flow (unless Ultra 20x). The help pages call it a "persistent overlay" on video and do not describe its position.
- If a clip has a visible mark, **do not remove, crop or cover it.** The honest options are:
  1. Use the API route and check the first clip. Its docs mention only SynthID, but the absence of a visible mark there is not verified.
  2. Generate on an Ultra plan where the switch exists (for one month if that is all it takes).
  3. Keep the watermarked clip for social posts only, where an "AI-generated" mark is normal.
  4. Keep the coded hero, which already animates this scene with exact colours and no watermark.
- The site should also be open about it: a short "hero animation made with AI" line in the footer fits the brand's honesty rule.

## 6. How it gets onto the site

The page has no video slot today: the coded hero in `web/src/sections/Hero.tsx` renders instead, and it stays as the fallback. Once the files exist in `web/public/hero/`, the main session will plan the change and hand it to a subagent:

- A `<video muted autoplay loop playsinline preload="metadata" poster="…">` with `<source>` elements per breakpoint (`media="(max-width: 899px)"` for the mobile files) and per format, AV1 or VP9 WebM first and MP4 last, plus `aria-hidden="true"` because it is decoration.
- `prefers-reduced-motion`: show the poster image only, no video download. The same check the page already uses (`MOTION_OK`).
- The video's background is flat `--bg`; the CSS grid-paper texture (`web/src/index.css`) is drawn over it. If the measured background does not match, the video goes in a bordered card with a hard shadow instead.
- `object-fit: cover` with `object-position: 75% 50%` on desktop; the palette picks the file (`${palette}-desktop.mp4`), falling back to the coded hero when a palette has no video.
- Every word stays HTML. The verdict chips with their labels and icons must sit next to the video, because the clip shows the verdict by colour alone.

## 7. Verified on

Checked 17 Nov 2026. Limits, credit prices and model line-ups on these pages change often; re-check before paying for anything.

- Gemini API, video generation overview (Omni Flash current; Veo 3.1 Preview shut down 22 Oct 2026): https://ai.google.dev/gemini-api/docs/video
- Gemini API, Omni Flash guide (ratios, durations, resolutions, start and end frame, references, extension, audio by default, no negative prompts, timecodes, SynthID): https://ai.google.dev/gemini-api/docs/omni
- Gemini API, image generation (Nano Banana 2.1 and other models, aspect ratios, sizes): https://ai.google.dev/gemini-api/docs/image-generation
- Gemini API pricing (no free tier for Omni or Nano Banana 2.1, per-second prices): https://ai.google.dev/gemini-api/docs/pricing
- Gemini Apps Help, generate videos (Omni 1.2 Flash, 3 to 10 s, 15 s on Ultra, references, paid plan, 18+): https://support.google.com/gemini/answer/16126339
- Gemini Apps Help, limits and feature availability (compute-based limits, 5-hour refresh, video needs a plan): https://support.google.com/gemini/answer/16275805
- Gemini Apps Help, watermark settings (India: switch only with AI Ultra; SynthID; Content Credentials): https://support.google.com/gemini/answer/17405358
- Google Flow, plans and credits per plan: https://labs.google/fx/tools/flow
- Flow Help, models and supported features (Omni 1.2, Veo 3.1 Lite, retirements on 5 Dec 2026): https://support.google.com/flow/answer/16352836
- Flow Help, create videos (Frames with start and end frame, Ingredients, settings): https://support.google.com/flow/answer/16353334
- Flow Help, credits (cost per second, upscaling): https://support.google.com/flow/answer/16526234
- Flow Help, get started FAQ (visible watermark automatic in India unless Ultra 20x; SynthID; 18+): https://support.google.com/flow/answer/16353333
- Flow Help, availability (India is listed): https://support.google.com/flow/answer/16353544
- Google blog, Introducing Gemini Omni (SynthID on all Omni videos; search excerpt only, not read in full): https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-omni/

Could not verify: a per-day video count in the Gemini app; the frame rate of the output; whether the same image is accepted as both start and end frame; whether Frames and Ingredients can be combined in Flow; whether API output has a visible watermark; what the visible watermark looks like or where it sits; social platform safe-zone percentages.
