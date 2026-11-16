// Pure number helpers for the scoring core. No imports outside this folder.
import type { Nutrients100g, Product } from './types';

/** A usable number, or undefined for missing / NaN / Infinity. */
export function num(x: number | undefined): number | undefined {
  return typeof x === 'number' && Number.isFinite(x) ? x : undefined;
}

/** Salt in g/100 g. Falls back to sodium (mg) × 2.5 / 1000 when salt is not listed (D6). */
export function saltG(n: Nutrients100g): number | undefined {
  const salt = num(n.saltG);
  if (salt !== undefined) return salt;
  const sodium = num(n.sodiumMg);
  if (sodium !== undefined) return (sodium * 2.5) / 1000;
  return undefined;
}

/** Protein per 100 kcal, unrounded (D7). Null if protein or kcal is missing, or kcal < 1. */
export function proteinPer100Kcal(n: Nutrients100g): number | null {
  const protein = num(n.proteinG);
  const kcal = num(n.energyKcal);
  if (protein === undefined || kcal === undefined || kcal < 1) return null;
  return (protein / kcal) * 100;
}

/** Protein (g) per ₹100 spent, unrounded (D12). Null without protein, price and pack size. */
export function proteinPer100Inr(p: Product): number | null {
  const protein = num(p.nutrients.proteinG);
  const pack = num(p.packSizeG);
  const price = num(p.priceInr);
  if (protein === undefined || pack === undefined || price === undefined) return null;
  if (pack <= 0 || price <= 0) return null;
  return ((protein * pack) / 100 / price) * 100;
}

/** Serving size in grams; 100 g when unknown (D10). */
export function servingG(p: Product): { grams: number; assumed: boolean } {
  const s = num(p.servingSizeG);
  if (s === undefined || s <= 0) return { grams: 100, assumed: true };
  return { grams: s, assumed: false };
}

/** Protein per serving in grams (D10). Null when protein is missing. */
export function proteinPerServingG(p: Product): number | null {
  const protein = num(p.nutrients.proteinG);
  if (protein === undefined) return null;
  return (protein * servingG(p).grams) / 100;
}

const PROTEIN_CLAIM = /high[\s-]*(in\s+)?protein|protein[\s-]*rich|rich in protein|\bprotein\b/i;

/**
 * Protein-washing (D13): the name or claims mention protein, but protein gives
 * under 20% of calories. False if protein or kcal is missing. Never changes colour.
 */
export function isProteinWashing(p: Product): boolean {
  const text = `${p.name ?? ''} ${p.claimsText ?? ''}`;
  if (!PROTEIN_CLAIM.test(text)) return false;
  const protein = num(p.nutrients.proteinG);
  const kcal = num(p.nutrients.energyKcal);
  if (protein === undefined || kcal === undefined || kcal < 1) return false;
  return (protein * 4) / kcal < 0.2;
}
