// STUB — WP1 replaces this with the real implementation. Signatures are fixed.
import type { Product, UserProfile, Verdict } from './types';
export * from './types';

export function scoreProduct(_p: Product, _u: UserProfile): Verdict {
  return {
    colour: 'unknown', headline: 'Not enough data', reason: '', redFlags: [],
    proteinPer100Kcal: null, proteinPerServingG: null, proteinPer100Inr: null,
    proteinWashing: false, servingAssumed: false, missing: [], notes: [],
  };
}
