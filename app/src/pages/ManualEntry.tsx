import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { Allergen, DietType, Nutrients100g, Product } from '../scoring';
import { looksLikeBarcode } from '../data/barcode';
import { findFixture } from '../data/fixtures';
import { getSavedProduct, saveProduct } from '../data/storage';
import { ALL_ALLERGENS, ALLERGEN_LABELS, NUTRIENT_LABELS } from '../components/labels';

const NUTRIENT_KEYS = Object.keys(NUTRIENT_LABELS) as (keyof Nutrients100g)[];
const REQUIRED: (keyof Nutrients100g)[] = ['energyKcal', 'proteinG'];

type NumField = keyof Nutrients100g | 'servingSizeG' | 'packSizeG' | 'priceInr';

function toStr(n: number | undefined): string {
  return n == null ? '' : String(n);
}

function parseNum(s: string): number | undefined {
  if (s.trim() === '') return undefined;
  const n = Number(s.replace(',', '.'));
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

export default function ManualEntry() {
  const params = useParams();
  const navigate = useNavigate();
  const notFound = Boolean((useLocation().state as { notFound?: boolean } | null)?.notFound);
  const existing = params.barcode ? getSavedProduct(params.barcode) ?? findFixture(params.barcode) : null;

  const [barcode, setBarcode] = useState(params.barcode ?? '');
  const [name, setName] = useState(existing?.name ?? '');
  const [brand, setBrand] = useState(existing?.brand ?? '');
  const [nums, setNums] = useState<Record<NumField, string>>(() => {
    const init = {} as Record<NumField, string>;
    NUTRIENT_KEYS.forEach((k) => (init[k] = toStr(existing?.nutrients[k])));
    init.servingSizeG = toStr(existing?.servingSizeG);
    init.packSizeG = toStr(existing?.packSizeG);
    init.priceInr = toStr(existing?.priceInr);
    return init;
  });
  const [ingredients, setIngredients] = useState(existing?.ingredientsText ?? '');
  const [dietType, setDietType] = useState<DietType>(existing?.dietType ?? 'unknown');
  const [allergens, setAllergens] = useState<Allergen[]>(existing?.allergens ?? []);
  const [claims, setClaims] = useState(existing?.claimsText ?? '');
  const [error, setError] = useState('');

  const setNum = (k: NumField, v: string) => setNums((s) => ({ ...s, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const code = barcode.replace(/\s+/g, '');
    if (!looksLikeBarcode(code)) return setError('Enter the barcode number (digits only).');
    if (!name.trim()) return setError('Enter the product name.');
    for (const k of REQUIRED) {
      if (parseNum(nums[k]) === undefined) return setError(`Enter ${NUTRIENT_LABELS[k].toLowerCase()} per 100 g.`);
    }
    const nutrients: Nutrients100g = {};
    NUTRIENT_KEYS.forEach((k) => {
      const v = parseNum(nums[k]);
      if (v !== undefined) nutrients[k] = v;
    });
    const product: Product = {
      barcode: code,
      name: name.trim(),
      brand: brand.trim() || undefined,
      nutrients,
      servingSizeG: parseNum(nums.servingSizeG),
      packSizeG: parseNum(nums.packSizeG),
      priceInr: parseNum(nums.priceInr),
      ingredientsText: ingredients.trim() || undefined,
      allergens,
      dietType,
      claimsText: [name.trim(), claims.trim()].filter(Boolean).join(' | '),
      source: 'manual',
    };
    saveProduct(product);
    navigate(`/product/${code}`, { replace: true });
  };

  const numInput = (k: NumField, label: string, required = false) => (
    <label key={k} className="field">
      <span>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </span>
      <input
        type="number"
        inputMode="decimal"
        min="0"
        step="any"
        required={required}
        value={nums[k]}
        onChange={(e) => setNum(k, e.target.value)}
        data-testid={`manual-${k}`}
      />
    </label>
  );

  return (
    <main className="page">
      <h1>{existing ? 'Edit product' : 'Add this product'}</h1>
      {notFound && (
        <p className="notice" data-testid="not-found">
          We couldn’t find <strong>{barcode}</strong>. Copy the nutrition table from the pack: it is saved on this
          phone, so next time it scans instantly.
        </p>
      )}
      <form className="manual-form" data-testid="manual-form" onSubmit={submit} noValidate>
        <label className="field">
          <span>Barcode *</span>
          <input inputMode="numeric" value={barcode} onChange={(e) => setBarcode(e.target.value)} readOnly={Boolean(params.barcode)} data-testid="manual-barcode" />
        </label>
        <label className="field">
          <span>Product name *</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required data-testid="manual-name" />
        </label>
        <label className="field">
          <span>Brand</span>
          <input value={brand} onChange={(e) => setBrand(e.target.value)} data-testid="manual-brand" />
        </label>

        <fieldset>
          <legend>Nutrition per 100 g (or 100 ml)</legend>
          <div className="grid-2">
            {NUTRIENT_KEYS.map((k) => numInput(k, NUTRIENT_LABELS[k], REQUIRED.includes(k)))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Pack</legend>
          <div className="grid-2">
            {numInput('servingSizeG', 'Serving size (g)')}
            {numInput('packSizeG', 'Pack size (g)')}
            {numInput('priceInr', 'Price / MRP (₹)')}
          </div>
        </fieldset>

        <label className="field">
          <span>Ingredients</span>
          <textarea rows={3} value={ingredients} onChange={(e) => setIngredients(e.target.value)} data-testid="manual-ingredients" />
        </label>
        <label className="field">
          <span>Claims on the pack (e.g. “high protein”)</span>
          <input value={claims} onChange={(e) => setClaims(e.target.value)} data-testid="manual-claims" />
        </label>

        <fieldset>
          <legend>Veg mark</legend>
          <div className="chips" role="radiogroup" aria-label="Veg mark">
            {(
              [
                ['veg', 'Veg (green dot)'],
                ['egg', 'Contains egg'],
                ['non_veg', 'Non-veg (brown dot)'],
                ['unknown', 'Not shown'],
              ] as [DietType, string][]
            ).map(([d, l]) => (
              <button key={d} type="button" role="radio" aria-checked={dietType === d} className={`chip ${dietType === d ? 'is-selected' : ''}`} onClick={() => setDietType(d)} data-testid={`manual-diet-${d}`}>
                {l}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Allergens listed on the pack</legend>
          <div className="chips">
            {ALL_ALLERGENS.map((a) => (
              <button
                key={a}
                type="button"
                aria-pressed={allergens.includes(a)}
                className={`chip ${allergens.includes(a) ? 'is-selected' : ''}`}
                onClick={() => setAllergens((s) => (s.includes(a) ? s.filter((x) => x !== a) : [...s, a]))}
              >
                {allergens.includes(a) ? '✓ ' : ''}
                {ALLERGEN_LABELS[a]}
              </button>
            ))}
          </div>
        </fieldset>

        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit" className="btn btn-primary btn-block" data-testid="manual-save">Save and check</button>
      </form>
    </main>
  );
}
