import { useRef } from 'react'
import { MOTION_OK } from '../motion/media.ts'
import { gsap, useGSAP } from '../motion/engine.ts'

const ITEMS = ['Protein per ₹100', 'Sugar per 100 g', 'Your goal, not ours', 'One reason line', 'Two better swaps', 'Indian shelves first']

/** A tilted band that slides with the scroll (scrubbed xPercent). Static when motion is reduced. */
export function Ticker() {
  const root = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '.js-ticker',
          { xPercent: 0 },
          { xPercent: -25, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
        )
      })
      return () => mm.revert()
    },
    { scope: root },
  )
  const row = [...ITEMS, ...ITEMS, ...ITEMS]
  return (
    <div ref={root} className="ticker" aria-hidden="true">
      <div className="ticker-track js-ticker">
        {row.map((t, i) => (
          <span key={i} className="ticker-item">
            {t}
            <span className="ticker-star">✶</span>
          </span>
        ))}
      </div>
    </div>
  )
}
