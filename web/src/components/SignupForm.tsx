import { type FormEvent, useId, useState } from 'react'
import { isValidEmail, submitSignup, type SignupSource } from '../signup.ts'

type UiState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'ok' }
  | { kind: 'not-live' }
  | { kind: 'invalid' }
  | { kind: 'error'; message: string }

const MESSAGES: Record<Exclude<UiState['kind'], 'idle' | 'loading' | 'error'>, string> = {
  ok: "You're on the list. We'll email you when early access opens.",
  'not-live': "Early access opens soon — signups aren't live yet.",
  invalid: 'That email looks off. Check it and try again.',
}

export function SignupForm({ source, id, className = '', cta = 'Get early access' }: { source: SignupSource; id?: string; className?: string; cta?: string }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<UiState>({ kind: 'idle' })
  const uid = useId()
  const inputId = `${uid}-email`
  const statusId = `${uid}-status`

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (state.kind === 'loading') return
    if (!isValidEmail(email)) {
      setState({ kind: 'invalid' })
      return
    }
    setState({ kind: 'loading' })
    const res = await submitSignup(email, source)
    if (res.status === 'ok') setEmail('')
    setState(res.status === 'error' ? { kind: 'error', message: res.message } : { kind: res.status })
  }

  const message = state.kind === 'error' ? state.message : state.kind === 'idle' || state.kind === 'loading' ? '' : MESSAGES[state.kind]
  const tone = state.kind === 'ok' ? 'ok' : state.kind === 'not-live' ? 'info' : state.kind === 'invalid' || state.kind === 'error' ? 'bad' : ''

  return (
    <form id={id} className={`signup ${className}`} onSubmit={onSubmit} noValidate>
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>
      <div className="signup-row">
        <input
          id={inputId}
          className="field"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (state.kind === 'invalid') setState({ kind: 'idle' })
          }}
          aria-invalid={state.kind === 'invalid' || undefined}
          aria-describedby={statusId}
          required
        />
        <button type="submit" className="btn" disabled={state.kind === 'loading'} aria-busy={state.kind === 'loading' || undefined}>
          <span className="btn-face">{state.kind === 'loading' ? 'Sending…' : cta}</span>
        </button>
      </div>
      <p id={statusId} className={`signup-status ${tone ? `signup-status--${tone}` : ''}`} role="status" aria-live="polite">
        {message}
      </p>
    </form>
  )
}
