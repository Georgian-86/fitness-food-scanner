import { Link } from 'react-router-dom';
import { scoreProduct } from '../scoring';
import { findFixture } from '../data/fixtures';
import { applyOverride, getHistory, getOverride, getSavedProduct } from '../data/storage';
import { COLOUR_ICON } from '../components/labels';
import { useProfile } from '../profile';

export default function History() {
  const { profile } = useProfile();
  const items = getHistory();

  return (
    <main className="page">
      <h1>History</h1>
      {items.length === 0 ? (
        <p className="muted">Nothing scanned yet. <Link to="/">Scan a product</Link>.</p>
      ) : (
        <ul className="list history" data-testid="history-list">
          {items.map((h) => {
            const base = getSavedProduct(h.barcode) ?? findFixture(h.barcode);
            const p = base ? applyOverride(base, getOverride(h.barcode)) : null;
            const v = p && profile ? scoreProduct(p, profile) : null;
            return (
              <li key={h.barcode} data-testid="history-item">
                <Link to={`/product/${h.barcode}`} className="history-link">
                  {v && (
                    <span className={`dot dot-${v.colour}`} aria-hidden="true">{COLOUR_ICON[v.colour]}</span>
                  )}
                  <span className="history-text">
                    <span className="history-name">{p?.name ?? h.name ?? h.barcode}</span>
                    <span className="muted small">
                      {v ? `${v.headline} · ` : ''}
                      {new Date(h.at).toLocaleDateString()}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
