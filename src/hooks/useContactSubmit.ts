import { useCallback, useRef, useState } from 'react'
import { checkSubmission, type GuardResult, recordSubmission } from '@/lib/spam-guard'

export type SubmitError = Exclude<GuardResult, 'ok' | 'bot'>

export const submitErrorMessages: Record<SubmitError, string> = {
  too_fast: 'Prenez une seconde pour relire votre demande, puis renvoyez-la.',
  links: 'Merci de retirer les liens de votre message.',
  rate_limited: 'Vous avez déjà envoyé plusieurs demandes. Réessayez dans quelques minutes.',
}

function safeStorage() {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

/**
 * Demo submission: the request is validated and run through the spam guards, then
 * discarded — nothing is sent, stored or opened. The site is a portfolio showcase.
 */
export function useContactSubmit() {
  const startedAt = useRef(Date.now())
  const honeypot = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<SubmitError | null>(null)

  /** Returns true when the demo submission is accepted (or silently dropped for bots). */
  const submit = useCallback((data: { message: string }) => {
    const now = Date.now()
    const storage = safeStorage()
    const verdict = checkSubmission({
      honeypot: honeypot.current?.value ?? '',
      startedAt: startedAt.current,
      message: data.message,
      now,
      storage,
    })

    if (verdict === 'bot') return true
    if (verdict !== 'ok') {
      setError(verdict)
      return false
    }

    recordSubmission(storage, now)
    setError(null)
    return true
  }, [])

  const reset = useCallback(() => {
    startedAt.current = Date.now()
    setError(null)
  }, [])

  return { submit, reset, error, honeypot }
}
