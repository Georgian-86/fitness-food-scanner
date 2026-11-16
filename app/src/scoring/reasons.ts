// Every user-facing string the scoring core produces (D14).
// Rules: never say "dangerous"; no medical claims. Red = "avoid for you".
import type { Allergen, Colour, Diet, Goal, Nutrients100g, Product, RedFlag } from './types';

export const HEADLINES: Record<Colour, string> = {
  red: 'Avoid for you',
  green: 'Fits your goal',
  yellow: 'Fine in moderation',
  orange: 'Works against your goal',
  unknown: 'Not enough data',
};

const ALLERGEN_NAMES: Record<Allergen, string> = {
  milk: 'milk',
  egg: 'egg',
  peanut: 'peanut',
  tree_nut: 'tree nuts',
  soy: 'soy',
  gluten: 'gluten',
  sesame: 'sesame',
  fish: 'fish',
  shellfish: 'shellfish',
  mustard: 'mustard',
};

const NUTRIENT_NAMES: Record<'sugar' | 'sat_fat' | 'salt', string> = {
  sugar: 'sugar',
  sat_fat: 'saturated fat',
  salt: 'salt',
};

const FIELD_NAMES: Record<keyof Nutrients100g, string> = {
  energyKcal: 'calories',
  proteinG: 'protein',
  sugarG: 'sugar',
  satFatG: 'saturated fat',
  saltG: 'salt',
  sodiumMg: 'sodium',
  carbsG: 'carbs',
  fatG: 'fat',
  fibreG: 'fibre',
};

const DIET_NAMES: Record<Diet, string> = {
  any: 'chosen',
  eggetarian: 'eggetarian',
  vegetarian: 'vegetarian',
};

/** "cut" for fat loss, "bulk" for muscle gain. */
export function goalWord(g: Goal): string {
  return g === 'fat_loss' ? 'cut' : 'bulk';
}

/** One decimal, e.g. 4.2. */
export function oneDp(n: number): string {
  return n.toFixed(1);
}

/** Up to one decimal, trailing ".0" dropped, e.g. 18 or 22.5. */
export function grams(n: number): string {
  return String(Number(n.toFixed(1)));
}

/** "a", "a and b", "a, b and c". */
export function joinList(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function redReason(flag: RedFlag, p: Product, diet: Diet): string {
  switch (flag.kind) {
    case 'allergen':
      return `Contains ${ALLERGEN_NAMES[flag.allergen]}, which you chose to avoid.`;
    case 'diet': {
      const what = p.dietType === 'non_veg' ? 'Non-vegetarian' : 'Contains egg';
      return `${what}, which doesn't fit your ${DIET_NAMES[diet]} diet.`;
    }
    case 'trans_fat':
      return 'Lists hydrogenated oil (a source of trans fat).';
    case 'multi_high':
      return `${capitalise(`high in ${joinList(flag.nutrients.map((n) => NUTRIENT_NAMES[n]))}`)}.`;
  }
}

export function missingReason(missing: (keyof Nutrients100g)[], g: Goal): string {
  const names = joinList(missing.map((m) => FIELD_NAMES[m]));
  return `The label doesn't list ${names}, so we can't rate this for your ${goalWord(g)}.`;
}

// ---- Fat loss (D8) ----
export const fatLoss = {
  highSugar: (sugar: number) => `${grams(sugar)} g sugar per 100 g: high for your cut.`,
  lowProteinHighKcal: (p100: number, kcal: number) =>
    `Only ${oneDp(p100)} g protein per 100 kcal at ${grams(kcal)} kcal per 100 g: low for your cut.`,
  green: (p100: number) => `${oneDp(p100)} g protein per 100 kcal with little sugar: good for your cut.`,
  yellowSugar: (sugar: number) => `${grams(sugar)} g sugar per 100 g: fine for your cut in small amounts.`,
  yellowProtein: (p100: number) =>
    p100 < 5
      ? `Only ${oneDp(p100)} g protein per 100 kcal: keep portions small on your cut.`
      : `${oneDp(p100)} g protein per 100 kcal: fine for your cut in small amounts.`,
  yellowNoCalories: () => 'Almost no calories: fine for your cut in small amounts.',
};

// ---- Muscle gain (D9) ----
function servingLabel(servingG: number, assumed: boolean): string {
  return assumed ? 'per 100 g' : `per ${grams(servingG)} g serving`;
}

export const muscleGain = {
  greenServing: (perServing: number, servingG: number, assumed: boolean) =>
    `${oneDp(perServing)} g protein ${servingLabel(servingG, assumed)}: good for your bulk.`,
  greenPer100Kcal: (p100: number) => `${oneDp(p100)} g protein per 100 kcal: good for your bulk.`,
  orange: (perServing: number, servingG: number, assumed: boolean, sugar: number) =>
    `Only ${oneDp(perServing)} g protein ${servingLabel(servingG, assumed)} and ${grams(sugar)} g sugar per 100 g: low for your bulk.`,
  yellow: (perServing: number, servingG: number, assumed: boolean) =>
    `${oneDp(perServing)} g protein ${servingLabel(servingG, assumed)}: fine for your bulk in small amounts.`,
};

// ---- Notes ----
export const NOTES = {
  dietUnknown: 'Veg/non-veg status not listed.',
  proteinWashing: 'The pack talks up protein, but protein is under 20% of its calories.',
  servingAssumed: 'Serving size not listed, so numbers are per 100 g.',
  alsoRed: (reason: string) => `Also: ${reason}`,
};
