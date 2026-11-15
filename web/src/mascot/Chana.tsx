import { useId, type JSX } from 'react'
import { AnimatePresence, motion, useReducedMotion, type Transition } from 'motion/react'
import { POSES, type ChanaMood } from './moods.ts'
import { AttachedProp, Arm, Body, Brow, C, Eye, FloatProp, Mouth, pivot, type Ctx } from './parts.tsx'

export interface ChanaProps {
  mood: ChanaMood
  /** Rendered width and height in px (square). Default 160. */
  size?: number
  className?: string
  /** Sweatband and accent colour. Default `var(--accent-1)`, with a hot-pink fallback. */
  accent?: string
}

const SPRING: Transition = { type: 'spring', stiffness: 210, damping: 19, mass: 0.9 }
const NEUTRAL = { y: 0, rotate: 0, scaleX: 1, scaleY: 1 }

/**
 * Chana, the chickpea gym buddy. Pure SVG + Motion; needs no host CSS.
 * Moods spring between poses; expressions and props cross-fade.
 * With prefers-reduced-motion, each mood shows its static pose.
 */
export function Chana({ mood, size = 160, className, accent = 'var(--accent-1, #FF2DAB)' }: ChanaProps): JSX.Element {
  const reduced = useReducedMotion() ?? false
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const pose = POSES[mood] ?? POSES.idle

  const ctx: Ctx = {
    reduced,
    accent,
    accentDark: `color-mix(in srgb, ${accent} 62%, #1A0A05)`,
    accent2: 'var(--accent-2, #D4FF3F)',
    uid,
    spring: reduced ? { duration: 0 } : SPRING,
    fadeT: { duration: reduced ? 0.12 : 0.22, ease: 'easeOut' },
  }

  // Body loop: every key is present so values from the previous mood settle back to neutral.
  const loop = !reduced ? pose.loop : null
  const loopAnim = loop
    ? {
        y: loop.y ?? 0,
        rotate: loop.rotate ?? 0,
        scaleX: loop.scaleX ?? 1,
        scaleY: loop.scaleY ?? 1,
      }
    : NEUTRAL
  const settle: Transition = { duration: 0.35, ease: 'easeOut' }
  const loopT: Transition = loop
    ? {
        y: loop.y ? { duration: loop.duration, times: loop.times, repeat: Infinity, ease: 'easeInOut' } : settle,
        rotate: loop.rotate ? { duration: loop.duration, times: loop.times, repeat: Infinity, ease: 'easeInOut' } : settle,
        scaleX: loop.scaleX ? { duration: loop.duration, times: loop.times, repeat: Infinity, ease: 'easeInOut' } : settle,
        scaleY: loop.scaleY ? { duration: loop.duration, times: loop.times, repeat: Infinity, ease: 'easeInOut' } : settle,
      }
    : reduced
      ? { duration: 0 }
      : settle

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
      {/* ground shadow */}
      <ellipse cx={100} cy={187} rx={46} ry={6} fill="#000000" opacity={0.16} />
      <motion.g style={pivot(100, 184)} initial={false} animate={{ rotate: pose.lean }} transition={ctx.spring}>
        <motion.g style={pivot(100, 184)} initial={false} animate={loopAnim} transition={loopT}>
          <Body ctx={ctx} />
          <motion.g initial={false} animate={{ opacity: pose.blush }} transition={ctx.fadeT}>
            <ellipse cx={63} cy={131} rx={8.5} ry={5} fill={C.blush} />
            <ellipse cx={137} cy={131} rx={8.5} ry={5} fill={C.blush} />
          </motion.g>
          <Eye cx={80} cy={113} pose={pose.eyes} ctx={ctx} id="l" />
          <Eye cx={120} cy={113} pose={pose.eyes} ctx={ctx} id="r" />
          <Brow cx={80} pose={pose.brows.l} ctx={ctx} />
          <Brow cx={120} pose={pose.brows.r} ctx={ctx} />
          <Mouth kind={pose.mouth} ctx={ctx} />
          <Arm side="L" pose={pose.armL} pass="outline" ctx={ctx} />
          <Arm side="L" pose={pose.armL} pass="fill" ctx={ctx} />
          <Arm side="R" pose={pose.armR} pass="outline" ctx={ctx} />
          <Arm side="R" pose={pose.armR} pass="fill" ctx={ctx} />
          <AnimatePresence initial={false}>
            {pose.prop === 'sweat' && (
              <motion.g key="sweat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={ctx.fadeT}>
                <AttachedProp kind="sweat" ctx={ctx} />
              </motion.g>
            )}
          </AnimatePresence>
        </motion.g>
        <AnimatePresence initial={false}>
          {pose.prop !== 'none' && pose.prop !== 'sweat' && pose.prop !== 'beam' && (
            <motion.g key={pose.prop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={ctx.fadeT}>
              <FloatProp kind={pose.prop} ctx={ctx} />
            </motion.g>
          )}
        </AnimatePresence>
      </motion.g>
    </svg>
  )
}
