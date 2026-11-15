// SVG parts for Chana, drawn in a 200 x 200 viewBox, neobrutalist:
// flat fills, one ink outline width (LINE) everywhere, a hard offset shadow.
// Parts read MotionValues from the director (useMoodMotion), so React renders
// never restart an animation.
import { AnimatePresence, motion, type MotionValue, type Transition } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'
import { C, LINE, T } from './colors.ts'
import type { EyeKind, HandKind, MouthKind, PropKind } from './moods.ts'
import type { ArmValues, ChanaMotion } from './useMoodMotion.ts'

/**
 * Rotation pivot for a motion <g>. Motion rotates and scales SVG around the
 * centre of the element's fill-box, so a large invisible circle centred on the
 * pivot makes the box centre equal the pivot whatever the parent transforms
 * are. Nested pivots need strictly smaller radii (inner pad inside outer pad).
 */
export function Pivot({ x, y, r }: { x: number; y: number; r: number }) {
  return <circle cx={x} cy={y} r={r} fill="none" pointerEvents="none" />
}

export interface Ctx {
  reduced: boolean
  accent: string
  uid: string
  /** Cross-fade for expressions and props: 200 ms, or instant with reduced motion. */
  fade: Transition
}

const fill = (f: string): CSSProperties => ({ fill: f })
const inked = (f: string, w = LINE): CSSProperties => ({ fill: f, stroke: T.ink, strokeWidth: w, strokeLinejoin: 'round' })
const loopT = (ctx: Ctx, duration: number, extra?: Transition): Transition =>
  ctx.reduced ? { duration: 0 } : { duration, repeat: Infinity, ease: 'easeInOut', ...extra }

function Fade({ show, ctx, children }: { show: boolean; ctx: Ctx; children: ReactNode }) {
  return (
    <motion.g initial={false} animate={{ opacity: show ? 1 : 0 }} transition={ctx.fade}>
      {children}
    </motion.g>
  )
}

/* ------------------------------------------------------------------ body */

export const BODY_PATH =
  'M104 46 C110 52 116 56 124 59 C150 68 166 92 166 120 C166 154 138 178 100 178 C62 178 34 154 34 120 C34 90 54 66 84 59 C94 57 100 53 104 46 Z'
const FEET = [
  { cx: 79, cy: 180 },
  { cx: 121, cy: 180 },
]
const KNOT = { x: 148, y: 72 }

/** Hard shadow, band tails and feet: everything behind the body. */
export function BodyBack({ m, ctx }: { m: ChanaMotion; ctx: Ctx }) {
  return (
    <>
      <g transform="translate(8 8)" style={inked(T.ink)}>
        {FEET.map((f) => (
          <ellipse key={f.cx} cx={f.cx} cy={f.cy} rx={15} ry={8.5} />
        ))}
        <path d={BODY_PATH} />
      </g>
      <motion.g style={{ rotate: m.tail }}>
        <Pivot x={KNOT.x} y={KNOT.y} r={600} />
        <g style={inked(ctx.accent, LINE - 0.5)}>
          <path d="M147 66 Q165 54 183 60 Q171 68 149 76 Z" />
          <path d="M147 74 Q165 78 175 94 Q159 90 145 80 Z" />
        </g>
      </motion.g>
      <g style={inked(C.body)}>
        {FEET.map((f) => (
          <ellipse key={f.cx} cx={f.cx} cy={f.cy} rx={15} ry={8.5} />
        ))}
      </g>
    </>
  )
}

/** Body fill, one flat shade, sweatband, crease, outline and knot. */
export function BodyFront({ ctx }: { ctx: Ctx }) {
  const clip = `chana-body-${ctx.uid}`
  return (
    <>
      <defs>
        <clipPath id={clip}>
          <path d={BODY_PATH} />
        </clipPath>
      </defs>
      <path d={BODY_PATH} style={fill(C.shade)} />
      <g clipPath={`url(#${clip})`}>
        {/* the lit part: the body shifted up-left, leaving a flat crescent of shade */}
        <path d={BODY_PATH} transform="translate(-10 -9)" style={fill(C.body)} />
        <path d="M14 55 Q100 77 186 55 L186 72 Q100 94 14 72 Z" style={inked(ctx.accent)} />
      </g>
      {/* chickpea tip crease */}
      <path d="M104 49 Q101 57 93 61" fill="none" style={{ stroke: C.face, strokeWidth: 3.5, strokeLinecap: 'round' }} />
      <g style={fill(C.blush)}>
        <ellipse cx={62} cy={132} rx={8} ry={4.5} />
        <ellipse cx={138} cy={132} rx={8} ry={4.5} />
      </g>
      <path data-part="body-outline" d={BODY_PATH} fill="none" style={{ stroke: T.ink, strokeWidth: LINE, strokeLinejoin: 'round' }} />
      <circle cx={KNOT.x} cy={KNOT.y} r={6.5} style={inked(ctx.accent, LINE - 0.5)} />
    </>
  )
}

