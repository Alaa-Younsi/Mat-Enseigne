import type { RefObject } from 'react'

interface SpamGuardProps {
  honeypot: RefObject<HTMLInputElement | null>
}

/** Off-screen honeypot input: invisible to people and screen readers, filled in by bots. */
export function SpamGuard({ honeypot }: SpamGuardProps) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Site web (ne pas remplir)
        <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  )
}
