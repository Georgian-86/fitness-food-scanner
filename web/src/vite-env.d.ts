/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SIGNUP_ENDPOINT?: string
}

interface Window {
  /** Progress (0..1) of the page-wide journey timeline. Used by tests. */
  __journeyProgress?: () => number
}
