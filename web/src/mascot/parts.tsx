// SVG parts for Chana, drawn in a 200 x 200 viewBox.
// Each part is a small component so moods swap expressions and props while the
// silhouette (body, band, feet) stays identical.
import { AnimatePresence, motion, type Transition } from 'motion/react'
import { C } from './colors.ts'
import type { ArmPose, BrowPose, HandKind, MoodPose, MouthKind, PropKind } from './moods.ts'


/**
 * Rotation pivot for a motion <g>. Motion rotates SVG around the centre of the
 * element's fill-box, so a large invisible circle centred on the pivot makes the
 * box centre equal the pivot, whatever the parent transforms are. Nested pivots
 * need strictly smaller radii so an outer pad always contains the inner ones.
 */
export function Pivot({ x, y, r }: { x: number; y: number; r: number }) {
  return <circle cx={x} cy={y} r={r} fill="none" pointerEvents="none" />
}

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export interface Ctx {
  reduced: boolean
  accent: string
  accentDark: string
  accent2: string
  uid: string
  spring: Transition
  fadeT: Transition
}

function loopT(ctx: Ctx, duration: number, extra?: Partial<Transition>): Transition {
  return ctx.reduced ? { duration: 0 } : { duration, repeat: Infinity, ease: 'easeInOut', ...extra }
}

/* ------------------------------------------------------------------ body */

export const BODY_PATH =
  'M104 46 C110 52 116 56 124 59 C150 68 166 92 166 120 C166 154 138 178 100 178 C62 178 34 154 34 120 C34 90 54 66 84 59 C94 57 100 53 104 46 Z'

export function Body({ ctx }: { ctx: Ctx }) {
  const g = `chana-body-${ctx.uid}`
  const clip = `chana-clip-${ctx.uid}`
  return (
    <>
      <defs>
        <radialGradient id={g} cx="38%" cy="34%" r="72%">
          <stop offset="0" stopColor={C.hilite} />
          <stop offset="0.5" stopColor={C.body} />
          <stop offset="1" stopColor={C.shade} />
        </radialGradient>
        <clipPath id={clip}>
          <path d={BODY_PATH} />
        </clipPath>
      </defs>
      {/* feet, behind the body */}
      <g fill={C.shade} stroke={C.outline} strokeWidth={3}>
        <ellipse cx={78} cy={178} rx={14} ry={8} />
        <ellipse cx={122} cy={178} rx={14} ry={8} />
      </g>
      {/* band tails, behind the body */}
      <g style={{ fill: ctx.accent, stroke: ctx.accentDark }} strokeWidth={2.5} strokeLinejoin="round">
        <path d="M150 74 Q166 64 180 70 Q170 76 152 82 Z" />
        <path d="M150 80 Q166 84 174 98 Q160 94 149 86 Z" />
      </g>
      <path d={BODY_PATH} fill={`url(#${g})`} stroke={C.outline} strokeWidth={3} strokeLinejoin="round" />
      <g clipPath={`url(#${clip})`}>
        {/* rim shade along the lower right */}
        <path d="M166 112 C164 152 136 178 100 180 L180 190 L180 100 Z" fill={C.shade} opacity={0.35} />
        {/* sweatband */}
        <path d="M20 62 Q100 82 180 62 L180 78 Q100 98 20 78 Z" style={{ fill: ctx.accent }} />
        <path d="M20 62 Q100 82 180 62" fill="none" style={{ stroke: ctx.accentDark }} strokeWidth={2.5} />
        <path d="M20 78 Q100 98 180 78" fill="none" style={{ stroke: ctx.accentDark }} strokeWidth={2.5} />
        <path d="M20 70 Q100 90 180 70" fill="none" stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={1.6} strokeDasharray="2 4" />
      </g>
      {/* tip crease and shine */}
      <path d="M104 48 Q100 58 92 63" fill="none" stroke={C.shade} strokeWidth={2.2} strokeLinecap="round" />
      <ellipse cx={58} cy={104} rx={7} ry={4.5} transform="rotate(-50 58 104)" fill="#FFF8E6" opacity={0.7} />
      {/* band knot, over the body edge */}
      <circle cx={148} cy={79} r={5.5} style={{ fill: ctx.accent, stroke: ctx.accentDark }} strokeWidth={2.5} />
    </>
  )
}

