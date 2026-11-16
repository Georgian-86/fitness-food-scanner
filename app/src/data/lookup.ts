import type { Product } from '../scoring';
import { findFixture } from './fixtures';
import { fetchOffProduct } from './off';
import { getSavedProduct, saveProduct } from './storage';

export type LookupSource = 'saved' | 'off' | 'fixture';

export interface LookupResult {
  product: Product;
  source: LookupSource;
}

export interface LookupDeps {
  getSaved: (barcode: string) => Product | null;
  save: (p: Product) => void;
  fetchOff: (barcode: string) => Promise<Product | null>;
  fixture: (barcode: string) => Product | null;
}

const defaultDeps: LookupDeps = {
  getSaved: getSavedProduct,
  save: saveProduct,
  fetchOff: (b) => fetchOffProduct(b),
  fixture: findFixture,
};

/** saved locally → Open Food Facts (cached on success) → bundled fixtures → null (manual entry). */
export async function lookup(barcode: string, deps: Partial<LookupDeps> = {}): Promise<LookupResult | null> {
  const d = { ...defaultDeps, ...deps };
  const saved = d.getSaved(barcode);
  if (saved) return { product: saved, source: 'saved' };

  try {
    const off = await d.fetchOff(barcode);
    if (off) {
      const p = { ...off, barcode };
      d.save(p);
      return { product: p, source: 'off' };
    }
  } catch {
    // network error / timeout: fall through to fixtures
  }

  const fx = d.fixture(barcode);
  if (fx) return { product: fx, source: 'fixture' };
  return null;
}
