import type { PaletteName } from '../palette.ts'

export type VideoSources = {
  mp4: string
  webm?: string
  poster: string
}

export type HeroVideoConfig = {
  desktop?: VideoSources
  mobile?: VideoSources
}

/**
 * Drop rendered hero videos (public/video/...) in here per palette.
 * While a palette has no entry, the coded motion graphic is shown instead.
 * Videos must carry no brand packaging and no baked-in text (see CLAUDE.md).
 */
export const HERO_VIDEO: Record<PaletteName, HeroVideoConfig> = {
  'neon-pulse': {},
  ultraviolet: {},
  'cobalt-chalk': {},
}
