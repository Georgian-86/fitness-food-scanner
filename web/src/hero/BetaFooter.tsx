export function BetaFooter() {
  return (
    <footer id="beta" className="relative z-10 scroll-mt-6 border-t border-[color-mix(in_srgb,var(--ink)_10%,transparent)]">
      <div className="mx-auto flex max-w-[84rem] flex-col items-start justify-between gap-6 px-4 py-14 sm:px-8 md:flex-row md:items-center lg:px-12">
        <div>
          <p className="display text-[clamp(2.25rem,5vw,3.5rem)] text-ink">Join the Android beta</p>
          <p className="mt-2 text-muted">Scanning is always free.</p>
        </div>
        <a href="#top" className="btn btn-secondary">
          Back to top
        </a>
      </div>
    </footer>
  )
}
