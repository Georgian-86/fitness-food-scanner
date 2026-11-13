# Fitness Food Scanner

Scan a packaged food's barcode and get a colour verdict against **your** saved fitness goal: the same product can be green for a bulk and orange for a cut.

## Status

Idea / research stage. No code yet.

## Core idea

- **Scan:** barcode → product lookup (Open Food Facts first), with OCR of the nutrition label as a fallback when the barcode isn't found.
- **Score:** hard limits (allergens, diet conflicts, trans fat, multiple "high" nutrients) decide red; then the user's goal decides green / yellow / orange.
- **Explain:** a one-line reason, protein per ₹100, a "protein-washing" flag, and two better options in the same category.

| Colour | Meaning |
| --- | --- |
| 🟢 Green | Fits your goal |
| 🟡 Yellow | Fine in moderation |
| 🟠 Orange | Works against your goal |
| 🔴 Red | Avoid: hits a limit you set |

## Docs

- [Competitor research and strategy](docs/research.md)
- [Scoring rules v1](docs/scoring-rules.md)
- Full research doc: https://claude.ai/artifact/MkrPxtDXtdKmz7SK7eiHLr

## MVP scope

1. Barcode scan with on-device decoding
2. Open Food Facts lookup plus an OCR label fallback that saves new products
3. Goal setup for **fat loss** and **muscle gain** only
4. Result card: colour, reason line, protein per ₹100
5. Pilot with one gym (about 50 members) for four weeks
