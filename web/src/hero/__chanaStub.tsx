// TEMPORARY stub until src/mascot exists. Delete before reporting.
export type ChanaMood = 'idle' | 'scanning' | 'thinking' | 'happy' | 'okay' | 'caution' | 'avoid' | 'celebrate' | 'sleepy' | 'lost'
export function Chana(props: { mood: ChanaMood; size?: number; className?: string; accent?: string }) {
  const s = props.size ?? 96
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" className={props.className} aria-hidden="true">
      <ellipse cx="50" cy="55" rx="40" ry="38" fill="#E8C27A" />
      <circle cx="38" cy="50" r="5" fill="#111" /><circle cx="62" cy="50" r="5" fill="#111" />
      <text x="50" y="82" fontSize="10" textAnchor="middle" fill="#111">{props.mood}</text>
    </svg>
  )
}
