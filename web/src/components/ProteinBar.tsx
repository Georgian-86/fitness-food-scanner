// A generic, unbranded protein bar drawn flat: ink outline, no gradients, no blur, no text.
// The barcode label sits at x 156-262, y 36-94 of the 300 x 130 viewBox (scan frames align to it).
export const BARCODE_BOX = { x: 156, y: 36, w: 106, h: 58, vw: 300, vh: 130 }

const BARS = [3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 2, 1, 1, 1, 2, 3, 1, 2, 1, 1, 3]
const UNIT = 86 / (BARS.reduce((a, b) => a + b, 0) + BARS.length)
const RECTS = BARS.map((w, i) => ({ x: 166 + (BARS.slice(0, i).reduce((a, b) => a + b, 0) + i) * UNIT, w: w * UNIT }))

export function ProteinBar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 300 130" aria-hidden="true">
      <g stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round">
        {/* crimped ends */}
        <path d="M22 22 L6 26 L14 35 L6 44 L14 53 L6 62 L14 71 L6 80 L14 89 L6 98 L14 106 L22 108 Z" fill="#D8D2C6" />
        <path d="M278 22 L294 26 L286 35 L294 44 L286 53 L294 62 L286 71 L294 80 L286 89 L294 98 L286 106 L278 108 Z" fill="#D8D2C6" />
        <rect x="18" y="18" width="264" height="94" rx="10" fill="#EEE9DF" />
        <rect x="36" y="18" width="96" height="94" fill="var(--c2)" />
        <rect x="156" y="36" width="106" height="58" rx="4" fill="#FFFFFF" strokeWidth="3" />
      </g>
      {/* plain band marks: a star burst and two rules, no words */}
      <path
        d="M84 40 l5 9 10 -3 -3 10 9 5 -9 5 3 10 -10 -3 -5 9 -5 -9 -10 3 3 -10 -9 -5 9 -5 -3 -10 10 3z"
        fill="#FFFFFF"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <rect x="56" y="88" width="56" height="6" rx="3" fill="#0A0A0A" opacity="0.35" />
      {RECTS.map((r, i) => (
        <rect key={i} x={r.x} y={44} width={r.w} height={i % 14 === 0 ? 40 : 34} fill="#0A0A0A" />
      ))}
    </svg>
  )
}
