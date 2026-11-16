import { useRef } from 'react'
import { SectionHead } from '../components/SectionHead.tsx'
import { useReveal } from '../motion/reveal.ts'

const TRICKS = [
  { k: 'Front', t: 'Big claims up front', d: '"High protein" in huge letters. The numbers that matter sit in small print on the back.' },
  { k: 'Serving', t: 'Tiny serving sizes', d: 'Per-serving numbers look small when the serving is half of what anyone eats.' },
  { k: 'Score', t: 'One score for everyone', d: 'A single grade can\'t know whether you are cutting or bulking.' },
]

/** Illustrative example from docs/brand.md: a "high protein" cookie, 400 kcal and 12 g protein per 100 g. */
export function Problem() {
  const root = useRef<HTMLElement>(null)
  useReveal(root)
  return (
    <section ref={root} className="sec" id="problem" aria-labelledby="problem-title">
      <div className="wrap">
        <SectionHead
          id="problem-title"
          eyebrow="The problem"
          title={
            <>
              Labels are <span className="hl-ink">written to sell.</span>
            </>
          }
          lede="Protein-washing is when a pack shouts protein but most of its calories come from somewhere else. We do the maths on the back of the pack, so you don't have to."
        />

        <div className="wash">
          <div className="wash-front js-rv" aria-hidden="true">
            <span className="example-tag mono">Example</span>
            <div className="cookie">
              <span className="cookie-burst">
                <span>High</span>
                <span>protein!</span>
              </span>
              <span className="cookie-dots">
                <i />
                <i />
                <i />
                <i />
                <i />
              </span>
            </div>
            <p className="wash-cap mono">What the front says</p>
          </div>

          <div className="nlabel js-rv" data-rv-delay="0.08">
            <div className="nlabel-head">
              <span className="example-tag mono">Example</span>
              <h3 className="nlabel-title">Nutrition facts</h3>
              <span className="mono nlabel-sub">"High protein" cookie · per 100 g</span>
            </div>
            <table className="nlabel-table">
              <tbody>
                <tr className="nlabel-thick">
                  <th scope="row">Energy</th>
                  <td>400 kcal</td>
                </tr>
                <tr>
                  <th scope="row">Protein</th>
                  <td>12 g</td>
                </tr>
                <tr>
                  <th scope="row">Calories from protein</th>
                  <td>12 g × 4 = 48 kcal</td>
                </tr>
                <tr className="nlabel-thick">
                  <th scope="row">Protein share of calories</th>
                  <td>
                    <strong>12%</strong>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="nlabel-foot">
              <span className="flag">
                <span className="flag-icon" aria-hidden="true">!</span>
                Protein-washing flag
              </span>
              <p>Our line is 20% of calories from protein. This one is at 12%, so the scan shows the flag next to its colour.</p>
            </div>
          </div>
        </div>

        <ul className="tricks">
          {TRICKS.map((t, i) => (
            <li key={t.k} className="trick card js-rv" data-rv-delay={String(i * 0.06)}>
              <span className="trick-k mono">{t.k}</span>
              <h3 className="trick-t">{t.t}</h3>
              <p className="trick-d">{t.d}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
