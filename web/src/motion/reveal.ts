import type { RefObject } from 'react'
import { gsap, useGSAP } from './engine.ts'
import { MOTION_OK } from './media.ts'

/**
 * Section entrance: every `.js-rv` inside `scope` rises in once as it enters (expo.out, 0.7 s, transform + opacity).
 * Time-based and played once, so content near the very bottom of the page is never left half-revealed.
 * Without motion nothing is hidden.
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>('.js-rv').forEach((el) => {
          gsap.from(el, {
            y: 36,
            opacity: 0,
            duration: 0.7,
            ease: 'expo.out',
            delay: Number(el.dataset.rvDelay ?? 0),
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          })
        })
      })
      return () => mm.revert()
    },
    { scope },
  )
}
