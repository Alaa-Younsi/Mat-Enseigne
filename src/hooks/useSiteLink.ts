import { type MouseEvent, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useScrollTo } from './useScrollTo'

/**
 * Click handler factory for internal links.
 *
 * - `/#section` → smooth-scrolls when already on the home page, otherwise navigates home
 *   (the home page then scrolls to the hash).
 * - `/route`    → client-side navigation (with the page transition).
 *
 * Modified clicks (ctrl/cmd/shift/middle) keep the browser default, so
 * "open in a new tab" still works because every link has a real `href`.
 */
export function useSiteLink() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const scrollTo = useScrollTo()

  return useCallback(
    (to: string, options: { delay?: number; onNavigate?: () => void } = {}) =>
      (event: MouseEvent<HTMLAnchorElement>) => {
        if (event.defaultPrevented || event.button !== 0) return
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        event.preventDefault()
        options.onNavigate?.()

        const run = () => {
          if (to.startsWith('/#') && pathname === '/') {
            scrollTo(to.slice(1))
          } else if (to !== pathname) {
            navigate(to)
          } else {
            scrollTo('#top')
          }
        }
        if (options.delay) window.setTimeout(run, options.delay)
        else run()
      },
    [navigate, pathname, scrollTo],
  )
}
