// Brand palettes from docs/brand.md. Preview branches change only the next line.
export type PaletteName = 'neon-pulse' | 'ultraviolet' | 'cobalt-chalk'

export const DEFAULT_PALETTE: PaletteName = 'ultraviolet';

export type PaletteTokens = {
  bg: string
  surface: string
  ink: string
  muted: string
  accent1: string
  onAccent1: string
  accent2: string
  onAccent2: string
  /** Focus ring colour, chosen for >= 3:1 against --bg. */
  focus: string
  scheme: 'dark' | 'light'
}

export const PALETTES: Record<PaletteName, PaletteTokens> = {
  'neon-pulse': {
    bg: '#0B0B0B',
    surface: '#161616',
    ink: '#F5F5F0',
    muted: '#A3A39B',
    accent1: '#FF2DAB',
    onAccent1: '#0B0B0B',
    accent2: '#D4FF3F',
    onAccent2: '#0B0B0B',
    focus: '#D4FF3F',
    scheme: 'dark',
  },
  ultraviolet: {
    bg: '#0D0A1F',
    surface: '#17122E',
    ink: '#EEEAFE',
    muted: '#A59FC9',
    accent1: '#8B5CFF',
    onAccent1: '#0D0A1F',
    accent2: '#3DF5FF',
    onAccent2: '#0D0A1F',
    focus: '#3DF5FF',
    scheme: 'dark',
  },
  'cobalt-chalk': {
    bg: '#F3EFE6',
    surface: '#FFFFFF',
    ink: '#111111',
    muted: '#55524B',
    accent1: '#2340FF',
    onAccent1: '#FFFFFF',
    accent2: '#B9C3FF',
    onAccent2: '#111111',
    focus: '#2340FF',
    scheme: 'light',
  },
}

function isPaletteName(value: string | null): value is PaletteName {
  return value !== null && Object.hasOwn(PALETTES, value)
}

/** `?palette=ultraviolet` overrides the default; unknown values fall back to it. */
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
    '--accent-1': t.accent1,
    '--on-accent-1': t.onAccent1,
    '--accent-2': t.accent2,
    '--on-accent-2': t.onAccent2,
    '--focus': t.focus,
  }
  for (const [key, value] of Object.entries(vars)) root.style.setProperty(key, value)
  root.style.colorScheme = t.scheme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t.bg)
}

export function currentPalette(): PaletteName {
  const name = document.documentElement.dataset.palette ?? null
  return isPaletteName(name) ? name : DEFAULT_PALETTE
}