/* ------------------------------------------------------------------ face */

export function Eye({ cx, cy, pose, ctx, id }: { cx: number; cy: number; pose: MoodPose['eyes']; ctx: Ctx; id: string }) {
  const clip = `chana-eye-${id}-${ctx.uid}`
  const xAnim = !ctx.reduced && pose.track ? pose.track.map((t) => pose.dx + t) : pose.dx
  const xT: Transition = !ctx.reduced && pose.track ? loopT(ctx, 2.2) : ctx.spring
  const lidAnim = !ctx.reduced && pose.blink ? [pose.lid, pose.lid, 1, pose.lid] : pose.lid
  const lidT: Transition =
    !ctx.reduced && pose.blink
      ? { duration: 4.2, times: [0, 0.9, 0.94, 1], repeat: Infinity, ease: 'easeInOut' }
      : ctx.reduced
        ? { duration: 0 }
        : { type: 'spring', stiffness: 300, damping: 26 }
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <motion.g animate={{ x: xAnim, y: pose.dy }} transition={{ x: xT, y: ctx.spring }}>
        <AnimatePresence>
          {pose.kind === 'open' && (
            <motion.g key="open" {...fade} transition={ctx.fadeT}>
              <defs>
                <clipPath id={clip}>
                  <ellipse rx={10.5} ry={12.5} />
                </clipPath>
              </defs>
              <ellipse rx={10.5} ry={12.5} fill={C.ink} />
              <ellipse cx={0} cy={6.5} rx={6} ry={3.4} fill="#6A4428" opacity={0.75} />
              <circle cx={-3.6} cy={-5} r={3.9} fill="#FFFFFF" />
              <circle cx={3.6} cy={4.2} r={1.7} fill="#FFFFFF" opacity={0.9} />
              <g clipPath={`url(#${clip})`}>
                <motion.rect
                  x={-14}
                  y={-13.5}
                  width={28}
                  height={27}
                  fill={C.body}
                  stroke={C.outline}
                  strokeWidth={2.4}
                  vectorEffect="non-scaling-stroke"
                  style={{ originY: 0 }}
                  initial={{ scaleY: pose.lid }}
                  animate={{ scaleY: lidAnim }}
                  transition={lidT}
                />
              </g>
            </motion.g>
          )}
          {pose.kind === 'arc' && (
            <motion.path
              key="arc"
              {...fade}
              transition={ctx.fadeT}
              d="M-9.5 4 Q0 -10 9.5 4"
              fill="none"
              stroke={C.ink}
              strokeWidth={4.6}
              strokeLinecap="round"
            />
          )}
          {pose.kind === 'closed' && (
            <motion.path
              key="closed"
              {...fade}
              transition={ctx.fadeT}
              d="M-9.5 -1 Q0 7 9.5 -1"
              fill="none"
              stroke={C.ink}
              strokeWidth={4}
              strokeLinecap="round"
            />
          )}
        </AnimatePresence>
      </motion.g>
    </g>
  )
}

export function Brow({ cx, pose, ctx }: { cx: number; pose: BrowPose; ctx: Ctx }) {
  return (
    <g transform={`translate(${cx} 94)`}>
      <motion.path
        d="M-7.5 1.5 Q0 -3 7.5 1.5"
        fill="none"
        stroke={C.brow}
        strokeWidth={3.4}
        strokeLinecap="round"
        initial={false}
        animate={{ y: pose.dy, rotate: pose.rot }}
        transition={ctx.spring}
      />
    </g>
  )
}

