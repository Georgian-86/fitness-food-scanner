import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'
import { useEffect } from 'react'
import { prefersReduced } from './media.ts'

gsap.registerPlugin(ScrollTrigger, useGSAP)
ScrollTrigger.config({ ignoreMobileResize: true })

let lenis: Lenis | null = null
export const getLenis = () => lenis

/** Fallback journey progress when there is no master ScrollTrigger (reduced motion). */
export function scrollProgress(): number {
  const max = document.documentElement.scrollHeight - window.innerHeight
  return max <= 0 ? 1 : Math.min(1, Math.max(0, window.scrollY / max))
}

/**
 * One frame loop for everything: Lenis is driven by gsap.ticker, and ScrollTrigger updates on Lenis scroll.
 * Without motion (prefers-reduced-motion), native scrolling and no Lenis.
 * Call once, in App, after the sections (their layout effects run first).
 */
export function useScrollEngine(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    let raf: ((time: number) => void) | null = null
    if (!prefersReduced()) {
      lenis = new Lenis({ autoRaf: false, lerp: 0.12, anchors: { offset: -84 } })
      lenis.on('scroll', ScrollTrigger.update)
      raf = (time: number) => lenis?.raf(time * 1000)
      gsap.ticker.add(raf)
      gsap.ticker.lagSmoothing(0)
    }

    ScrollTrigger.sort()
    ScrollTrigger.refresh()
    let alive = true
    document.fonts?.ready.then(() => alive && ScrollTrigger.refresh())

    // Page height changes (accordions, late images) need fresh trigger positions, so "end: max" stays exact.
    let timer = 0
    let lastH = document.documentElement.scrollHeight
    const ro = new ResizeObserver(() => {
      const h = document.documentElement.scrollHeight
      if (h === lastH) return
      lastH = h
      window.clearTimeout(timer)
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 150)
    })
    if (root.current) ro.observe(root.current)

    return () => {
      alive = false
      ro.disconnect()
      window.clearTimeout(timer)
      if (raf) gsap.ticker.remove(raf)
      lenis?.destroy()
      lenis = null
    }
  }, [root])
}

export { gsap, ScrollTrigger, useGSAP }
