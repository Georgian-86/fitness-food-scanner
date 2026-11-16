import { useRef } from 'react'
import { PaletteSwitcher } from './components/PaletteSwitcher.tsx'
import { useScrollEngine } from './motion/engine.ts'
import { Colours } from './sections/Colours.tsx'
import { Compare } from './sections/Compare.tsx'
import { Faq } from './sections/Faq.tsx'
import { FinalCta, Footer } from './sections/FinalCta.tsx'
import { Gamified } from './sections/Gamified.tsx'
import { Hero } from './sections/Hero.tsx'
import { HowItWorks } from './sections/HowItWorks.tsx'
import { Pricing } from './sections/Pricing.tsx'
import { Problem } from './sections/Problem.tsx'
import { Trust } from './sections/Trust.tsx'
import { JourneyRail } from './sections/JourneyRail.tsx'
import { Nav } from './sections/Nav.tsx'
import { Proof } from './sections/Proof.tsx'
import { Ticker } from './sections/Ticker.tsx'

export default function App() {
  const page = useRef<HTMLDivElement>(null)
  useScrollEngine(page)
  return (
    <div ref={page} className="page">
      <a href="#main" className="skip">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Ticker />
        <Proof />
        <Problem />
        <HowItWorks />
        <Colours />
        <Compare />
        <Trust />
        <Gamified />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <JourneyRail />
      <PaletteSwitcher />
    </div>
  )
}
