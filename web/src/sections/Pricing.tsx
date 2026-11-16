import { useRef } from 'react'
import { SectionHead } from '../components/SectionHead.tsx'
import { PLANS, PRICING_NOTE } from '../content/pricing.ts'
import { useReveal } from '../motion/reveal.ts'

export function Pricing() {
  const root = useRef<HTMLElement>(null)
  useReveal(root)
  return (
    <section ref={root} className="sec" id="pricing" aria-labelledby="pricing-title">
      <div className="wrap">
        <SectionHead
          id="pricing-title"
          eyebrow="Pricing"
          title="Scanning is free. Forever."
          lede="The verdict is never behind a paywall. Pro is for extras, and it pays for the app instead of brand money."
        />
        <div className="plans">
          {PLANS.map((p, i) => (
            <article key={p.id} className={`plan card js-rv ${p.founding ? 'plan--pro' : ''}`} data-rv-delay={String(i * 0.08)} aria-labelledby={`plan-${p.id}`}>
              <header className="plan-head">
                <h3 id={`plan-${p.id}`} className="plan-name">
                  {p.name}
                </h3>
                {p.founding && <span className="draft-tag mono">Draft</span>}
              </header>
              <p className="plan-price">
                <span className="display plan-amt">{p.price}</span>
                <span className="plan-per mono">{p.period}</span>
              </p>
              {p.founding && (
                <p className="founding">
                  <span className="founding-star" aria-hidden="true" />
                  {p.founding.note}
                </p>
              )}
              <p className="plan-blurb">{p.blurb}</p>
              <ul className="plan-list">
                {p.features.map((f) => (
                  <li key={f}>
                    <span className="trust-tick" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#join" className="btn plan-btn">
                <span className={`btn-face ${p.founding ? '' : 'btn-face--surface'}`}>{p.cta}</span>
              </a>
            </article>
          ))}
        </div>
        <p className="plans-note mono js-rv">{PRICING_NOTE}</p>
      </div>
    </section>
  )
}
