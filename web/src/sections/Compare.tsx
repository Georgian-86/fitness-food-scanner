import { useRef } from 'react'
import { SectionHead } from '../components/SectionHead.tsx'
import { useReveal } from '../motion/reveal.ts'

type Mark = 'yes' | 'no' | 'some'
type Cell = { mark: Mark; text: string }

const COLS = ['Same-score-for-everyone scanners', 'Calorie trackers', 'chana.'] as const

// Category comparison only, per the trust rules in docs/brand.md: no named competitors.
const ROWS: { label: string; cells: [Cell, Cell, Cell] }[] = [
  { label: 'Judges the food', cells: [{ mark: 'yes', text: 'Yes' }, { mark: 'no', text: 'No, it logs it' }, { mark: 'yes', text: 'Yes, every scan' }] },
  { label: 'Knows your goal', cells: [{ mark: 'no', text: 'No, one score for all' }, { mark: 'yes', text: 'Yes' }, { mark: 'yes', text: 'Yes, cut or bulk' }] },
  { label: 'Protein per ₹100', cells: [{ mark: 'no', text: 'Not usually' }, { mark: 'no', text: 'Not usually' }, { mark: 'yes', text: 'On every scan' }] },
  {
    label: 'Indian products & OCR fallback',
    cells: [{ mark: 'some', text: 'Varies' }, { mark: 'some', text: 'Varies' }, { mark: 'yes', text: 'Indian shelves first; snap the label if missing' }],
  },
  { label: 'No brand money', cells: [{ mark: 'some', text: 'Varies' }, { mark: 'some', text: 'Varies' }, { mark: 'yes', text: 'None, ever' }] },
]

function MarkIcon({ mark }: { mark: Mark }) {
  const label = mark === 'yes' ? 'Yes' : mark === 'no' ? 'No' : 'Varies'
  return (
    <span className={`mk mk--${mark}`} role="img" aria-label={label}>
      <svg viewBox="0 0 20 20" aria-hidden="true">
        {mark === 'yes' && <path d="M4.5 10.5l3.6 3.6L15.5 6.5" />}
        {mark === 'no' && <path d="M6 6l8 8M14 6l-8 8" />}
        {mark === 'some' && <path d="M5 10h10" />}
      </svg>
    </span>
  )
}

export function Compare() {
  const root = useRef<HTMLElement>(null)
  useReveal(root)
  return (
    <section ref={root} className="sec sec--band" id="compare" aria-labelledby="compare-title">
      <div className="wrap">
        <SectionHead
          id="compare-title"
          eyebrow="Why it's different"
          tone="c2"
          title="Scanners judge. Trackers count. We do both, for you."
          lede="Most apps either give every person the same score, or log what you ate without judging the product. We join the two."
        />
        <div className="cmp-wrap js-rv">
          <table className="cmp">
            <caption className="sr-only">How chana. compares with other kinds of food apps</caption>
            <thead>
              <tr>
                <td />
                {COLS.map((c, i) => (
                  <th key={c} scope="col" className={i === 2 ? 'cmp-us' : ''}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.label}>
                  <th scope="row">{r.label}</th>
                  {r.cells.map((c, i) => (
                    <td key={i} className={i === 2 ? 'cmp-us' : ''} data-col={COLS[i]}>
                      <span className="cmp-cell">
                        <MarkIcon mark={c.mark} />
                        <span>{c.text}</span>
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
