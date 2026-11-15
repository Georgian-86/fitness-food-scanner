import { useState, type CSSProperties } from 'react'
import { Chana } from './Chana.tsx'
import { CHANA_MOODS, type ChanaMood } from './moods.ts'

// Self-contained neobrutalist styles: reads the brand tokens from docs/brand.md
// when the host defines them, otherwise falls back to bubblegum.
const T = {
  bg: 'var(--bg, #FFF4E6)',
  surface: 'var(--surface, #FFFFFF)',
  ink: 'var(--ink, #0A0A0A)',
  muted: 'var(--muted, #4A4540)',
  c1: 'var(--c1, #FF4FD8)',
  onC1: 'var(--on-c1, #0A0A0A)',
  c3: 'var(--c3, #9BE7FF)',
  onC3: 'var(--on-c3, #0A0A0A)',
  display: "Archivo, 'Arial Black', system-ui, sans-serif",
  body: "Archivo, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
}

const card: CSSProperties = {
  background: T.surface,
  border: `3px solid ${T.ink}`,
  borderRadius: 14,
  boxShadow: `6px 6px 0 ${T.ink}`,
}

// Hover lifts and press sinks move only `transform`; the hard shadow itself never animates.
const css = `
.chana-g-btn { transition: transform 150ms cubic-bezier(.25,.46,.45,.94); }
.chana-g-btn:hover { transform: translate(-2px, -2px); }
.chana-g-btn:active { transform: translate(2px, 2px); }
.chana-g-btn:focus-visible { outline: 3px solid ${T.c1}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { .chana-g-btn { transition: none; } }
`

export default function MascotGallery() {
  const [mood, setMood] = useState<ChanaMood>('idle')
  const [size, setSize] = useState(240)
  const current = CHANA_MOODS.find((m) => m.mood === mood) ?? CHANA_MOODS[0]

  return (
    <section
      aria-labelledby="chana-gallery-title"
      style={{
        background: T.bg,
        color: T.ink,
        fontFamily: T.body,
        padding: '32px 16px 56px',
        boxSizing: 'border-box',
        minHeight: '100%',
      }}
    >
      <style>{css}</style>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <h1
          id="chana-gallery-title"
          style={{ fontFamily: T.display, fontWeight: 900, fontStretch: '120%', textTransform: 'uppercase', letterSpacing: '-0.01em', fontSize: 'clamp(36px, 7vw, 56px)', lineHeight: 0.95, margin: '0 0 10px' }}
        >
          Meet Chana
        </h1>
        <p style={{ color: T.muted, margin: '0 0 28px', maxWidth: 620, lineHeight: 1.5, fontSize: 16 }}>
          Your chickpea gym buddy. Chana reacts to every scan, cheers your streaks and asks for help when a product is missing.
        </p>

        {/* Large preview */}
        <div
          style={{
            ...card,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: 24,
            padding: 20,
            marginBottom: 40,
          }}
        >
          <div style={{ display: 'grid', placeItems: 'center', minHeight: 340, overflow: 'hidden', background: T.bg, border: `3px solid ${T.ink}`, borderRadius: 10 }}>
            <Chana mood={mood} size={size} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center' }}>
            <div aria-live="polite">
              <span
                style={{
                  display: 'inline-block',
                  transform: 'rotate(-2deg)',
                  background: T.c3,
                  color: T.onC3,
                  border: `3px solid ${T.ink}`,
                  borderRadius: 999,
                  padding: '4px 12px',
                  font: `700 13px/1.2 ${T.mono}`,
                  marginBottom: 10,
                }}
              >
                {current.mood}
              </span>
              <div style={{ fontFamily: T.display, fontWeight: 900, fontStretch: '115%', textTransform: 'uppercase', fontSize: 30, lineHeight: 1.05 }}>{current.label}</div>
              <div style={{ color: T.muted, marginTop: 6, lineHeight: 1.45 }}>{current.when}</div>
            </div>
            <div role="group" aria-label="Choose a mood" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {CHANA_MOODS.map((m) => {
                const active = m.mood === mood
                return (
                  <button
                    key={m.mood}
                    type="button"
                    className="chana-g-btn"
                    aria-pressed={active}
                    onClick={() => setMood(m.mood)}
                    style={{
                      minHeight: 44,
                      minWidth: 44,
                      padding: '0 14px',
                      borderRadius: 999,
                      border: `3px solid ${T.ink}`,
                      boxShadow: `3px 3px 0 ${T.ink}`,
                      background: active ? T.c1 : T.surface,
                      color: active ? T.onC1 : T.ink,
                      font: `700 14px/1 ${T.mono}`,
                      cursor: 'pointer',
                    }}
                  >
                    {m.mood}
                  </button>
                )
              })}
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, color: T.muted, fontSize: 14, fontWeight: 600 }}>
              Size
              <input
                type="range"
                min={40}
                max={320}
                step={4}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                aria-valuetext={`${size} pixels`}
                style={{ flex: 1, minHeight: 44, accentColor: T.c1 }}
              />
              <span style={{ fontFamily: T.mono, fontVariantNumeric: 'tabular-nums', minWidth: 56, textAlign: 'right', color: T.ink }}>{size}px</span>
            </label>
          </div>
        </div>

        {/* Every mood */}
        <h2 style={{ fontFamily: T.display, fontWeight: 900, fontStretch: '115%', textTransform: 'uppercase', fontSize: 26, margin: '0 0 16px' }}>All moods</h2>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 190px), 1fr))',
            gap: 18,
          }}
        >
          {CHANA_MOODS.map((m) => {
            const active = m.mood === mood
            return (
              <li key={m.mood}>
                <button
                  type="button"
                  className="chana-g-btn"
                  onClick={() => setMood(m.mood)}
                  aria-pressed={active}
                  aria-label={`Preview ${m.mood}: ${m.label}`}
                  style={{
                    ...card,
                    background: active ? T.c3 : T.surface,
                    color: active ? T.onC3 : T.ink,
                    width: '100%',
                    height: '100%',
                    minHeight: 44,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    padding: '16px 12px 18px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    font: `400 14px/1.4 ${T.body}`,
                  }}
                >
                  <Chana mood={m.mood} size={120} />
                  <span style={{ fontFamily: T.display, fontWeight: 900, textTransform: 'uppercase', fontSize: 17, lineHeight: 1.1, marginTop: 8 }}>
                    {m.label}
                  </span>
                  <code style={{ fontFamily: T.mono, fontSize: 12, fontWeight: 700 }}>{m.mood}</code>
                  <span style={{ color: active ? T.onC3 : T.muted, fontSize: 13 }}>{m.when}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