/* ------------------------------------------------------------------ face */

const EYES = [80, 120]
const EYE_Y = 113
const EYE = { rx: 9.5, ry: 12.5 }

export function Face({ m, ctx, eyes, mouth }: { m: ChanaMotion; ctx: Ctx; eyes: EyeKind; mouth: MouthKind }) {
  const clip = `chana-eyes-${ctx.uid}`
  const v = m.v
  return (
    <motion.g style={{ x: m.faceX, y: m.faceY }}>
      <motion.g style={{ x: m.eyeX, y: m.eyeY }}>
        <Fade show={eyes === 'open'} ctx={ctx}>
          <defs>
            <clipPath id={clip}>
              {EYES.map((x) => (
                <ellipse key={x} cx={x} cy={EYE_Y} rx={EYE.rx + 0.5} ry={EYE.ry + 0.5} />
              ))}
            </clipPath>
          </defs>
          {EYES.map((x) => (
            <g key={x}>
              <ellipse cx={x} cy={EYE_Y} rx={EYE.rx} ry={EYE.ry} style={fill(C.face)} />
              <rect x={x - 6} y={EYE_Y - 8.5} width={5.5} height={5.5} rx={1.4} style={fill(C.catchlight)} />
            </g>
          ))}
          <g clipPath={`url(#${clip})`}>
            <motion.g style={{ y: m.lidY }}>
              {EYES.map((x) => (
                <g key={x}>
                  <rect x={x - 12} y={EYE_Y - EYE.ry - 30} width={24} height={30} style={fill(C.body)} />
                  <path d={`M${x - 12} ${EYE_Y - EYE.ry} H${x + 12}`} style={{ stroke: C.face, strokeWidth: 4 }} />
                </g>
              ))}
            </motion.g>
          </g>
        </Fade>
        <Fade show={eyes === 'arc'} ctx={ctx}>
          {EYES.map((x) => (
            <path key={x} d={`M${x - 9} ${EYE_Y + 4} L${x} ${EYE_Y - 6} L${x + 9} ${EYE_Y + 4}`} fill="none" style={faceLine(5.5)} />
          ))}
        </Fade>
        <Fade show={eyes === 'closed'} ctx={ctx}>
          {EYES.map((x) => (
            <path key={x} d={`M${x - 9} ${EYE_Y} Q${x} ${EYE_Y + 8} ${x + 9} ${EYE_Y}`} fill="none" style={faceLine(5)} />
          ))}
        </Fade>
      </motion.g>
      <Brow cx={80} y={v.bLy} r={v.bLr} />
      <Brow cx={120} y={v.bRy} r={v.bRr} />
      <AnimatePresence initial={false}>
        <motion.g key={mouth} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={ctx.fade}>
          {mouthShape(mouth)}
        </motion.g>
      </AnimatePresence>
    </motion.g>
  )
}

const faceLine = (w: number): CSSProperties => ({ stroke: C.face, strokeWidth: w, strokeLinecap: 'round', strokeLinejoin: 'round' })

function Brow({ cx, y, r }: { cx: number; y: MotionValue<number>; r: MotionValue<number> }) {
  return (
    <motion.g style={{ y, rotate: r }}>
      <Pivot x={cx} y={93} r={400} />
      <path d={`M${cx - 8} 93 H${cx + 8}`} style={faceLine(5.5)} />
    </motion.g>
  )
}

