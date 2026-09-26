import { useLenis } from 'lenis/react'
import { AnimatePresence } from 'motion/react'
import { useLocation, useOutlet } from 'react-router'
import { Footer } from './Footer'
import { Header } from './Header'
import { PageTransition } from './PageTransition'
import { Preloader } from './Preloader'
import { ScrollProgress } from './ScrollProgress'
import { SmoothScroll } from './SmoothScroll'
import { WhatsAppFab } from './WhatsAppFab'

/** Page content with a curtain transition between routes (not between hashes). */
function AnimatedOutlet() {
  const outlet = useOutlet()
  const { pathname, hash } = useLocation()
  const lenis = useLenis()

  // While the curtain fully covers the screen, jump to the top (or let the page handle its hash).
  const resetScroll = () => {
    if (hash) return
    lenis?.scrollTo(0, { immediate: true, force: true })
    window.scrollTo(0, 0)
  }

  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={resetScroll}>
      <PageTransition key={pathname}>{outlet}</PageTransition>
    </AnimatePresence>
  )
}

export function RootLayout() {
  return (
    <SmoothScroll>
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
        <AnimatedOutlet />
      </main>
      <Footer />
      <WhatsAppFab />
    </SmoothScroll>
  )
}
