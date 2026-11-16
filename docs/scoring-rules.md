# Scoring rules v1

The thresholds below are starting points. Get a dietitian to check them before launch, and switch to FSSAI's front-of-pack thresholds once those are final.

## Step 1: red (any one triggers it, for every goal)

- Contains an allergen the user selected
- Conflicts with their diet (non-veg for a vegetarian, egg for a no-egg diet)
- Lists hydrogenated or partially hydrogenated oil (trans fat)
- High in two or more of: sugar > 22.5 g, saturated fat > 5 g, salt > 1.5 g per 100 g (the UK "high" traffic-light cut-offs)

## Step 2: colour by goal

| Goal | Key numbers | 🟢 Green | 🟡 Yellow | 🟠 Orange |
| --- | --- | --- | --- | --- |
| Fat loss | Protein per 100 kcal, kcal/100 g, sugar | ≥ 10 g protein/100 kcal and sugar ≤ 5 g/100 g | 5–10 g protein/100 kcal, or sugar 5–15 g | < 5 g protein/100 kcal with > 400 kcal/100 g, or sugar > 15 g |
| Muscle gain | Protein per serving, protein per 100 kcal | ≥ 15 g protein per serving or ≥ 10 g/100 kcal | 8–15 g per serving | < 8 g per serving and sugar > 15 g/100 g |
| Maintain / eat healthier | Nutri-Score-style overall score | A or B | C | D or E |
| Low-carb / keto | Net carbs per serving (carbs − fibre) | ≤ 5 g | 5–10 g | > 10 g |
| Endurance | Carbs per serving, sodium, saturated fat | ≥ 20 g carbs per serving, saturated fat ≤ 2 g | Carbs 10–20 g | < 10 g carbs with high saturated fat |

## Always shown on the result card

- One reason line, e.g. "Only 4 g protein per 100 kcal: low for your cut."
- Protein per ₹100 (from the MRP on the label or a price the user enters)
- A protein-washing flag when the pack claims "high protein" but protein is under 20% of calories
- Share of the user's daily sugar and sodium budget per serving
- Two better options in the same category, sorted for the user's goal

## Wording rule

Never call a product "dangerous". Red means "avoid for you", based on limits the user set.

## v1 decisions (prototype)

These close gaps in the rules above for the first prototype. They are implemented in `app/src/scoring/` and covered by `app/src/scoring/scoring.test.ts`. **The dietitian should review every one of them before launch.** All numbers are per 100 g unless stated.

- **D1 Order.** Red is checked first. If nothing is red, the goal rules apply.
- **D2 Red priority.** Allergen > diet > trans fat > multi-high. All flags are returned; the reason line uses the first one, and the others are added as "Also: …" notes.
- **D3 Allergens.** Red when the product's allergens overlap the user's. "May contain traces" is not red in v1.
- **D4 Diet.** Vegetarian: red if the product is non-veg or egg, or lists egg as an allergen. Eggetarian: red only for non-veg. "Any": never red. Veg/non-veg status unknown: not red, with the note "Veg/non-veg status not listed." (shown only to vegetarian and eggetarian users).
- **D5 Trans fat.** Red when the ingredients mention "hydrogenated" (any case; includes partially and fully hydrogenated).
- **D6 High cut-offs.** Strictly greater than: sugar > 22.5 g, saturated fat > 5 g, salt > 1.5 g. If salt is not listed, salt = sodium (mg) × 2.5 / 1000. A missing value is never "high". Red when 2 or more are high. Drinks use the same per-100 g cut-offs for now (known limitation).
- **D7 Protein per 100 kcal** = protein ÷ kcal × 100. Not available if either is missing or kcal < 1. Compared unrounded; shown with one decimal.
- **D8 Fat loss**, checked in order:
  1. Orange if sugar > 15 g, or protein per 100 kcal < 5 with kcal > 400.
  2. Green if protein per 100 kcal ≥ 10 and sugar ≤ 5 g.
  3. Otherwise yellow.

  Sugar of exactly 5 g can be green; exactly 15 g is yellow; exactly 400 kcal is not orange. Under 1 kcal with sugar ≤ 5 g is yellow.
- **D9 Muscle gain**, checked in order:
  1. Green if protein per serving ≥ 15 g, or protein per 100 kcal ≥ 10.
  2. Orange if protein per serving < 8 g and sugar > 15 g.
  3. Otherwise yellow.
- **D10 Serving size.** If unknown, a serving is treated as 100 g, the result is marked "serving assumed", and the reason line says "per 100 g". Protein per serving = protein × serving (g) ÷ 100.
- **D11 Missing data.** Fat loss needs kcal, protein and sugar; muscle gain needs protein and sugar (kcal optional). A condition that needs a missing value counts as false. If orange or green still fires, that colour is returned. Otherwise, if any required value is missing, the result is "Not enough data" and the missing values are listed. Red checks still run on partial data.
- **D12 Protein per ₹100** = protein × pack size (g) ÷ 100 ÷ price × 100. Not shown without both price and pack size.
- **D13 Protein-washing.** Flagged when the name or claims mention protein ("high protein", "protein rich", "rich in protein", or the word "protein") and protein gives under 20% of calories (protein × 4 ÷ kcal < 0.20). Not flagged if protein or kcal is missing. It never changes the colour; it adds a note.
- **D14 Wording.** Headlines: red "Avoid for you", green "Fits your goal", yellow "Fine in moderation", orange "Works against your goal", missing data "Not enough data". One specific reason line, e.g. "Only 4.2 g protein per 100 kcal: low for your cut.", "Contains peanut, which you chose to avoid.", "Lists hydrogenated oil (a source of trans fat).", "High in sugar and saturated fat." Fat loss is called "your cut" and muscle gain "your bulk". No line makes a medical claim. All strings live in `app/src/scoring/reasons.ts`.
