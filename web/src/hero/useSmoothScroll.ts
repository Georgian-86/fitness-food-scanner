import gsap from 'gsap'
import Lenis from 'lenis'
import { useEffect } from 'react'
import { useReducedMotion } from './useMedia.ts'

/** Lenis driven by the GSAP ticker so scroll and timelines share one frame loop. */
export function useSmoothScroll() {
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ autoRaf: false, anchors: true, lerp: 0.1 })
    const update = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(update)
      lenis.destroy()
    }
  }, [reduced])
}
