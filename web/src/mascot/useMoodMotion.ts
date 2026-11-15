// The motion director: one MotionValue per animated channel, driven from a
// single effect per mood change. Values are never reset, so every transition
// starts from wherever Chana is right now (mid-hop included).
import { useEffect, useRef } from 'react'
import {
  animate,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
  type AnimationPlaybackControls,
  type MotionValue,
} from 'motion/react'
import type { Chan, MoodPose } from './moods.ts'

/** Pose spring: every pose change uses it. */
export const POSE_SPRING = { type: 'spring', stiffness: 260, damping: 22 } as const
/** Follow-through spring: softer, for parts that lag behind the body. */
const FOLLOW_SPRING = { stiffness: 150, damping: 12 }

const KEYS = [
  'y', 'rot', 'sx', 'sy',
  'lookX', 'lookY', 'lid',
  'bLy', 'bLr', 'bRy', 'bRr',
  'lS', 'lE', 'lHa', 'lOx', 'lOy',
  'rS', 'rE', 'rHa', 'rOx', 'rOy',
  'beam',
] as const
type Key = (typeof KEYS)[number]

function targets(p: MoodPose): Record<Key, Chan> {
  return {
    y: p.body.y, rot: p.body.rot, sx: p.body.sx, sy: p.body.sy,
    lookX: p.look.x, lookY: p.look.y, lid: p.lid,
    bLy: p.brows.ly, bLr: p.brows.lr, bRy: p.brows.ry, bRr: p.brows.rr,
    lS: p.armL.s, lE: p.armL.e, lHa: p.armL.ha ?? 0, lOx: p.armL.ox ?? 0, lOy: p.armL.oy ?? 0,
    rS: p.armR.s, rE: p.armR.e, rHa: p.armR.ha ?? 0, rOx: p.armR.ox ?? 0, rOy: p.armR.oy ?? 0,
    beam: p.beam,
  }
}

const startOf = (c: Chan) => (typeof c === 'number' ? c : c.frames[0])

export type MoodValues = Record<Key, MotionValue<number>>

export interface ArmValues {
  s: MotionValue<number>
  e: MotionValue<number>
  hand: MotionValue<number>
  ox: MotionValue<number>
  oy: MotionValue<number>
}

export interface ChanaMotion {
  v: MoodValues
  faceX: MotionValue<number>
  faceY: MotionValue<number>
  eyeX: MotionValue<number>
  eyeY: MotionValue<number>
  /** Eye-lid translate in eye units (0 = open, 25 = shut). */
  lidY: MotionValue<number>
  tail: MotionValue<number>
  armL: ArmValues
  armR: ArmValues
}

export function useMoodMotion(pose: MoodPose, reduced: boolean): ChanaMotion {
  const init = targets(pose)
  // Hooks in a fixed order: KEYS never changes.
  const v = {} as MoodValues
  for (const k of KEYS) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    v[k] = useMotionValue(startOf(init[k]))
  }
  const mounted = useRef(false)

  useEffect(() => {
    const t = targets(pose)
    const first = !mounted.current
    mounted.current = true
    let alive = true
    const running: AnimationPlaybackControls[] = []
    const leads: Promise<unknown>[] = []
    const loops: Key[] = []

    for (const k of KEYS) {
      const c = t[k]
      const to = startOf(c)
      if (typeof c !== 'number') loops.push(k)
      if (first || reduced) {
        v[k].jump(to)
      } else {
        const a = animate(v[k], to, POSE_SPRING)
        running.push(a)
        if (typeof c !== 'number') leads.push(a.finished)
      }
    }

    // Loops wait until every looping channel has arrived, then start together.
    const startLoops = () => {
      if (!alive) return
      for (const k of loops) {
        const c = t[k]
        if (typeof c === 'number') continue
        running.push(
          animate(v[k], c.frames, {
            duration: c.duration,
            times: c.times,
            ease: c.ease ?? 'easeInOut',
            repeat: Infinity,
          }),
        )
      }
    }
    if (!reduced && loops.length) {
      if (leads.length) Promise.all(leads).then(startLoops, startLoops)
      else startLoops()
    }

    return () => {
      alive = false
      for (const a of running) a.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pose, reduced])

  // Derived values: no animations of their own, they just combine channels.
  const faceX = useTransform(() => v.lookX.get() * 0.45 + v.beam.get() * 0.08)
  const faceY = useTransform(() => v.lookY.get() * 0.45)
  const eyeX = useTransform(() => v.lookX.get() * 0.55 + v.beam.get() * 0.14)
  const eyeY = useTransform(() => v.lookY.get() * 0.55)
  const lidY = useTransform(() => v.lid.get() * 25)

  // Follow-through: band tails and arms lag behind the body's own motion.
  const yVel = useVelocity(v.y)
  const rotVel = useVelocity(v.rot)
  const clamp = (n: number, m: number) => Math.max(-m, Math.min(m, n))
  const tailRaw = useTransform(() => (reduced ? 0 : clamp(-yVel.get() * 0.12 - rotVel.get() * 0.5, 22)))
  const tail = useSpring(tailRaw, FOLLOW_SPRING)
  const lagRaw = useTransform(() => (reduced ? 0 : clamp(-yVel.get() * 0.07, 12)))
  const lag = useSpring(lagRaw, FOLLOW_SPRING)

  const lS = useTransform(() => v.lS.get() - lag.get())
  const rS = useTransform(() => v.rS.get() + lag.get())
  // Hands keep their angle relative to the body: undo the shoulder and elbow.
  const lHand = useTransform(() => v.lHa.get() - lS.get() - v.lE.get())
  const rHand = useTransform(() => v.rHa.get() - rS.get() - v.rE.get())

  return {
    v,
    faceX,
    faceY,
    eyeX,
    eyeY,
    lidY,
    tail,
    armL: { s: lS, e: v.lE, hand: lHand, ox: v.lOx, oy: v.lOy },
    armR: { s: rS, e: v.rE, hand: rHand, ox: v.rOx, oy: v.rOy },
  }
}