function mouthShape(kind: MouthKind) {
  const line = { fill: 'none', ...faceLine(5) }
  const solid = { fill: C.face, stroke: C.face, strokeWidth: 4, strokeLinejoin: 'round' as const }
  switch (kind) {
    case 'smirk':
      return <path d="M90 132 Q101 143 111 129" style={line} />
    case 'focus':
      return (
        <>
          <path d="M101 136 Q101 145 106 145 Q111 145 110 136 Z" style={{ fill: C.tongue, stroke: C.face, strokeWidth: 3, strokeLinejoin: 'round' }} />
          <path d="M91 134 Q100 140 112 134" style={line} />
        </>
      )
    case 'think':
      return <path d="M95 137 Q102 133 108 136" style={line} />
    case 'open':
      return (
        <>
          <path d="M88 130 H112 Q112 148 100 148 Q88 148 88 130 Z" style={solid} />
          <path d="M93 143.5 Q100 137.5 107 143.5 Q104 146.5 100 146.5 Q96 146.5 93 143.5 Z" style={fill(C.tongue)} />
        </>
      )
    case 'neutral':
      return <path d="M92 136 Q100 139.5 108 135" style={line} />
    case 'hmm':
      return <path d="M90 137 Q95 132 100 136 Q105 140 110 134" style={line} />
    case 'calm':
      return <path d="M92 135.5 Q100 139 108 135.5" style={line} />
    case 'grin':
      return (
        <>
          <path d="M85 128 H115 Q115 151 100 151 Q85 151 85 128 Z" style={solid} />
          <rect x={89} y={130} width={22} height={4.5} rx={1} style={fill(C.catchlight)} />
          <path d="M92 146 Q100 139.5 108 146 Q104 149.5 100 149.5 Q96 149.5 92 146 Z" style={fill(C.tongue)} />
        </>
      )
    case 'o':
      return <ellipse cx={100} cy={137} rx={3.5} ry={4.5} style={solid} />
    case 'hopeful':
      return <path d="M93 132 H107 Q107 142 100 142 Q93 142 93 132 Z" style={solid} />
  }
}

/* ------------------------------------------------------------------ arms */

const UPPER = { x: -7, y: -4, width: 14, height: 21, rx: 7 }
const FORE = { x: -6.5, y: 10, width: 13, height: 20, rx: 6.5 }
const ELBOW = 14
const WRIST = 29

type Pass = 'outline' | 'fill'
const passPaint = (pass: Pass): CSSProperties =>
  pass === 'outline' ? { fill: T.ink, stroke: T.ink, strokeWidth: LINE * 2, strokeLinejoin: 'round' } : fill(C.body)

function HandShape({ kind, pass, mirror }: { kind: 'fist' | 'palm'; pass: Pass; mirror: boolean }) {
  const paint = passPaint(pass)
  if (kind === 'palm') {
    return (
      <g transform={mirror ? 'scale(-1 1)' : undefined}>
        <rect x={-9} y={-16} width={18} height={23} rx={7} style={paint} />
        <ellipse cx={9} cy={0} rx={4.6} ry={3.4} transform="rotate(35 9 0)" style={paint} />
        {pass === 'fill' && <path d="M-3.5 -13 V-6 M0.5 -13.5 V-6 M4.5 -13 V-6" style={{ stroke: C.shade, strokeWidth: 2, strokeLinecap: 'round' }} />}
      </g>
    )
  }
  return <circle r={8.5} style={paint} />
}

function Scanner({ beam, ctx }: { beam: MotionValue<number>; ctx: Ctx }) {
  return (
    <g>
      <motion.g style={{ rotate: beam }}>
        <Pivot x={0} y={16} r={120} />
        <path d="M-5 16 L5 16 L21 54 L-21 54 Z" style={{ fill: T.c3, opacity: 0.7 }} />
        <path d="M-21 54 H21" style={{ stroke: T.ink, strokeWidth: 3.5, strokeLinecap: 'round' }} />
      </motion.g>
      <rect x={-10} y={-19} width={20} height={36} rx={4} style={inked(T.c2, LINE - 1)} />
      <rect x={-6} y={-13} width={12} height={9} rx={1.5} style={inked(T.c3, 2.5)} />
      <rect x={-5} y={9} width={10} height={4} rx={1} style={fill(ctx.accent)} />
    </g>
  )
}

function Camera({ ctx }: { ctx: Ctx }) {
  return (
    <g>
      <rect x={-10} y={-32} width={9} height={6} rx={1.5} style={inked(T.c2, LINE - 1.5)} />
      <rect x={-17} y={-28} width={34} height={23} rx={4} style={inked(T.c2, LINE - 1)} />
      <circle cx={0} cy={-16.5} r={7.5} style={inked(T.c3, LINE - 1.5)} />
      <rect x={-3.4} y={-20} width={3.2} height={3.2} rx={0.8} style={fill(C.catchlight)} />
      <circle cx={11.5} cy={-23.5} r={2.2} style={fill(ctx.accent)} />
    </g>
  )
}

