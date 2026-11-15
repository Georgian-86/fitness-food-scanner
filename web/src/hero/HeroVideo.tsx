import type { VideoSources } from './heroVideo.ts'

/** Muted, looping background video. Rendered only when a source exists for the palette. */
export function HeroVideo({ sources, className = '' }: { sources: VideoSources; className?: string }) {
  return (
    <video
      key={sources.mp4}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={sources.poster}
      aria-hidden="true"
      tabIndex={-1}
    >
      {sources.webm && <source src={sources.webm} type="video/webm" />}
      <source src={sources.mp4} type="video/mp4" />
    </video>
  )
}

export function HeroPoster({ sources, className = '' }: { sources: VideoSources; className?: string }) {
  return <img className={className} src={sources.poster} alt="" aria-hidden="true" decoding="async" />
}
