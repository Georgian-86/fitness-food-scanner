import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef, useState } from 'react'
import { Chana, type ChanaMood } from './chana.ts'
import { BARCODE_BOX, ProteinBar } from './ProteinBar.tsx'
import { useIsMobile } from './useMedia.ts'
import { VerdictChip, type VerdictKey } from './verdicts.tsx'

gsap.registerPlugin(useGSAP)

type Phase = 'scan' | 'orange' | 'green'

const PHASES: Record<Phase, { goal: 'fat' | 'muscle'; verdict: VerdictKey; reason: string; mood: ChanaMood }> = {
  scan: { goal: 'fat', verdict: 'orange', reason: '18 g sugar per 100 g: high for your cut.', mood: 'scanning' },
  orange: { goal: 'fat', verdict: 'orange', reason: '18 g sugar per 100 g: high for your cut.', mood: 'caution' },
  green: { goal: 'muscle', verdict: 'green', reason: '15 g protein per bar: fits your bulk.', mood: 'happy' },
}

// Blob outlines share one command structure so GSAP can tween between them.
const BLOB_A = [
  'M98,14 C150,10 190,56 180,104 C170,150 128,190 84,180 C40,170 10,132 20,86 C30,42 54,18 98,14 Z',
  'M110,22 C160,34 186,74 172,118 C158,162 112,184 72,170 C32,156 14,110 30,70 C46,30 72,14 110,22 Z',
]
const BLOB_B = [
  'M92,20 C138,14 176,44 182,92 C188,140 150,182 102,184 C54,186 18,150 16,104 C14,58 46,26 92,20 Z',
  'M104,16 C146,26 186,62 178,108 C170,154 130,178 88,176 C46,174 12,138 22,92 C32,46 62,6 104,16 Z',
]

const pct = (n: number, of: number) => `${(n / of) * 100}%`

/**
 * The hero's coded motion graphic: one ~8 s loop of scan -> fat-loss verdict -> muscle-gain verdict.
 * With `animate` off it renders the final (green) frame and creates no timeline.
 */
