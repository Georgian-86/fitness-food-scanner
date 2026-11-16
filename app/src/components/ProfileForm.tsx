import type { Allergen, Diet, Goal, UserProfile } from '../scoring';
import { ALL_ALLERGENS, ALLERGEN_LABELS, DIET_LABELS, GOAL_LABELS } from './labels';

interface Props {
  value: UserProfile;
  onChange: (p: UserProfile) => void;
}

const GOALS = Object.keys(GOAL_LABELS) as Goal[];
const DIETS = Object.keys(DIET_LABELS) as Diet[];

export default function ProfileForm({ value, onChange }: Props) {
  const toggleAllergen = (a: Allergen) => {
    const has = value.allergens.includes(a);
    onChange({ ...value, allergens: has ? value.allergens.filter((x) => x !== a) : [...value.allergens, a] });
  };

  return (
    <div className="profile-form">
      <fieldset>
        <legend>Your goal</legend>
        <div className="choice-list" role="radiogroup" aria-label="Your goal">
          {GOALS.map((g) => (
            <button
              key={g}
              type="button"
              role="radio"
              aria-checked={value.goal === g}
              className={`choice ${value.goal === g ? 'is-selected' : ''}`}
              data-testid={`goal-${g}`}
              onClick={() => onChange({ ...value, goal: g })}
            >
              <span className="choice-title">{GOAL_LABELS[g].title}</span>
              <span className="choice-hint">{GOAL_LABELS[g].hint}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Your diet</legend>
        <div className="choice-list" role="radiogroup" aria-label="Your diet">
          {DIETS.map((d) => (
            <button
              key={d}
              type="button"
              role="radio"
              aria-checked={value.diet === d}
              className={`choice choice-compact ${value.diet === d ? 'is-selected' : ''}`}
              data-testid={`diet-${d}`}
              onClick={() => onChange({ ...value, diet: d })}
            >
              <span className="choice-title">{DIET_LABELS[d]}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Allergies to avoid</legend>
        <p className="muted small">Products with these are marked “Avoid for you”.</p>
        <div className="chips">
          {ALL_ALLERGENS.map((a) => (
            <button
              key={a}
              type="button"
              aria-pressed={value.allergens.includes(a)}
              className={`chip ${value.allergens.includes(a) ? 'is-selected' : ''}`}
              data-testid={`allergen-${a}`}
              onClick={() => toggleAllergen(a)}
            >
              {value.allergens.includes(a) ? '✓ ' : ''}
              {ALLERGEN_LABELS[a]}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
