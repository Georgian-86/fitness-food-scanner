// Step 1: red checks (D1–D6). Applies to every goal.
import type { Product, RedFlag, UserProfile } from './types';
import { num, saltG } from './metrics';

export const HIGH_SUGAR_G = 22.5;
export const HIGH_SAT_FAT_G = 5;
export const HIGH_SALT_G = 1.5;

/** Lists hydrogenated oil (D5). Case-insensitive; includes partially / fully hydrogenated. */
export function hasHydrogenatedOil(ingredientsText?: string): boolean {
  return typeof ingredientsText === 'string' && /hydrogenated/i.test(ingredientsText);
}

/** Nutrients above the "high" cut-offs (strictly greater, per 100 g). Missing = not high (D6). */
export function highNutrients(p: Product): ('sugar' | 'sat_fat' | 'salt')[] {
  const out: ('sugar' | 'sat_fat' | 'salt')[] = [];
  const sugar = num(p.nutrients.sugarG);
  const sat = num(p.nutrients.satFatG);
  const salt = saltG(p.nutrients);
  if (sugar !== undefined && sugar > HIGH_SUGAR_G) out.push('sugar');
  if (sat !== undefined && sat > HIGH_SAT_FAT_G) out.push('sat_fat');
  if (salt !== undefined && salt > HIGH_SALT_G) out.push('salt');
  return out;
}

function conflictsWithDiet(p: Product, u: UserProfile): boolean {
  switch (u.diet) {
    case 'vegetarian':
      return p.dietType === 'non_veg' || p.dietType === 'egg' || p.allergens.includes('egg');
    case 'eggetarian':
      return p.dietType === 'non_veg';
    default:
      return false;
  }
}

/** All red flags, in priority order: allergen > diet > trans fat > multi-high (D2). */
export function checkRed(p: Product, u: UserProfile): RedFlag[] {
  const flags: RedFlag[] = [];
  for (const a of new Set(p.allergens)) {
    if (u.allergens.includes(a)) flags.push({ kind: 'allergen', allergen: a });
  }
  if (conflictsWithDiet(p, u)) flags.push({ kind: 'diet' });
  if (hasHydrogenatedOil(p.ingredientsText)) flags.push({ kind: 'trans_fat' });
  const high = highNutrients(p);
  if (high.length >= 2) flags.push({ kind: 'multi_high', nutrients: high });
  return flags;
}
