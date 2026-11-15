import { Component, type ReactNode } from 'react'
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
    if (this.state.failed) return <span style={{ display: 'inline-block', width: this.props.size, height: this.props.size }} aria-hidden="true" />
    return this.props.children
  }
}

export function SafeChana({ mood, size = 160, className }: { mood: ChanaMood; size?: number; className?: string }) {
  return (
    <MascotBoundary size={size}>
      <Chana mood={mood} size={size} className={className} />
    </MascotBoundary>
  )
}
