import { useRef } from 'react'
import { SectionHead } from '../components/SectionHead.tsx'
import { VERDICTS, VerdictChip } from '../content/verdicts.tsx'
import { useReveal } from '../motion/reveal.ts'

// One example reason line per colour, each consistent with docs/scoring-rules.md.
const EXAMPLES: Record<string, string> = {
  green: '15 g protein per bar: fits your bulk.',
  yellow: '8 g sugar per 100 g: fine for your cut, watch the portion.',
  orange: '18 g sugar per 100 g: high for your cut.',
  red: 'Lists peanut, which you marked as an allergen.',
}

export function Colours() {
  const root = useRef<HTMLElement>(null)
  useReveal(root)
  return (
    <section ref={root} className="sec" id="colours" aria-labelledby="colours-title">
      <div className="wrap">
        <SectionHead
          id="colours-title"
          eyebrow="The four colours"
          title="Four colours. Always with a reason."
          lede="Every colour comes with a label, an icon and one line that says why. Red means avoid for you, based on limits you set. It never means a food is bad."
        />
        <ul className="colours">
          {VERDICTS.map((v, i) => (
            <li key={v.key} className="colour card js-rv" data-rv-delay={String(i * 0.06)}>
              <span className="colour-swatch" style={{ background: v.colour }} aria-hidden="true" />
              <VerdictChip verdict={v.key} className="colour-chip" />
              <p className="colour-m">{v.meaning}</p>
              <p className="colour-ex mono">
                <span className="colour-ex-k">e.g.</span> {EXAMPLES[v.key]}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
