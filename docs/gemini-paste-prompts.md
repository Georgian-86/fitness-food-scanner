# Gemini prompts: copy and paste

Palette: **bubblegum**. Paste each box exactly as it is, one box per generation, in this order.
Tool: **Flow** (flow.google.com). Image model for stills: **Nano Banana 2.1**. Video model: **Omni Flash 1.2**, length **8 s**.
To use another palette, see section 4 of `docs/hero-video-prompts.md`.

## Step 1: Chana reference image

Image, aspect ratio **1:1**. Save the result as `chana-ref.png`.

```text
Flat 2D vector illustration in neobrutalist sticker style. One character, full body, front view, centred, on a plain flat warm cream (#FFF4E6) background with nothing else in frame.

Chana, a small round chickpea mascot: flat beige (#E8C98F) body with one flat darker crescent (#D2AE6E) along the lower right, a small pointed chickpea tip on top with a short crease, solid dark-ink oval eyes (always #0A0A0A) each with one square white catchlight, short bold straight brows, a cheeky half-smile, two small light-pink blush marks, stubby arms and feet, and a sweatband in hot magenta (#FF4FD8) with a knot and two short tails on one side. Relaxed standing pose.

Thick uniform black (#0A0A0A) outline on every shape. A hard offset drop shadow in solid black (#0A0A0A): the body silhouette shifted down and to the right, zero blur. Solid flat fills only. No gradients, no shading, no highlights, no glow, no texture, no 3D, no clay or vinyl look. No text, letters, numbers or logos.
```

## Step 2: Desktop style frame (still)

Image, aspect ratio **16:9**. Attach `chana-ref.png` as a reference. Save as `desktop-still.png`.

```text
Flat 2D vector illustration in neobrutalist sticker style, like cut-paper stickers laid on a desk. Every shape has a solid flat fill, a thick uniform black (#0A0A0A) outline, and a hard offset drop shadow in solid black (#0A0A0A) shifted down and to the right with zero blur. No gradients, no soft shadows, no glow, no texture, no perspective, no 3D. Background: one flat, even, empty field of warm cream (#FFF4E6), edge to edge.

The cast, all drawn in this same style:
1. PHONE CARD: an upright rounded rectangle with a white (#FFFFFF) face, tilted 3 degrees. Inside it, at the top, a square viewfinder marked by four chunky corner brackets; below it one wide rounded blank panel in white (#FFFFFF) with the same outline.
2. BAR: an unbranded protein-bar wrapper, pale grey with crimped zigzag ends, a violet (#6B5BFF) band holding one blank white star burst, and a white label with plain black barcode stripes of varying width. Tilted minus 4 degrees.
3. CHANA: a small round chickpea mascot. Flat beige (#E8C98F) body with one flat darker crescent (#D2AE6E) along the lower right, a small pointed chickpea tip on top, solid dark-ink oval eyes (always #0A0A0A) each with one square white catchlight, short bold brows, a cheeky half-smile, two small light-pink blush marks, stubby arms and feet, and a sweatband in hot magenta (#FF4FD8) with a knot and two short tails. Standing relaxed.
4. STICKERS: three small chunky shapes: an eight-point star burst in violet (#6B5BFF), a blank tilted rectangular label in hot magenta (#FF4FD8), and a blank pill in sky blue (#9BE7FF).

Use only the colours named above. No yellow, no red, no orange, no green, no lime, no mint anywhere. Absolutely no text, letters, numbers, symbols, logos, brand names or watermarks: every label and panel is blank.

Draw Chana exactly as in the attached reference image.

Composition: wide 16:9 frame. The left 45% of the frame is completely empty background: no shapes, no shadows. The whole cast sits in the right 55%, inside the middle 70% of the frame's height. The PHONE CARD is centred about 70% of the way across. The BAR rests at the phone's lower left, overlapping its bottom-left corner. CHANA stands at the phone's right side, about one third of the phone's height, feet level with the phone's bottom edge. The three STICKERS are small and sit near the phone's top-left corner, top-right corner and bottom-right corner; none crosses into the left 45%. Clear background margin along the top, bottom and right edges.
```

## Step 3: Desktop video

Video → **Frames**. Start frame: `desktop-still.png`. End frame: the **same** `desktop-still.png`. Aspect ratio **16:9**, 8 s. Draft at 360p first, then 720p.

