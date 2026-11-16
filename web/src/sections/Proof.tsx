import { useRef } from 'react'
import type { ChanaMood } from '../mascot'
import { SafeChana as Chana } from '../components/SafeChana.tsx'
import { GoalToggle } from '../components/GoalToggle.tsx'
import { Phone } from '../components/Phone.tsx'
import { ScanTile } from '../components/ScanTile.tsx'
import { StoreChana } from '../components/StoreChana.tsx'
import { VerdictCard } from '../components/VerdictCard.tsx'
import { DEMO_BAR } from '../content/demo.ts'
import { gsap, useGSAP } from '../motion/engine.ts'
import { PIN_OK, STACK_MOTION } from '../motion/media.ts'
import { createStore } from '../motion/store.ts'

const STEPS = [
  { n: '01', title: 'Scan the barcode', line: 'Point your camera at the pack. No match yet? Snap the nutrition label instead.' },
  { n: '02', title: 'Cutting? Orange.', line: `Goal set to fat loss. ${DEMO_BAR.cut.reason}` },
  { n: '03', title: 'Bulking? Green.', line: `Same bar, goal set to muscle gain. ${DEMO_BAR.bulk.reason}` },
  { n: '04', title: 'Value, in rupees', line: '₹60 for 15 g protein. That is 25 g protein per ₹100, on every scan.' },
]

/** Step boundaries of the pinned timeline, as progress (0..1). Chana's mood changes only here. */
const STEP_AT = [0, 0.24, 0.46, 0.68]
const MOODS: ChanaMood[] = ['scanning', 'caution', 'happy', 'celebrate']
const stageMood = createStore<ChanaMood>('scanning')

function Header() {
  return (
    <div className="proof-head">
      <span className="sticker">The proof</span>
      <h2 className="display proof-title">
        One bar.
        <br />
        Two goals.
        <br />
        <span className="hl-ink">Two verdicts.</span>
      </h2>
      <p className="proof-lede">
        Labels don't know if you're cutting or bulking. We do. Scroll to scan the same ₹{DEMO_BAR.priceRs} bar for two different goals.
      </p>
    </div>
  )
}

function ValueCard({ className = '' }: { className?: string }) {
  return (
    <div className={`value card ${className}`}>
      <span className="value-k mono">Protein per ₹100</span>
      <span className="value-n display">
        <span className="js-count">{DEMO_BAR.proteinPerRs100}</span>
        <span className="value-u"> g</span>
      </span>
      <span className="meter" aria-hidden="true">
        <span className="meter-fill js-meter" />
      </span>
      <span className="value-math mono">15 g protein ÷ ₹60 × 100</span>
    </div>
  )
}

