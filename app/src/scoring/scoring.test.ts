import { describe, expect, it } from 'vitest';
import {
  checkRed,
  hasHydrogenatedOil,
  isProteinWashing,
  proteinPer100Inr,
  proteinPer100Kcal,
  saltG,
  scoreProduct as rawScore,
  type Diet,
  type Goal,
  type Nutrients100g,
  type Product,
  type UserProfile,
  type Verdict,
} from './index';

// Every verdict produced in this suite is collected for the wording checks (test 16).
const produced: Verdict[] = [];
function scoreProduct(p: Product, u: UserProfile): Verdict {
  const v = rawScore(p, u);
  produced.push(v);
  return v;
}

function product(nutrients: Nutrients100g, extra: Partial<Product> = {}): Product {
  return { name: 'Test product', nutrients, allergens: [], dietType: 'veg', source: 'fixture', ...extra };
}
function user(goal: Goal, extra: Partial<UserProfile> = {}): UserProfile {
  return { goal, diet: 'any', allergens: [], ...extra };
}
const FL = user('fat_loss');
const MG = user('muscle_gain');
const neutral: Nutrients100g = { energyKcal: 100, proteinG: 12, sugarG: 2, satFatG: 1, saltG: 0.2 };

describe('1. allergens', () => {
  it('peanut allergen selected + product lists peanut → red for both goals', () => {
    const p = product(neutral, { allergens: ['peanut', 'milk'] });
    for (const goal of ['fat_loss', 'muscle_gain'] as Goal[]) {
      const v = scoreProduct(p, user(goal, { allergens: ['peanut'] }));
      expect(v.colour).toBe('red');
      expect(v.redFlags).toEqual([{ kind: 'allergen', allergen: 'peanut' }]);
      expect(v.reason).toBe('Contains peanut, which you chose to avoid.');
    }
  });
  it('allergen not selected → not red', () => {
    expect(scoreProduct(product(neutral, { allergens: ['peanut'] }), FL).colour).not.toBe('red');
  });
});

describe('2. diet', () => {
  const cases: [Diet, Product['dietType'], boolean][] = [
    ['vegetarian', 'non_veg', true],
    ['vegetarian', 'egg', true],
    ['eggetarian', 'egg', false],
    ['eggetarian', 'non_veg', true],
    ['any', 'non_veg', false],
    ['vegetarian', 'unknown', false],
  ];
  it.each(cases)('%s user + %s product → red=%s', (diet, dietType, red) => {
    const v = scoreProduct(product(neutral, { dietType }), user('fat_loss', { diet }));
    expect(v.colour === 'red').toBe(red);
  });
  it('vegetarian + unknown → note added', () => {
    const v = scoreProduct(product(neutral, { dietType: 'unknown' }), user('fat_loss', { diet: 'vegetarian' }));
    expect(v.notes).toContain('Veg/non-veg status not listed.');
  });
  it('vegetarian + "veg" product that lists egg allergen → red (diet)', () => {
    const p = product(neutral, { dietType: 'veg', allergens: ['egg'] });
    expect(checkRed(p, user('fat_loss', { diet: 'vegetarian' }))).toEqual([{ kind: 'diet' }]);
  });
});

describe('3. trans fat', () => {
  it('partially hydrogenated oil → red', () => {
    const p = product(neutral, { ingredientsText: 'Wheat flour, Partially Hydrogenated Vegetable Oil, salt' });
    const v = scoreProduct(p, FL);
    expect(v.colour).toBe('red');
    expect(v.reason).toBe('Lists hydrogenated oil (a source of trans fat).');
  });
  it('helper', () => {
    expect(hasHydrogenatedOil('FULLY HYDROGENATED palm oil')).toBe(true);
    expect(hasHydrogenatedOil('palm oil')).toBe(false);
    expect(hasHydrogenatedOil(undefined)).toBe(false);
  });
});

