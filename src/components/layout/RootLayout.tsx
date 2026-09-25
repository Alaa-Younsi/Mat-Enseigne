import { useLenis } from 'lenis/react'
import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Footer } from './Footer'
import { Header } from './Header'
import { Preloader } from './Preloader'
import { ScrollProgress } from './ScrollProgress'
import { SmoothScroll } from './SmoothScroll'
import { WhatsAppFab } from './WhatsAppFab'

/** Reset scroll on route change (hash navigation is handled by the page itself). */
function ScrollReset() {
  const { pathname, hash } = useLocation()
  const lenis = useLenis()

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger, not a value we read
  useEffect(() => {
    if (hash) return
    lenis?.scrollTo(0, { immediate: true, force: true })
    window.scrollTo(0, 0)
  }, [pathname, hash, lenis])

  return null
}

export function RootLayout() {
  return (
    <SmoothScroll>
      <ScrollReset />
      <Preloader />
      <ScrollProgress />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[110] focus:rounded-full focus:bg-ember-500 focus:px-5 focus:py-3 focus:text-cream-50"
      >
        Aller au contenu
      </a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFab />
    </SmoothScroll>
  )
}
