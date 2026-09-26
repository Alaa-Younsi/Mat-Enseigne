import { useCallback, useRef, useState } from 'react'
import { checkSubmission, type GuardResult, recordSubmission } from '@/lib/spam-guard'
import { formatQuoteMessage, type QuoteRequest, whatsappLink } from '@/lib/whatsapp'

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
 * Validates a quote request against the spam guards, then opens WhatsApp with the
 * pre-written message (the visitor presses "Envoyer" in WhatsApp).
 *
 * `window.open` runs synchronously inside the submit handler so popup blockers allow it;
 * if a browser still blocks it, `link` is exposed for a manual "Ouvrir WhatsApp" button.
 */
export function useContactSubmit() {
  const startedAt = useRef(Date.now())
  const honeypot = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<SubmitError | null>(null)
  const [link, setLink] = useState<string | null>(null)

  /** Returns true when the request was handed to WhatsApp (or silently dropped for bots). */
  const submit = useCallback((data: QuoteRequest) => {
    const now = Date.now()
    const storage = safeStorage()
    const verdict = checkSubmission({
      honeypot: honeypot.current?.value ?? '',
      startedAt: startedAt.current,
      message: data.message,
      now,
      storage,
    })

    // Bots get a fake success and nothing opens.
    if (verdict === 'bot') {
      setLink(null)
      return true
    }
    if (verdict !== 'ok') {
      setError(verdict)
      return false
    }

    const url = whatsappLink(formatQuoteMessage(data))
    const opened = window.open(url, '_blank')
    if (opened) opened.opener = null
    recordSubmission(storage, now)
    setError(null)
    setLink(url)
    return true
  }, [])

  const reset = useCallback(() => {
    startedAt.current = Date.now()
    setError(null)
    setLink(null)
  }, [])

  return { submit, reset, error, link, honeypot }
}
