import { VERDICTS, VerdictIcon } from './verdicts.tsx'

export function ColoursSection() {
  return (
    <section id="colours" aria-labelledby="colours-title" className="relative z-10 scroll-mt-6 border-t border-[color-mix(in_srgb,var(--ink)_10%,transparent)]">
      <div className="mx-auto max-w-[84rem] px-4 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div>
            <h2 id="colours-title" className="display text-[clamp(2.75rem,6vw,4.75rem)] text-ink">
              How the colours <span className="text-accent-1">work</span>
            </h2>
            <p className="mt-5 max-w-[28rem] text-[1.0625rem] text-muted">
              Every scan is checked against the goal you saved, so the same product can get a different colour for a
              different goal. Each verdict always comes with a label, an icon and one plain reason.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2" role="list">
            {VERDICTS.map((v) => (
              <li
                key={v.key}
                className="rounded-3xl bg-surface p-6 shadow-[0_1px_0_rgb(255_255_255/0.04)_inset,0_20px_40px_-28px_rgb(0_0_0/0.6)] ring-1 ring-[color-mix(in_srgb,var(--ink)_8%,transparent)]"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="grid size-10 shrink-0 place-items-center rounded-full text-[#0b0b0b]"
                    style={{ background: v.colourVar }}
                  >
                    <VerdictIcon verdict={v.key} className="size-5" />
                  </span>
                  <h3 className="text-[1.1875rem] font-semibold leading-tight text-ink">{v.label}</h3>
                </div>
                <p className="mt-3 text-[0.9875rem] leading-[1.55] text-muted">{v.meaning}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
