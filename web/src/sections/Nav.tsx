import { Wordmark } from '../components/Wordmark.tsx'

const LINKS = [
  { href: '#how', label: 'How it works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
]

export function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a href="#top" className="nav-brand" aria-label="chana. home">
          <Wordmark />
        </a>
        <nav aria-label="Main" className="nav-links">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="nav-link">
              {l.label}
            </a>
          ))}
        </nav>
        <a href="#signup" className="btn btn-sm">
          <span className="btn-face">Get early access</span>
        </a>
      </div>
      {/* Journey meter for narrow screens (the desktop rail sits on the right edge). */}
      <div className="nav-meter" aria-hidden="true">
        <span className="nav-meter-fill js-journey-bar" />
      </div>
    </header>
  )
}