export function Proof() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Desktop: one pinned, scrubbed timeline.
      mm.add(PIN_OK, () => {
        const q = gsap.utils.selector('.js-stage')
        const count = { v: 0 }
        const countEl = q('.js-count')[0] as HTMLElement
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: '.js-pin',
            start: 'top top',
            end: '+=2800',
            pin: true,
            scrub: true,
            refreshPriority: 1,
            onUpdate(self) {
              let i = 0
              while (i < STEP_AT.length - 1 && self.progress >= STEP_AT[i + 1]) i++
              stageMood.set(MOODS[i])
            },
          },
        })
        // Initial frame, applied before the timeline records its start values.
        gsap.set(q('.js-found'), { opacity: 0 })
        gsap.set(q('.js-card-orange, .js-card-green'), { opacity: 0, y: 28 })
        gsap.set(q('.js-knob'), { x: 0, xPercent: 0 })
        gsap.set(q('.js-knob-cut'), { opacity: 1 })
        gsap.set(q('.js-knob-bulk'), { opacity: 0 })
        gsap.set(q('.js-meter'), { scaleX: 0 })
        gsap.set(q('.js-value'), { opacity: 0, y: 24 })
        gsap.set('.js-step-hl', { opacity: 0 })
        gsap.set('.js-step-hl-0', { opacity: 1 })
        countEl.textContent = '0'
        tl
          // 1. scan
          .fromTo(q('.js-beam'), { yPercent: 0 }, { yPercent: 92, duration: 0.8 })
          .to(q('.js-beam'), { yPercent: 0, duration: 0.8 })
          .to(q('.js-beam'), { yPercent: 46, duration: 0.4 })
          .to(q('.js-beam'), { opacity: 0, duration: 0.2 })
          .to(q('.js-found'), { opacity: 1, duration: 0.2 }, '<')
          // 2. cut -> orange
          .to('.js-step-hl-0', { opacity: 0, duration: 0.2 }, 2.4)
          .to('.js-step-hl-1', { opacity: 1, duration: 0.2 }, 2.4)
          .to(q('.js-card-orange'), { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 2.6)
          // 3. bulk -> green
          .to('.js-step-hl-1', { opacity: 0, duration: 0.2 }, 4.6)
          .to('.js-step-hl-2', { opacity: 1, duration: 0.2 }, 4.6)
          .to(q('.js-knob'), { x: 0, xPercent: 100, duration: 0.9, ease: 'power2.inOut' }, 4.8)
          .to(q('.js-knob-cut'), { opacity: 0, duration: 0.4 }, 5.0)
          .to(q('.js-knob-bulk'), { opacity: 1, duration: 0.4 }, 5.1)
          .to(q('.js-card-orange'), { opacity: 0, y: -20, duration: 0.5 }, 5.0)
          .to(q('.js-card-green'), { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 5.2)
          // 4. value count-up
          .to('.js-step-hl-2', { opacity: 0, duration: 0.2 }, 6.8)
          .to('.js-step-hl-3', { opacity: 1, duration: 0.2 }, 6.8)
          .to(q('.js-value'), { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 6.9)
          .to(count, { v: DEMO_BAR.proteinPerRs100, duration: 1.4, onUpdate: () => (countEl.textContent = String(Math.round(count.v))) }, 7.1)
          .to(q('.js-meter'), { scaleX: 1, duration: 1.4 }, 7.1)
          .to({}, { duration: 1.4 })
        return () => stageMood.set('scanning')
      })

      // Mobile and tablet: no long pin, short scrubbed reveals per step.
      mm.add(STACK_MOTION, () => {
        gsap.utils.toArray<HTMLElement>('.js-pstep').forEach((card) => {
          gsap.from(card, { y: 48, opacity: 0, ease: 'none', scrollTrigger: { trigger: card, start: 'top 94%', end: 'top 66%', scrub: true } })
          const st = { trigger: card, start: 'top 78%', end: 'top 42%', scrub: true }
          const beam = card.querySelector('.js-beam')
          if (beam) gsap.fromTo(beam, { yPercent: 0 }, { yPercent: 92, ease: 'none', scrollTrigger: st })
          const knob = card.querySelector('.js-knob')
          if (knob) {
            const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: st })
            tl.fromTo(knob, { x: 0, xPercent: 0 }, { x: 0, xPercent: 100, duration: 1 })
              .fromTo(card.querySelector('.js-knob-cut'), { opacity: 1 }, { opacity: 0, duration: 0.4 }, 0.2)
              .fromTo(card.querySelector('.js-knob-bulk'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.4)
              .from(card.querySelector('.js-card-green'), { opacity: 0, y: 20, duration: 0.6 }, 0.5)
          }
          const count = card.querySelector<HTMLElement>('.js-count')
          if (count) {
            const c = { v: 0 }
            const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: st })
            tl.fromTo(c, { v: 0 }, { v: DEMO_BAR.proteinPerRs100, duration: 1, onUpdate: () => (count.textContent = String(Math.round(c.v))) })
              .fromTo(card.querySelector('.js-meter'), { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)
          }
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} className="proof" id="proof" aria-label="The proof: one bar, two goals">
      {/* Desktop pinned stage */}
      <div className="proof-pin js-pin">
        <div className="wrap proof-grid">
          <div className="proof-left">
            <Header />
            <ol className="steps">
              {STEPS.map((s, i) => (
                <li key={s.n} className="step">
                  <span className={`step-hl js-step-hl js-step-hl-${i}`} aria-hidden="true" />
                  <span className="step-n mono">{s.n}</span>
                  <span className="step-body">
                    <span className="step-t">{s.title}</span>
                    <span className="step-l">{s.line}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="stage js-stage">
            <div className="stage-device">
            <Phone className="stage-phone">
              <GoalToggle goal="bulk" />
              <ScanTile />
              <div className="vstack">
                <div className="vwait" aria-hidden="true">
                  Waiting for your goal…
                </div>
                <VerdictCard className="js-card-orange" verdict="orange" goalLabel="Fat loss" reason={DEMO_BAR.cut.reason} />
                <VerdictCard className="js-card-green" verdict="green" goalLabel="Muscle gain" reason={DEMO_BAR.bulk.reason} />
              </div>
            </Phone>
            <ValueCard className="stage-value js-value" />
            <div className="stage-chana">
              <StoreChana store={stageMood} size={150} />
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile, tablet and reduced motion: stacked, every state shown */}
      <div className="proof-stack wrap">
        <Header />
        <ol className="psteps">
          <li className="pstep card js-pstep">
            <StepHead i={0} />
            <ScanTile className="pstep-vis" />
          </li>
          <li className="pstep card js-pstep">
            <StepHead i={1} />
            <div className="pstep-vis">
              <GoalToggle goal="cut" />
              <VerdictCard verdict="orange" goalLabel="Fat loss" reason={DEMO_BAR.cut.reason} />
            </div>
            <Chana mood="caution" size={84} className="pstep-chana" />
          </li>
          <li className="pstep card js-pstep">
            <StepHead i={2} />
            <div className="pstep-vis">
              <GoalToggle goal="bulk" />
              <VerdictCard className="js-card-green" verdict="green" goalLabel="Muscle gain" reason={DEMO_BAR.bulk.reason} />
            </div>
            <Chana mood="happy" size={84} className="pstep-chana" />
          </li>
          <li className="pstep card js-pstep">
            <StepHead i={3} />
            <ValueCard className="pstep-vis value--flat" />
          </li>
        </ol>
      </div>
    </section>
  )
}

function StepHead({ i }: { i: number }) {
  const s = STEPS[i]
  return (
    <div className="pstep-head">
      <span className="step-n mono">{s.n}</span>
      <h3 className="step-t">{s.title}</h3>
      <p className="step-l">{s.line}</p>
    </div>
  )
}
