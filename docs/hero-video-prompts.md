> **Out of date:** written for the v0 dark neon hero. Rewrite against `docs/brand.md` v1 once the owner picks a neobrutalist direction.

# Hero video prompts (Higgsfield)

Prompts for the AI-generated hero clip described in `docs/brand.md`: "Same snack. Different verdict." The clip shows the same scene as the coded hero (drifting blobs, a phone scanning an unbranded protein bar, a verdict changing from orange to green, Chana reacting) so it can replace the coded graphic later.

The video carries **no text, UI copy, logos or real packaging**. The headline, goal toggle, verdict labels, reason lines and the "+10 XP" chip stay as HTML on top. In the clip the verdict is only a coloured glow.

## How to use

1. **Chana reference first.** Generate the mascot reference image (prompt below) with any Higgsfield image model and pick one you like. Reuse it everywhere.
2. **Still frame.** For the palette you want, generate the desktop (16:9) and mobile (9:16) stills, attaching the Chana reference if the image model accepts one. The still is the *rest state*: no scan beam, no glow, Chana neutral. Check it for stray letters before going further.
3. **Draft clip.** Run image-to-video with the **same still as both start and end frame**, so the last frame matches the first and the loop is seamless. Use the draft settings below (`seedance_2_5`, `draft: true`) to check motion cheaply.
4. **Final clip.** When the draft motion is right, either finalize that draft (within 7 days) or run the final settings below. 8 s, 1080p, audio off.
5. **Compress.** Targets: under 3 MB desktop, under 2 MB mobile, H.264 MP4 plus WebM, no audio track, and a poster JPG taken from the clip's first frame.

Because the clip must end on its opening frame, every video prompt runs a full cycle: rest, scan, orange, green, back to rest. The camera move also returns to where it started.

### Settings (same for every palette)

| | Draft run | Final run |
| --- | --- | --- |
| Model | `seedance_2_5` | `seedance_2_0` |
| Mode | `omni_reference` | n/a |
| `start_image` | the still | the still |
| `end_image` | the same still | the same still |
| `image_references` | not listed for this model | the Chana reference image |
| Duration | 8 s | 8 s |
| Resolution | `draft: true` (480p draft) | 1080p |
| Aspect ratio | 16:9 desktop, 9:16 mobile | 16:9 desktop, 9:16 mobile |
| `generate_audio` | false | false |
| `bitrate_mode` | standard | n/a |

- **Why these:** `seedance_2_5` is the only model with a draft option, and `seedance_2_0` accepts start frame, end frame and image references together, which is what keeps Chana consistent.
- **Finalizing the draft instead:** if a `seedance_2_5` draft is already right, finalize it (at 1080p if offered) with `bitrate_mode: high`. Chana is carried by the start frame alone in that case.
- **Fallbacks:** if the mascot drifts or the phone warps on `seedance_2_0`, try `flux_3_video` (same three image inputs, 8 s, 1080p, `generate_audio: false`). `cinematic_studio_3_0` takes start and end frames but no image references, so use it only if the lighting on the other two looks flat.
- **Negative prompt:** none of the models above lists a negative-prompt setting. If the app shows a negative field, paste the "Avoid" line there; otherwise append it to the prompt as `Avoid: ...`.
- These recommendations come from the listed parameters, not from test renders. Judge by the draft.

### Compress

```bash
# H.264 MP4 (raise -crf to shrink; 26-30 is the useful range)
ffmpeg -i in.mp4 -an -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart -vf "scale=1920:-2" neon-pulse-desktop.mp4
# WebM (VP9)
ffmpeg -i in.mp4 -an -c:v libvpx-vp9 -crf 34 -b:v 0 -vf "scale=1920:-2" neon-pulse-desktop.webm
# Mobile: 720 px wide is enough
ffmpeg -i in-mobile.mp4 -an -c:v libx264 -crf 27 -preset slow -pix_fmt yuv420p -movflags +faststart -vf "scale=720:-2" neon-pulse-mobile.mp4
ffmpeg -i in-mobile.mp4 -an -c:v libvpx-vp9 -crf 35 -b:v 0 -vf "scale=720:-2" neon-pulse-mobile.webm
# Posters from the first frame of each clip (so poster and video match exactly)
ffmpeg -i in.mp4 -frames:v 1 -q:v 3 neon-pulse-poster-desktop.jpg
ffmpeg -i in-mobile.mp4 -frames:v 1 -q:v 3 -vf "scale=720:-2" neon-pulse-poster-mobile.jpg
```

