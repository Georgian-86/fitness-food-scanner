export type VerdictKey = 'green' | 'yellow' | 'orange' | 'red'

export type Verdict = {
  key: VerdictKey
  label: string
  meaning: string
  colour: string
}

// Labels and colours are fixed by docs/brand.md; meanings follow docs/scoring-rules.md.
export const VERDICTS: Verdict[] = [
  {
    key: 'green',
    label: 'Fits your goal',
    meaning: 'The numbers line up with your goal, like enough protein for a bulk or little sugar for a cut.',
    colour: '#22C55E',
  },
  {
    key: 'yellow',
    label: 'Fine in moderation',
    meaning: 'Not a strong pick for your goal, not a clash either. Watch the portion.',
    colour: '#FACC15',
  },
  {
    key: 'orange',
    label: 'Works against your goal',
    meaning: 'A key number pulls the wrong way for your goal, like high sugar while you are cutting.',
    colour: '#FB923C',
  },
  {
    key: 'red',
    label: 'Avoid for you',
    meaning: 'It clashes with something you set, like an allergen or your diet, or several numbers run high.',
    colour: '#F43F5E',
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
    strokeWidth: 3,
    strokeLinecap: 'square' as const,
    strokeLinejoin: 'miter' as const,
    'aria-hidden': true,
  }
  switch (verdict) {
    case 'green':
      return (
        <svg {...common}>
          <path d="M4.5 10.5l3.6 3.6L15.5 6.5" />
        </svg>
      )
    case 'yellow':
      return (
        <svg {...common}>
          <path d="M5 10h10" />
        </svg>
      )
    case 'orange':
      return (
        <svg {...common}>
          <path d="M10 4v11M5.5 10.5L10 15l4.5-4.5" />
        </svg>
      )
    case 'red':
      return (
        <svg {...common}>
          <path d="M5.5 5.5l9 9M14.5 5.5l-9 9" />
        </svg>
      )
  }
}

/** Verdict chip: colour + icon + label, always in fixed dark text (#0A0A0A). */
export function VerdictChip({ verdict, className = '' }: { verdict: VerdictKey; className?: string }) {
  const v = verdictByKey(verdict)
  return (
    <span className={`chip ${className}`} style={{ background: v.colour }}>
      <span className="chip-icon">
        <VerdictIcon verdict={verdict} />
      </span>
      {v.label}
    </span>
  )
}
