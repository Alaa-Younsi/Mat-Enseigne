import { useLenis } from 'lenis/react'
import { useCallback } from 'react'

/**
 * Smoothly scroll to an in-page anchor (e.g. "#services").
 * Uses Lenis when active, and falls back to native scrolling
 * (reduced-motion users, or before Lenis is mounted).
 */
export function useScrollTo() {
  const lenis = useLenis()

  return useCallback(
    (hash: string) => {
      const target = hash === '#top' ? 0 : document.querySelector<HTMLElement>(hash)
      if (target === null) return false

      if (lenis) {
        lenis.start()
        // After a route change the page height differs from Lenis' cached limit — re-measure first.
        lenis.resize()
        lenis.scrollTo(target, { offset: 0, duration: 1.4 })
      } else if (target === 0) {
        window.scrollTo({ top: 0 })
      } else {
        target.scrollIntoView()
      }

      if (window.location.hash !== hash && hash !== '#top') {
        window.history.replaceState(null, '', hash)
      }
      return true
    },
    [lenis],
  )
}
