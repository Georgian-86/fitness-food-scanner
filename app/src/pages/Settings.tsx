import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileForm from '../components/ProfileForm';
import { clearAll } from '../data/storage';
import { useProfile } from '../profile';

export default function Settings() {
  const { profile, setProfile } = useProfile();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  if (!profile) return null;

  const clear = () => {
    if (!window.confirm('Delete your goal, saved products and history from this phone?')) return;
    clearAll();
    setProfile(null);
    navigate('/onboarding', { replace: true });
  };

  return (
    <main className="page">
      <h1>Settings</h1>
      <ProfileForm
        value={profile}
        onChange={(p) => {
          setProfile(p);
          setSaved(true);
        }}
      />
      <p className="small muted" role="status" data-testid="settings-saved">{saved ? 'Saved. Verdicts now use these settings.' : ''}</p>

      <section className="card">
        <h2>Your data</h2>
        <p className="small muted">Everything stays on this phone. Nothing is uploaded.</p>
        <button type="button" className="btn btn-secondary" onClick={clear} data-testid="clear-data">
          Clear all data
        </button>
      </section>
    </main>
  );
}