## Art direction

- **One slow move.** A push-in of a few percent that eases back. No orbit sweeps, no cuts, no speed ramps.
- **Matched background.** The backdrop is the palette's `--bg`, flat and seamless, so the video's edges disappear into the page. Blobs fade out before the frame edges.
- **Soft studio light.** One large soft key and a faint rim. No hard speculars, no lens flare.
- **Shallow depth of field.** Bar and Chana sharp, blobs soft.
- **Restrained glow.** The verdict glow is a soft halo around the phone, never a flash. Only orange `#FB923C` and green `#22C55E` appear as verdict colours; the scan beam is white so it is not mistaken for a verdict.
- **Small acting.** Chana's first reaction is a head tilt (unsure, not alarmed), the second a single small hop. Nothing in frame signals fear or warning.
- **Staging.** `brand.md` says the phone frame holds the bar; here the bar floats just in front of the phone, which reads better in 3D and keeps the barcode visible. To match the coded hero more literally, change the still prompts so the bar appears inside the phone's screen as a camera viewfinder.
- **Calm space for type.** Desktop keeps the left 45% empty; mobile keeps the bottom 40% empty. If the site puts the headline on the right instead, swap "right half" and "left 45%" in the desktop prompts.

## Mascot: Chana

Use this description word for word in every prompt. Only the sweatband colour changes, and it is always the palette's `--accent-1`.

