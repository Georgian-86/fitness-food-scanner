// A generic, unbranded protein bar: plain foil wrapper, a blank band, and a barcode label.
// The barcode label sits at x 150-268, y 34-96 of the 300 x 130 viewBox; HeroGraphic's
// scan frame is positioned from these numbers.
export const BARCODE_BOX = { x: 150, y: 34, w: 118, h: 62, vw: 300, vh: 130 }

const BARS = [3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 2, 1, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2, 1]

function Barcode() {
  const x0 = 160
  const width = 98
  const units = BARS.reduce((a, b) => a + b, 0) + BARS.length
  const u = width / units
  let x = x0
  const rects = BARS.map((w, i) => {
    const r = <rect key={i} x={x} y={42} width={w * u} height={i % 15 === 0 ? 44 : 38} fill="#141414" />
    x += (w + 1) * u
    return r
  })
  return (
    <g>
      {rects}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={170 + i * 14 + (i > 2 ? 6 : 0)} y={86} width={8} height={4} rx={1} fill="#141414" opacity={0.55} />
      ))}
    </g>
  )
}

export function ProteinBar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 300 130" aria-hidden="true">
      <defs>
        <linearGradient id="pb-foil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2EFE8" />
          <stop offset="0.45" stopColor="#D6D2C8" />
          <stop offset="1" stopColor="#ABA69B" />
        </linearGradient>
        <linearGradient id="pb-band" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A3A3A" />
          <stop offset="1" stopColor="#1C1C1C" />
        </linearGradient>
        <filter id="pb-shadow" x="-10%" y="-20%" width="120%" height="160%">
          <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#000" floodOpacity="0.45" />
        </filter>
      </defs>
      <g filter="url(#pb-shadow)">
        {/* crimped ends */}
        <path d="M18 20 L4 24 L12 32 L4 40 L12 48 L4 56 L12 64 L4 72 L12 80 L4 88 L12 96 L4 104 L18 110 Z" fill="#BDB8AD" />
        <path d="M282 20 L296 24 L288 32 L296 40 L288 48 L296 56 L288 64 L296 72 L288 80 L296 88 L288 96 L296 104 L282 110 Z" fill="#BDB8AD" />
        <rect x="14" y="18" width="272" height="94" rx="12" fill="url(#pb-foil)" />
        <rect x="30" y="18" width="96" height="94" fill="url(#pb-band)" />
        <rect x="30" y="18" width="96" height="6" fill="#000" opacity="0.15" />
        {/* blank band details: plain dots, no text or brand */}
        <circle cx="78" cy="58" r="15" fill="none" stroke="#5A5A5A" strokeWidth="2" />
        <rect x="52" y="84" width="52" height="5" rx="2.5" fill="#5A5A5A" />
        <rect x="60" y="93" width="36" height="4" rx="2" fill="#4A4A4A" />
        {/* barcode label */}
        <rect x="150" y="34" width="118" height="62" rx="5" fill="#FFFFFF" />
        <Barcode />
        {/* foil sheen */}
        <rect x="14" y="24" width="272" height="10" rx="5" fill="#fff" opacity="0.28" />
      </g>
    </svg>
  )
}
