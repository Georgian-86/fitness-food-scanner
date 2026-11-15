import { VerdictChip, type VerdictKey, verdictByKey } from '../content/verdicts.tsx'

/** Full-colour verdict card: chip + one reason line, text fixed dark (#0A0A0A) on the verdict colour. */
export function VerdictCard({ verdict, reason, goalLabel, className = '' }: { verdict: VerdictKey; reason: string; goalLabel: string; className?: string }) {
  return (
    <div className={`vcard ${className}`} style={{ background: verdictByKey(verdict).colour }}>
      <div className="vcard-top">
        <span className="vcard-goal">{goalLabel}</span>
        <VerdictChip verdict={verdict} className="chip--onfill" />
      </div>
      <p className="vcard-reason">{reason}</p>
    </div>
  )
}
