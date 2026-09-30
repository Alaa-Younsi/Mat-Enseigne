import { useLenis } from 'lenis/react'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { InstagramIcon, WhatsAppIcon } from '@/components/ui/BrandIcons'
import { ButtonLink } from '@/components/ui/Button'
import { Wordmark } from '@/components/ui/Wordmark'
import { navigation, site } from '@/config/site'
import { useSiteLink } from '@/hooks/useSiteLink'
import { cn } from '@/lib/cn'

const EASE = [0.76, 0, 0.24, 1] as const

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const { scrollY } = useScroll()
  const lenis = useLenis()
  const link = useSiteLink()
  const { pathname } = useLocation()

  useMotionValueEvent(scrollY, 'change', (y) => {
    const previous = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)
    setHidden(y > 480 && y > previous && !open)
  })

  // Lock page scroll while the mobile menu is open.
  useEffect(() => {
    if (open) {
      lenis?.stop()
      document.documentElement.style.overflow = 'hidden'
    } else {
      lenis?.start()
      document.documentElement.style.overflow = ''
    }
  }, [open, lenis])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  /** Close the menu first, then follow the link once the menu has started closing. */
  const go = (to: string) => link(to, { delay: open ? 350 : 0, onNavigate: () => setOpen(false) })
  const isCurrent = (to: string) => !to.includes('#') && pathname === to

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
        animate={{ y: hidden ? '-120%' : '0%' }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div
          className={cn(
            'mx-auto flex h-14 max-w-[88rem] items-center justify-between rounded-full pr-2 pl-5 transition-[background-color,box-shadow,backdrop-filter] duration-500',
            scrolled || open
              ? 'bg-plum-900/75 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)] ring-1 ring-cream-100/10 backdrop-blur-xl'
              : 'bg-transparent',
          )}
        >
          <Link
            to="/"
            onClick={go('/')}
            className="relative z-10 text-[1.35rem] text-cream-50"
            aria-label={`${site.name} — accueil`}
          >
            <Wordmark />
          </Link>

          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navigation.map((item) => (
                <li key={item.to}>
                  <a
                    href={item.to}
                    onClick={go(item.to)}
                    aria-current={isCurrent(item.to) ? 'page' : undefined}
                    className={cn(
                      'group relative block overflow-hidden rounded-full px-4 py-2 font-medium text-[0.92rem] transition-colors hover:text-cream-50',
                      isCurrent(item.to) ? 'bg-cream-100/10 text-cream-50' : 'text-cream-100/85',
                    )}
                  >
                    <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">
                      {item.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-4 top-full block text-ember-400 transition-transform duration-500 ease-out-expo group-hover:-translate-y-full"
                    >
                      {item.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de Mat Enseigne"
              className="hidden size-10 place-items-center rounded-full text-cream-100/80 transition-colors hover:bg-cream-100/10 hover:text-cream-50 sm:grid"
            >
              <InstagramIcon className="size-5" />
            </a>
            <div className="hidden sm:block">
              <ButtonLink
                href="/contact"
                onClick={go('/contact')}
                className="py-1 pl-5 text-sm [&>span:last-child]:size-8"
              >
                Devis gratuit
              </ButtonLink>
            </div>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
              className="relative z-10 grid size-11 place-items-center rounded-full bg-cream-100 text-plum-800 transition-transform active:scale-95 lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col bg-plum-900 px-6 pt-28 pb-10 lg:hidden"
            initial={{ clipPath: 'circle(0% at calc(100% - 3rem) 2.75rem)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 3rem) 2.75rem)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 3rem) 2.75rem)' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <nav aria-label="Navigation mobile" className="flex-1">
              <ul className="space-y-1">
                {navigation.map((item, i) => (
                  <li key={item.to} className="overflow-hidden">
                    <motion.a
                      href={item.to}
                      onClick={go(item.to)}
                      aria-current={isCurrent(item.to) ? 'page' : undefined}
                      className="flex items-baseline gap-4 py-2 font-display font-bold text-[clamp(2.4rem,11vw,4rem)] text-cream-50 leading-none tracking-tight"
                      initial={{ y: '100%' }}
                      animate={{ y: '0%' }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 + i * 0.06 }}
                    >
                      <span className="font-sans font-medium text-ember-400 text-xs tracking-widest">
                        0{i + 1}
                      </span>
                      {item.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </nav>

            <motion.div
              className="space-y-4 border-cream-100/10 border-t pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span className="flex items-center gap-3 font-display font-semibold text-cream-50 text-xl">
                <WhatsAppIcon className="size-6 text-ember-400" />
                WhatsApp
              </span>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-cream-100/80"
              >
                <InstagramIcon className="size-5" />@{site.instagram.handle}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
