// The demo product from docs/brand.md, checked against docs/scoring-rules.md.
// Unbranded protein bar, 60 g, ₹60. Per 100 g: 400 kcal, 25 g protein, 18 g sugar, 4 g sat fat, 0.6 g salt.
export const DEMO_BAR = {
  name: 'Protein bar',
  grams: 60,
  priceRs: 60,
  per100: { kcal: 400, protein: 25, sugar: 18, satFat: 4, salt: 0.6 },
  proteinPerBar: 15,
  proteinPerRs100: 25,
  cut: { verdict: 'orange', reason: '18 g sugar per 100 g: high for your cut.' },
  bulk: { verdict: 'green', reason: '15 g protein per bar: fits your bulk.' },
} as const