describe('4. multi-high', () => {
  it('sugar 30 + satFat 6 → red', () => {
    const v = scoreProduct(product({ energyKcal: 450, proteinG: 6, sugarG: 30, satFatG: 6 }), FL);
    expect(v.colour).toBe('red');
    expect(v.redFlags).toEqual([{ kind: 'multi_high', nutrients: ['sugar', 'sat_fat'] }]);
    expect(v.reason).toBe('High in sugar and saturated fat.');
  });
  it('sugar 30 only → fat loss orange, not red', () => {
    expect(scoreProduct(product({ energyKcal: 300, proteinG: 6, sugarG: 30 }), FL).colour).toBe('orange');
  });
  it('sugar 22.5 + satFat 5 → not red (strictly greater)', () => {
    const v = scoreProduct(product({ energyKcal: 300, proteinG: 6, sugarG: 22.5, satFatG: 5 }), FL);
    expect(v.colour).not.toBe('red');
    expect(v.redFlags).toEqual([]);
  });
  it('sodium 700 mg (no salt) + satFat 6 → red', () => {
    const v = scoreProduct(product({ energyKcal: 500, proteinG: 8, sugarG: 2, satFatG: 6, sodiumMg: 700 }), FL);
    expect(v.colour).toBe('red');
    expect(v.redFlags).toEqual([{ kind: 'multi_high', nutrients: ['sat_fat', 'salt'] }]);
  });
  it('saltG helper', () => {
    expect(saltG({ sodiumMg: 700 })).toBeCloseTo(1.75);
    expect(saltG({ saltG: 1, sodiumMg: 700 })).toBe(1);
    expect(saltG({})).toBeUndefined();
  });
  it('all three high → listed in order', () => {
    const v = scoreProduct(product({ energyKcal: 500, proteinG: 5, sugarG: 30, satFatG: 10, saltG: 2 }), FL);
    expect(v.reason).toBe('High in sugar, saturated fat and salt.');
  });
});

describe('5–8. fat loss', () => {
  const fl = (n: Nutrients100g) => scoreProduct(product(n), FL);
  it('green', () => {
    expect(fl({ energyKcal: 400, proteinG: 80, sugarG: 4 }).colour).toBe('green');
    expect(fl({ energyKcal: 100, proteinG: 10, sugarG: 5 }).colour).toBe('green');
  });
  it('yellow', () => {
    expect(fl({ energyKcal: 60, proteinG: 10, sugarG: 8 }).colour).toBe('yellow');
    expect(fl({ energyKcal: 250, proteinG: 15, sugarG: 3 }).colour).toBe('yellow');
    expect(fl({ energyKcal: 400, proteinG: 8, sugarG: 2 }).colour).toBe('yellow');
    expect(fl({ energyKcal: 0, proteinG: 0, sugarG: 0 }).colour).toBe('yellow');
  });
  it('orange', () => {
    const v = fl({ energyKcal: 520, proteinG: 6, sugarG: 2 });
    expect(v.colour).toBe('orange');
    expect(v.reason).toBe('Only 1.2 g protein per 100 kcal at 520 kcal per 100 g: low for your cut.');
    expect(fl({ energyKcal: 100, proteinG: 12, sugarG: 16 }).colour).toBe('orange');
    expect(fl({ energyKcal: 100, proteinG: 12, sugarG: 15 }).colour).toBe('yellow');
  });
  it('missing data', () => {
    const u = fl({ energyKcal: 200, sugarG: 3 });
    expect(u.colour).toBe('unknown');
    expect(u.headline).toBe('Not enough data');
    expect(u.missing).toEqual(['proteinG']);
    const o = fl({ energyKcal: 200, sugarG: 20 });
    expect(o.colour).toBe('orange');
    expect(o.missing).toEqual(['proteinG']);
  });
  it('missing kcal but protein + low sugar → unknown', () => {
    expect(fl({ proteinG: 20, sugarG: 1 }).colour).toBe('unknown');
  });
  it('green reason uses one decimal', () => {
    expect(fl({ energyKcal: 120, proteinG: 25, sugarG: 1 }).reason).toBe(
      '20.8 g protein per 100 kcal with little sugar: good for your cut.',
    );
  });
});

describe('9–12. muscle gain', () => {
  const mg = (n: Nutrients100g, servingSizeG?: number) => scoreProduct(product(n, { servingSizeG }), MG);
  it('green', () => {
    const v = mg({ energyKcal: 400, proteinG: 80, sugarG: 3 }, 30);
    expect(v.colour).toBe('green');
    expect(v.proteinPerServingG).toBeCloseTo(24);
    expect(v.reason).toBe('24.0 g protein per 30 g serving: good for your bulk.');
    expect(mg({ energyKcal: 150, proteinG: 20, sugarG: 3 }, 30).colour).toBe('green');
  });
  it('yellow', () => {
    expect(mg({ energyKcal: 450, proteinG: 25, sugarG: 5 }, 40).colour).toBe('yellow');
    expect(mg({ energyKcal: 450, proteinG: 6, sugarG: 10 }, 30).colour).toBe('yellow');
  });
  it('orange', () => {
    const v = mg({ energyKcal: 480, proteinG: 6, sugarG: 30, satFatG: 2 }, 30);
    expect(v.colour).toBe('orange');
    expect(v.headline).toBe('Works against your goal');
  });
  it('no serving → assumed 100 g', () => {
    const v = mg({ energyKcal: 600, proteinG: 25, sugarG: 2 });
    expect(v.colour).toBe('green');
    expect(v.servingAssumed).toBe(true);
    expect(v.reason).toContain('per 100 g');
  });
  it('kcal optional; protein missing → unknown', () => {
    expect(mg({ proteinG: 10, sugarG: 2 }, 50).colour).toBe('yellow');
    const v = mg({ energyKcal: 300, sugarG: 2 }, 50);
    expect(v.colour).toBe('unknown');
    expect(v.missing).toEqual(['proteinG']);
  });
  it('sugar missing but green fires → green', () => {
    expect(mg({ proteinG: 30 }, 60).colour).toBe('green');
  });
});

