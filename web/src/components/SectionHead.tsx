import type { ReactNode } from 'react'

export function SectionHead({ eyebrow, title, lede, id, tone = 'c3' }: { eyebrow: string; title: ReactNode; lede?: ReactNode; id: string; tone?: 'c3' | 'c2' }) {
  return (
    <div className="shead js-rv">
      <span className={`sticker ${tone === 'c2' ? 'sticker--c2' : ''}`}>{eyebrow}</span>
      <h2 id={id} className="display shead-title">
        {title}
      </h2>
      {lede && <p className="shead-lede">{lede}</p>}
    </div>
  )
}
