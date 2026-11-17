// Reference stills for AI video tools (docs/gemini-paste-prompts.md). Renders ONLY the still at exact pixel size.
// Text-free by design: no letters, numbers or logos anywhere. Verdict colours never appear.
import { useEffect, type CSSProperties, type ReactNode } from 'react'
import { Chana, CHANA_MOODS, type ChanaMood } from '../mascot/index.ts'
import { ProteinBar } from '../components/ProteinBar.tsx'

type Format = 'chana' | 'desktop' | 'mobile' | 'social' | 'mood'

const SIZES: Record<Format, { w: number; h: number }> = {
  chana: { w: 2048, h: 2048 },
  desktop: { w: 1920, h: 1080 },
  mobile: { w: 1080, h: 1920 },
  social: { w: 1080, h: 1920 },
  mood: { w: 1024, h: 1024 },
}

const INK = 'var(--ink)'

interface Layout {
  phone: { cx: number; cy: number; w: number; h: number }
  bw: number
  sh: number
  chana: { left: number; size: number }
  bar: { cx: number; cy: number; w: number }
  star: { cx: number; cy: number; s: number }
  label: { cx: number; cy: number; w: number; h: number; rot: number }
  pill: { cx: number; cy: number; w: number; h: number; rot: number }
}

const LAYOUTS: Record<'desktop' | 'mobile' | 'social', Layout> = {
  desktop: {
    phone: { cx: 1344, cy: 530, w: 340, h: 640 },
    bw: 7, sh: 14,
    chana: { left: 1550, size: 256 },
    bar: { cx: 1175, cy: 810, w: 380 },
    star: { cx: 1160, cy: 225, s: 120 },
    label: { cx: 1545, cy: 225, w: 160, h: 84, rot: 9 },
    pill: { cx: 1470, cy: 862, w: 130, h: 52, rot: -8 },
  },
  mobile: {
    phone: { cx: 540, cy: 576, w: 400, h: 700 },
    bw: 8, sh: 16,
    chana: { left: 700, size: 280 },
    bar: { cx: 330, cy: 880, w: 340 },
    star: { cx: 315, cy: 250, s: 120 },
    label: { cx: 770, cy: 245, w: 160, h: 84, rot: 9 },
    pill: { cx: 285, cy: 540, w: 150, h: 56, rot: -8 },
  },
  social: {
    phone: { cx: 540, cy: 940, w: 340, h: 600 },
    bw: 7, sh: 14,
    chana: { left: 660, size: 240 },
    bar: { cx: 410, cy: 1175, w: 300 },
    star: { cx: 370, cy: 665, s: 100 },
    label: { cx: 720, cy: 660, w: 140, h: 74, rot: 9 },
    pill: { cx: 650, cy: 1290, w: 130, h: 50, rot: -8 },
  },
}

const hardShadow = (px: number) => `drop-shadow(${px}px ${px}px 0 ${INK})`

