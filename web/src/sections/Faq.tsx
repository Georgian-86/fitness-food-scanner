import { useId, useRef, useState } from 'react'
import { SectionHead } from '../components/SectionHead.tsx'
import { useReveal } from '../motion/reveal.ts'

const FAQS = [
  {
    q: 'Is scanning really free?',
    a: 'Yes. Unlimited scans, the colour verdict, the reason line and protein per ₹100 are free forever. Pro adds extras like better swaps and a weekly goal report.',
  },
  {
    q: 'Where does the data come from?',
    a: 'Product data comes from Open Food Facts, an open food database, plus products people add by photographing the label. The scoring rules are published on this page.',
  },
  {
    q: "What if my product isn't found?",
    a: 'Snap the nutrition label. We read it with OCR, you confirm the numbers, and the product is saved for everyone who scans it next. Chana gives you bonus XP for it.',
  },
  {
    q: 'Is this medical advice?',
    a: "No. It's a guide based on limits you set, like your goal, allergens and diet. If you have a medical condition or special dietary needs, check with a qualified professional.",
  },
  {
    q: 'Android or iPhone?',
    a: 'Android comes first, because most people using fitness apps in India are on Android. iPhone is planned after that.',
  },
  {
    q: 'When does it launch?',
    a: "There's no date yet. A pilot with one gym is starting soon, and early-access signups open after that. Founding members hear first.",
  },
]

export function Faq() {
  const root = useRef<HTMLElement>(null)
  const [open, setOpen] = useState<number | null>(0)
  const uid = useId()
  useReveal(root)
  return (
    <section ref={root} className="sec sec--band" id="faq" aria-labelledby="faq-title">
      <div className="wrap faq-grid">
        <SectionHead id="faq-title" eyebrow="FAQ" tone="c2" title="Fair questions." />
        <div className="faq js-rv">
          {FAQS.map((f, i) => {
            const isOpen = open === i
            const bid = `${uid}-b${i}`
            const pid = `${uid}-p${i}`
            return (
              <div key={f.q} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
                <h3 className="faq-h">
                  <button id={bid} type="button" className="faq-q" aria-expanded={isOpen} aria-controls={pid} onClick={() => setOpen(isOpen ? null : i)}>
                    <span>{f.q}</span>
                    <span className="faq-sign" aria-hidden="true" />
                  </button>
                </h3>
                <div id={pid} role="region" aria-labelledby={bid} className="faq-a" hidden={!isOpen}>
                  <p>{f.a}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