```text
Animate this exact illustration as a flat 2D motion graphic, like cut-paper stickers: snappy moves that ease out, overshoot and settle, with squash and stretch, at smooth 24 fps. Locked camera, flat even lighting. Fills, outlines and hard shadows stay exactly as drawn. The left 45% of the frame stays empty and still throughout.
[0-1s] The bar slides up to the phone's viewfinder and settles with a small bounce.
[1-2.5s] A chunky translucent sky blue (#9BE7FF) beam sweeps across the barcode and back.
[2.5-4s] The phone's blank panel flips like a card to flat orange (#FB923C). Chana side-eyes it, one brow raised.
[4-6s] The panel flips to flat green (#22C55E). Chana squashes, hops with both arms up and lands with a bounce; the three stickers bounce once.
[6-8s] The panel flips back to blank, the bar slides back, and everything returns to its exact starting position and holds still.

No dialogue. No music. No sound effects. Completely silent. No text, letters, numbers, logos or labels appear at any time. Do not add any new object or character. No camera movement, no zoom, no cuts. No 3D, no depth of field, no motion blur, no gradients, no glow, no soft shadows, no photorealism, no clay or plastic look. Orange and green appear only on the phone's panel. No yellow, red, lime or mint anywhere.
```

## Step 4: Mobile style frame (still)

Image, aspect ratio **9:16**. Attach `chana-ref.png`. Save as `mobile-still.png`.

```text
Flat 2D vector illustration in neobrutalist sticker style, like cut-paper stickers laid on a desk. Every shape has a solid flat fill, a thick uniform black (#0A0A0A) outline, and a hard offset drop shadow in solid black (#0A0A0A) shifted down and to the right with zero blur. No gradients, no soft shadows, no glow, no texture, no perspective, no 3D. Background: one flat, even, empty field of warm cream (#FFF4E6), edge to edge.

The cast, all drawn in this same style:
1. PHONE CARD: an upright rounded rectangle with a white (#FFFFFF) face, tilted 3 degrees. Inside it, at the top, a square viewfinder marked by four chunky corner brackets; below it one wide rounded blank panel in white (#FFFFFF) with the same outline.
2. BAR: an unbranded protein-bar wrapper, pale grey with crimped zigzag ends, a violet (#6B5BFF) band holding one blank white star burst, and a white label with plain black barcode stripes of varying width. Tilted minus 4 degrees.
3. CHANA: a small round chickpea mascot. Flat beige (#E8C98F) body with one flat darker crescent (#D2AE6E) along the lower right, a small pointed chickpea tip on top, solid dark-ink oval eyes (always #0A0A0A) each with one square white catchlight, short bold brows, a cheeky half-smile, two small light-pink blush marks, stubby arms and feet, and a sweatband in hot magenta (#FF4FD8) with a knot and two short tails. Standing relaxed.
4. STICKERS: three small chunky shapes: an eight-point star burst in violet (#6B5BFF), a blank tilted rectangular label in hot magenta (#FF4FD8), and a blank pill in sky blue (#9BE7FF).

Use only the colours named above. No yellow, no red, no orange, no green, no lime, no mint anywhere. Absolutely no text, letters, numbers, symbols, logos, brand names or watermarks: every label and panel is blank.

Draw Chana exactly as in the attached reference image.

Composition: tall 9:16 frame. The bottom 40% of the frame is completely empty background: no shapes, no shadows. The whole cast sits in the upper 55%, with a clear margin at the top and sides. The PHONE CARD is centred horizontally, its centre about 30% of the way down the frame. The BAR rests at the phone's lower left, overlapping its bottom-left corner. CHANA stands at the phone's lower right, about one third of the phone's height, feet level with the phone's bottom edge. The three STICKERS are small and sit near the phone's top-left corner, top-right corner and left side; none drops into the bottom 40%.
```

## Step 5: Mobile video

Video → **Frames**. Start and end frame: `mobile-still.png`. Aspect ratio **9:16**, 8 s.

```text
Animate this exact illustration as a flat 2D motion graphic, like cut-paper stickers: snappy moves that ease out, overshoot and settle, with squash and stretch, at smooth 24 fps. Locked camera, flat even lighting. Fills, outlines and hard shadows stay exactly as drawn. The bottom 40% of the frame stays empty and still throughout.
[0-1s] The bar slides up to the phone's viewfinder and settles with a small bounce.
[1-2.5s] A chunky translucent sky blue (#9BE7FF) beam sweeps across the barcode and back.
[2.5-4s] The phone's blank panel flips like a card to flat orange (#FB923C). Chana side-eyes it, one brow raised.
[4-6s] The panel flips to flat green (#22C55E). Chana squashes, hops with both arms up and lands with a bounce; the three stickers bounce once.
[6-8s] The panel flips back to blank, the bar slides back, and everything returns to its exact starting position and holds still.

No dialogue. No music. No sound effects. Completely silent. No text, letters, numbers, logos or labels appear at any time. Do not add any new object or character. No camera movement, no zoom, no cuts. No 3D, no depth of field, no motion blur, no gradients, no glow, no soft shadows, no photorealism, no clay or plastic look. Orange and green appear only on the phone's panel. No yellow, red, lime or mint anywhere.
```

