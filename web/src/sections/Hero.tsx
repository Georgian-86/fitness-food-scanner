import { useRef } from 'react'
import { SafeChana as Chana } from '../components/SafeChana.tsx'
import { GoalToggle } from '../components/GoalToggle.tsx'
import { Phone } from '../components/Phone.tsx'
import { ProteinBar } from '../components/ProteinBar.tsx'
import { ScanTile } from '../components/ScanTile.tsx'
import { SignupForm } from '../components/SignupForm.tsx'
import { VerdictCard } from '../components/VerdictCard.tsx'
import { DEMO_BAR } from '../content/demo.ts'
import { VerdictChip } from '../content/verdicts.tsx'
import { MOTION_OK } from '../motion/media.ts'
import { gsap, useGSAP } from '../motion/engine.ts'

const TRUST = ['Scanning free forever', 'No brand money in our ratings', 'Open scoring rules', 'Built in India']

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        // Entrance (time-based, once).
        const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 0.8 } })
        tl.from('.js-hl', { yPercent: 60, opacity: 0, stagger: 0.08 })
          .from('.js-hero-copy > *', { y: 24, opacity: 0, stagger: 0.06, duration: 0.7 }, 0.25)
          .from('.js-hero-phone', { y: 60, rotate: 4, opacity: 0, duration: 0.9 }, 0.2)
          .from('.js-pop', { scale: 0.6, opacity: 0, stagger: 0.1, ease: 'back.out(2.2)', duration: 0.6 }, 0.55)

        // Scroll: the visual drifts up a little as the hero leaves (scrubbed, transform only).
        gsap.to('.js-hero-drift', {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} className="hero" id="top" aria-labelledby="hero-title">
      <div className="wrap">
        <h1 id="hero-title" className="hero-title display">
          <span className="hl-mask">
            <span className="hl js-hl">Same snack.</span>
          </span>
          <span className="hl-mask">
            <span className="hl hl--sticker js-hl">Different</span>
          </span>
          <span className="hl-mask hl-mask--last">
            <span className="hl js-hl">Verdict.</span>
            <span className="hl-badge js-pop" aria-hidden="true">
              cut or bulk?
            </span>
          </span>
        </h1>

        <div className="hero-grid">
          <div className="hero-copy js-hero-copy">
            <p className="hero-sub">
              Scan any packaged food and see if it fits <strong>your</strong> goal, cutting or bulking, in about a second. One colour, one
              reason, no label maths.
            </p>
            {/* Narrow screens: the claim made visible before the form (desktop shows the phone). */}
            <div className="hero-mini card" role="group" aria-label="Example: the same protein bar, two goals">
              <div className="hero-mini-top">
                <ProteinBar className="hero-mini-bar" />
                <span className="hero-mini-name">
                  Protein bar <span className="mono">60 g · ₹60</span>
                </span>
              </div>
              <div className="hero-mini-row">
                <span className="hero-mini-goal mono">Cutting</span>
                <VerdictChip verdict="orange" />
              </div>
              <div className="hero-mini-row">
                <span className="hero-mini-goal mono">Bulking</span>
                <VerdictChip verdict="green" />
              </div>
            </div>
            <SignupForm source="hero" id="signup" className="hero-form" />
            <ul className="trust" aria-label="Our promises">
              {TRUST.map((t) => (
                <li key={t} className="trust-item">
                  <span className="trust-tick" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="hero-visual js-hero-drift">
            <div className="js-hero-phone hero-phone-wrap">
              <Phone className="hero-phone">
                <GoalToggle goal="cut" />
                <ScanTile />
                <VerdictCard verdict="orange" goalLabel="Fat loss" reason={DEMO_BAR.cut.reason} />
              </Phone>
              <div className="hero-chana js-pop">
                <Chana mood="caution" size={128} />
              </div>
              <div className="hero-note card js-pop">
                <span className="hero-note-k mono">Same bar, bulking</span>
                <VerdictChip verdict="green" />
                <span className="hero-note-r">{DEMO_BAR.bulk.reason}</span>
              </div>
              <span className="hero-star js-pop" aria-hidden="true">
                <span className="mono">₹60</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