describe('13. anchor: same product, both goals', () => {
  const p = product({ energyKcal: 400, proteinG: 33, sugarG: 18, satFatG: 4 }, { servingSizeG: 60 });
  it('fat loss orange, muscle gain green', () => {
    expect(scoreProduct(p, FL).colour).toBe('orange');
    expect(scoreProduct(p, MG).colour).toBe('green');
  });
});

describe('14. protein per ₹100', () => {
  it('computes and handles missing', () => {
    expect(proteinPer100Inr(product({ proteinG: 80 }, { packSizeG: 1000, priceInr: 2000 }))).toBeCloseTo(40);
    expect(proteinPer100Inr(product({ proteinG: 80 }, { packSizeG: 1000 }))).toBeNull();
    expect(proteinPer100Inr(product({ proteinG: 80 }, { priceInr: 2000 }))).toBeNull();
  });
});

describe('15. protein-washing', () => {
  it('flags only real washing', () => {
    expect(isProteinWashing(product({ energyKcal: 480, proteinG: 10 }, { name: 'Protein Cookies' }))).toBe(true);
    expect(isProteinWashing(product({ energyKcal: 400, proteinG: 80 }, { name: 'Whey Protein' }))).toBe(false);
    expect(isProteinWashing(product({ energyKcal: 480, proteinG: 10 }, { name: 'Butter Cookies' }))).toBe(false);
    expect(
      isProteinWashing(product({ energyKcal: 480, proteinG: 10 }, { name: 'Bar', claimsText: 'High-in protein!' })),
    ).toBe(true);
    expect(isProteinWashing(product({ energyKcal: 480 }, { name: 'Protein Cookies' }))).toBe(false);
  });
  it('never changes colour, adds a note', () => {
    const n = { energyKcal: 480, proteinG: 10, sugarG: 20 };
    const a = scoreProduct(product(n, { name: 'Protein Cookies' }), FL);
    const b = scoreProduct(product(n, { name: 'Cookies' }), FL);
    expect(a.proteinWashing).toBe(true);
    expect(a.colour).toBe(b.colour);
    expect(a.notes.length).toBe(b.notes.length + 1);
  });
});

describe('metrics', () => {
  it('protein per 100 kcal', () => {
    expect(proteinPer100Kcal({ energyKcal: 400, proteinG: 80 })).toBe(20);
    expect(proteinPer100Kcal({ energyKcal: 0.5, proteinG: 1 })).toBeNull();
    expect(proteinPer100Kcal({ proteinG: 1 })).toBeNull();
  });
});

describe('red priority (D2)', () => {
  it('returns all flags; reason uses the first', () => {
    const p = product(
      { energyKcal: 500, proteinG: 5, sugarG: 30, satFatG: 10 },
      { allergens: ['milk'], dietType: 'non_veg', ingredientsText: 'hydrogenated fat' },
    );
    const v = scoreProduct(p, user('muscle_gain', { diet: 'vegetarian', allergens: ['milk'] }));
    expect(v.redFlags.map((f) => f.kind)).toEqual(['allergen', 'diet', 'trans_fat', 'multi_high']);
    expect(v.reason).toBe('Contains milk, which you chose to avoid.');
    expect(v.notes.filter((n) => n.startsWith('Also:'))).toHaveLength(3);
  });
});

describe('16. wording', () => {
  it('headlines', () => {
    expect(scoreProduct(product(neutral, { allergens: ['soy'] }), user('fat_loss', { allergens: ['soy'] })).headline).toBe(
      'Avoid for you',
    );
    expect(scoreProduct(product({ energyKcal: 100, proteinG: 12, sugarG: 1 }), FL).headline).toBe('Fits your goal');
    expect(scoreProduct(product({ energyKcal: 100, proteinG: 6, sugarG: 1 }), FL).headline).toBe('Fine in moderation');
  });
  // Last test in the file: runs after every other test has pushed its verdicts.
  it('no verdict says "dangerous" or makes a medical claim; red headline is "Avoid for you"', () => {
    expect(produced.length).toBeGreaterThan(30);
    for (const v of produced) {
      const text = [v.headline, v.reason, ...v.notes].join(' ');
      expect(text).not.toMatch(/dangerous/i);
      expect(text).not.toMatch(/\bcauses?\b|disease|healthy for your heart|cure/i);
      expect(v.reason.length).toBeGreaterThan(0);
      if (v.colour === 'red') expect(v.headline).toBe('Avoid for you');
    }
  });
});
