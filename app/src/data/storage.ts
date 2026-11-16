import type { Allergen, Diet, Goal, Product, UserProfile } from '../scoring';

const KEYS = {
  profile: 'ffs.profile.v1',
  products: 'ffs.products.v1',
  history: 'ffs.history.v1',
  overrides: 'ffs.overrides.v1',
} as const;

export interface HistoryEntry {
  barcode: string;
  name?: string;
  at: number; // epoch ms
}

export interface ProductOverride {
  priceInr?: number;
  packSizeG?: number;
}

const memory = new Map<string, string>();

function read<T>(key: string, fallback: T): T {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    raw = memory.get(key) ?? null;
  }
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  const raw = JSON.stringify(value);
  try {
    window.localStorage.setItem(key, raw);
  } catch {
    memory.set(key, raw);
  }
}

function remove(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
  memory.delete(key);
}

const GOALS: Goal[] = ['fat_loss', 'muscle_gain'];
const DIETS: Diet[] = ['any', 'eggetarian', 'vegetarian'];

// ---- profile ----
export function getProfile(): UserProfile | null {
  const p = read<UserProfile | null>(KEYS.profile, null);
  if (!p || !GOALS.includes(p.goal) || !DIETS.includes(p.diet)) return null;
  return { goal: p.goal, diet: p.diet, allergens: Array.isArray(p.allergens) ? (p.allergens as Allergen[]) : [] };
}

export function saveProfile(p: UserProfile): void {
  write(KEYS.profile, p);
}

// ---- saved products (by barcode) ----
export function getSavedProducts(): Record<string, Product> {
  return read<Record<string, Product>>(KEYS.products, {});
}

export function getSavedProduct(barcode: string): Product | null {
  return getSavedProducts()[barcode] ?? null;
}

export function saveProduct(p: Product): void {
  if (!p.barcode) return;
  const all = getSavedProducts();
  all[p.barcode] = p;
  write(KEYS.products, all);
}

// ---- history ----
const HISTORY_MAX = 100;

export function getHistory(): HistoryEntry[] {
  const h = read<HistoryEntry[]>(KEYS.history, []);
  return Array.isArray(h) ? h : [];
}

export function addHistory(barcode: string, name?: string): void {
  const h = getHistory().filter((e) => e.barcode !== barcode);
  h.unshift({ barcode, name, at: Date.now() });
  write(KEYS.history, h.slice(0, HISTORY_MAX));
}

// ---- per-product price / pack overrides ----
export function getOverride(barcode: string): ProductOverride {
  return read<Record<string, ProductOverride>>(KEYS.overrides, {})[barcode] ?? {};
}

export function saveOverride(barcode: string, o: ProductOverride): void {
  const all = read<Record<string, ProductOverride>>(KEYS.overrides, {});
  all[barcode] = o;
  write(KEYS.overrides, all);
}

export function applyOverride(p: Product, o: ProductOverride): Product {
  return {
    ...p,
    priceInr: o.priceInr ?? p.priceInr,
    packSizeG: o.packSizeG ?? p.packSizeG,
  };
}

export function clearAll(): void {
  Object.values(KEYS).forEach(remove);
}