function mouthShape(kind: MouthKind) {
  const line = { fill: 'none', stroke: C.ink, strokeWidth: 3.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const open = { fill: C.mouthIn, stroke: C.ink, strokeWidth: 2.6, strokeLinejoin: 'round' as const }
  switch (kind) {
    case 'smile':
      return <path d="M92 133 Q100 141 108 133" {...line} />
    case 'focus':
      return (
        <>
          <ellipse cx={104.5} cy={137.5} rx={3.4} ry={3} fill={C.tongue} stroke={C.ink} strokeWidth={1.8} />
          <path d="M93 134 Q100 139.5 107 134" {...line} />
        </>
      )
    case 'think':
      return <path d="M96 137 Q102 134.5 107 136.5" {...line} />
    case 'open':
      return (
        <>
          <path d="M88.5 131 Q100 133 111.5 131 Q110.5 147 100 147 Q89.5 147 88.5 131 Z" {...open} />
          <path d="M94 143.4 Q100 139 106 143.4 Q103 146 100 146 Q97 146 94 143.4 Z" fill={C.tongue} />
        </>
      )
    case 'neutral':
      return <path d="M93 135.5 Q100 138.5 107.5 134" {...line} />
    case 'hmm':
      return <path d="M91.5 136 Q95.5 132.5 100 136 Q104.5 139.5 108.5 135" {...line} />
    case 'calm':
      return <path d="M93 135 Q100 137.6 107 135" {...line} />
    case 'grin':
      return (
        <>
          <path d="M85.5 129.5 Q100 132 114.5 129.5 Q113.5 150 100 150 Q86.5 150 85.5 129.5 Z" {...open} />
          <path d="M92.5 145.6 Q100 140 107.5 145.6 Q104 149 100 149 Q96 149 92.5 145.6 Z" fill={C.tongue} />
        </>
      )
    case 'o':
      return <ellipse cx={100} cy={137} rx={3.6} ry={4.4} {...open} />
    case 'hopeful':
      return (
        <>
          <path d="M93.5 132.5 Q100 134 106.5 132.5 Q105.5 141.5 100 141.5 Q94.5 141.5 93.5 132.5 Z" {...open} />
        </>
      )
  }
}

export function Mouth({ kind, ctx }: { kind: MouthKind; ctx: Ctx }) {
  return (
    <AnimatePresence>
      <motion.g key={kind} {...fade} transition={ctx.fadeT}>
        {mouthShape(kind)}
      </motion.g>
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------ arms */

const UPPER = { x: -7.5, y: -6, width: 15, height: 21, rx: 7.5 }
const FORE = { x: -7, y: 10, width: 14, height: 19, rx: 7 }

function HandShape({ kind, pass, mirror }: { kind: HandKind; pass: 'outline' | 'fill'; mirror: boolean }) {
  const paint =
    pass === 'outline'
      ? { fill: C.outline, stroke: C.outline, strokeWidth: 6, strokeLinejoin: 'round' as const }
      : { fill: C.body }
  if (kind === 'palm') {
    return (
      <g transform={mirror ? 'scale(-1 1)' : undefined}>
        <rect x={-7.5} y={-11} width={15} height={18} rx={6.5} {...paint} />
        <ellipse cx={7.6} cy={1.5} rx={4} ry={3.2} transform="rotate(30 7.6 1.5)" {...paint} />
        {pass === 'fill' && (
          <g stroke={C.shade} strokeWidth={1.6} strokeLinecap="round">
            <path d="M-2.5 -9 V-4" />
            <path d="M2.5 -9 V-4" />
          </g>
        )}
      </g>
    )
  }
  return <circle r={8.8} {...paint} />
}

function Scanner({ ctx }: { ctx: Ctx }) {
  const beam = `chana-beam-${ctx.uid}`
  return (
    <g>
      <defs>
        <linearGradient id={beam} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: ctx.accent2 }} stopOpacity={0.85} />
          <stop offset="1" style={{ stopColor: ctx.accent2 }} stopOpacity={0} />
        </linearGradient>
      </defs>
      <motion.g
        
       
        animate={{ rotate: ctx.reduced ? 0 : [-16, 16, -16] }}
        transition={loopT(ctx, 2.2)}
      >
<Pivot x={0} y={16} r={90} />
        <path d="M-5 16 L5 16 L20 52 L-20 52 Z" fill={`url(#${beam})`} />
        <path d="M-19 51 H19" style={{ stroke: ctx.accent2 }} strokeWidth={2.4} strokeLinecap="round" opacity={0.9} />
      </motion.g>
      <rect x={-9} y={-18} width={18} height={34} rx={5} fill={C.gadget} stroke={C.gadgetRim} strokeWidth={1.8} />
      <rect x={-9} y={-9} width={18} height={4} style={{ fill: ctx.accent }} />
      <rect x={-6} y={11} width={12} height={4} rx={1.5} style={{ fill: ctx.accent2 }} />
    </g>
  )
}

function Camera({ ctx }: { ctx: Ctx }) {
  return (
    <g>
      <rect x={-11} y={-30} width={8} height={5} rx={1.5} fill={C.gadget} stroke={C.gadgetRim} strokeWidth={1.5} />
      <rect x={-16} y={-27} width={32} height={22} rx={5} fill={C.gadget} stroke={C.gadgetRim} strokeWidth={1.8} />
      <circle cx={0} cy={-16} r={7.5} fill="#15151C" stroke={C.gadgetRim} strokeWidth={1.8} />
      <circle cx={0} cy={-16} r={3.6} style={{ fill: ctx.accent2 }} opacity={0.55} />
      <circle cx={-2.4} cy={-18.4} r={1.8} fill="#FFFFFF" />
      <circle cx={11} cy={-23} r={2} style={{ fill: ctx.accent }} />
    </g>
  )
}

export function Arm({ side, pose, pass, ctx }: { side: 'L' | 'R'; pose: ArmPose; pass: 'outline' | 'fill'; ctx: Ctx }) {
  const sx = side === 'L' ? 44 : 156
  const sy = 142
  const h = pose.h ?? -(pose.s + pose.e)
  const paint =
    pass === 'outline'
      ? { fill: C.outline, stroke: C.outline, strokeWidth: 6 }
      : { fill: C.body }
  const loopAnim = !ctx.reduced && pose.loop ? pose.loop : 0
  const loopTr: Transition = !ctx.reduced && pose.loop ? loopT(ctx, pose.loopDur ?? 2) : ctx.spring
  const showProp = pass === 'outline' && (pose.hand === 'scanner' || pose.hand === 'camera')
  const handKind: HandKind = pose.hand === 'palm' ? 'palm' : 'fist'
  return (
    <g transform={`translate(${sx} ${sy})`}>
      <motion.g
        animate={{ x: pose.ox ?? 0, y: pose.oy ?? 0, rotate: pose.s }}
        transition={ctx.spring}
      >
<Pivot x={0} y={0} r={400} />
        <motion.g  animate={{ rotate: loopAnim }} transition={loopTr}>
<Pivot x={0} y={0} r={360} />
          <rect {...UPPER} {...paint} />
          {/* bicep bump for the flex, part of the arm's own outline and fill passes */}
          <motion.circle
            cx={side === 'L' ? -6 : 6}
            cy={8}
            r={6}
            {...paint}
            initial={false}
            animate={{ opacity: pose.flex ? 1 : 0 }}
            transition={ctx.fadeT}
          />
          {/* shoulder blend: hides the arm's top outline so it grows out of the body */}
          {pass === 'fill' && <circle cx={0} cy={-1} r={8.6} fill={C.body} />}
          <motion.g  initial={false} animate={{ rotate: pose.e }} transition={ctx.spring}>
<Pivot x={0} y={14} r={300} />
            <rect {...FORE} {...paint} />
            <g transform="translate(0 28)">
              <motion.g  initial={false} animate={{ rotate: h }} transition={ctx.spring}>
<Pivot x={0} y={0} r={200} />
                <AnimatePresence>
                  {showProp && (
                    <motion.g key={pose.hand} {...fade} transition={ctx.fadeT}>
                      {pose.hand === 'scanner' ? <Scanner ctx={ctx} /> : <Camera ctx={ctx} />}
                    </motion.g>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  <motion.g key={handKind} {...fade} transition={ctx.fadeT}>
                    <HandShape kind={handKind} pass={pass} mirror={side === 'L'} />
                  </motion.g>
                </AnimatePresence>
              </motion.g>
            </g>
          </motion.g>
        </motion.g>
      </motion.g>
    </g>
  )
}

/* ------------------------------------------------------------------ props */

const SPARKLE = 'M0 -8 Q1.4 -1.4 8 0 Q1.4 1.4 0 8 Q-1.4 1.4 -8 0 Q-1.4 -1.4 0 -8 Z'

function Sparkles({ ctx }: { ctx: Ctx }) {
  const pts = [
    { x: 22, y: 64, s: 1.1, d: 0 },
    { x: 180, y: 60, s: 1.3, d: 0.5 },
    { x: 186, y: 140, s: 0.8, d: 1 },
    { x: 14, y: 138, s: 0.9, d: 1.4 },
  ]
  return (
    <>
      {pts.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y}) scale(${p.s})`}>
          <motion.path
            d={SPARKLE}
            style={{ fill: ctx.accent2, stroke: ctx.accentDark }}
            strokeWidth={1.4}
            strokeLinejoin="round"
           
            animate={ctx.reduced ? { scale: 1, opacity: 1 } : { scale: [0.2, 1.1, 0.2], opacity: [0, 1, 0] }}
            transition={ctx.reduced ? { duration: 0 } : { duration: 2, delay: p.d, repeat: Infinity, ease: 'easeInOut' }}
          />
        </g>
      ))}
    </>
  )
}

function Sweat({ ctx }: { ctx: Ctx }) {
  return (
    <g transform="translate(50 96)">
      <motion.g
       
        animate={ctx.reduced ? { y: 0, opacity: 1 } : { y: [0, 0, 8], opacity: [0, 1, 0] }}
        transition={ctx.reduced ? { duration: 0 } : { duration: 2.6, times: [0, 0.3, 1], repeat: Infinity, ease: 'easeIn' }}
      >
        <path d="M0 -9 C4 -3 6.5 0.5 6.5 4 A6.5 6.5 0 0 1 -6.5 4 C-6.5 0.5 -4 -3 0 -9 Z" fill="#A9DDFF" stroke="#2F79B8" strokeWidth={1.8} />
        <ellipse cx={-2.2} cy={3} rx={1.6} ry={2.4} fill="#FFFFFF" />
      </motion.g>
    </g>
  )
}

function Dots({ ctx }: { ctx: Ctx }) {
  return (
    <g>
      <circle cx={132} cy={68} r={2.6} fill={C.bubble} stroke={C.outline} strokeWidth={2} />
      <circle cx={138} cy={60} r={4} fill={C.bubble} stroke={C.outline} strokeWidth={2} />
      <rect x={136} y={30} width={50} height={24} rx={12} fill={C.bubble} stroke={C.outline} strokeWidth={2.5} />
      {[148, 161, 174].map((x, i) => (
        <motion.circle
          key={x}
          cx={x}
          cy={42}
          r={3.6}
          fill={C.ink}
         
          animate={ctx.reduced ? { opacity: 1, scale: 1 } : { opacity: [0.25, 1, 0.25], scale: [0.8, 1.15, 0.8] }}
          transition={ctx.reduced ? { duration: 0 } : { duration: 1.2, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </g>
  )
}

const Z_PATH = 'M-5 -5 H5 L-5 5 H5'

function Zzz({ ctx }: { ctx: Ctx }) {
  const zs = [
    { x: 136, y: 56, s: 1, d: 0 },
    { x: 152, y: 40, s: 1.4, d: 1.6 },
  ]
  return (
    <>
      {zs.map((z, i) => (
        <g key={i} transform={`translate(${z.x} ${z.y}) scale(${z.s})`}>
          <motion.g
            
           
            animate={ctx.reduced ? { opacity: 1, x: 0, y: 0, scale: 1 } : { opacity: [0, 1, 1, 0], x: [0, 4, 10], y: [6, -6, -16], scale: [0.6, 1, 1.15] }}
            transition={ctx.reduced ? { duration: 0 } : { duration: 3.2, delay: z.d, repeat: Infinity, ease: 'easeOut' }}
          >
<Pivot x={0} y={0} r={60} />
            <path d={Z_PATH} fill="none" stroke={C.ink} strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" />
            <path d={Z_PATH} fill="none" stroke="#FFFFFF" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
          </motion.g>
        </g>
      ))}
    </>
  )
}

function Question({ ctx }: { ctx: Ctx }) {
  return (
    <g transform="translate(164 40)">
      <motion.g
        
       
        animate={{ rotate: ctx.reduced ? 0 : [-6, 6, -6], y: ctx.reduced ? 0 : [0, -2, 0] }}
        transition={loopT(ctx, 2.4)}
      >
<Pivot x={-10} y={18} r={60} />
        <path d="M-14 12 L-22 24 L-6 16 Z" fill={C.bubble} stroke={C.outline} strokeWidth={2.5} strokeLinejoin="round" />
        <circle r={18} fill={C.bubble} stroke={C.outline} strokeWidth={2.5} />
        <path d="M-6 9 L-11 15" stroke={C.bubble} strokeWidth={4} />
        <path d="M-5.5 -4.5 Q-5.5 -11 0.5 -11 Q6.5 -11 6.5 -5 Q6.5 -1 1 1.5 L0.5 4.5" fill="none" style={{ stroke: ctx.accent }} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={0.5} cy={10.5} r={2.5} style={{ fill: ctx.accent }} />
      </motion.g>
    </g>
  )
}

const CONFETTI = [
  { x: 16, d: 0, c: 0, sq: true },
  { x: 34, d: 0.9, c: 1, sq: false },
  { x: 52, d: 0.4, c: 2, sq: true },
  { x: 70, d: 1.3, c: 3, sq: true },
  { x: 88, d: 0.2, c: 1, sq: true },
  { x: 106, d: 1.1, c: 0, sq: false },
  { x: 124, d: 0.6, c: 2, sq: true },
  { x: 142, d: 1.5, c: 1, sq: true },
  { x: 160, d: 0.3, c: 3, sq: false },
  { x: 178, d: 1.0, c: 0, sq: true },
  { x: 192, d: 0.7, c: 2, sq: true },
  { x: 8, d: 1.7, c: 1, sq: true },
]

function Confetti({ ctx }: { ctx: Ctx }) {
  const colors = [ctx.accent, ctx.accent2, `color-mix(in srgb, ${ctx.accent} 45%, #FFFFFF)`, '#B9C3FF']
  return (
    <>
      {CONFETTI.map((p, i) => {
        const staticY = 14 + ((i * 37) % 60)
        return (
          <motion.g
            key={i}

           
            animate={
              ctx.reduced
                ? { y: staticY, rotate: i * 40, opacity: 1 }
                : { y: [-6, 96], rotate: [0, i % 2 ? 300 : -300], opacity: [0, 1, 1, 0] }
            }
            transition={
              ctx.reduced
                ? { duration: 0 }
                : { duration: 2.4, delay: p.d, repeat: Infinity, ease: 'linear', opacity: { duration: 2.4, delay: p.d, repeat: Infinity, times: [0, 0.1, 0.75, 1] } }
            }
          >
            {p.sq ? (
              <rect x={p.x - 2.5} y={-4} width={5} height={8} rx={1} style={{ fill: colors[p.c] }} stroke="rgba(0,0,0,0.35)" strokeWidth={0.8} />
            ) : (
              <circle cx={p.x} cy={0} r={3} style={{ fill: colors[p.c] }} stroke="rgba(0,0,0,0.35)" strokeWidth={0.8} />
            )}
          </motion.g>
        )
      })}
    </>
  )
}

/** Props that float around Chana (not held). */
export function FloatProp({ kind, ctx }: { kind: PropKind; ctx: Ctx }) {
  switch (kind) {
    case 'sparkles':
      return <Sparkles ctx={ctx} />
    case 'dots':
      return <Dots ctx={ctx} />
    case 'zzz':
      return <Zzz ctx={ctx} />
    case 'question':
      return <Question ctx={ctx} />
    case 'confetti':
      return <Confetti ctx={ctx} />
    default:
      return null
  }
}

export function AttachedProp({ kind, ctx }: { kind: PropKind; ctx: Ctx }) {
  return kind === 'sweat' ? <Sweat ctx={ctx} /> : null
}
