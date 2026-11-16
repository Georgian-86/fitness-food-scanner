import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { scoreProduct, type Product } from '../scoring';
import { lookup, type LookupSource } from '../data/lookup';
import { addHistory, applyOverride, getOverride, saveOverride, type ProductOverride } from '../data/storage';
import VerdictCard from '../components/VerdictCard';
import { ALLERGEN_LABELS, DIET_TYPE_LABELS, fmt, NUTRIENT_LABELS, SOURCE_LABELS } from '../components/labels';
import { useProfile } from '../profile';

type State =
  | { status: 'loading' }
  | { status: 'ready'; product: Product; source: LookupSource }
  | { status: 'error' };

export default function Result() {
  const { barcode = '' } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [state, setState] = useState<State>({ status: 'loading' });
  const [override, setOverride] = useState<ProductOverride>(() => getOverride(barcode));

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });
    setOverride(getOverride(barcode));
    lookup(barcode)
      .then((r) => {
        if (cancelled) return;
        if (!r) {
          navigate(`/manual/${barcode}`, { replace: true, state: { notFound: true } });
          return;
        }
        addHistory(barcode, r.product.name);
        setState({ status: 'ready', product: r.product, source: r.source });
      })
      .catch(() => !cancelled && setState({ status: 'error' }));
    return () => {
      cancelled = true;
    };
  }, [barcode, navigate]);

  const product = useMemo(
    () => (state.status === 'ready' ? applyOverride(state.product, override) : null),
    [state, override],
  );
  const verdict = useMemo(() => (product && profile ? scoreProduct(product, profile) : null), [product, profile]);

  if (state.status === 'loading') {
    return (
      <main className="page" aria-busy="true">
        <p className="muted">Looking up {barcode}…</p>
      </main>
    );
  }
  if (state.status === 'error' || !product || !verdict) {
    return (
      <main className="page">
        <p className="error">Something went wrong looking up this product.</p>
        <Link className="btn btn-secondary" to={`/manual/${barcode}`}>Enter it from the label</Link>
      </main>
    );
  }

  const sourceLabel =
    state.source === 'saved' && product.source === 'manual' ? SOURCE_LABELS.manual
    : state.source === 'saved' && product.source === 'off' ? `${SOURCE_LABELS.off} (saved on this phone)`
    : SOURCE_LABELS[state.source];

  return (
    <main className="page">
      <header className="product-head">
        <h1>{product.name}</h1>
        <p className="muted">
          {product.brand && <>{product.brand} · </>}
          <span>{barcode}</span>
        </p>
      </header>

      <VerdictCard verdict={verdict} />

      {verdict.proteinWashing && (
        <p className="chip chip-warn" data-testid="protein-washing">
          ⚠ Protein-washing
        </p>
      )}

      <section className="card metrics" aria-label="Protein numbers">
        <div className="metric">
          <span className="metric-value">{fmt(verdict.proteinPer100Kcal)} g</span>
          <span className="metric-label">protein per 100 kcal</span>
        </div>
        <div className="metric">
          <span className="metric-value">{fmt(verdict.proteinPerServingG)} g</span>
          <span className="metric-label">
            protein per serving
            {verdict.servingAssumed ? ' (per 100 g, serving size not given)' : product.servingSizeG ? ` (${fmt(product.servingSizeG)} g)` : ''}
          </span>
        </div>
        <div className="metric">
          <span className="metric-value">{fmt(verdict.proteinPer100Inr)} g</span>
          <span className="metric-label">protein per ₹100</span>
        </div>
      </section>

      <PriceEditor
        product={product}
        onSave={(o) => {
          saveOverride(barcode, o);
          setOverride(o);
        }}
      />

      {verdict.missing.length > 0 && (
        <section className="card" data-testid="missing-data">
          <h2>Data missing</h2>
          <p className="muted small">The verdict may change once these are known:</p>
          <ul>
            {verdict.missing.map((m) => (
              <li key={m}>{NUTRIENT_LABELS[m] ?? m}</li>
            ))}
          </ul>
          <Link to={`/manual/${barcode}`}>Add them from the label</Link>
        </section>
      )}

      <details className="card">
        <summary>Nutrition per 100 g</summary>
        <table className="nutrition">
          <tbody>
            {(Object.keys(NUTRIENT_LABELS) as (keyof typeof NUTRIENT_LABELS)[]).map((k) => (
              <tr key={k}>
                <th scope="row">{NUTRIENT_LABELS[k]}</th>
                <td>{fmt(product.nutrients[k])}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="small">
          Diet: {DIET_TYPE_LABELS[product.dietType]}
          {product.allergens.length > 0 && <> · Allergens: {product.allergens.map((a) => ALLERGEN_LABELS[a]).join(', ')}</>}
        </p>
        {product.ingredientsText && <p className="small muted">Ingredients: {product.ingredientsText}</p>}
      </details>

      <p className="small muted" data-testid="source-label">Source: {sourceLabel}</p>
      <div className="row">
        <Link className="btn btn-secondary" to="/">Scan another</Link>
        <Link className="btn btn-link" to={`/manual/${barcode}`}>Edit product data</Link>
      </div>
    </main>
  );
}

function PriceEditor({ product, onSave }: { product: Product; onSave: (o: ProductOverride) => void }) {
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState(product.priceInr?.toString() ?? '');
  const [pack, setPack] = useState(product.packSizeG?.toString() ?? '');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const p = Number(price);
    const g = Number(pack);
    onSave({
      priceInr: price !== '' && p > 0 ? p : undefined,
      packSizeG: pack !== '' && g > 0 ? g : undefined,
    });
    setOpen(false);
  };

  if (!open) {
    return (
      <p className="small">
        Price: {product.priceInr != null ? `₹${fmt(product.priceInr)}` : 'not set'} · Pack:{' '}
        {product.packSizeG != null ? `${fmt(product.packSizeG)} g` : 'not set'}{' '}
        <button type="button" className="btn-link" data-testid="price-edit" onClick={() => setOpen(true)}>
          Edit price / pack size
        </button>
      </p>
    );
  }
  return (
    <form className="card row-wrap" onSubmit={submit} data-testid="price-form">
      <label>
        Price paid (₹)
        <input type="number" inputMode="decimal" min="0" step="any" value={price} onChange={(e) => setPrice(e.target.value)} data-testid="price-input" />
      </label>
      <label>
        Pack size (g)
        <input type="number" inputMode="decimal" min="0" step="any" value={pack} onChange={(e) => setPack(e.target.value)} data-testid="pack-input" />
      </label>
      <div className="row">
        <button type="submit" className="btn btn-primary" data-testid="price-save">Save</button>
        <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </form>
  );
}
