import type { ReactNode } from 'react'
import { Wordmark } from './Wordmark.tsx'

/** Flat neobrutalist phone: thick ink border, static hard shadow, no glare or gradients. */
export function Phone({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`phone ${className}`}>
      <div className="phone-screen">
        <div className="phone-status" aria-hidden="true">
          <span>9:41</span>
          <span className="phone-notch" />
          <span className="phone-dots">
            <i />
            <i />
            <i />
          </span>
        </div>
        <div className="phone-head">
          <Wordmark className="wordmark--sm" />
          <span className="phone-tag">Scan</span>
        </div>
        {children}
      </div>
    </div>
  )
}
