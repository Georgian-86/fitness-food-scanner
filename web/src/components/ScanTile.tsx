import { DEMO_BAR } from '../content/demo.ts'
import { BARCODE_BOX, ProteinBar } from './ProteinBar.tsx'

const pct = (n: number, of: number) => `${(n / of) * 100}%`

/** The product tile: the bar, a scan frame on its barcode and a beam the story moves with transform. */
export function ScanTile({ className = '' }: { className?: string }) {
  const b = BARCODE_BOX
  return (
    <div className={`scan ${className}`}>
      <div className="scan-art">
        <ProteinBar className="scan-bar" />
        <div
          className="scan-frame"
          style={{ left: pct(b.x - 6, b.vw), top: pct(b.y - 6, b.vh), width: pct(b.w + 12, b.vw), height: pct(b.h + 12, b.vh) }}
          aria-hidden="true"
        >
          <span className="scan-beam js-beam" />
        </div>
      </div>
      <div className="scan-meta">
        <span className="scan-name">{DEMO_BAR.name}</span>
        <span className="mono scan-facts">
          {DEMO_BAR.grams} g · ₹{DEMO_BAR.priceRs}
        </span>
        <span className="scan-found mono js-found">Found</span>
      </div>
    </div>
  )
}
