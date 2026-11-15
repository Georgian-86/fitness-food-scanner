// Chana's palette. Flat fills only, no gradients.
// Outlines and the hard shadow follow the page ink (cream on night-shift).
// Face features stay fixed dark: they sit on the beige body on every palette.
// Never use the verdict hues (#22C55E #FACC15 #FB923C #F43F5E), mint or lime here.
export const C = {
  body: '#E8C98F',
  shade: '#D2AE6E',
  face: '#0A0A0A',
  catchlight: '#FFFFFF',
  blush: '#F5A3C7',
  tongue: '#FF8FC8',
}

/** Page tokens (docs/brand.md), with bubblegum fallbacks. Use through `style`, not attributes. */
export const T = {
  ink: 'var(--ink, #0A0A0A)',
  surface: 'var(--surface, #FFFFFF)',
  c1: 'var(--c1, #FF4FD8)',
  c2: 'var(--c2, #6B5BFF)',
  c3: 'var(--c3, #9BE7FF)',
}

/** Outline width in viewBox units (200 x 200), used everywhere. */
export const LINE = 5
