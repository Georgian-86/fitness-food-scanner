// Step 2: colour by goal (D8–D11). Only called when the product is not red.
import type { Colour, Goal, Nutrients100g, Product } from './types';
import { num, proteinPer100Kcal, proteinPerServingG, servingG } from './metrics';
import { fatLoss, missingReason, muscleGain } from './reasons';

export interface GoalResult {
  colour: Exclude<Colour, 'red'>;
  reason: string;
}

export const REQUIRED_FIELDS: Record<Goal, (keyof Nutrients100g)[]> = {
  fat_loss: ['energyKcal', 'proteinG', 'sugarG'],
  muscle_gain: ['proteinG', 'sugarG'],
};

/** Required fields for the goal that are missing (D11). */
export function missingFor(goal: Goal, n: Nutrients100g): (keyof Nutrients100g)[] {
  return REQUIRED_FIELDS[goal].filter((k) => num(n[k]) === undefined);
}

export function scoreFatLoss(p: Product): GoalResult {
  const n = p.nutrients;
  const sugar = num(n.sugarG);
  const kcal = num(n.energyKcal);
  const p100 = proteinPer100Kcal(n);

  // (1) orange
  if (sugar !== undefined && sugar > 15) return { colour: 'orange', reason: fatLoss.highSugar(sugar) };
  if (p100 !== null && kcal !== undefined && p100 < 5 && kcal > 400) {
    return { colour: 'orange', reason: fatLoss.lowProteinHighKcal(p100, kcal) };
  }
  // (2) green
  if (p100 !== null && p100 >= 10 && sugar !== undefined && sugar <= 5) {
    return { colour: 'green', reason: fatLoss.green(p100) };
  }
  // missing data → unknown
  const missing = missingFor('fat_loss', n);
  if (missing.length > 0) return { colour: 'unknown', reason: missingReason(missing, 'fat_loss') };
  // (3) yellow
  if (sugar !== undefined && sugar > 5) return { colour: 'yellow', reason: fatLoss.yellowSugar(sugar) };
  if (p100 !== null) return { colour: 'yellow', reason: fatLoss.yellowProtein(p100) };
  return { colour: 'yellow', reason: fatLoss.yellowNoCalories() };
}

export function scoreMuscleGain(p: Product): GoalResult {
  const n = p.nutrients;
  const sugar = num(n.sugarG);
  const p100 = proteinPer100Kcal(n);
  const perServing = proteinPerServingG(p);
  const { grams, assumed } = servingG(p);

  // (1) green
  if (perServing !== null && perServing >= 15) {
    return { colour: 'green', reason: muscleGain.greenServing(perServing, grams, assumed) };
  }
  if (p100 !== null && p100 >= 10) return { colour: 'green', reason: muscleGain.greenPer100Kcal(p100) };
  // (2) orange
  if (perServing !== null && perServing < 8 && sugar !== undefined && sugar > 15) {
    return { colour: 'orange', reason: muscleGain.orange(perServing, grams, assumed, sugar) };
  }
  // missing data → unknown
  const missing = missingFor('muscle_gain', n);
  if (missing.length > 0 || perServing === null) {
    return { colour: 'unknown', reason: missingReason(missing, 'muscle_gain') };
  }
  // (3) yellow
  return { colour: 'yellow', reason: muscleGain.yellow(perServing, grams, assumed) };
}

export function scoreGoal(goal: Goal, p: Product): GoalResult {
  return goal === 'fat_loss' ? scoreFatLoss(p) : scoreMuscleGain(p);
}
