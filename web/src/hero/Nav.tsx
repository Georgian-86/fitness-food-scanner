import { Chana } from './chana.ts'

export function Nav() {
  return (
    <header className="relative z-20">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-[84rem] items-center justify-between gap-4 px-4 py-4 sm:px-8 lg:px-12 lg:py-6"
      >
        <a href="#top" className="flex items-center gap-2 rounded-full pr-2 text-ink no-underline" aria-label="chana. home">
          <span className="grid size-11 place-items-center" aria-hidden="true">
            <Chana mood="idle" size={40} />
          </span>
          <span className="display text-[2rem] leading-none tracking-tight lowercase">
            chana<span className="text-accent-1">.</span>
          </span>
        </a>
        <div className="flex items-center gap-2 sm:gap-6">
          <ul className="hidden items-center gap-1 md:flex" role="list">
            <li>
              <a className="nav-link" href="#colours">
                How the colours work
              </a>
            </li>
            <li>
              <a className="nav-link" href="#beta">
                Beta
              </a>
            </li>
          </ul>
          <a href="#beta" className="btn btn-primary btn-sm">
            Join beta
          </a>
        </div>
      </nav>
    </header>
  )
}
