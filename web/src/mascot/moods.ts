// Chana's moods: public metadata plus the pose table that drives the SVG parts.
// Mood names are the public contract (hero, app, and later the Android
// Rive/Lottie state machine). Do not rename them.

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

/** One arm: shoulder rotation, elbow bend, hand rotation (degrees), shoulder offset (px). */
export interface ArmPose {
  s: number
  e: number
  /** Hand rotation. Omit to keep the hand upright (counter-rotates s + e). */
  h?: number
  ox?: number
  oy?: number
  hand: HandKind
  /** Bicep bump shown (flex). */
  flex?: boolean
  /** Looping shoulder delta keyframes, added on top of `s`. */
  loop?: number[]
  loopDur?: number
}

export type HandKind = 'fist' | 'palm' | 'scanner' | 'camera'
export type EyeKind = 'open' | 'arc' | 'closed'
export type MouthKind =
  | 'smile'
  | 'focus'
  | 'think'
  | 'open'
  | 'neutral'
  | 'hmm'
  | 'calm'
  | 'grin'
  | 'o'
  | 'hopeful'
export type PropKind = 'beam' | 'dots' | 'sparkles' | 'sweat' | 'confetti' | 'zzz' | 'question' | 'none'

export interface BrowPose {
  dy: number
  rot: number
}

export interface MoodPose {
  /** Whole-body lean (deg) and offset, springs between moods. */
  lean: number
  /** Looping body motion (keyframes start/end at neutral). */
  loop: {
    y?: number[]
    rotate?: number[]
    scaleX?: number[]
    scaleY?: number[]
    duration: number
    times?: number[]
  } | null
  eyes: {
    kind: EyeKind
    dx: number
    dy: number
    /** Upper-lid closure 0..1. */
    lid: number
    blink?: boolean
    /** Looping horizontal eye track keyframes. */
    track?: number[]
  }
  brows: { l: BrowPose; r: BrowPose }
  mouth: MouthKind
  blush: number
  armL: ArmPose
  armR: ArmPose
  prop: PropKind
}

const restL: ArmPose = { s: 22, e: 6, hand: 'fist' }
const restR: ArmPose = { s: -22, e: -6, hand: 'fist' }
const browsFlat = { l: { dy: 0, rot: 0 }, r: { dy: 0, rot: 0 } }

