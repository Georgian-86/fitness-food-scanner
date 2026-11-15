export type Goal = 'cut' | 'bulk'

/**
 * Two-segment goal switch. The knob holds both labels and cross-fades them, so the scroll story
 * can move it with transform and opacity only. `goal` sets the static (final) state.
 */
export function GoalToggle({ goal, className = '' }: { goal: Goal; className?: string }) {
  return (
    <div className={`toggle ${className}`} data-goal={goal} role="img" aria-label={`Goal: ${goal === 'cut' ? 'Fat loss' : 'Muscle gain'}`}>
      <span className="toggle-seg">Fat loss</span>
      <span className="toggle-seg">Muscle gain</span>
      <span className="toggle-knob js-knob" aria-hidden="true">
        <span className="toggle-knob-label js-knob-cut">Fat loss</span>
        <span className="toggle-knob-label js-knob-bulk">Muscle gain</span>
      </span>
    </div>
  )
}