export function Arm({
  side,
  a,
  hand,
  flex,
  pass,
  beam,
  ctx,
}: {
  side: 'L' | 'R'
  a: ArmValues
  hand: HandKind
  flex: boolean
  pass: Pass
  beam: MotionValue<number>
  ctx: Ctx
}) {
  const sx = side === 'L' ? 46 : 154
  const sy = 140
  const paint = passPaint(pass)
  const held = hand === 'scanner' || hand === 'camera' ? hand : null
  const palm = hand === 'palm'
  return (
    <motion.g style={{ x: a.ox, y: a.oy, rotate: a.s }}>
      <Pivot x={sx} y={sy} r={700} />
      <g transform={`translate(${sx} ${sy})`}>
        <rect {...UPPER} style={paint} />
        <Fade show={flex} ctx={ctx}>
          <circle cx={side === 'L' ? -6 : 6} cy={8} r={6.5} style={paint} />
        </Fade>
        <motion.g style={{ rotate: a.e }}>
          <Pivot x={0} y={ELBOW} r={500} />
          <rect {...FORE} style={paint} />
          <motion.g style={{ rotate: a.hand }}>
            <Pivot x={0} y={WRIST} r={300} />
            <g transform={`translate(0 ${WRIST})`}>
              {pass === 'outline' && (
                <AnimatePresence>
                  {held && (
                    <motion.g key={held} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={ctx.fade}>
                      {held === 'scanner' ? <Scanner beam={beam} ctx={ctx} /> : <Camera ctx={ctx} />}
                    </motion.g>
                  )}
                </AnimatePresence>
              )}
              <Fade show={!palm} ctx={ctx}>
                <HandShape kind="fist" pass={pass} mirror={side === 'L'} />
              </Fade>
              <Fade show={palm} ctx={ctx}>
                <HandShape kind="palm" pass={pass} mirror={side === 'L'} />
              </Fade>
            </g>
          </motion.g>
        </motion.g>
      </g>
    </motion.g>
  )
}

/* ------------------------------------------------------------------ props */

const STAR = 'M0 -10 L2.6 -2.6 L10 0 L2.6 2.6 L0 10 L-2.6 2.6 L-10 0 L-2.6 -2.6 Z'

function Sparkles({ ctx }: { ctx: Ctx }) {
  const pts = [
    { x: 24, y: 58, s: 1.1, d: 0, c: T.c3 },
    { x: 180, y: 52, s: 1.35, d: 0.6, c: T.c2 },
    { x: 186, y: 134, s: 0.85, d: 1.2, c: T.c3 },
  ]
  return (
    <>
      {pts.map((p) => (
        <g key={p.x} transform={`translate(${p.x} ${p.y}) scale(${p.s})`}>
          <motion.path
            d={STAR}
            style={inked(p.c, 3)}
            initial={ctx.reduced ? false : { scale: 0, rotate: 0 }}
            animate={ctx.reduced ? { scale: 1 } : { scale: [0, 1, 1, 0], rotate: [0, 45, 45, 90] }}
            transition={ctx.reduced ? { duration: 0 } : { duration: 1.8, delay: p.d, times: [0, 0.3, 0.7, 1], repeat: Infinity, ease: 'easeInOut' }}
          />
        </g>
      ))}
    </>
  )
}

function Sweat({ ctx }: { ctx: Ctx }) {
  return (
    <g transform="translate(52 94)">
      <motion.g
        animate={ctx.reduced ? { y: 0, opacity: 1 } : { y: [0, 0, 9], opacity: [0, 1, 0] }}
        transition={ctx.reduced ? { duration: 0 } : { duration: 2.8, times: [0, 0.35, 1], repeat: Infinity, ease: 'easeIn' }}
      >
        <path d="M0 -10 C4 -4 7 0 7 4 A7 7 0 0 1 -7 4 C-7 0 -4 -4 0 -10 Z" style={inked(T.c3, 3.5)} />
        <rect x={-3.6} y={0.5} width={2.6} height={3.4} rx={0.8} style={fill(C.catchlight)} />
      </motion.g>
    </g>
  )
}

