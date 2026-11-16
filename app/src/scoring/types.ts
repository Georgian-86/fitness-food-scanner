// FROZEN contract between the scoring core and the app. Change only via the lead.
export type Goal = 'fat_loss' | 'muscle_gain';
export type Diet = 'any' | 'eggetarian' | 'vegetarian'; // vegetarian = no meat, no egg
export type DietType = 'veg' | 'egg' | 'non_veg' | 'unknown';
export type Allergen =
  | 'milk' | 'egg' | 'peanut' | 'tree_nut' | 'soy' | 'gluten'
  | 'sesame' | 'fish' | 'shellfish' | 'mustard';
export type Colour = 'green' | 'yellow' | 'orange' | 'red' | 'unknown';

export interface Nutrients100g {
  energyKcal?: number;
  proteinG?: number;
  sugarG?: number;
  satFatG?: number;
  saltG?: number;
  sodiumMg?: number;
  carbsG?: number;
  fatG?: number;
  fibreG?: number;
}

export interface Product {
  barcode?: string;
  name: string;
  brand?: string;
  nutrients: Nutrients100g;
  servingSizeG?: number;
  packSizeG?: number;
  priceInr?: number;
  ingredientsText?: string;
  allergens: Allergen[];
  dietType: DietType;
  claimsText?: string;
  source: 'off' | 'fixture' | 'manual';
}

export interface UserProfile {
  goal: Goal;
  diet: Diet;
  allergens: Allergen[];
}

export type RedFlag =
  | { kind: 'allergen'; allergen: Allergen }
  | { kind: 'diet' }
  | { kind: 'trans_fat' }
  | { kind: 'multi_high'; nutrients: ('sugar' | 'sat_fat' | 'salt')[] };

export interface Verdict {
  colour: Colour;
  headline: string;
  reason: string;
  redFlags: RedFlag[];
  proteinPer100Kcal: number | null;
  proteinPerServingG: number | null;
  proteinPer100Inr: number | null;
  proteinWashing: boolean;
  servingAssumed: boolean;
  missing: (keyof Nutrients100g)[];
  notes: string[];
}