function starPoints(points = 8, outer = 50, inner = 33): string {
  const pts: string[] = []
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = (Math.PI * i) / points - Math.PI / 2
    pts.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`)
  }
  return pts.join(' ')
}

function Abs({ style, children }: { style: CSSProperties; children?: ReactNode }) {
  return <div style={{ position: 'absolute', ...style }}>{children}</div>
}

/** Text-free phone card: viewfinder with four corner brackets over one blank panel. */
function StillPhone({ w, h, bw, sh }: { w: number; h: number; bw: number; sh: number }) {
  const pad = Math.round(w * 0.09)
  const vf = w - pad * 2 - bw * 2
  const br = Math.round(vf * 0.2)
  const bt = Math.round(bw * 1.7)
  const corner = (pos: CSSProperties, borders: CSSProperties): CSSProperties => ({
    position: 'absolute', width: br, height: br, borderColor: INK, borderStyle: 'solid', borderWidth: 0, ...pos, ...borders,
  })
  return (
    <div
      style={{
        width: w, height: h, boxSizing: 'border-box', background: 'var(--surface)',
        border: `${bw}px solid ${INK}`, borderRadius: Math.round(w * 0.12), boxShadow: `${sh}px ${sh}px 0 ${INK}`,
        padding: pad, display: 'flex', flexDirection: 'column', gap: pad,
      }}
    >
      <div style={{ position: 'relative', width: vf, height: vf, flex: 'none' }}>
        <div style={corner({ left: 0, top: 0 }, { borderTopWidth: bt, borderLeftWidth: bt, borderTopLeftRadius: bt * 1.5 })} />
        <div style={corner({ right: 0, top: 0 }, { borderTopWidth: bt, borderRightWidth: bt, borderTopRightRadius: bt * 1.5 })} />
        <div style={corner({ left: 0, bottom: 0 }, { borderBottomWidth: bt, borderLeftWidth: bt, borderBottomLeftRadius: bt * 1.5 })} />
        <div style={corner({ right: 0, bottom: 0 }, { borderBottomWidth: bt, borderRightWidth: bt, borderBottomRightRadius: bt * 1.5 })} />
      </div>
      <div
        style={{
          flex: 1, minHeight: 0, background: 'var(--surface)', border: `${bw}px solid ${INK}`,
          borderRadius: Math.round(w * 0.08), boxSizing: 'border-box',
        }}
      />
    </div>
  )
}

function Cast({ layout: L }: { layout: Layout }) {
  const { phone: p, bw, sh } = L
  const phoneBottom = p.cy + p.h / 2
  const chanaTop = phoneBottom - L.chana.size * 0.93 // feet sit at y = 186 of the 200 viewBox
  const barH = L.bar.w * (130 / 300)
  return (
    <>
      <Abs style={{ left: p.cx - p.w / 2, top: p.cy - p.h / 2, transform: 'rotate(3deg)' }}>
        <StillPhone w={p.w} h={p.h} bw={bw} sh={sh} />
      </Abs>
      <Abs style={{ left: L.bar.cx - L.bar.w / 2, top: L.bar.cy - barH / 2, width: L.bar.w, transform: 'rotate(-4deg)', filter: hardShadow(sh) }}>
        <ProteinBar className="still-bar" />
      </Abs>
      <Abs style={{ left: L.chana.left, top: chanaTop }}>
        <Chana mood="idle" size={L.chana.size} accent="var(--accent-1)" />
      </Abs>
      {/* stickers */}
      <Abs style={{ left: L.star.cx - L.star.s / 2, top: L.star.cy - L.star.s / 2, width: L.star.s, height: L.star.s, filter: hardShadow(sh * 0.7), transform: 'rotate(8deg)' }}>
        <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible', display: 'block' }}>
          <polygon points={starPoints()} fill="var(--c2)" stroke={INK} strokeWidth={(bw * 100) / L.star.s} strokeLinejoin="round" />
        </svg>
      </Abs>
      <Abs
        style={{
          left: L.label.cx - L.label.w / 2, top: L.label.cy - L.label.h / 2, width: L.label.w, height: L.label.h, boxSizing: 'border-box',
          background: 'var(--c1)', border: `${bw}px solid ${INK}`, borderRadius: 10, transform: `rotate(${L.label.rot}deg)`, filter: hardShadow(sh * 0.7),
        }}
      />
      <Abs
        style={{
          left: L.pill.cx - L.pill.w / 2, top: L.pill.cy - L.pill.h / 2, width: L.pill.w, height: L.pill.h, boxSizing: 'border-box',
          background: 'var(--c3)', border: `${bw}px solid ${INK}`, borderRadius: 999, transform: `rotate(${L.pill.rot}deg)`, filter: hardShadow(sh * 0.7),
        }}
      />
    </>
  )
}

export default function StillsPage() {
  const q = new URLSearchParams(window.location.search)
  const fmt = (q.get('format') ?? 'chana') as Format
  const format: Format = fmt in SIZES ? fmt : 'chana'
  const transparent = q.get('bg') === '0'
  const moodParam = q.get('mood') as ChanaMood | null
  const mood: ChanaMood = CHANA_MOODS.some((m) => m.mood === moodParam) ? (moodParam as ChanaMood) : 'idle'
  const { w, h } = SIZES[format]

  // The site's body paints grid paper; the still must be flat, so strip it for this route.
  useEffect(() => {
    const els = [document.documentElement, document.body]
    const prev = els.map((e) => [e.style.background, e.style.backgroundImage])
    els.forEach((e) => {
      e.style.backgroundImage = 'none'
      e.style.background = transparent ? 'transparent' : 'var(--bg)'
    })
    document.body.style.margin = '0'
    return () => els.forEach((e, i) => { e.style.background = prev[i][0]; e.style.backgroundImage = prev[i][1] })
  }, [transparent])

  return (
    <div
      id="still"
      data-format={format}
      style={{
        position: 'fixed', left: 0, top: 0, width: w, height: h, overflow: 'hidden', zIndex: 9999,
        background: transparent ? 'transparent' : 'var(--bg)',
      }}
    >
      <style>{`.still-bar{display:block;width:100%;height:auto;overflow:visible}`}</style>
      {format === 'chana' && (
        <Abs style={{ left: (w - 1670) / 2, top: (h - 1670) / 2 + 20 }}>
          <Chana mood="idle" size={1670} accent="var(--accent-1)" />
        </Abs>
      )}
      {format === 'mood' && (
        <Abs style={{ left: (w - 780) / 2, top: (h - 780) / 2 }}>
          <Chana mood={mood} size={780} accent="var(--accent-1)" />
        </Abs>
      )}
      {(format === 'desktop' || format === 'mobile' || format === 'social') && <Cast layout={LAYOUTS[format]} />}
    </div>
  )
}
