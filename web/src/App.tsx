import { useRef } from 'react'
import { PaletteSwitcher } from './components/PaletteSwitcher.tsx'
import { useScrollEngine } from './motion/engine.ts'
import { Hero } from './sections/Hero.tsx'
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
        <div className="checkpoint-end wrap">
          <p className="mono">Checkpoint build · sections 4–12 come next</p>
        </div>
      </main>
      <JourneyRail />
      <PaletteSwitcher />
    </div>
  )
}
