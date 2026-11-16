import type { ReactNode } from 'react';
import { HashRouter, Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { ProfileProvider, useProfile } from './profile';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Result from './pages/Result';
import ManualEntry from './pages/ManualEntry';
import History from './pages/History';
import Settings from './pages/Settings';
import Games from './pages/Games';

function RequireProfile({ children }: { children: ReactNode }) {
  const { profile } = useProfile();
  const loc = useLocation();
  if (!profile) return <Navigate to="/onboarding" replace state={{ from: loc.pathname }} />;
  return <>{children}</>;
}

const NAV = [
  { to: '/', label: 'Scan', icon: '📷', end: true },
  { to: '/history', label: 'History', icon: '🕘', end: false },
  { to: '/games', label: 'Games', icon: '🎮', end: false },
  { to: '/settings', label: 'Settings', icon: '⚙', end: false },
];

function Shell() {
  const { profile } = useProfile();
  const guard = (el: ReactNode) => <RequireProfile>{el}</RequireProfile>;
  return (
    <div className="app">
      <div className="content">
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/" element={guard(<Home />)} />
          <Route path="/product/:barcode" element={guard(<Result />)} />
          <Route path="/manual" element={guard(<ManualEntry />)} />
          <Route path="/manual/:barcode" element={guard(<ManualEntry />)} />
          <Route path="/history" element={guard(<History />)} />
          <Route path="/settings" element={guard(<Settings />)} />
          <Route path="/games" element={guard(<Games />)} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <footer className="disclaimer">Guidance based on your goal and settings, not medical advice.</footer>
      </div>
      {profile && (
        <nav className="bottom-nav" aria-label="Main">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} data-testid={`nav-${n.label.toLowerCase()}`}>
              <span aria-hidden="true">{n.icon}</span>
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ProfileProvider>
      <HashRouter>
        <Shell />
      </HashRouter>
    </ProfileProvider>
  );
}