export function HeroGraphic({ animate }: { animate: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<Phase>(animate ? 'scan' : 'green')
  const isMobile = useIsMobile()
  const p = PHASES[phase]

  useGSAP(
    () => {
      if (!animate) {
        setPhase('green')
        return
      }
      const blobs = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut', duration: 8 } })
      blobs
        .to('.blob-a path', { attr: { d: BLOB_A[1] } }, 0)
        .to('.blob-a', { rotation: 14, xPercent: -4, yPercent: 3, transformOrigin: '50% 50%' }, 0)
        .to('.blob-b path', { attr: { d: BLOB_B[1] } }, 0)
        .to('.blob-b', { rotation: -12, xPercent: 5, yPercent: -4, transformOrigin: '50% 50%' }, 0)

      const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'power2.inOut' } })
      tl.call(() => setPhase('scan'), [], 0)
        .set('.result-card', { yPercent: 115 }, 0)
        .set('.scan-frame', { autoAlpha: 0, scale: 1.08 }, 0)
        .set('.scan-beam', { top: '6%', autoAlpha: 0 }, 0)
        .to('.scan-frame', { autoAlpha: 1, scale: 1, duration: 0.45 }, 0.25)
        .to('.scan-beam', { autoAlpha: 1, duration: 0.2 }, 0.5)
        .to('.scan-beam', { top: '94%', duration: 0.75, repeat: 1, yoyo: true, ease: 'sine.inOut' }, 0.5)
        .to('.scan-beam', { autoAlpha: 0, duration: 0.2 }, 2.0)
        .to('.scan-frame', { autoAlpha: 0, scale: 0.96, duration: 0.35 }, 2.05)
        .call(() => setPhase('orange'), [], 2.1)
        .to('.result-card', { yPercent: 0, duration: 0.75 }, 2.1)
        .call(() => setPhase('green'), [], 4.9)
        .to('.result-card', { yPercent: 115, duration: 0.6 }, 7.3)
        .to({}, { duration: 0.1 }, 7.9)
    },
    { scope: root, dependencies: [animate], revertOnUpdate: true },
  )

  const chanaSize = isMobile ? 104 : 150

  return (
    <div ref={root} className="hero-stage relative mx-auto w-full" data-phase={phase}>
      {/* organic accent blobs */}
      <svg className="blob-a absolute right-[22%] top-[3%] w-[66%]" viewBox="0 0 200 200" aria-hidden="true">
        <path d={BLOB_A[0]} fill="var(--accent-1)" />
      </svg>
      <svg className="blob-b absolute -left-[4%] bottom-[0%] w-[44%]" viewBox="0 0 200 200" aria-hidden="true">
        <path d={BLOB_B[0]} fill="var(--accent-2)" />
      </svg>

      {/* phone */}
      <div className="phone absolute">
        <div className="phone-screen">
          <div className="absolute left-1/2 top-[0.6em] h-[1.5em] w-[5.6em] -translate-x-1/2 rounded-full bg-black" />
          <div className="flex items-center justify-between px-[1.6em] pt-[0.75em] text-[0.72em] font-semibold text-white/85">
            <span>9:41</span>
            <span className="flex items-center gap-[0.35em]">
              <span className="inline-block h-[0.7em] w-[1em] rounded-[0.2em] border border-white/70" />
            </span>
          </div>

          {/* camera view */}
          <div className="camera absolute inset-x-0 bottom-0 top-[2.9em]">
            <div className="absolute left-1/2 top-[0.6em] -translate-x-1/2 rounded-full bg-black/55 px-[0.9em] py-[0.35em] text-[0.68em] font-medium text-white/85 backdrop-blur">
              Point at the barcode
            </div>
            <div className="absolute left-1/2 top-[7.8em] w-[88%] -translate-x-1/2 -translate-y-1/2 rotate-[-4deg]">
              <ProteinBar className="block w-full" />
              <div
                className="scan-frame absolute"
                style={{
                  left: `calc(${pct(BARCODE_BOX.x, BARCODE_BOX.vw)} - 0.5em)`,
                  top: `calc(${pct(BARCODE_BOX.y, BARCODE_BOX.vh)} - 0.5em)`,
                  width: `calc(${pct(BARCODE_BOX.w, BARCODE_BOX.vw)} + 1em)`,
                  height: `calc(${pct(BARCODE_BOX.h, BARCODE_BOX.vh)} + 1em)`,
                  opacity: animate ? undefined : 0,
                }}
              >
                <span className="corner tl" />
                <span className="corner tr" />
                <span className="corner bl" />
                <span className="corner br" />
                <span className="scan-beam" />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-[2.2em] flex flex-col items-center gap-[0.9em]">
              <span className="text-[0.72em] font-medium text-white/75">Looking for a barcode…</span>
              <span className="grid size-[3.6em] place-items-center rounded-full border-[0.22em] border-white/80">
                <span className="size-[2.6em] rounded-full bg-white/90" />
              </span>
            </div>
          </div>

          {/* result card */}
          <div className="result-card absolute inset-x-0 bottom-0">
            <div className="mx-auto mb-[0.9em] h-[0.3em] w-[2.6em] rounded-full bg-[color-mix(in_srgb,var(--ink)_22%,transparent)]" />
            <div className="text-[0.66em] font-semibold uppercase tracking-[0.14em] text-muted">Your goal</div>
            <div className="goal-toggle mt-[0.45em]" data-goal={p.goal}>
              <span className="goal-thumb" />
              <span className={`goal-opt ${p.goal === 'fat' ? 'is-on' : ''}`}>Fat loss</span>
              <span className={`goal-opt ${p.goal === 'muscle' ? 'is-on' : ''}`}>Muscle gain</span>
            </div>

            <div className="mt-[1em] flex items-baseline justify-between text-[0.78em]">
              <span className="font-semibold text-ink">Protein bar, 60 g</span>
              <span className="text-muted">₹60</span>
            </div>

            <div className="mt-[0.6em]">
              <VerdictChip key={p.verdict} verdict={p.verdict} className="chip-in text-[0.8em]" />
            </div>
            <p key={p.reason} className="reason-in mt-[0.55em] min-h-[2.7em] text-[0.8em] leading-[1.35] text-ink">
              {p.reason}
            </p>

            <div className="mt-[0.7em] flex items-end gap-[0.6em] border-t border-[color-mix(in_srgb,var(--ink)_12%,transparent)] pt-[0.8em]">
              <span className="display text-[2.3em] leading-[0.8] normal-case text-ink">25 g</span>
              <span className="pb-[0.1em] text-[0.72em] leading-[1.2] text-muted">
                protein
                <br />
                per ₹100
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chana + XP */}
      <div className="chana-slot absolute">
        {phase === 'green' && (
          <span className="xp-pop absolute -top-[0.4em] left-[55%] rounded-full bg-accent-1 px-[0.75em] py-[0.3em] text-[0.85em] font-semibold whitespace-nowrap text-on-accent-1 shadow-lg">
            +10 XP
          </span>
        )}
        <Chana mood={p.mood} size={chanaSize} />
      </div>
    </div>
  )
}
