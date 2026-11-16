import { useRef } from 'react'
import { SectionHead } from '../components/SectionHead.tsx'
import { VerdictChip } from '../content/verdicts.tsx'
import { useReveal } from '../motion/reveal.ts'

function IconGoal() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="how-ico">
      <circle cx="32" cy="32" r="26" fill="var(--surface)" stroke="var(--ink)" strokeWidth="4" />
      <circle cx="32" cy="32" r="16" fill="var(--c2)" stroke="var(--ink)" strokeWidth="4" />
      <circle cx="32" cy="32" r="6" fill="var(--surface)" stroke="var(--ink)" strokeWidth="4" />
    </svg>
  )
}
function IconScan() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="how-ico">
      <rect x="6" y="12" width="52" height="40" rx="6" fill="var(--surface)" stroke="var(--ink)" strokeWidth="4" />
      {[14, 19, 22, 28, 31, 36, 41, 44, 49].map((x, i) => (
        <rect key={x} x={x} y="20" width={i % 3 === 0 ? 3 : 2} height="24" fill="#0A0A0A" />
      ))}
      <rect x="2" y="30" width="60" height="5" fill="var(--c1)" stroke="var(--ink)" strokeWidth="2" />
    </svg>
  )
}

export function HowItWorks() {
  const root = useRef<HTMLElement>(null)
  useReveal(root)
  return (
    <section ref={root} className="sec sec--band" id="how" aria-labelledby="how-title">
      <div className="wrap">
        <SectionHead id="how-title" eyebrow="How it works" tone="c2" title="Three steps. About a second." />
        <ol className="how">
          <li className="how-step card js-rv">
            <span className="how-n display">1</span>
            <IconGoal />
            <h3 className="how-t">Set your goal once</h3>
            <p className="how-d">Fat loss or muscle gain. Add allergens and your diet, like vegetarian or no egg, if you want them checked too.</p>
          </li>
          <li className="how-step card js-rv" data-rv-delay="0.08">
            <span className="how-n display">2</span>
            <IconScan />
            <h3 className="how-t">Scan the barcode, or snap the label if it's missing</h3>
            <p className="how-d">Barcode first. If the product isn't in our data yet, photograph the nutrition label and we read the numbers.</p>
          </li>
          <li className="how-step card js-rv" data-rv-delay="0.16">
            <span className="how-n display">3</span>
            <span className="how-chips" aria-hidden="true">
              <VerdictChip verdict="green" />
            </span>
            <h3 className="how-t">Get a colour, one reason, and two better swaps</h3>
            <p className="how-d">
              Your colour, the number behind it, and two picks from the same shelf that suit your goal better.{' '}
              <span className="pro-tag mono">Swaps: Pro</span>
            </p>
          </li>
        </ol>
      </div>
    </section>
  )
}
