# Project context for Claude

- **Owner:** Golu Kumar (GitHub: Georgian-86), a B.Tech CS student building this as a product idea.
- **Product:** a barcode food scanner for fitness people in India that colour-codes products against the user's saved goal (green / yellow / orange / red).
- **Source of truth for logic:** `docs/scoring-rules.md`. Keep it in sync whenever the scoring code changes.
- **Strategy and competitors:** `docs/research.md`.
- **Data:** Open Food Facts API first; OCR of the nutrition label when the barcode isn't found. Indian coverage is thin, so every miss should become a saved product.
- **Wording:** never call a product "dangerous". Red = "avoid for you". Make no medical claims.
- **MVP scope:** fat-loss and muscle-gain goals only, Android first (Android is about 72% of India's fitness-app market).

## How to work in this repo: plan here, build in subagents

The main session plans and reviews; subagents write the code. The owner asked for this to keep the most capable model on planning only.

- For any task that changes more than a few lines, write the plan in the main session, then delegate the implementation with the Agent tool: `builder` (Sonnet) for routine, well-specified work, `senior-builder` (Opus) for work with tricky logic or open design decisions. Both are defined in `.claude/agents/`.
- Give each subagent a self-contained brief: the goal, the files involved, the constraints, and what done looks like. Run independent tasks in parallel.
- Review what comes back, run the checks yourself, then commit. Subagents do not commit.
- Small edits (a typo, a one-line fix, a doc tweak) are done directly; delegating them costs more than it saves.

## Marketing site

- The landing page lives in `web/` (Vite + React + TypeScript, Tailwind, GSAP ScrollTrigger + Lenis, Motion). Brand rules, palettes and trust rules are in `docs/brand.md`; the mascot is documented in `docs/mascot.md`.
- Palette: one line in `web/src/palette.ts` (`DEFAULT_PALETTE`), overridable with `?palette=`. `?clean=1` hides the preview palette switcher; `?view=mascot` shows the mascot gallery.
- Never invent social proof (user counts, ratings, testimonials, logos). Pricing in `web/src/content/pricing.ts` is a draft.
- Signups post to `VITE_SIGNUP_ENDPOINT`; until it is set the form says signups aren't live.
- Scroll animation: transform and opacity only, no React state per frame, one journey timeline that ends at max scroll.
- When adding React Bits components, add the registry to a `components.json` first so the shadcn MCP server in `.mcp.json` can find them: `"registries": { "@react-bits": "https://reactbits.dev/r/{name}.json" }`.
