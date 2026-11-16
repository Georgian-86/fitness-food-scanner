import { useRef } from 'react'
import { SafeChana as Chana } from '../components/SafeChana.tsx'
import { SectionHead } from '../components/SectionHead.tsx'
import { useReveal } from '../motion/reveal.ts'

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export function Gamified() {
  const root = useRef<HTMLElement>(null)
  useReveal(root)
  return (
    <section ref={root} className="sec sec--band" id="streaks" aria-labelledby="streaks-title">
      <div className="wrap">
        <SectionHead
          id="streaks-title"
          eyebrow="Meet Chana"
          tone="c2"
          title="Reward the looking, not the eating."
          lede="Chana is your chickpea gym buddy. Every scan earns XP whatever the colour, a streak resets quietly with no guilt, and badges are for things you chose to do. Never for body weight."
        />
        <div className="game">
          <div className="game-card card js-rv">
            <div className="game-row">
              <span className="game-k mono">Scan streak</span>
              <span className="example-tag mono">Example</span>
            </div>
            <p className="game-big display">
              5 <span>days</span>
            </p>
            <ol className="streak" aria-label="Scanned on 5 of 7 days this week">
              {DAYS.map((d, i) => (
                <li key={i} className={`streak-day ${i < 5 ? 'is-on' : ''}`}>
                  <span aria-hidden="true">{d}</span>
                </li>
              ))}
            </ol>
            <p className="game-d">One scan a day keeps it alive. Miss a day and it just starts again.</p>
          </div>

          <div className="game-card card js-rv" data-rv-delay="0.08">
            <div className="game-row">
              <span className="game-k mono">XP</span>
              <span className="xp-pop mono">+10 XP</span>
            </div>
            <p className="game-big display">
              Every <span>scan</span>
            </p>
            <span className="meter" aria-hidden="true">
              <span className="meter-fill meter-fill--static" />
            </span>
            <p className="game-d">Checking a red product still earns XP. We reward you for looking, not for "eating right".</p>
          </div>

          <div className="game-card game-card--quest card js-rv" data-rv-delay="0.16">
            <div className="game-row">
              <span className="game-k mono">Quest</span>
              <span className="xp-pop mono">Bonus XP</span>
            </div>
            <h3 className="quest-t">Add a product</h3>
            <p className="game-d">
              Barcode not found? Chana asks for help. Snap the nutrition label, confirm the numbers, and the product is saved for everyone.
            </p>
            <div className="quest-chana">
              <Chana mood="lost" size={112} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
