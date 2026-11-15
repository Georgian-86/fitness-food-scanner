// Chana's moods: public metadata plus the pose table that drives the motion.
// Mood names are the public contract (hero, app, and later the Android
// Rive/Lottie state machine). Do not rename them.
//
// Every animated number is a "channel". A channel is either a fixed target
// (the pose springs to it) or a Loop. A loop is entered from wherever the
// channel currently is (spring to frames[0]), then repeats frames forever, so
// a mood change mid-hop never snaps back to neutral. All loops of one mood
// start on the same frame, so loops with equal durations stay in phase.

export type ChanaMood =
  | 'idle'
  | 'scanning'
  | 'thinking'
  | 'happy'
  | 'okay'
  | 'caution'
  | 'avoid'
  | 'celebrate'
  | 'sleepy'
  | 'lost'

export const CHANA_MOODS: { mood: ChanaMood; label: string; when: string }[] = [
  { mood: 'idle', label: 'Ready', when: 'Home screen, waiting for the next scan.' },
  { mood: 'scanning', label: 'Scanning', when: 'Camera is open and reading a barcode.' },
  { mood: 'thinking', label: 'Checking', when: 'Looking the product up and scoring it for your goal.' },
  { mood: 'happy', label: 'Fits your goal', when: 'Green verdict.' },
  { mood: 'okay', label: 'Fine in moderation', when: 'Yellow verdict.' },
  { mood: 'caution', label: 'Works against your goal', when: 'Orange verdict.' },
  { mood: 'avoid', label: 'Avoid for you', when: 'Red verdict. Firm but kind, and shows a better swap.' },
  { mood: 'celebrate', label: 'Celebrate', when: 'Streak kept, XP level-up, badge earned, or a green swap picked.' },
  { mood: 'sleepy', label: 'Sleepy', when: 'Offline, or the app has sat idle for a long time.' },
  { mood: 'lost', label: 'Not found yet', when: 'Barcode missing from the database: asks you to photograph the label and add it.' },
]

export type Ease = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut'

export interface Loop {
  frames: number[]
  /** 0..1 offsets, same length as frames. Even spacing when omitted. */
  times?: number[]
  /** One ease for every segment, or one per segment. Default easeInOut (sine-like). */
  ease?: Ease | Ease[]
  /** Seconds per cycle. */
  duration: number
}

/** A fixed target (springs) or a loop (entered from the current value). */
export type Chan = number | Loop

export type HandKind = 'fist' | 'palm' | 'scanner' | 'camera'
export type EyeKind = 'open' | 'arc' | 'closed'
export type MouthKind = 'smirk' | 'focus' | 'think' | 'open' | 'neutral' | 'hmm' | 'calm' | 'grin' | 'o' | 'hopeful'
export type PropKind = 'dots' | 'sparkles' | 'sweat' | 'confetti' | 'zzz' | 'question' | 'none'

/**
 * One arm, in degrees. `s` rotates the whole arm at the shoulder (0 = hanging
 * straight down, positive = clockwise on screen). `e` bends the elbow. `ha` is
 * the hand's angle relative to the body (0 = upright), so the hand stays level
 * while the arm moves. `ox`/`oy` nudge the shoulder in viewBox units.
 */
export interface ArmPose {
  s: Chan
  e: number
  ha?: number
  ox?: number
  oy?: number
  hand: HandKind
  /** Bicep bump shown (flex). */
  flex?: boolean
}

export interface MoodPose {
  /** Body group: lift (y), lean + sway (rot, deg), squash and stretch, pivot at the feet. */
  body: { y: Chan; rot: Chan; sx: Chan; sy: Chan }
  /** Gaze in viewBox units. The face shifts 45% of it, the eyes the rest. */
  look: { x: Chan; y: Chan }
  /** Upper-lid closure 0..1 (1 = shut). Blinks are a loop on this channel. */
  lid: Chan
  eyes: EyeKind
  /** Brow lift (negative = up) and tilt, left and right. */
  brows: { ly: number; lr: number; ry: number; rr: number }
  mouth: MouthKind
  armL: ArmPose
  armR: ArmPose
  /** Scanner beam sweep (deg). The eyes follow it. */
  beam: Chan
  prop: PropKind
}

const blink = (lid: number, duration = 3.8): Loop => ({
  frames: [lid, lid, 1, lid],
  times: [0, 0.93, 0.965, 1],
  duration,
})
const breathe = (amount: number, duration: number) => ({
  sy: { frames: [1, 1 + amount, 1], duration },
  sx: { frames: [1, 1 - amount * 0.5, 1], duration },
})

const restL: ArmPose = { s: 20, e: 8, hand: 'fist' }
const restR: ArmPose = { s: -20, e: -8, hand: 'fist' }
const flat = { ly: 0, lr: 0, ry: 0, rr: 0 }

// The happy hop: anticipation squash, take-off stretch, hang, fall, land squash,
// small rebound, then a rest. One shared time grid keeps squash on the beat.
const HOP_T = [0, 0.1, 0.22, 0.3, 0.42, 0.5, 0.6, 1]
const HOP_D = 1.8

