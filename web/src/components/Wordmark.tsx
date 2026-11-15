export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`}>
      chana<span className="wordmark-dot">.</span>
    </span>
  )
}
