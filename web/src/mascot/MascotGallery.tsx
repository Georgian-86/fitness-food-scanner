import { useState, type CSSProperties } from 'react'
import { Chana } from './Chana.tsx'
import { CHANA_MOODS, type ChanaMood } from './moods.ts'

// Self-contained styles: reads the brand tokens when the host defines them,
// otherwise falls back to the neon-pulse palette from docs/brand.md.
const T = {
  bg: 'var(--bg, #0B0B0B)',
  surface: 'var(--surface, #161616)',
  ink: 'var(--ink, #F5F5F0)',
  muted: 'var(--muted, #A3A39B)',
  accent: 'var(--accent-1, #FF2DAB)',
  onAccent: 'var(--on-accent-1, #0B0B0B)',
  line: 'color-mix(in srgb, var(--ink, #F5F5F0) 14%, transparent)',
  display: "'Barlow Condensed', 'Arial Narrow', system-ui, sans-serif",
  body: "Barlow, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
}

const focusRing: CSSProperties = { outlineOffset: 2 }

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
        padding: '32px 16px 48px',
        boxSizing: 'border-box',
        minHeight: '100%',
      }}
    >
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <h1
          id="chana-gallery-title"
          style={{ fontFamily: T.display, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.01em', fontSize: 44, lineHeight: 1, margin: '0 0 6px' }}
        >
          Meet Chana
        </h1>
        <p style={{ color: T.muted, margin: '0 0 24px', maxWidth: 620, lineHeight: 1.5 }}>
          Your chickpea gym buddy. Chana reacts to every scan, cheers your streaks and asks for help when a product is missing.
        </p>

        {/* Large preview */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: 24,
            background: T.surface,
            border: `1px solid ${T.line}`,
            borderRadius: 20,
            padding: 20,
            marginBottom: 32,
          }}
        >
          <div style={{ display: 'grid', placeItems: 'center', minHeight: 340, overflow: 'hidden' }}>
            <Chana mood={mood} size={size} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center' }}>
            <div aria-live="polite">
              <div style={{ fontFamily: T.display, fontWeight: 800, textTransform: 'uppercase', fontSize: 30, lineHeight: 1.05 }}>{current.label}</div>
              <div style={{ color: T.muted, marginTop: 4, lineHeight: 1.45 }}>{current.when}</div>
            </div>
            <div role="group" aria-label="Choose a mood" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CHANA_MOODS.map((m) => {
                const active = m.mood === mood
                return (
                  <button
                    key={m.mood}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setMood(m.mood)}
                    style={{
                      ...focusRing,
                      minHeight: 44,
                      minWidth: 44,
                      padding: '0 14px',
                      borderRadius: 999,
                      border: `1px solid ${active ? T.accent : T.line}`,
                      background: active ? T.accent : 'transparent',
                      color: active ? T.onAccent : T.ink,
                      font: `600 14px/1 ${T.body}`,
                      cursor: 'pointer',
                    }}
                  >
                    {m.mood}
                  </button>
                )
              })}
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, color: T.muted, fontSize: 14 }}>
              Size
              <input
                type="range"
                min={40}
                max={320}
                step={4}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                aria-valuetext={`${size} pixels`}
                style={{ flex: 1, minHeight: 44, accentColor: T.accent }}
              />
              <span style={{ fontVariantNumeric: 'tabular-nums', minWidth: 52, textAlign: 'right', color: T.ink }}>{size}px</span>
            </label>
          </div>
        </div>

        {/* Every mood */}
        <h2 style={{ fontFamily: T.display, fontWeight: 800, textTransform: 'uppercase', fontSize: 24, margin: '0 0 12px' }}>All moods</h2>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 190px), 1fr))',
            gap: 12,
          }}
        >
          {CHANA_MOODS.map((m) => {
            const active = m.mood === mood
            return (
              <li key={m.mood}>
                <button
                  type="button"
                  onClick={() => setMood(m.mood)}
                  aria-pressed={active}
                  aria-label={`Preview ${m.mood}: ${m.label}`}
                  style={{
                    ...focusRing,
                    width: '100%',
                    height: '100%',
                    minHeight: 44,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    padding: '14px 12px 16px',
                    borderRadius: 16,
                    border: `${active ? 2 : 1}px solid ${active ? T.accent : T.line}`,
                    background: T.surface,
                    color: T.ink,
                    cursor: 'pointer',
                    textAlign: 'center',
                    font: `400 14px/1.4 ${T.body}`,
                  }}
                >
                  <Chana mood={m.mood} size={120} />
                  <span style={{ fontFamily: T.display, fontWeight: 800, textTransform: 'uppercase', fontSize: 18, lineHeight: 1.1, marginTop: 4 }}>
                    {m.label}
                  </span>
                  <code style={{ fontSize: 12, color: T.accent }}>{m.mood}</code>
                  <span style={{ color: T.muted, fontSize: 13 }}>{m.when}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
