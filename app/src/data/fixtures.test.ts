import { describe, expect, it } from 'vitest';
import { gs1CheckDigit, isValidEan13, isValidGtin } from './barcode';
import { ANCHOR_BARCODE, FIXTURES, findFixture } from './fixtures';

describe('barcode check digits', () => {
  it('validates known real-world EAN-13s', () => {
    expect(isValidEan13('4006381333931')).toBe(true);
    expect(gs1CheckDigit('400638133393')).toBe(1);
    expect(isValidEan13('4006381333932')).toBe(false);
    expect(isValidGtin('96385074')).toBe(true); // EAN-8
    expect(isValidGtin('036000291452')).toBe(true); // UPC-A
  });
});

describe('fixtures', () => {
  it('has at least 8 products with valid, unique EAN-13 barcodes', () => {
    expect(FIXTURES.length).toBeGreaterThanOrEqual(8);
    const codes = FIXTURES.map((f) => f.barcode!);
    expect(new Set(codes).size).toBe(codes.length);
    for (const c of codes) expect(isValidEan13(c), c).toBe(true);
    for (const f of FIXTURES) expect(f.source).toBe('fixture');
  });

  it('includes the anchor product exactly as specified', () => {
    const a = findFixture(ANCHOR_BARCODE)!;
    expect(a.nutrients).toMatchObject({ energyKcal: 400, proteinG: 33, sugarG: 18, satFatG: 4 });
    expect(a.servingSizeG).toBe(60);
  });

  it('includes protein cookies, a hydrogenated-oil biscuit and a peanut allergen product', () => {
    const cookies = FIXTURES.find((f) => f.name === 'Protein Cookies')!;
    expect(cookies.nutrients).toMatchObject({ energyKcal: 480, proteinG: 10 });
    expect(FIXTURES.some((f) => /partially hydrogenated/i.test(f.ingredientsText ?? ''))).toBe(true);
    expect(FIXTURES.some((f) => f.allergens.includes('peanut'))).toBe(true);
  });

  it('findFixture returns a copy', () => {
    const a = findFixture(ANCHOR_BARCODE)!;
    a.name = 'changed';
    expect(findFixture(ANCHOR_BARCODE)!.name).not.toBe('changed');
    expect(findFixture('0000000000000')).toBeNull();
  });
});
