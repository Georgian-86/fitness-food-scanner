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
export const PIN_OK = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)'
export const prefersReduced = () => window.matchMedia(REDUCED).matches