## Step 6: Social style frame (still), for Reels, Shorts, Stories, 1:1 and 4:5

Image, aspect ratio **9:16**. Attach `chana-ref.png`. Save as `social-still.png`.

```text
Flat 2D vector illustration in neobrutalist sticker style, like cut-paper stickers laid on a desk. Every shape has a solid flat fill, a thick uniform black (#0A0A0A) outline, and a hard offset drop shadow in solid black (#0A0A0A) shifted down and to the right with zero blur. No gradients, no soft shadows, no glow, no texture, no perspective, no 3D. Background: one flat, even, empty field of warm cream (#FFF4E6), edge to edge.

The cast, all drawn in this same style:
1. PHONE CARD: an upright rounded rectangle with a white (#FFFFFF) face, tilted 3 degrees. Inside it, at the top, a square viewfinder marked by four chunky corner brackets; below it one wide rounded blank panel in white (#FFFFFF) with the same outline.
2. BAR: an unbranded protein-bar wrapper, pale grey with crimped zigzag ends, a violet (#6B5BFF) band holding one blank white star burst, and a white label with plain black barcode stripes of varying width. Tilted minus 4 degrees.
3. CHANA: a small round chickpea mascot. Flat beige (#E8C98F) body with one flat darker crescent (#D2AE6E) along the lower right, a small pointed chickpea tip on top, solid dark-ink oval eyes (always #0A0A0A) each with one square white catchlight, short bold brows, a cheeky half-smile, two small light-pink blush marks, stubby arms and feet, and a sweatband in hot magenta (#FF4FD8) with a knot and two short tails. Standing relaxed.
4. STICKERS: three small chunky shapes: an eight-point star burst in violet (#6B5BFF), a blank tilted rectangular label in hot magenta (#FF4FD8), and a blank pill in sky blue (#9BE7FF).

Use only the colours named above. No yellow, no red, no orange, no green, no lime, no mint anywhere. Absolutely no text, letters, numbers, symbols, logos, brand names or watermarks: every label and panel is blank.

Draw Chana exactly as in the attached reference image.

Composition: tall 9:16 frame. The whole cast is grouped tightly in the centre of the frame, inside the middle 50% of the height and the middle 70% of the width, with the PHONE CARD in the middle, the BAR at its lower left, CHANA at its lower right and the three STICKERS close around it. The top 25% and the bottom 25% of the frame are empty background, and so is a 15% strip down the left and right edges. The background carries a very faint grid-paper pattern of thin lines only slightly different in tone from the background.
```

## Step 7: Social video

Video → **Frames**. Start and end frame: `social-still.png`. Aspect ratio **9:16**, 8 s.

```text
Animate this exact illustration as a flat 2D motion graphic, like cut-paper stickers: snappy moves that ease out, overshoot and settle, with squash and stretch, at smooth 24 fps. Locked camera, flat even lighting. Fills, outlines and hard shadows stay exactly as drawn. All motion stays inside the frame's central square; nothing else moves.
[0-1s] The bar slides up to the phone's viewfinder and settles with a small bounce.
[1-2.5s] A chunky translucent sky blue (#9BE7FF) beam sweeps across the barcode and back.
[2.5-4s] The phone's blank panel flips like a card to flat orange (#FB923C). Chana side-eyes it, one brow raised.
[4-6s] The panel flips to flat green (#22C55E). Chana squashes, hops with both arms up and lands with a bounce; the three stickers bounce once.
[6-8s] The panel flips back to blank, the bar slides back, and everything returns to its exact starting position and holds still.

No dialogue. No music. No sound effects. Completely silent. No text, letters, numbers, logos or labels appear at any time. Do not add any new object or character. No camera movement, no zoom, no cuts. No 3D, no depth of field, no motion blur, no gradients, no glow, no soft shadows, no photorealism, no clay or plastic look. Orange and green appear only on the phone's panel. No yellow, red, lime or mint anywhere.
```

## If something goes wrong

- **Clip barely moves:** remove the end frame, keep only the start frame, and generate again.
- **Looks 3D, glossy or off-style:** switch the video model to **Veo 3.1 Lite** with the same frames and prompt.
- **Letters or yellow/red/green shapes appear:** generate again; don't use that clip.
- After generating, follow section 5 of `docs/hero-video-prompts.md` to remove audio, smooth the loop and export, or send me the files and I'll do it.
