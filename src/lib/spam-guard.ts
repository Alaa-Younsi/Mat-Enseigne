/**
 * Client-side protections for the quote forms.
 *
 * The forms are demos and never send data anywhere; these guards still run on submit
 * so the validation flow behaves like a production form.
 */

/** A human needs at least this long to fill a form. */
export const MIN_FILL_MS = 3_000
/** Max submissions per browser within the window. */
export const MAX_SENDS = 3
export const SEND_WINDOW_MS = 10 * 60 * 1000
export const MAX_LINKS = 2

const STORAGE_KEY = 'mat-quote-sends'

export type GuardResult = 'ok' | 'bot' | 'too_fast' | 'rate_limited' | 'links'

interface GuardInput {
  honeypot: string
  startedAt: number
  message: string
  now: number
  storage?: Pick<Storage, 'getItem' | 'setItem'> | null
}

export function countLinks(text: string) {
  return (
    text.match(/https?:\/\/|www\.|\b[a-z0-9-]+\.(?:com|net|org|ru|xyz|top|info|biz)\b/gi) ?? []
  ).length
}

function readSends(storage: GuardInput['storage'], now: number): number[] {
  try {
    const raw = storage?.getItem(STORAGE_KEY)
    const list = raw ? (JSON.parse(raw) as unknown) : []
    return Array.isArray(list)
      ? list.filter((t): t is number => typeof t === 'number' && now - t < SEND_WINDOW_MS)
      : []
  } catch {
    return []
  }
}

/** Decide whether a submission is accepted. */
export function checkSubmission({
  honeypot,
  startedAt,
  message,
  now,
  storage,
}: GuardInput): GuardResult {
  if (honeypot.trim() !== '') return 'bot'
  if (now - startedAt < MIN_FILL_MS) return 'too_fast'
  if (countLinks(message) > MAX_LINKS) return 'links'
  if (readSends(storage, now).length >= MAX_SENDS) return 'rate_limited'
  return 'ok'
}

/** Remember a submission for the rate limit (best effort — storage may be unavailable). */
export function recordSubmission(storage: GuardInput['storage'], now: number) {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify([...readSends(storage, now), now]))
  } catch {
    // Private mode / blocked storage: the other guards still apply.
  }
}
