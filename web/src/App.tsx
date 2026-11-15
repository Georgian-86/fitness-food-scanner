import { BetaFooter } from './hero/BetaFooter.tsx'
import { ColoursSection } from './hero/ColoursSection.tsx'
import { Hero } from './hero/Hero.tsx'
import { useSmoothScroll } from './hero/useSmoothScroll.ts'

export default function App() {
  useSmoothScroll()
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:h-auto focus:w-auto focus:rounded-full focus:bg-ink focus:px-4 focus:py-3 focus:text-bg"
      >
        Skip to content
      </a>
      <Hero />
      <ColoursSection />
      <BetaFooter />
    </>
  )
}