function Dots({ ctx }: { ctx: Ctx }) {
  return (
    <g>
      <circle cx={134} cy={70} r={3} style={inked(T.surface, 3)} />
      <circle cx={142} cy={60} r={4.5} style={inked(T.surface, 3.5)} />
      <rect x={140} y={26} width={52} height={26} rx={13} style={inked(T.surface, 4)} />
      {[153, 166, 179].map((x, i) => (
        <motion.circle
          key={x}
          cx={x}
          cy={39}
          r={3.8}
          style={fill(T.ink)}
          animate={ctx.reduced ? { opacity: 1, y: 0 } : { opacity: [0.3, 1, 0.3], y: [0, -2.5, 0] }}
          transition={ctx.reduced ? { duration: 0 } : { duration: 1.2, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </g>
  )
}

const Z_PATH = 'M-5 -5 H5 L-5 5 H5'

function Zzz({ ctx }: { ctx: Ctx }) {
  const zs = [
    { x: 138, y: 56, s: 1, d: 0 },
    { x: 156, y: 36, s: 1.4, d: 1.5 },
  ]
  return (
    <>
      {zs.map((z) => (
        <g key={z.x} transform={`translate(${z.x} ${z.y}) scale(${z.s})`}>
          <motion.g
            animate={ctx.reduced ? { opacity: 1, x: 0, y: 0 } : { opacity: [0, 1, 1, 0], x: [0, 3, 8], y: [6, -4, -14] }}
            transition={ctx.reduced ? { duration: 0 } : { duration: 3, delay: z.d, repeat: Infinity, ease: 'easeOut' }}
          >
            <path d={Z_PATH} fill="none" style={{ stroke: T.ink, strokeWidth: 7, strokeLinecap: 'square', strokeLinejoin: 'miter' }} />
            <path d={Z_PATH} fill="none" style={{ stroke: T.c2, strokeWidth: 3, strokeLinecap: 'square', strokeLinejoin: 'miter' }} />
          </motion.g>
        </g>
      ))}
    </>
  )
}

function Question({ ctx }: { ctx: Ctx }) {
  return (
    <motion.g animate={{ rotate: ctx.reduced ? 0 : [-5, 5, -5] }} transition={loopT(ctx, 2.4)}>
      <Pivot x={150} y={60} r={60} />
      <g transform="translate(166 38)">
        <path d="M-15 10 L-24 26 L-5 15 Z" style={inked(T.surface, 4)} />
        <circle r={19} style={inked(T.surface, 4)} />
        <path d="M-6 10 L-12 17" style={{ stroke: T.surface, strokeWidth: 5 }} />
        <path
          d="M-6 -4.5 Q-6 -11.5 0.5 -11.5 Q7 -11.5 7 -5 Q7 -1 1.5 1.5 L0.8 4.5"
          fill="none"
          style={{ stroke: ctx.accent, strokeWidth: 5, strokeLinecap: 'round', strokeLinejoin: 'round' }}
        />
        <rect x={-2.2} y={8} width={5.4} height={5.4} rx={1.2} style={fill(ctx.accent)} />
      </g>
    </motion.g>
  )
}

const CONFETTI = [
  { x: 18, d: 0, c: 0 },
  { x: 40, d: 0.9, c: 1 },
  { x: 60, d: 0.4, c: 0 },
  { x: 84, d: 1.3, c: 1 },
  { x: 118, d: 0.2, c: 0 },
  { x: 140, d: 1.1, c: 1 },
  { x: 162, d: 0.6, c: 0 },
  { x: 184, d: 1.5, c: 1 },
]

function Confetti({ ctx }: { ctx: Ctx }) {
  const colors = [T.c2, T.c3]
  return (
    <>
      {CONFETTI.map((p, i) => {
        const staticY = 14 + ((i * 29) % 44)
        return (
          <motion.g
            key={p.x}
            animate={ctx.reduced ? { y: staticY, rotate: i * 40, opacity: 1 } : { y: [-8, 92], rotate: [0, i % 2 ? 280 : -280], opacity: [0, 1, 1, 0] }}
            transition={
              ctx.reduced
                ? { duration: 0 }
                : {
                    duration: 2.4,
                    delay: p.d,
                    repeat: Infinity,
                    ease: 'linear',
                    opacity: { duration: 2.4, delay: p.d, repeat: Infinity, times: [0, 0.1, 0.75, 1] },
                  }
            }
          >
            <rect x={p.x - 3} y={-5} width={6} height={10} rx={1} style={inked(colors[p.c], 2.5)} />
          </motion.g>
        )
      })}
    </>
  )
}

/** Props that float around Chana (not held, not attached to the body). */
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

/** Props that ride on the body. */
export function AttachedProp({ kind, ctx }: { kind: PropKind; ctx: Ctx }) {
  return kind === 'sweat' ? <Sweat ctx={ctx} /> : null
}