export const POSES: Record<ChanaMood, MoodPose> = {
  idle: {
    body: { y: 0, rot: 0, ...breathe(0.03, 3) },
    look: { x: 0, y: 0 },
    lid: blink(0),
    eyes: 'open',
    brows: flat,
    mouth: 'smirk',
    armL: restL,
    armR: restR,
    beam: 0,
    prop: 'none',
  },
  scanning: {
    body: { y: { frames: [0, -1.5, 0], duration: 2.2 }, rot: 3, sx: 1, sy: 1 },
    look: { x: 3, y: 3 },
    lid: 0.15,
    eyes: 'open',
    brows: { ly: 2, lr: 4, ry: -1, rr: 0 },
    mouth: 'focus',
    armL: restL,
    armR: { s: -58, e: -32, hand: 'scanner' },
    beam: { frames: [-16, 16, -16], duration: 2.2 },
    prop: 'none',
  },
  thinking: {
    body: { y: 0, rot: { frames: [-4, -1.5, -4], duration: 3 }, sx: 1, sy: 1 },
    look: { x: 4, y: -5 },
    lid: blink(0, 3),
    eyes: 'open',
    brows: { ly: -1, lr: 0, ry: -6, rr: -8 },
    mouth: 'think',
    armL: restL,
    armR: { s: -200, e: -45, hand: 'fist' },
    beam: 0,
    prop: 'dots',
  },
  happy: {
    body: {
      y: { frames: [0, 0, -17, -18, 0, 0, 0, 0], times: HOP_T, duration: HOP_D, ease: ['easeInOut', 'easeOut', 'easeOut', 'easeIn', 'linear', 'linear', 'linear'] },
      rot: 0,
      sy: { frames: [1, 0.9, 1.07, 1.02, 0.89, 1.03, 1, 1], times: HOP_T, duration: HOP_D },
      sx: { frames: [1, 1.07, 0.95, 0.99, 1.09, 0.98, 1, 1], times: HOP_T, duration: HOP_D },
    },
    look: { x: 0, y: -1 },
    lid: blink(0, HOP_D * 2),
    eyes: 'open',
    brows: { ly: -5, lr: 0, ry: -5, rr: 0 },
    mouth: 'open',
    armL: { s: 148, e: 14, hand: 'fist' },
    armR: { s: -148, e: -14, hand: 'fist' },
    beam: 0,
    prop: 'sparkles',
  },
  okay: {
    body: { y: { frames: [0, -2, 0], duration: 2.4 }, rot: 0, sx: 1, sy: 1 },
    look: { x: 0, y: 0 },
    lid: blink(0.22),
    eyes: 'open',
    brows: { ly: -3, lr: 6, ry: -3, rr: -6 },
    mouth: 'neutral',
    armL: { s: { frames: [64, 54, 64], duration: 2.4 }, e: 62, ha: -40, hand: 'palm' },
    armR: { s: { frames: [-64, -54, -64], duration: 2.4 }, e: -62, ha: 40, hand: 'palm' },
    beam: 0,
    prop: 'none',
  },
  caution: {
    body: { y: 0, rot: { frames: [-3, -4.5, -3], duration: 2.8 }, sx: 1, sy: 1 },
    look: { x: 5, y: 0 },
    lid: 0.42,
    eyes: 'open',
    brows: { ly: 2, lr: 0, ry: -7, rr: -10 },
    mouth: 'hmm',
    armL: { s: 16, e: 4, hand: 'fist' },
    armR: { s: -16, e: -4, hand: 'fist' },
    beam: 0,
    prop: 'sweat',
  },
  avoid: {
    // A slow, kind head shake: body and gaze sway together, the palm wags with them.
    body: { y: 0, rot: { frames: [0, -4, 0, 4, 0], duration: 2.8 }, sx: 1, sy: 1 },
    look: { x: { frames: [0, -4, 0, 4, 0], duration: 2.8 }, y: 1 },
    lid: 0.3,
    eyes: 'open',
    brows: { ly: 1, lr: 0, ry: 1, rr: 0 },
    mouth: 'calm',
    armL: restL,
    armR: { s: { frames: [-140, -134, -140, -146, -140], duration: 2.8 }, e: -18, hand: 'palm' },
    beam: 0,
    prop: 'none',
  },
  celebrate: {
    // Two bounces per cycle with a flex pump on each, squash on every landing.
    body: {
      y: { frames: [0, -7, 0, -7, 0], duration: 1.6, ease: ['easeOut', 'easeIn', 'easeOut', 'easeIn'] },
      rot: 0,
      sy: { frames: [0.95, 1.04, 0.95, 1.04, 0.95], duration: 1.6 },
      sx: { frames: [1.04, 0.97, 1.04, 0.97, 1.04], duration: 1.6 },
    },
    look: { x: 0, y: 0 },
    lid: 0,
    eyes: 'arc',
    brows: { ly: -6, lr: 0, ry: -6, rr: 0 },
    mouth: 'grin',
    armL: { s: { frames: [112, 100, 112, 100, 112], duration: 1.6 }, e: 78, ox: -7, oy: -13, hand: 'fist', flex: true },
    armR: { s: { frames: [-112, -100, -112, -100, -112], duration: 1.6 }, e: -78, ox: 7, oy: -13, hand: 'fist', flex: true },
    beam: 0,
    prop: 'confetti',
  },
  sleepy: {
    body: { y: 0, rot: 5, ...breathe(0.035, 3) },
    look: { x: 0, y: 2 },
    lid: 0,
    eyes: 'closed',
    brows: { ly: 2, lr: -6, ry: 2, rr: 6 },
    mouth: 'o',
    armL: { s: 12, e: 4, hand: 'fist' },
    armR: { s: -12, e: -4, hand: 'fist' },
    beam: 0,
    prop: 'zzz',
  },
  lost: {
    body: { y: { frames: [0, -3, 0], duration: 2.4 }, rot: -2, sx: 1, sy: 1 },
    look: { x: -3, y: -4 },
    lid: blink(0, 2.4 * 2),
    eyes: 'open',
    brows: { ly: -5, lr: -10, ry: -5, rr: 10 },
    mouth: 'hopeful',
    armL: restL,
    armR: { s: -150, e: -18, hand: 'camera' },
    beam: 0,
    prop: 'question',
  },
}
