import { useId, type JSX } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { POSES, type ChanaMood } from './moods.ts'
import { AttachedProp, Arm, BodyBack, BodyFront, Face, FloatProp, Pivot, type Ctx } from './parts.tsx'
import { useMoodMotion } from './useMoodMotion.ts'

export interface ChanaProps {
  mood: ChanaMood
  /** Rendered width and height in px (square). Default 160. */
  size?: number
  className?: string
  /** Sweatband and accent colour. Default `var(--c1)`, with the bubblegum magenta fallback. */
  accent?: string
}

/**
 * Chana, the chickpea gym buddy. Pure SVG + Motion; needs no host CSS.
 * Neobrutalist: flat fills, one ink outline width, a hard offset shadow.
 * Every animated number is a MotionValue that blends from its current value
 * on a mood change (no restart from neutral); expressions and props cross-fade.
 * With prefers-reduced-motion each mood is a static pose and swaps are instant.
 */
export function Chana({ mood, size = 160, className, accent = 'var(--c1, #FF4FD8)' }: ChanaProps): JSX.Element {
  const reduced = useReducedMotion() ?? false
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const pose = POSES[mood] ?? POSES.idle
  const m = useMoodMotion(pose, reduced)
  const v = m.v

  const ctx: Ctx = {
    reduced,
    accent,
    uid,
    fade: reduced ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' },
  }
  const arm = (side: 'L' | 'R', pass: 'outline' | 'fill') => {
    const p = side === 'L' ? pose.armL : pose.armR
    return (
      <Arm side={side} a={side === 'L' ? m.armL : m.armR} hand={p.hand} flex={!!p.flex} pass={pass} beam={v.beam} ctx={ctx} />
    )
  }

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`Chana, ${mood}`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* One group carries the whole body: lift, lean and squash, pivoting at the feet. */}
      <motion.g style={{ y: v.y, rotate: v.rot, scaleX: v.sx, scaleY: v.sy }}>
        <Pivot x={100} y={186} r={1000} />
        <BodyBack m={m} ctx={ctx} />
        <BodyFront ctx={ctx} />
        <Face m={m} ctx={ctx} eyes={pose.eyes} mouth={pose.mouth} />
        {arm('L', 'outline')}
        {arm('L', 'fill')}
        {arm('R', 'outline')}
        {arm('R', 'fill')}
        <AnimatePresence>
          {pose.prop === 'sweat' && (
            <motion.g key="sweat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={ctx.fade}>
              <AttachedProp kind="sweat" ctx={ctx} />
            </motion.g>
          )}
        </AnimatePresence>
      </motion.g>
      {/* No initial={false} here: it would freeze the props' own keyframe loops on first mount. */}
      <AnimatePresence>
        {pose.prop !== 'none' && pose.prop !== 'sweat' && (
          <motion.g key={pose.prop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={ctx.fade}>
            <FloatProp kind={pose.prop} ctx={ctx} />
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  )
}
