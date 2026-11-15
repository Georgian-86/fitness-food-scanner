import type { ChanaMood } from '../mascot'
import { SafeChana } from './SafeChana.tsx'
import { type Store, useStore } from '../motion/store.ts'

/** Chana whose mood comes from a store, so scroll code can change it on step boundaries without re-rendering a section. */
export function StoreChana({ store, size, className }: { store: Store<ChanaMood>; size?: number; className?: string }) {
  const mood = useStore(store)
  return <SafeChana mood={mood} size={size} className={className} />
}
