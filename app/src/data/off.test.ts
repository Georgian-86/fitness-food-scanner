import { describe, expect, it } from 'vitest';
import { fetchOffProduct, mapAllergens, mapDietType, mapOffProduct, OffNetworkError } from './off';

const kcalFixture = {
  code: '8901063010529',
  status: 1,
  product: {
    code: '8901063010529',
    product_name: 'High Protein Peanut Butter',
    brands: 'NutriSpread, Some Parent Co',
    nutriments: {
      'energy-kcal_100g': 610,
      'energy-kj_100g': 2552,
      proteins_100g: 30,
      sugars_100g: 6,
      'saturated-fat_100g': 9.5,
      salt_100g: 0.9,
      sodium_100g: 0.36,
      carbohydrates_100g: 15,
      fat_100g: 48,
      fiber_100g: 7,
    },
    serving_quantity: 32,
    product_quantity: '1000',
    ingredients_text: 'Roasted peanuts (90%), whey protein, salt',
    allergens_tags: ['en:peanuts', 'en:milk', 'en:unknown-thing'],
    ingredients_analysis_tags: ['en:palm-oil-free', 'en:vegetarian'],
    labels_tags: ['en:high-protein', 'en:veg'],
  },
};

const kjOnlyFixture = {
  status: 1,
  product: {
    code: '8906000000001',
    product_name_en: 'Chicken Masala Noodles',
    nutriments: {
      energy_100g: 1757, // kJ
      proteins_100g: '9.1',
      sugars_100g: 2.4,
      sodium_100g: 1.1,
    },
    ingredients_text_en: 'Wheat flour, palm oil, chicken powder, salt',
    allergens_tags: ['en:gluten', 'en:crustaceans', 'en:molluscs', 'en:soybeans'],
    labels_tags: ['in:non-veg', 'en:non-veg'],
  },
};

describe('mapOffProduct', () => {
  it('maps a full kcal product', () => {
    const p = mapOffProduct(kcalFixture)!;
    expect(p).not.toBeNull();
    expect(p.barcode).toBe('8901063010529');
    expect(p.name).toBe('High Protein Peanut Butter');
    expect(p.brand).toBe('NutriSpread');
    expect(p.source).toBe('off');
    expect(p.nutrients).toEqual({
      energyKcal: 610,
      proteinG: 30,
      sugarG: 6,
      satFatG: 9.5,
      saltG: 0.9,
      sodiumMg: 360,
      carbsG: 15,
      fatG: 48,
      fibreG: 7,
    });
    expect(p.servingSizeG).toBe(32);
    expect(p.packSizeG).toBe(1000);
    expect(p.allergens).toEqual(['peanut', 'milk']);
    expect(p.dietType).toBe('veg');
    expect(p.claimsText).toContain('high protein');
    expect(p.claimsText).toContain('High Protein Peanut Butter');
  });

  it('converts kJ-only energy and handles missing fields', () => {
    const p = mapOffProduct(kjOnlyFixture)!;
    expect(p.name).toBe('Chicken Masala Noodles');
    expect(p.nutrients.energyKcal).toBeCloseTo(1757 / 4.184, 1);
    expect(p.nutrients.proteinG).toBe(9.1);
    expect(p.nutrients.sodiumMg).toBe(1100);
    expect(p.nutrients.saltG).toBeUndefined();
    expect('satFatG' in p.nutrients).toBe(false);
    expect(p.servingSizeG).toBeUndefined();
    expect(p.ingredientsText).toContain('chicken');
    expect(p.allergens).toEqual(['gluten', 'shellfish', 'soy']);
    expect(p.dietType).toBe('non_veg');
  });

  it('prefers energy-kj_100g over energy_100g when kcal missing', () => {
    const p = mapOffProduct({ product: { product_name: 'X', nutriments: { 'energy-kj_100g': 418.4, energy_100g: 9999 } } })!;
    expect(p.nutrients.energyKcal).toBe(100);
  });

  it('returns null for not-found responses', () => {
    expect(mapOffProduct({ status: 0, status_verbose: 'product not found' })).toBeNull();
    expect(mapOffProduct(null)).toBeNull();
    expect(mapOffProduct({ product: {} })).toBeNull();
  });
});

describe('mapDietType / mapAllergens', () => {
  it('non-veg wins over veg; unknown otherwise', () => {
    expect(mapDietType(['en:non-vegetarian'], ['en:vegetarian'])).toBe('non_veg');
    expect(mapDietType(['en:vegan'], [])).toBe('veg');
    expect(mapDietType([], [])).toBe('unknown');
  });
  it('maps tree nuts, sesame and mustard', () => {
    expect(mapAllergens(['en:nuts', 'en:sesame-seeds', 'en:mustard', 'en:fish'])).toEqual([
      'tree_nut', 'sesame', 'mustard', 'fish',
    ]);
  });
});

describe('fetchOffProduct', () => {
  const ok = (body: unknown, status = 200) =>
    (async () => new Response(JSON.stringify(body), { status })) as unknown as typeof fetch;

  it('returns mapped product', async () => {
    const p = await fetchOffProduct('8901063010529', { fetchImpl: ok(kcalFixture) });
    expect(p?.name).toBe('High Protein Peanut Butter');
  });
  it('returns null on not found', async () => {
    expect(await fetchOffProduct('1', { fetchImpl: ok({ status: 0 }, 404) })).toBeNull();
    expect(await fetchOffProduct('1', { fetchImpl: ok({ status: 0 }) })).toBeNull();
  });
  it('throws OffNetworkError on network failure', async () => {
    const fail = (async () => {
      throw new TypeError('Failed to fetch');
    }) as unknown as typeof fetch;
    await expect(fetchOffProduct('1', { fetchImpl: fail })).rejects.toBeInstanceOf(OffNetworkError);
  });
});
