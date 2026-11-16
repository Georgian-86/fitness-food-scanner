import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { UserProfile } from '../scoring';
import ProfileForm from '../components/ProfileForm';
import { useProfile } from '../profile';

export default function Onboarding() {
  const { profile, setProfile } = useProfile();
  const [draft, setDraft] = useState<UserProfile>(profile ?? { goal: 'fat_loss', diet: 'any', allergens: [] });
  const navigate = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from;

  const save = () => {
    setProfile(draft);
    navigate(from && from !== '/onboarding' ? from : '/', { replace: true });
  };

  return (
    <main className="page">
      <h1>Set up your goal</h1>
      <p className="muted">
        Scan a packaged food and see how it fits <strong>your</strong> goal. You can change this any time in Settings.
      </p>
      <ProfileForm
        value={draft}
        onChange={setDraft}
      />
      <button type="button" className="btn btn-primary btn-block" data-testid="onboarding-save" onClick={save}>
        Start scanning
      </button>
    </main>
  );
}
