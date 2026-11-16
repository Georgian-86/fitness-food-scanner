import { useRef } from 'react'
import type { ChanaMood } from '../mascot'
import { StoreChana } from '../components/StoreChana.tsx'
import { VerdictChip } from '../content/verdicts.tsx'
import { gsap, scrollProgress, useGSAP } from '../motion/engine.ts'
import { MOTION_OK } from '../motion/media.ts'
import { createStore } from '../motion/store.ts'
import { ctaMood } from './FinalCta.tsx'

const railMood = createStore<ChanaMood>('idle')

function moodFor(p: number): ChanaMood {
  if (p >= 0.985) return 'celebrate'
  if (p >= 0.6) return 'thinking'
  if (p >= 0.03) return 'scanning'
  return 'idle'
}

/**
 * The page-wide journey: ONE timeline scrubbed from the top (0) to the last scroll ("max").
 * A bar sticker travels down the rail, the meter fills, and the final frame lands on green with Chana celebrating.
 * It is built from progress only, so it stays exact however long the page gets.
 */
export function JourneyRail() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      window.__journeyProgress = scrollProgress
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            id: 'journey',
            trigger: document.documentElement,
            start: 0,
            end: 'max',
            scrub: true,
            refreshPriority: -10,
            onUpdate: (self) => {
              railMood.set(moodFor(self.progress))
              ctaMood.set(self.progress >= 0.985 ? 'celebrate' : 'happy')
            },
          },
        })
        tl.fromTo('.js-rail-fill', { scaleY: 0 }, { scaleY: 1, duration: 1 }, 0)
          .fromTo('.js-rail-runner', { yPercent: 0 }, { yPercent: 100, duration: 1 }, 0)
          .fromTo(document.querySelectorAll('.js-journey-bar'), { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)
          .fromTo('.js-rail-tag', { rotate: -8 }, { rotate: 8, duration: 1 }, 0)
          .fromTo('.js-rail-done', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.03 }, 0.97)
        window.__journeyProgress = () => tl.scrollTrigger?.progress ?? scrollProgress()
        return () => {
          window.__journeyProgress = scrollProgress
          railMood.set('idle')
        }
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <div ref={root} className="rail" aria-hidden="true">
      <span className="rail-label mono">scan</span>
      <div className="rail-track">
        <span className="rail-fill js-rail-fill" />
        <span className="rail-runner js-rail-runner">
          <span className="rail-tag js-rail-tag">
            <span className="rail-tag-code" />
          </span>
        </span>
      </div>
      <span className="rail-done js-rail-done">
        <VerdictChip verdict="green" />
      </span>
      <StoreChana store={railMood} size={56} />
    </div>
  )
}

