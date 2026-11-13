# Project context for Claude

- **Owner:** Golu Kumar (GitHub: Georgian-86), a B.Tech CS student building this as a product idea.
- **Product:** a barcode food scanner for fitness people in India that colour-codes products against the user's saved goal (green / yellow / orange / red).
- **Source of truth for logic:** `docs/scoring-rules.md`. Keep it in sync whenever the scoring code changes.
- **Strategy and competitors:** `docs/strategy.md` (decisions), `docs/research.md` (competitor summary), `reports/` (full sourced research).
- **Data:** Open Food Facts API first; OCR of the nutrition label when the barcode isn't found. Indian coverage is thin, so every miss should become a saved product.
- **Wording:** never call a product "dangerous". Red = "avoid for you". Make no medical claims.
- **MVP scope:** fat-loss and muscle-gain goals only, Android first (Android is about 72% of India's fitness-app market).
