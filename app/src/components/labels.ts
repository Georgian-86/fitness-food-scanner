import type { Allergen, Colour, Diet, DietType, Goal, Nutrients100g } from '../scoring';
import type { LookupSource } from '../data/lookup';

export const GOAL_LABELS: Record<Goal, { title: string; hint: string }> = {
  fat_loss: { title: 'Fat loss', hint: 'Cutting: more protein per calorie, less sugar' },
  muscle_gain: { title: 'Muscle gain', hint: 'Bulking: enough protein in every serving' },
};

export const DIET_LABELS: Record<Diet, string> = {
  any: 'Eat everything',
  eggetarian: 'Eggetarian (veg + egg)',
  vegetarian: 'Vegetarian (no meat, no egg)',
};

export const DIET_TYPE_LABELS: Record<DietType, string> = {
  veg: 'Veg',
  egg: 'Contains egg',
  non_veg: 'Non-veg',
  unknown: 'Not stated',
};

export const ALLERGEN_LABELS: Record<Allergen, string> = {
  milk: 'Milk',
  egg: 'Egg',
  peanut: 'Peanut',
  tree_nut: 'Tree nuts',
  soy: 'Soy',
  gluten: 'Gluten',
  sesame: 'Sesame',
  fish: 'Fish',
  shellfish: 'Shellfish',
  mustard: 'Mustard',
};

export const ALL_ALLERGENS = Object.keys(ALLERGEN_LABELS) as Allergen[];

export const NUTRIENT_LABELS: Record<keyof Nutrients100g, string> = {
  energyKcal: 'Energy (kcal)',
  proteinG: 'Protein (g)',
  sugarG: 'Sugar (g)',
  satFatG: 'Saturated fat (g)',
  saltG: 'Salt (g)',
  sodiumMg: 'Sodium (mg)',
  carbsG: 'Carbohydrate (g)',
  fatG: 'Total fat (g)',
  fibreG: 'Fibre (g)',
};

/** Non-colour signal shown next to the headline. */
export const COLOUR_ICON: Record<Colour, string> = {
  green: '✓',
  yellow: '~',
  orange: '!',
  red: '✕',
  unknown: '?',
};

export const SOURCE_LABELS: Record<LookupSource | 'manual', string> = {
  saved: 'Saved on this phone',
  off: 'Open Food Facts',
  fixture: 'Built-in demo product',
  manual: 'Entered by you from the label',
};

export function fmt(n: number | null | undefined, dp = 1): string {
  if (n == null || !Number.isFinite(n)) return '—';
  return Number.isInteger(n) ? String(n) : n.toFixed(dp);
}
