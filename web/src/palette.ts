// Brand palettes from docs/brand.md (v1, neobrutalist). Preview branches change only the next line.
export type PaletteName = 'bubblegum' | 'cobalt-punch' | 'night-shift' | 'ube-chai' | 'ink-lilac'

export const DEFAULT_PALETTE: PaletteName = 'cobalt-punch';

export type PaletteTokens = {
  label: string
  bg: string
  surface: string
  /** Text, borders and hard shadows. */
  ink: string
  muted: string
  c1: string
  onC1: string
  c2: string
  onC2: string
  c3: string
  onC3: string
  scheme: 'dark' | 'light'
}

export const PALETTES: Record<PaletteName, PaletteTokens> = {
  bubblegum: {
    label: 'Bubblegum',
    bg: '#FFF4E6',
    surface: '#FFFFFF',
    ink: '#0A0A0A',
    muted: '#4A4540',
    c1: '#FF4FD8',
    onC1: '#0A0A0A',
    c2: '#6B5BFF',
    onC2: '#FFFFFF',
    c3: '#9BE7FF',
    onC3: '#0A0A0A',
    scheme: 'light',
  },
  'cobalt-punch': {
    label: 'Cobalt punch',
    bg: '#EEF0FF',
    surface: '#FFFFFF',
    ink: '#0A0A0A',
    muted: '#3F4360',
    c1: '#2F3BFF',
    onC1: '#FFFFFF',
    c2: '#FF7AC6',
    onC2: '#0A0A0A',
    c3: '#C8B6FF',
    onC3: '#0A0A0A',
    scheme: 'light',
  },
  'night-shift': {
    label: 'Night shift',
    bg: '#111111',
    surface: '#1C1C1C',
    ink: '#F7F3EA',
    muted: '#B9B4A8',
    c1: '#B79CFF',
    onC1: '#111111',
    c2: '#FF4FD8',
    onC2: '#111111',
    c3: '#7FD8FF',
    onC3: '#111111',
    scheme: 'dark',
  },
  'ube-chai': {
    label: 'Ube chai',
    bg: '#F3E9DC',
    surface: '#FFFBF5',
    ink: '#1B1030',
    muted: '#4E4060',
    c1: '#7B2FF7',
    onC1: '#FFFFFF',
    c2: '#FFB3E6',
    onC2: '#1B1030',
    c3: '#2A2AFF',
    onC3: '#FFFFFF',
    scheme: 'light',
  },
  'ink-lilac': {
    label: 'Ink lilac',
    bg: '#FAFAF7',
    surface: '#FFFFFF',
    ink: '#0A0A0A',
    muted: '#55534D',
    c1: '#0A0A0A',
    onC1: '#FFFFFF',
    c2: '#D9C8FF',
    onC2: '#0A0A0A',
    c3: '#FF4FD8',
    onC3: '#0A0A0A',
    scheme: 'light',
  },
}

export const PALETTE_NAMES = Object.keys(PALETTES) as PaletteName[]

function isPaletteName(value: string | null): value is PaletteName {
  return value !== null && Object.hasOwn(PALETTES, value)
}

/** `?palette=night-shift` overrides the default; unknown values fall back to it. */
export function resolvePalette(search: string): PaletteName {
  const requested = new URLSearchParams(search).get('palette')
  return isPaletteName(requested) ? requested : DEFAULT_PALETTE
}

export function applyPalette(name: PaletteName, root: HTMLElement = document.documentElement) {
  const t = PALETTES[name]
  root.dataset.palette = name
  const vars: Record<string, string> = {
    '--bg': t.bg,
    '--surface': t.surface,
    '--ink': t.ink,
    '--muted': t.muted,
    '--c1': t.c1,
    '--on-c1': t.onC1,
    '--c2': t.c2,
    '--on-c2': t.onC2,
    '--c3': t.c3,
    '--on-c3': t.onC3,
    // Aliases read by the mascot (web/src/mascot). Chana's sweatband takes a brand colour, never a verdict hue.
    // On ink-lilac c1 is ink, so the sweatband uses the magenta accent instead.
    '--accent-1': name === 'ink-lilac' ? t.c3 : t.c1,
    '--on-accent-1': name === 'ink-lilac' ? t.onC3 : t.onC1,
    '--accent-2': t.c2,
    '--on-accent-2': t.onC2,
  }
  for (const [key, value] of Object.entries(vars)) root.style.setProperty(key, value)
  root.style.colorScheme = t.scheme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t.bg)
}

export function currentPalette(): PaletteName {
  const name = document.documentElement.dataset.palette ?? null
  return isPaletteName(name) ? name : DEFAULT_PALETTE
}
