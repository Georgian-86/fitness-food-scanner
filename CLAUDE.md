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

## Marketing site and hero section

- No web app exists yet. When one is scaffolded, add the React Bits registry to its `components.json` so the shadcn MCP server in `.mcp.json` can find the components: `"registries": { "@react-bits": "https://reactbits.dev/r/{name}.json" }`.
- Take React Bits components from the registry, not from memory.
- Hero video: no real brand packaging and no text baked into the video (headline and verdict labels are HTML on top). Ship it muted, looping, with a poster image and a `prefers-reduced-motion` fallback.
