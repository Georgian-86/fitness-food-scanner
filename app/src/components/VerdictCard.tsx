import type { Verdict } from '../scoring';
import { COLOUR_ICON } from './labels';

export default function VerdictCard({ verdict }: { verdict: Verdict }) {
  return (
    <section
      className={`verdict verdict-${verdict.colour}`}
      data-testid="verdict-card"
      data-colour={verdict.colour}
      aria-live="polite"
    >
      <h2 className="verdict-headline">
        <span className="verdict-icon" aria-hidden="true">{COLOUR_ICON[verdict.colour]}</span>
        <span data-testid="verdict-headline">{verdict.headline}</span>
      </h2>
      <p className="verdict-reason" data-testid="verdict-reason">{verdict.reason}</p>
      {verdict.notes.length > 0 && (
        <ul className="verdict-notes" data-testid="verdict-notes">
          {verdict.notes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
