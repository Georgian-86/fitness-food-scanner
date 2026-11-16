import type { Allergen, DietType, Nutrients100g, Product } from '../scoring';

export const OFF_FIELDS = [
  'code',
  'product_name',
  'product_name_en',
  'brands',
  'nutriments',
  'serving_quantity',
  'product_quantity',
  'ingredients_text',
  'ingredients_text_en',
  'allergens_tags',
  'ingredients_analysis_tags',
  'labels_tags',
].join(',');

export const OFF_TIMEOUT_MS = 6000;

export class OffNetworkError extends Error {}

/** Fetch a product from Open Food Facts. Returns null when OFF has no such product;
 * throws OffNetworkError on network failure / timeout / bad response. */
export async function fetchOffProduct(
  barcode: string,
  opts: { timeoutMs?: number; fetchImpl?: typeof fetch } = {},
): Promise<Product | null> {
  const doFetch = opts.fetchImpl ?? fetch;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs ?? OFF_TIMEOUT_MS);
  const url = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json?fields=${OFF_FIELDS}`;
  try {
    const res = await doFetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } });
    if (res.status === 404) return null;
    if (!res.ok) throw new OffNetworkError(`OFF HTTP ${res.status}`);
    const json: unknown = await res.json();
    const p = mapOffProduct(json);
    if (p && !p.barcode) p.barcode = barcode;
    return p;
  } catch (e) {
    if (e instanceof OffNetworkError) throw e;
    throw new OffNetworkError(e instanceof Error ? e.message : String(e));
  } finally {
    clearTimeout(timer);
  }
}

type Json = Record<string, unknown>;

function num(v: unknown): number | undefined {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v.replace(',', '.'));
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

function str(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() !== '' ? v.trim() : undefined;
}

function strArr(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
}

function round(n: number | undefined, dp = 2): number | undefined {
  if (n === undefined) return undefined;
  const f = 10 ** dp;
  return Math.round(n * f) / f;
}

const ALLERGEN_MAP: Record<string, Allergen> = {
  'en:milk': 'milk',
  'en:eggs': 'egg',
  'en:peanuts': 'peanut',
  'en:nuts': 'tree_nut',
  'en:soybeans': 'soy',
  'en:gluten': 'gluten',
  'en:sesame-seeds': 'sesame',
  'en:fish': 'fish',
  'en:crustaceans': 'shellfish',
  'en:molluscs': 'shellfish',
  'en:mustard': 'mustard',
};

export function mapAllergens(tags: string[]): Allergen[] {
  const out: Allergen[] = [];
  for (const t of tags) {
    const a = ALLERGEN_MAP[t.toLowerCase()];
    if (a && !out.includes(a)) out.push(a);
  }
  return out;
}

export function mapDietType(analysisTags: string[], labelTags: string[]): DietType {
  const tags = [...analysisTags, ...labelTags].map((t) => t.toLowerCase());
  if (tags.includes('en:non-vegetarian') || tags.includes('en:non-veg')) return 'non_veg';
  if (tags.includes('en:vegetarian') || tags.includes('en:vegan') || tags.includes('en:veg')) return 'veg';
  return 'unknown';
}

function energyKcal(n: Json): number | undefined {
  const kcal = num(n['energy-kcal_100g']);
  if (kcal !== undefined) return kcal;
  const kj = num(n['energy-kj_100g']) ?? num(n['energy_100g']); // energy_100g is kJ in OFF
  return kj !== undefined ? kj / 4.184 : undefined;
}

/** Map an OFF API v2 product response (or bare product object) to our Product. */
export function mapOffProduct(json: unknown): Product | null {
  if (!json || typeof json !== 'object') return null;
  const root = json as Json;
  if (root.status === 0 || root.status === 'failure') return null;
  const prod = (root.product && typeof root.product === 'object' ? root.product : root) as Json;
  const nm = (prod.nutriments && typeof prod.nutriments === 'object' ? prod.nutriments : {}) as Json;

  const name = str(prod.product_name) ?? str(prod.product_name_en);
  const hasNutrition = Object.keys(nm).length > 0;
  if (!name && !hasNutrition) return null;

  const sodiumG = num(nm['sodium_100g']);
  const nutrients: Nutrients100g = {
    energyKcal: round(energyKcal(nm), 1),
    proteinG: num(nm['proteins_100g']),
    sugarG: num(nm['sugars_100g']),
    satFatG: num(nm['saturated-fat_100g']),
    saltG: num(nm['salt_100g']),
    sodiumMg: sodiumG !== undefined ? round(sodiumG * 1000, 1) : undefined,
    carbsG: num(nm['carbohydrates_100g']),
    fatG: num(nm['fat_100g']),
    fibreG: num(nm['fiber_100g']),
  };
  (Object.keys(nutrients) as (keyof Nutrients100g)[]).forEach((k) => {
    if (nutrients[k] === undefined) delete nutrients[k];
  });

  const labels = strArr(prod.labels_tags);
  const productName = name ?? 'Unnamed product';
  const claimsText = [productName, ...labels.map((l) => l.replace(/^[a-z]{2}:/, '').replace(/-/g, ' '))].join(' | ');

  const p: Product = {
    barcode: str(prod.code) ?? str(root.code),
    name: productName,
    brand: str(prod.brands)?.split(',')[0]?.trim(),
    nutrients,
    servingSizeG: num(prod.serving_quantity),
    packSizeG: num(prod.product_quantity),
    ingredientsText: str(prod.ingredients_text_en) ?? str(prod.ingredients_text),
    allergens: mapAllergens(strArr(prod.allergens_tags)),
    dietType: mapDietType(strArr(prod.ingredients_analysis_tags), labels),
    claimsText,
    source: 'off',
  };
  (Object.keys(p) as (keyof Product)[]).forEach((k) => {
    if (p[k] === undefined) delete p[k];
  });
  return p;
}
