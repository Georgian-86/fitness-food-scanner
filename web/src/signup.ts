// Early-access signup. Posts JSON to VITE_SIGNUP_ENDPOINT when it is set.
// The owner decided signups stay off for now: with no endpoint the form says so and never fakes success.

export type SignupSource = 'hero' | 'final-cta' | 'pricing' | (string & {})

export type SignupResult =
  | { status: 'ok' }
  | { status: 'not-live' }
  | { status: 'invalid' }
  | { status: 'error'; message: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function isValidEmail(email: string): boolean {
  return email.length <= 254 && EMAIL_RE.test(email.trim())
}

export function signupEndpoint(): string | undefined {
  const url = import.meta.env.VITE_SIGNUP_ENDPOINT as string | undefined
  return url && url.trim() ? url.trim() : undefined
}

export const signupsLive = () => signupEndpoint() !== undefined

export async function submitSignup(email: string, source: SignupSource): Promise<SignupResult> {
  const clean = email.trim()
  if (!isValidEmail(clean)) return { status: 'invalid' }
  const endpoint = signupEndpoint()
  if (!endpoint) return { status: 'not-live' }

  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), 10_000)
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email: clean, source, page: window.location.pathname, at: new Date().toISOString() }),
      signal: controller.signal,
    })
    if (!res.ok) return { status: 'error', message: `The server said no (${res.status}). Please try again in a minute.` }
    return { status: 'ok' }
  } catch {
    return { status: 'error', message: 'Could not reach the server. Check your connection and try again.' }
  } finally {
    window.clearTimeout(timer)
  }
}
