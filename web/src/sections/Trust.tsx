import { useRef } from 'react'
import { SectionHead } from '../components/SectionHead.tsx'
import { useReveal } from '../motion/reveal.ts'

/** Open scoring rules, summarised from docs/scoring-rules.md (v1). Keep in sync with that file. */
const RULES = {
  red: [
    'Contains an allergen you selected',
    'Clashes with your diet (non-veg for vegetarian, egg for no-egg)',
    'Lists hydrogenated or partially hydrogenated oil',
    'High in two or more of: sugar > 22.5 g, saturated fat > 5 g, salt > 1.5 g per 100 g',
  ],
  cut: [
    ['Green', '≥ 10 g protein per 100 kcal and sugar ≤ 5 g'],
    ['Yellow', '5–10 g protein per 100 kcal, or sugar 5–15 g'],
    ['Orange', '< 5 g protein per 100 kcal with > 400 kcal, or sugar > 15 g'],
  ],
  bulk: [
    ['Green', '≥ 15 g protein per serving, or ≥ 10 g per 100 kcal'],
    ['Yellow', '8–15 g protein per serving'],
    ['Orange', '< 8 g per serving and sugar > 15 g'],
  ],
}

export function Trust() {
  const root = useRef<HTMLElement>(null)
  useReveal(root)
  return (
    <section ref={root} className="sec" id="trust" aria-labelledby="trust-title">
      <div className="wrap">
        <SectionHead
          id="trust-title"
          eyebrow="Why you can trust it"
          title={
            <>
              Open rules. <span className="hl-ink">No brand money.</span>
            </>
          }
          lede="You should be able to check our working. So the rules are public, the data source is named, and no brand can pay for a better colour."
        />

        <div className="trust-grid">
          <article className="rules js-rv" id="rules" aria-labelledby="rules-title">
            <header className="rules-head">
              <h3 id="rules-title" className="rules-title">
                Scoring rules
              </h3>
              <span className="mono rules-v">v1 · per 100 g unless noted</span>
            </header>
            <div className="rules-block">
              <h4 className="rules-k">Red for every goal, if any one is true</h4>
              <ul className="rules-list">
                {RULES.red.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
            <div className="rules-block">
              <h4 className="rules-k">Fat loss</h4>
              <dl className="rules-dl">
                {RULES.cut.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="rules-block">
              <h4 className="rules-k">Muscle gain</h4>
              <dl className="rules-dl">
                {RULES.bulk.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="rules-block rules-block--last">
              <h4 className="rules-k">Protein-washing flag</h4>
              <p>The pack claims "high protein" but protein is under 20% of calories.</p>
            </div>
            <p className="rules-note">
              These are v1 starting points. Changes happen in the open, and we'll switch to FSSAI's front-of-pack thresholds once those are final.
            </p>
          </article>

          <div className="trust-side">
            <div className="tcard card js-rv">
              <span className="tcard-k mono">Data</span>
              <h3 className="tcard-t">From Open Food Facts, and from you</h3>
              <p>
                Product data comes from Open Food Facts, the open food database. Indian coverage is still thin, so every missing product you add
                is saved for everyone who scans it next.
              </p>
            </div>
            <div className="tcard card js-rv">
              <span className="tcard-k mono">Money</span>
              <h3 className="tcard-t">No brand money in our ratings</h3>
              <p>Brands can't pay for a better colour or a spot in your swaps. We earn from Pro, not from the products we rate.</p>
            </div>
            <div className="tcard card tcard--c3 js-rv">
              <span className="tcard-k mono">Next</span>
              <h3 className="tcard-t">A pilot with one gym is starting soon</h3>
            </div>
          </div>
        </div>

        <figure className="founder card js-rv">
          <span className="founder-quote display" aria-hidden="true">
            “
          </span>
          <blockquote className="founder-text">
            <p>
              I'm a B.Tech CS student, and I'm building this for my own gym routine. I kept standing in shop aisles trying to work out whether a
              bar fit my cut, and the label never told me. So I'm making the app I wanted: one scan, one honest colour for my goal. The rules are
              public, and no brand will ever pay for a verdict.
            </p>
          </blockquote>
          <figcaption className="founder-sign">
            <span className="founder-avatar mono" aria-hidden="true">
              G
            </span>
            <span>
              <strong>Golu</strong>, founder
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
