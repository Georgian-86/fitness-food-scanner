import { useSyncExternalStore } from 'react'

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export const REDUCED = '(prefers-reduced-motion: reduce)'
export const MOTION_OK = '(prefers-reduced-motion: no-preference)'
/** Desktop pinned story. Mobile and reduced motion get the stacked version. */
// Keep in sync with the matching @media rule in styles/site.css (.proof-pin).
export const PIN_OK = '(min-width: 1200px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)'
/** Stacked story with short scrubbed reveals (the complement of PIN_OK, motion allowed). */
export const STACK_MOTION = '(prefers-reduced-motion: no-preference) and ((max-width: 1199px) or (max-height: 699px))'
/** The desktop journey rail is shown (keep in sync with .rail in styles/site.css). */
export const RAIL_OK = '(min-width: 1440px) and (prefers-reduced-motion: no-preference)'
export const prefersReduced = () => window.matchMedia(REDUCED).matches