> Chana, a small round chickpea mascot: warm beige (#E8C98F) body with a subtle pointed tip at the top, big glossy dark eyes, tiny arms, a soft terry sweatband in [accent-1 name] ([accent-1 hex]), soft 3D clay vinyl-toy finish

**Reference image prompt** (1:1, generate once per palette so the sweatband matches; the body must look the same in all three):

```text
Single character, one view, front three-quarter angle, full body, centred. Chana, a small round chickpea mascot: warm beige (#E8C98F) body with a subtle pointed tip at the top, big glossy dark eyes, tiny arms, a soft terry sweatband in hot pink (#FF2DAB), soft 3D clay vinyl-toy finish. Neutral relaxed pose, small friendly closed-mouth smile. Plain flat mid-grey backdrop, soft even studio lighting, no props, no text, no logos.
```

For `ultraviolet` change the sweatband to `violet (#8B5CFF)`; for `cobalt-chalk` to `cobalt blue (#2340FF)`. Easiest route: generate the `neon-pulse` one, then use an image-edit model to recolour only the sweatband.

## Palette: `neon-pulse`

`--bg` `#0B0B0B` · `--accent-1` `#FF2DAB` hot pink · `--accent-2` `#D4FF3F` chartreuse

Keep the chartreuse blob on the far side of the frame from the phone: it sits close to the green verdict (see the caveat in `brand.md`).

### Still, desktop 16:9

```text
Premium 3D product render, 16:9 wide frame. Flat seamless near-black backdrop, exactly #0B0B0B, edge to edge: no vignette, no gradient, no floor line, no horizon. Phone, bar and mascot are grouped in the right half of the frame; the left 45% is empty backdrop. A generic dark graphite smartphone with a thin rim-lit edge, thin bezels and no logo floats upright, tilted 10 degrees; its screen is dark with one blank rounded card shape, no interface. Just in front of the phone floats an unbranded protein bar in a plain matte silver wrapper with no print, showing only a barcode made of plain black stripes, no numerals. Beside the phone stands Chana, a small round chickpea mascot: warm beige (#E8C98F) body with a subtle pointed tip at the top, big glossy dark eyes, tiny arms, a soft terry sweatband in hot pink (#FF2DAB), soft 3D clay vinyl-toy finish, neutral relaxed pose, looking at the bar. Two large soft out-of-focus organic blobs of light, one hot pink (#FF2DAB) and one chartreuse (#D4FF3F), the hot pink blob off to one side of the group, the chartreuse blob on the far opposite side, the area right around the phone left as clean backdrop; both fade out fully before the frame edges. Soft studio lighting: large overhead softbox key, faint rim light, deep clean blacks. 85 mm lens look, shallow depth of field, bar and mascot sharp, blobs soft. Rest state: no scan beam, no coloured glow around the phone. No text, letters, numbers or logos anywhere.
```

### Still, mobile 9:16

```text
Premium 3D product render, 9:16 vertical frame composed for a phone screen. Flat seamless near-black backdrop, exactly #0B0B0B, edge to edge: no vignette, no gradient, no floor line, no horizon. Phone, bar and mascot are grouped in the upper 55% of the frame, centred horizontally, with a little headroom; the bottom 40% is completely empty plain near-black (#0B0B0B) backdrop with no objects, no blobs and no shadows. A generic dark graphite smartphone with a thin rim-lit edge, thin bezels and no logo floats upright, tilted 10 degrees; its screen is dark with one blank rounded card shape, no interface. Just in front of the phone floats an unbranded protein bar in a plain matte silver wrapper with no print, showing only a barcode made of plain black stripes, no numerals. Beside the phone stands Chana, a small round chickpea mascot: warm beige (#E8C98F) body with a subtle pointed tip at the top, big glossy dark eyes, tiny arms, a soft terry sweatband in hot pink (#FF2DAB), soft 3D clay vinyl-toy finish, neutral relaxed pose, looking at the bar. Two large soft out-of-focus organic blobs of light, one hot pink (#FF2DAB) and one chartreuse (#D4FF3F), the hot pink blob off to one side of the group, the chartreuse blob on the far opposite side, the area right around the phone left as clean backdrop; both fade out fully before the frame edges. Blobs stay in the upper half only. Soft studio lighting: large overhead softbox key, faint rim light, deep clean blacks. 85 mm lens look, shallow depth of field, bar and mascot sharp, blobs soft. Rest state: no scan beam, no coloured glow around the phone. No text, letters, numbers or logos anywhere.
```

### Video, desktop 16:9

```text
Single shot. Camera pushes in 4 percent very slowly, then eases back to the start. 0-2 s: a thin white scan beam sweeps across the bar's barcode. 2-4 s: a soft orange (#FB923C) halo blooms around the phone; Chana, a small round chickpea mascot: warm beige (#E8C98F) body with a subtle pointed tip at the top, big glossy dark eyes, tiny arms, a soft terry sweatband in hot pink (#FF2DAB), soft 3D clay vinyl-toy finish, tilts its head. 4-6.5 s: glow shifts to green (#22C55E); Chana hops once, happy. 6.5-8 s: glow fades, Chana settles. Hot pink (#FF2DAB) and chartreuse (#D4FF3F) blobs drift slowly and return. Backdrop stays flat near-black (#0B0B0B). Shallow depth of field.
```

### Video, mobile 9:16

```text
Single shot. Camera pushes in 4 percent very slowly, then eases back to the start. 0-2 s: a thin white scan beam sweeps across the bar's barcode. 2-4 s: a soft orange (#FB923C) halo blooms around the phone; Chana, a small round chickpea mascot: warm beige (#E8C98F) body with a subtle pointed tip at the top, big glossy dark eyes, tiny arms, a soft terry sweatband in hot pink (#FF2DAB), soft 3D clay vinyl-toy finish, tilts its head. 4-6.5 s: glow shifts to green (#22C55E); Chana hops once, happy. 6.5-8 s: glow fades, Chana settles. Hot pink (#FF2DAB) and chartreuse (#D4FF3F) blobs drift slowly and return. Bottom 40% stays empty flat near-black (#0B0B0B). Shallow depth of field.
```

### Avoid (negative prompt)

```text
text, letters, numbers, captions, subtitles, UI copy, icons, logos, brand names, watermarks, real food brands, real packaging designs, phone maker logos, barcode numerals, hands, fingers, extra fingers, people, warped or bending phone, melting shapes, mascot changing shape or colour, extra limbs, mouth with teeth, fast camera, camera shake, zoom bursts, cuts, scene changes, flicker, strobing, lens flare, heavy bloom, film grain, vignette, background gradient, floor line, red or yellow glow around the phone, grey or lifted blacks, visible banding in the dark background
```

**Model and settings:** draft on `seedance_2_5` (`omni_reference`, `draft: true`), final on `seedance_2_0` at 1080p, 8 s, `generate_audio: false`, start and end image both the `neon-pulse` still for that aspect ratio, Chana reference with the hot pink sweatband in `image_references`. Full table under "Settings" above.

## Palette: `ultraviolet`

`--bg` `#0D0A1F` · `--accent-1` `#8B5CFF` violet · `--accent-2` `#3DF5FF` cyan

Cyan and violet are both far from the verdict colours, so the orange-to-green shift reads most clearly in this palette.

### Still, desktop 16:9

```text
Premium 3D product render, 16:9 wide frame. Flat seamless deep indigo backdrop, exactly #0D0A1F, edge to edge: no vignette, no gradient, no floor line, no horizon. Phone, bar and mascot are grouped in the right half of the frame; the left 45% is empty backdrop. A generic dark graphite smartphone with a thin rim-lit edge, thin bezels and no logo floats upright, tilted 10 degrees; its screen is dark with one blank rounded card shape, no interface. Just in front of the phone floats an unbranded protein bar in a plain matte silver wrapper with no print, showing only a barcode made of plain black stripes, no numerals. Beside the phone stands Chana, a small round chickpea mascot: warm beige (#E8C98F) body with a subtle pointed tip at the top, big glossy dark eyes, tiny arms, a soft terry sweatband in violet (#8B5CFF), soft 3D clay vinyl-toy finish, neutral relaxed pose, looking at the bar. Two large soft out-of-focus organic blobs of light, one violet (#8B5CFF) and one cyan (#3DF5FF), the violet blob off to one side of the group, the cyan blob on the opposite side, the area right around the phone left as clean backdrop; both fade out fully before the frame edges. Soft studio lighting: large overhead softbox key, faint rim light, deep clean blacks. 85 mm lens look, shallow depth of field, bar and mascot sharp, blobs soft. Rest state: no scan beam, no coloured glow around the phone. No text, letters, numbers or logos anywhere.
```

### Still, mobile 9:16

```text
Premium 3D product render, 9:16 vertical frame composed for a phone screen. Flat seamless deep indigo backdrop, exactly #0D0A1F, edge to edge: no vignette, no gradient, no floor line, no horizon. Phone, bar and mascot are grouped in the upper 55% of the frame, centred horizontally, with a little headroom; the bottom 40% is completely empty plain deep indigo (#0D0A1F) backdrop with no objects, no blobs and no shadows. A generic dark graphite smartphone with a thin rim-lit edge, thin bezels and no logo floats upright, tilted 10 degrees; its screen is dark with one blank rounded card shape, no interface. Just in front of the phone floats an unbranded protein bar in a plain matte silver wrapper with no print, showing only a barcode made of plain black stripes, no numerals. Beside the phone stands Chana, a small round chickpea mascot: warm beige (#E8C98F) body with a subtle pointed tip at the top, big glossy dark eyes, tiny arms, a soft terry sweatband in violet (#8B5CFF), soft 3D clay vinyl-toy finish, neutral relaxed pose, looking at the bar. Two large soft out-of-focus organic blobs of light, one violet (#8B5CFF) and one cyan (#3DF5FF), the violet blob off to one side of the group, the cyan blob on the opposite side, the area right around the phone left as clean backdrop; both fade out fully before the frame edges. Blobs stay in the upper half only. Soft studio lighting: large overhead softbox key, faint rim light, deep clean blacks. 85 mm lens look, shallow depth of field, bar and mascot sharp, blobs soft. Rest state: no scan beam, no coloured glow around the phone. No text, letters, numbers or logos anywhere.
```

### Video, desktop 16:9

```text
Single shot. Camera pushes in 4 percent very slowly, then eases back to the start. 0-2 s: a thin white scan beam sweeps across the bar's barcode. 2-4 s: a soft orange (#FB923C) halo blooms around the phone; Chana, a small round chickpea mascot: warm beige (#E8C98F) body with a subtle pointed tip at the top, big glossy dark eyes, tiny arms, a soft terry sweatband in violet (#8B5CFF), soft 3D clay vinyl-toy finish, tilts its head. 4-6.5 s: glow shifts to green (#22C55E); Chana hops once, happy. 6.5-8 s: glow fades, Chana settles. Violet (#8B5CFF) and cyan (#3DF5FF) blobs drift slowly and return. Backdrop stays flat deep indigo (#0D0A1F). Shallow depth of field.
```

### Video, mobile 9:16

```text
Single shot. Camera pushes in 4 percent very slowly, then eases back to the start. 0-2 s: a thin white scan beam sweeps across the bar's barcode. 2-4 s: a soft orange (#FB923C) halo blooms around the phone; Chana, a small round chickpea mascot: warm beige (#E8C98F) body with a subtle pointed tip at the top, big glossy dark eyes, tiny arms, a soft terry sweatband in violet (#8B5CFF), soft 3D clay vinyl-toy finish, tilts its head. 4-6.5 s: glow shifts to green (#22C55E); Chana hops once, happy. 6.5-8 s: glow fades, Chana settles. Violet (#8B5CFF) and cyan (#3DF5FF) blobs drift slowly and return. Bottom 40% stays empty flat deep indigo (#0D0A1F). Shallow depth of field.
```

### Avoid (negative prompt)

```text
text, letters, numbers, captions, subtitles, UI copy, icons, logos, brand names, watermarks, real food brands, real packaging designs, phone maker logos, barcode numerals, hands, fingers, extra fingers, people, warped or bending phone, melting shapes, mascot changing shape or colour, extra limbs, mouth with teeth, fast camera, camera shake, zoom bursts, cuts, scene changes, flicker, strobing, lens flare, heavy bloom, film grain, vignette, background gradient, floor line, red or yellow glow around the phone, grey or lifted blacks, visible banding in the dark background
```

**Model and settings:** draft on `seedance_2_5` (`omni_reference`, `draft: true`), final on `seedance_2_0` at 1080p, 8 s, `generate_audio: false`, start and end image both the `ultraviolet` still for that aspect ratio, Chana reference with the violet sweatband in `image_references`. Full table under "Settings" above.

## Palette: `cobalt-chalk`

`--bg` `#F3EFE6` · `--accent-1` `#2340FF` cobalt blue · `--accent-2` `#B9C3FF` periwinkle

Light palette: the verdict glow is a soft tinted light spill on the backdrop and the phone's edges, not neon. Shadows stay soft and short.

### Still, desktop 16:9

```text
Premium 3D product render, 16:9 wide frame. Flat seamless chalk off-white backdrop, exactly #F3EFE6, edge to edge: no vignette, no gradient, no floor line, no horizon. Phone, bar and mascot are grouped in the right half of the frame; the left 45% is empty backdrop. A generic matte black smartphone with thin bezels and no logo floats upright, tilted 10 degrees; its screen is dark with one blank rounded card shape, no interface. Just in front of the phone floats an unbranded protein bar in a plain matte silver wrapper with no print, showing only a barcode made of plain black stripes, no numerals. Beside the phone stands Chana, a small round chickpea mascot: warm beige (#E8C98F) body with a subtle pointed tip at the top, big glossy dark eyes, tiny arms, a soft terry sweatband in cobalt blue (#2340FF), soft 3D clay vinyl-toy finish, neutral relaxed pose, looking at the bar. Two large soft out-of-focus organic blurred colour shapes, one cobalt blue (#2340FF) and one periwinkle (#B9C3FF), the periwinkle blob off to one side of the group, the smaller cobalt blue blob on the opposite side, the area right around the phone left as clean backdrop; both fade out fully before the frame edges. Soft bright studio lighting: large overhead softbox key, gentle fill, short soft contact shadows. 85 mm lens look, shallow depth of field, bar and mascot sharp, blobs soft. Rest state: no scan beam, no coloured glow around the phone. No text, letters, numbers or logos anywhere.
```

### Still, mobile 9:16

```text
Premium 3D product render, 9:16 vertical frame composed for a phone screen. Flat seamless chalk off-white backdrop, exactly #F3EFE6, edge to edge: no vignette, no gradient, no floor line, no horizon. Phone, bar and mascot are grouped in the upper 55% of the frame, centred horizontally, with a little headroom; the bottom 40% is completely empty plain chalk off-white (#F3EFE6) backdrop with no objects, no blobs and no shadows. A generic matte black smartphone with thin bezels and no logo floats upright, tilted 10 degrees; its screen is dark with one blank rounded card shape, no interface. Just in front of the phone floats an unbranded protein bar in a plain matte silver wrapper with no print, showing only a barcode made of plain black stripes, no numerals. Beside the phone stands Chana, a small round chickpea mascot: warm beige (#E8C98F) body with a subtle pointed tip at the top, big glossy dark eyes, tiny arms, a soft terry sweatband in cobalt blue (#2340FF), soft 3D clay vinyl-toy finish, neutral relaxed pose, looking at the bar. Two large soft out-of-focus organic blurred colour shapes, one cobalt blue (#2340FF) and one periwinkle (#B9C3FF), the periwinkle blob off to one side of the group, the smaller cobalt blue blob on the opposite side, the area right around the phone left as clean backdrop; both fade out fully before the frame edges. Blobs stay in the upper half only. Soft bright studio lighting: large overhead softbox key, gentle fill, short soft contact shadows. 85 mm lens look, shallow depth of field, bar and mascot sharp, blobs soft. Rest state: no scan beam, no coloured glow around the phone. No text, letters, numbers or logos anywhere.
```

### Video, desktop 16:9

```text
Single shot. Camera pushes in 4 percent very slowly, then eases back to the start. 0-2 s: a thin white scan beam sweeps across the bar's barcode. 2-4 s: a soft orange (#FB923C) light spill blooms around the phone; Chana, a small round chickpea mascot: warm beige (#E8C98F) body with a subtle pointed tip at the top, big glossy dark eyes, tiny arms, a soft terry sweatband in cobalt blue (#2340FF), soft 3D clay vinyl-toy finish, tilts its head. 4-6.5 s: glow shifts to green (#22C55E); Chana hops once, happy. 6.5-8 s: glow fades, Chana settles. Cobalt blue (#2340FF) and periwinkle (#B9C3FF) blobs drift slowly and return. Backdrop stays flat chalk off-white (#F3EFE6). Shallow depth of field.
```

### Video, mobile 9:16

```text
Single shot. Camera pushes in 4 percent very slowly, then eases back to the start. 0-2 s: a thin white scan beam sweeps across the bar's barcode. 2-4 s: a soft orange (#FB923C) light spill blooms around the phone; Chana, a small round chickpea mascot: warm beige (#E8C98F) body with a subtle pointed tip at the top, big glossy dark eyes, tiny arms, a soft terry sweatband in cobalt blue (#2340FF), soft 3D clay vinyl-toy finish, tilts its head. 4-6.5 s: glow shifts to green (#22C55E); Chana hops once, happy. 6.5-8 s: glow fades, Chana settles. Cobalt blue (#2340FF) and periwinkle (#B9C3FF) blobs drift slowly and return. Bottom 40% stays empty flat chalk off-white (#F3EFE6). Shallow depth of field.
```

### Avoid (negative prompt)

```text
text, letters, numbers, captions, subtitles, UI copy, icons, logos, brand names, watermarks, real food brands, real packaging designs, phone maker logos, barcode numerals, hands, fingers, extra fingers, people, warped or bending phone, melting shapes, mascot changing shape or colour, extra limbs, mouth with teeth, fast camera, camera shake, zoom bursts, cuts, scene changes, flicker, strobing, lens flare, heavy bloom, film grain, vignette, background gradient, floor line, red or yellow glow around the phone, dark or grey backdrop, hard black shadows, neon glow, blown-out whites
```

**Model and settings:** draft on `seedance_2_5` (`omni_reference`, `draft: true`), final on `seedance_2_0` at 1080p, 8 s, `generate_audio: false`, start and end image both the `cobalt-chalk` still for that aspect ratio, Chana reference with the cobalt blue sweatband in `image_references`. Full table under "Settings" above.

## Compositing on the site

Files go in `web/public/hero/`, six per palette:

| File | Use |
| --- | --- |
| `<palette>-desktop.mp4`, `<palette>-desktop.webm` | 16:9 clip, wide viewports |
| `<palette>-mobile.mp4`, `<palette>-mobile.webm` | 9:16 clip, narrow viewports |
| `<palette>-poster-desktop.jpg`, `<palette>-poster-mobile.jpg` | poster frames |

`<palette>` is `neon-pulse`, `ultraviolet` or `cobalt-chalk`.

- **Playback:** `muted`, `loop`, `autoplay`, `playsinline`, with the poster set. List the WebM source first and the MP4 second.
- **Reduced motion:** users with `prefers-reduced-motion: reduce` get the poster image only; the video is not loaded.
- **Text stays HTML:** headline, goal toggle, verdict chip (colour plus label plus icon), reason line and the XP chip are layered on top, timed to the clip: orange at about 2-4 s, green at about 4-6.5 s.
- **Edge match:** models and compression shift colours slightly, so the backdrop will rarely be exactly `--bg`. Sample a corner pixel after compressing; if it is off, colour-correct in the ffmpeg step or feather the video's edges with a CSS `mask-image` gradient.
- **Check before shipping:** no letters or numerals anywhere in any frame, no recognisable brand or packaging, first and last frames match, file sizes under the targets.
