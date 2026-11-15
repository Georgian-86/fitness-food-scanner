export type VerdictKey = 'green' | 'yellow' | 'orange' | 'red'

export type Verdict = {
  key: VerdictKey
  label: string
  meaning: string
  colourVar: string
}

// Labels are fixed by docs/brand.md; meanings follow docs/scoring-rules.md.
export const VERDICTS: Verdict[] = [
  {
    key: 'green',
    label: 'Fits your goal',
    meaning: 'The numbers line up with your goal, like enough protein for a bulk or little sugar for a cut.',
    colourVar: 'var(--verdict-green)',
  },
  {
    key: 'yellow',
    label: 'Fine in moderation',
    meaning: 'Not a bad pick, just not a strong one for your goal. Keep an eye on the portion.',
    colourVar: 'var(--verdict-yellow)',
  },
  {
    key: 'orange',
    label: 'Works against your goal',
    meaning: 'A key number pulls the wrong way for your goal, like high sugar while you are cutting.',
    colourVar: 'var(--verdict-orange)',
  },
  {
    key: 'red',
    label: 'Avoid for you',
    meaning: 'It clashes with something you set, such as an allergen or your diet, or several numbers run high.',
    colourVar: 'var(--verdict-red)',
  },
]

export const verdictByKey = (key: VerdictKey) => VERDICTS.find((v) => v.key === key)!

/** Each verdict has its own shape, so the chip never relies on colour alone. */
export function VerdictIcon({ verdict, className }: { verdict: VerdictKey; className?: string }) {
  const common = {
    className,
    viewBox: '0 0 20 20',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  switch (verdict) {
    case 'green':
      return (
        <svg {...common}>
          <path d="M5 10.5l3.2 3.2L15 6.8" />
        </svg>
      )
    case 'yellow':
      return (
        <svg {...common}>
          <path d="M5.5 10h9" />
        </svg>
      )
    case 'orange':
      return (
        <svg {...common}>
          <path d="M10 4.5v10M5.8 10.6L10 14.8l4.2-4.2" />
        </svg>
      )
    case 'red':
      return (
        <svg {...common}>
          <path d="M6 6l8 8M14 6l-8 8" />
        </svg>
      )
  }
}

export function VerdictChip({ verdict, className = '' }: { verdict: VerdictKey; className?: string }) {
  const v = verdictByKey(verdict)
  return (
    <span className={`verdict-chip ${className}`} style={{ background: v.colourVar }}>
      <span className="grid size-[1.35em] place-items-center rounded-full bg-black/12">
        <VerdictIcon verdict={verdict} className="size-[0.95em]" />
      </span>
      {v.label}
    </span>
  )
}
