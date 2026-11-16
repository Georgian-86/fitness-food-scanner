import { lazy, Suspense, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { looksLikeBarcode } from '../data/barcode';
import { FIXTURES } from '../data/fixtures';
import { getHistory } from '../data/storage';
import { GOAL_LABELS } from '../components/labels';
import { useProfile } from '../profile';

const Scanner = lazy(() => import('../scan/Scanner'));

export default function Home() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [scanning, setScanning] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const recent = getHistory().slice(0, 5);

  const go = (barcode: string) => navigate(`/product/${barcode}`);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const c = code.replace(/\s+/g, '');
    if (!looksLikeBarcode(c)) {
      setError('Enter the 8 to 13 digit number printed under the barcode.');
      return;
    }
    setError('');
    go(c);
  };

  return (
    <main className="page">
      <h1>Scan a product</h1>
      {profile && (
        <p className="muted">
          Goal: <strong>{GOAL_LABELS[profile.goal].title}</strong> · <Link to="/settings">change</Link>
        </p>
      )}

      {scanning ? (
        <Suspense fallback={<p className="muted">Loading scanner…</p>}>
          <Scanner onDetected={(c) => { setScanning(false); go(c); }} onClose={() => setScanning(false)} />
        </Suspense>
      ) : (
        <button type="button" className="btn btn-primary btn-block btn-large" data-testid="scan-button" onClick={() => setScanning(true)}>
          📷 Scan barcode
        </button>
      )}

      <form className="card barcode-form" onSubmit={submit} noValidate>
        <label htmlFor="barcode">Or type the barcode number</label>
        <div className="row">
          <input
            id="barcode"
            data-testid="barcode-input"
            inputMode="numeric"
            autoComplete="off"
            pattern="[0-9]*"
            placeholder="e.g. 8901000000019"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'barcode-error' : undefined}
          />
          <button type="submit" className="btn btn-primary" data-testid="barcode-submit">Check</button>
        </div>
        {error && <p id="barcode-error" className="error" role="alert">{error}</p>}
      </form>

      {recent.length > 0 && (
        <section>
          <h2>Recent</h2>
          <ul className="list">
            {recent.map((h) => (
              <li key={h.barcode}>
                <Link to={`/product/${h.barcode}`}>{h.name ?? h.barcode}</Link>
              </li>
            ))}
          </ul>
          <Link to="/history">See all history</Link>
        </section>
      )}

      <details className="card">
        <summary>Try a demo product</summary>
        <p className="muted small">Built-in examples, useful when you have no pack in hand.</p>
        <ul className="list">
          {FIXTURES.map((f) => (
            <li key={f.barcode}>
              <Link to={`/product/${f.barcode}`}>{f.name}</Link> <span className="muted small">{f.barcode}</span>
            </li>
          ))}
        </ul>
      </details>
    </main>
  );
}
