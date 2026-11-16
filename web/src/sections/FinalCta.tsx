import { useRef } from 'react'
import type { ChanaMood } from '../mascot'
import { SignupForm } from '../components/SignupForm.tsx'
import { StoreChana } from '../components/StoreChana.tsx'
import { Wordmark } from '../components/Wordmark.tsx'
import { VerdictChip } from '../content/verdicts.tsx'
import { gsap, useGSAP } from '../motion/engine.ts'
import { REDUCED } from '../motion/media.ts'
import { useReveal } from '../motion/reveal.ts'
import { createStore } from '../motion/store.ts'

/** Chana here is set by the journey timeline: happy on the way in, celebrate at the very last scroll. */
export const ctaMood = createStore<ChanaMood>('happy')

export function FinalCta() {
  const root = useRef<HTMLElement>(null)
  useReveal(root)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(REDUCED, () => {
      ctaMood.set('celebrate')
      return () => ctaMood.set('happy')
    })
    return () => mm.revert()
  })
  return (
    <section ref={root} className="final" id="join" aria-labelledby="final-title">
      <div className="wrap">
        <div className="final-box js-rv">
          <div className="final-copy">
            <span className="sticker">Early access</span>
            <h2 id="final-title" className="display final-title">
              Scan before
              <br />
              you buy.
            </h2>
            <p className="final-sub">Know in about a second if it fits your goal. Free to scan, forever.</p>
            <SignupForm source="final-cta" className="final-form" />
          </div>
          <div className="final-visual" aria-hidden="true">
            <span className="final-chip">
              <VerdictChip verdict="green" />
            </span>
            <StoreChana store={ctaMood} size={200} className="final-chana" />
          </div>
        </div>
      </div>
    </section>
  )
}

const LINKS = [
  { href: '#how', label: 'How it works' },
  { href: '#rules', label: 'Scoring rules' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
]

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot-inner">
        <Wordmark />
        <nav aria-label="Footer" className="foot-links">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="nav-link">
              {l.label}
            </a>
          ))}
        </nav>
        <p className="foot-note">
          <strong>Not medical advice.</strong> Verdicts are a guide based on limits you set. Product data from Open Food Facts. Built in India.
        </p>
      </div>
    </footer>
  )
}
