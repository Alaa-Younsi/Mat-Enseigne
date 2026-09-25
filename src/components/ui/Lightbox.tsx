import { useLenis } from 'lenis/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { type KeyboardEvent as ReactKeyboardEvent, useEffect, useRef } from 'react'
import { Img } from './Img'

export interface LightboxItem {
  id: string
  image: string
  alt: string
  title: string
  caption: string
}

interface LightboxProps {
  items: readonly LightboxItem[]
  index: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}

/** Accessible image viewer: focus trap, Escape to close, arrow keys to navigate. */
export function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const lenis = useLenis()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const open = index !== null
  const item = index !== null ? items[index] : undefined

  const go = (delta: number) => {
    if (index === null) return
    onNavigate((index + delta + items.length) % items.length)
  }

  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      lenis?.start()
      document.documentElement.style.overflow = ''
      previouslyFocused?.focus()
    }
  }, [open, lenis])

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') onClose()
    else if (event.key === 'ArrowRight') go(1)
    else if (event.key === 'ArrowLeft') go(-1)
    else if (event.key === 'Tab' && dialogRef.current) {
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>('button')
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
  }

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
          data-lenis-prevent
          onKeyDown={onKeyDown}
          className="fixed inset-0 z-[80] flex flex-col bg-plum-950/95 p-4 backdrop-blur-md sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex items-center justify-between text-cream-100">
            <p className="font-medium text-sm tabular-nums tracking-widest">
              {String((index ?? 0) + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="grid size-12 place-items-center rounded-full bg-cream-100/10 transition-colors hover:bg-ember-500"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center py-4">
            <button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              onClick={onClose}
              className="absolute inset-0 cursor-zoom-out"
            />
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={item.id}
                className="relative flex max-h-full flex-col items-center"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <Img
                  name={item.image}
                  alt={item.alt}
                  sizes="90vw"
                  priority
                  className="max-h-[72svh] w-auto max-w-full rounded-2xl object-contain"
                />
                <figcaption className="mt-4 text-center">
                  <span className="block font-display font-semibold text-cream-50 text-lg">
                    {item.title}
                  </span>
                  <span className="text-cream-100/60 text-sm">{item.caption}</span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Image précédente"
              className="grid size-12 place-items-center rounded-full bg-cream-100/10 text-cream-100 transition-colors hover:bg-ember-500"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Image suivante"
              className="grid size-12 place-items-center rounded-full bg-cream-100/10 text-cream-100 transition-colors hover:bg-ember-500"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
