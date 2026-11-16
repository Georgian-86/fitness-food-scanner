import { Component, type ReactNode, useEffect, useRef, useState } from 'react'
import { Chana, type ChanaMood } from '../mascot'

/** Keeps the page alive if the mascot ever throws: the slot stays the same size and simply shows nothing. */
class MascotBoundary extends Component<{ size: number; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: unknown) {
    console.warn('Chana failed to render', error)
  }
  render() {
    if (this.state.failed) return <Slot size={this.props.size} />
    return this.props.children
  }
}

function Slot({ size }: { size: number }) {
  return <span style={{ display: 'block', width: size, height: size }} aria-hidden="true" />
}

/**
 * Chana, mounted only while near the viewport. The mascot runs animation loops, so a page with several
 * Chanas would otherwise animate every one of them on every frame, on or off screen.
 */
export function SafeChana({ mood, size = 160, className }: { mood: ChanaMood; size?: number; className?: string }) {
  const host = useRef<HTMLSpanElement>(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = host.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setNear(true)
      return
    }
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: '30% 0px 30% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <span ref={host} className={className} style={{ display: 'block', width: size, height: size }}>
      {near ? (
        <MascotBoundary size={size}>
          <Chana mood={mood} size={size} />
        </MascotBoundary>
      ) : (
        <Slot size={size} />
      )}
    </span>
  )
}
