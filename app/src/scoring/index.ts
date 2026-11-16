// Scoring core public API. Pure TypeScript: imports nothing outside this folder.
// Rules: docs/scoring-rules.md (D1–D14).
import type { Product, UserProfile, Verdict } from './types';
import { checkRed } from './red';
import { missingFor, scoreGoal } from './goals';
import { proteinPer100Inr, proteinPer100Kcal, proteinPerServingG, servingG, isProteinWashing } from './metrics';
import { HEADLINES, NOTES, redReason } from './reasons';

export * from './types';
export { checkRed, hasHydrogenatedOil } from './red';
export { proteinPer100Kcal, proteinPer100Inr, isProteinWashing, saltG } from './metrics';

export function scoreProduct(p: Product, u: UserProfile): Verdict {
  const redFlags = checkRed(p, u);
  const washing = isProteinWashing(p);
  const serving = servingG(p);
  const notes: string[] = [];

  let colour: Verdict['colour'];
  let reason: string;

  // D1: red first.
  if (redFlags.length > 0) {
    colour = 'red';
    reason = redReason(redFlags[0], p, u.diet);
    for (const f of redFlags.slice(1)) notes.push(NOTES.alsoRed(redReason(f, p, u.diet)));
  } else {
    const g = scoreGoal(u.goal, p);
    colour = g.colour;
    reason = g.reason;
  }

  if (p.dietType === 'unknown' && u.diet !== 'any') notes.push(NOTES.dietUnknown);
  if (washing) notes.push(NOTES.proteinWashing);
  if (serving.assumed && u.goal === 'muscle_gain') notes.push(NOTES.servingAssumed);

  return {
    colour,
    headline: HEADLINES[colour],
    reason,
    redFlags,
    proteinPer100Kcal: proteinPer100Kcal(p.nutrients),
    proteinPerServingG: proteinPerServingG(p),
    proteinPer100Inr: proteinPer100Inr(p),
    proteinWashing: washing,
    servingAssumed: serving.assumed,
    missing: missingFor(u.goal, p.nutrients),
    notes,
  };
}
