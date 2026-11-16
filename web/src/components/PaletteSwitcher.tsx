import { useId, useState } from 'react'
import { applyPalette, currentPalette, PALETTE_NAMES, PALETTES, type PaletteName } from '../palette.ts'

/** Preview tool for the owner: compare the five brand directions. Hidden with ?clean=1. */
export function PaletteSwitcher() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<PaletteName>(currentPalette)
  const uid = useId()
  if (new URLSearchParams(window.location.search).get('clean') === '1') return null

  function choose(name: PaletteName) {
    applyPalette(name)
    setActive(name)
    const url = new URL(window.location.href)
    url.searchParams.set('palette', name)
    window.history.replaceState(null, '', url)
  }

  return (
    <div className="pal" data-open={open || undefined}>
      {open && (
        <fieldset className="pal-panel" id={`${uid}-panel`}>
          <legend className="pal-legend">Preview tool · palette</legend>
          {PALETTE_NAMES.map((name) => {
            const p = PALETTES[name]
            return (
              <label key={name} className="pal-opt">
                <input type="radio" name={`${uid}-palette`} value={name} checked={active === name} onChange={() => choose(name)} />
                <span className="pal-sw" aria-hidden="true">
                  <i style={{ background: p.bg }} />
                  <i style={{ background: p.c1 }} />
                  <i style={{ background: p.c2 }} />
                  <i style={{ background: p.c3 }} />
                </span>
                {p.label}
              </label>
            )
          })}
        </fieldset>
      )}
      <button
        type="button"
        className="pal-btn"
        aria-label="Preview palette"
        aria-expanded={open}
        aria-controls={`${uid}-panel`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="pal-dot" aria-hidden="true" />
        <span className="pal-text" aria-hidden="true">
          <span className="pal-note">Preview</span> palette
        </span>
      </button>
    </div>
  )
}