export const POSES: Record<ChanaMood, MoodPose> = {
  idle: {
    lean: 0,
    loop: { scaleY: [1, 1.025, 1], scaleX: [1, 0.988, 1], duration: 3.2 },
    eyes: { kind: 'open', dx: 0, dy: 0, lid: 0, blink: true },
    brows: browsFlat,
    mouth: 'smile',
    blush: 0.5,
    armL: restL,
    armR: restR,
    prop: 'none',
  },
  scanning: {
    lean: 3,
    loop: { y: [0, -1.5, 0], duration: 2 },
    eyes: { kind: 'open', dx: 4, dy: 3, lid: 0.12, track: [-3.5, 3.5, -3.5] },
    brows: { l: { dy: 1, rot: 0 }, r: { dy: 0, rot: 0 } },
    mouth: 'focus',
    blush: 0.45,
    armL: restL,
    armR: { s: -58, e: -32, hand: 'scanner' },
    prop: 'beam',
  },
  thinking: {
    lean: -4,
    loop: { rotate: [0, 2, 0], duration: 3 },
    eyes: { kind: 'open', dx: 4, dy: -5, lid: 0, blink: true },
    brows: { l: { dy: -1, rot: 0 }, r: { dy: -5, rot: -8 } },
    mouth: 'think',
    blush: 0.4,
    armL: restL,
    armR: { s: -200, e: -45, hand: 'fist' },
    prop: 'dots',
  },
  happy: {
    lean: 0,
    loop: {
      y: [0, -12, 0, 0, 0],
      scaleY: [1, 1.04, 0.95, 1, 1],
      scaleX: [1, 0.97, 1.04, 1, 1],
      times: [0, 0.18, 0.36, 0.46, 1],
      duration: 2.2,
    },
    eyes: { kind: 'open', dx: 0, dy: -1, lid: 0, blink: true },
    brows: { l: { dy: -4, rot: 0 }, r: { dy: -4, rot: 0 } },
    mouth: 'open',
    blush: 0.8,
    armL: { s: 148, e: 14, hand: 'fist' },
    armR: { s: -148, e: -14, hand: 'fist' },
    prop: 'sparkles',
  },
  okay: {
    lean: 0,
    loop: { y: [0, -3, 0, 0], times: [0, 0.2, 0.45, 1], duration: 2.6 },
    eyes: { kind: 'open', dx: 0, dy: 0, lid: 0.22, blink: true },
    brows: { l: { dy: -3, rot: 4 }, r: { dy: -3, rot: -4 } },
    mouth: 'neutral',
    blush: 0.5,
    armL: { s: 62, e: 62, h: -10, hand: 'palm', loop: [0, -10, 0, 0], loopDur: 2.6 },
    armR: { s: -62, e: -62, h: 10, hand: 'palm', loop: [0, 10, 0, 0], loopDur: 2.6 },
    prop: 'none',
  },
  caution: {
    lean: -3,
    loop: { rotate: [0, -1.5, 0], duration: 2.8 },
    eyes: { kind: 'open', dx: 5, dy: 0, lid: 0.45 },
    brows: { l: { dy: 2, rot: 0 }, r: { dy: -6, rot: -10 } },
    mouth: 'hmm',
    blush: 0.45,
    armL: { s: 18, e: 4, hand: 'fist' },
    armR: { s: -18, e: -4, hand: 'fist' },
    prop: 'sweat',
  },
  avoid: {
    lean: 0,
    loop: { rotate: [0, -3.5, 3.5, 0], duration: 3.6 },
    eyes: { kind: 'open', dx: 0, dy: 1, lid: 0.32, blink: true },
    brows: { l: { dy: 1, rot: 0 }, r: { dy: 1, rot: 0 } },
    mouth: 'calm',
    blush: 0.5,
    armL: { s: -30, e: -62, ox: 14, oy: 2, hand: 'fist' },
    armR: { s: -118, e: -22, hand: 'palm' },
    prop: 'none',
  },
  celebrate: {
    lean: 0,
    loop: { y: [0, -5, 0], scaleY: [1, 1.03, 1], duration: 1.1 },
    eyes: { kind: 'arc', dx: 0, dy: 0, lid: 0 },
    brows: { l: { dy: -5, rot: 0 }, r: { dy: -5, rot: 0 } },
    mouth: 'grin',
    blush: 0.85,
    armL: { s: 112, e: 78, ox: -7, oy: -13, hand: 'fist', flex: true, loop: [0, -10, 0], loopDur: 1.1 },
    armR: { s: -112, e: -78, ox: 7, oy: -13, hand: 'fist', flex: true, loop: [0, 10, 0], loopDur: 1.1 },
    prop: 'confetti',
  },
  sleepy: {
    lean: 5,
    loop: { scaleY: [1, 1.03, 1], scaleX: [1, 0.985, 1], duration: 4 },
    eyes: { kind: 'closed', dx: 0, dy: 2, lid: 0 },
    brows: { l: { dy: 2, rot: -6 }, r: { dy: 2, rot: 6 } },
    mouth: 'o',
    blush: 0.55,
    armL: { s: 12, e: 4, hand: 'fist' },
    armR: { s: -12, e: -4, hand: 'fist' },
    prop: 'zzz',
  },
  lost: {
    lean: -2,
    loop: { y: [0, -3, 0], duration: 2.4 },
    eyes: { kind: 'open', dx: -3, dy: -4, lid: 0, blink: true },
    brows: { l: { dy: -4, rot: -10 }, r: { dy: -4, rot: 10 } },
    mouth: 'hopeful',
    blush: 0.6,
    armL: restL,
    armR: { s: -150, e: -18, hand: 'camera' },
    prop: 'question',
  },
}
