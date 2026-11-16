import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import type { UserProfile } from './scoring';
import { getProfile, saveProfile } from './data/storage';

interface Ctx {
  profile: UserProfile | null;
  setProfile: (p: UserProfile | null) => void;
}

const ProfileContext = createContext<Ctx>({ profile: null, setProfile: () => {} });

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setState] = useState<UserProfile | null>(() => getProfile());
  const setProfile = useCallback((p: UserProfile | null) => {
    if (p) saveProfile(p);
    setState(p);
  }, []);
  return <ProfileContext.Provider value={{ profile, setProfile }}>{children}</ProfileContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProfile(): Ctx {
  return useContext(ProfileContext);
}
