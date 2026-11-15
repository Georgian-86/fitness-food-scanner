import './hero.css'
import { currentPalette } from '../palette.ts'
import { HeroGraphic } from './HeroGraphic.tsx'
import { HeroPoster, HeroVideo } from './HeroVideo.tsx'
import { HERO_VIDEO } from './heroVideo.ts'
import { Nav } from './Nav.tsx'
import { useIsMobile, useReducedMotion } from './useMedia.ts'

const GRAPHIC_SUMMARY =
  'Demo: a phone scans an unbranded protein bar. With the goal set to fat loss the verdict is orange, ' +
  '"Works against your goal", because of 18 g sugar per 100 g. Switched to muscle gain it turns green, ' +
  '"Fits your goal", with 15 g protein per bar. It gives 25 g protein per ₹100.'

export function Hero() {
  const reduced = useReducedMotion()
  const isMobile = useIsMobile()
  const config = HERO_VIDEO[currentPalette()]
  const video = isMobile ? config.mobile : config.desktop
  const mobileVideo = Boolean(video && isMobile)

  const media = video ? (
    reduced ? (
      <HeroPoster sources={video} className="size-full object-cover" />
    ) : (
      <HeroVideo sources={video} className="size-full object-cover" />
    )
  ) : (
    <HeroGraphic animate={!reduced} />
  )

  return (
    <div id="top" className={`relative overflow-hidden ${mobileVideo ? 'min-h-[100svh]' : ''}`}>
      {mobileVideo && (
        <div className="absolute inset-0 z-0" aria-hidden="true">
          {media}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_35%,var(--bg)_62%)]" />
        </div>
      )}
      <div
        className="hero-glow absolute -left-[10%] top-[8%] z-0 size-[22rem] rounded-full lg:size-[34rem] bg-accent-1"
        aria-hidden="true"
      />
      <Nav />
      <main id="main">
        <section
          aria-labelledby="hero-title"
          className={`relative z-10 mx-auto grid max-w-[84rem] items-center gap-10 px-4 pb-16 sm:px-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-8 lg:px-12 lg:pb-24 lg:pt-6 ${
            mobileVideo ? 'pt-[58svh]' : 'pt-6'
          }`}
        >
          <div className="hero-copy @container max-w-[40rem]">
            <p className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--ink)_18%,transparent)] px-3.5 py-1.5 text-[0.8125rem] font-semibold tracking-[0.08em] text-ink uppercase">
              <span className="size-2 rounded-full bg-accent-1" aria-hidden="true" />
              Made for Indian gym-goers
            </p>
            <h1 id="hero-title" className="display mt-6 text-[clamp(3.6rem,20cqi,8.75rem)] text-ink">
              <span className="block">Same snack.</span>
              <span className="block text-accent-1">Different</span>
              <span className="block pt-[0.06em]">
                <span className="headline-blob">verdict.</span>
              </span>
            </h1>
            <p className="mt-7 max-w-[32rem] text-[1.125rem] leading-[1.55] text-muted sm:text-[1.25rem]">
              Scan a packaged food and see whether it fits <em className="font-semibold text-ink not-italic">your</em>{' '}
              goal, cutting or bulking, in about a second.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="#beta" className="btn btn-primary">
                Join the Android beta
                <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 10h11M11 5.5 15.5 10 11 14.5" />
                </svg>
              </a>
              <a href="#colours" className="btn btn-secondary">
                How the colours work
              </a>
            </div>
            <p className="mt-5 text-[0.9375rem] text-muted">Scanning is always free.</p>
          </div>

          {!mobileVideo && (
            <div className="relative">
              <div aria-hidden="true" className={video ? 'aspect-[4/5] overflow-hidden rounded-[2rem]' : ''}>
                {media}
              </div>
              <p className="sr-only">{GRAPHIC_SUMMARY}</p>
            </div>
          )}
          {mobileVideo && <p className="sr-only">{GRAPHIC_SUMMARY}</p>}
        </section>
      </main>
    </div>
  )
}
