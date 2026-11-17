# Reference stills for Gemini (Flow)

Exported from the site by `npm run export:stills` (in `web/`, with `npx vite preview --port 4173` running after `npm run build`). Palette folders: `bubblegum`, `cobalt-punch`, `night-shift`, `ube-chai`, `ink-lilac`.

| File | Size | What it is | Use for (docs/gemini-paste-prompts.md) |
| --- | --- | --- | --- |
| `<palette>/chana-ref.png` | 2048x2048 | Idle Chana, centred, full body | Step 1 reference image |
| `<palette>/desktop-still.png` | 1920x1080 | Phone, bar, Chana, 3 stickers, left 45% empty | Steps 2-3: start AND end frame |
| `<palette>/mobile-still.png` | 1080x1920 | Same cast, bottom 40% empty | Steps 4-5: start and end frame |
| `<palette>/social-still.png` | 1080x1920 | Same cast grouped in the central square | Steps 6-7: start and end frame |
| `moods/chana-<mood>.png` | 1024x1024, transparent | One per mood (bubblegum), for character references | Optional extra references |

These replace Steps 1, 2, 4 and 6 — skip generating stills; upload these directly. Exported from the site, so colours are exact and there is no watermark.
