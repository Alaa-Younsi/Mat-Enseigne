import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { Wordmark } from '@/components/ui/Wordmark'

const EASE = [0.76, 0, 0.24, 1] as const
const DURATION = 0.65

/**
 * Wraps a page: on exit a curtain rises from the bottom and covers the screen,
 * on enter it lifts away through the top. Must be a direct child of
 * <AnimatePresence mode="wait"> keyed by pathname.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div exit={{ opacity: 1 }} transition={{ duration: DURATION }}>
      {children}

      {/* Exit curtain: grows from the bottom */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[95] grid origin-bottom place-items-center bg-plum-900"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: DURATION, ease: EASE }}
      >
        <motion.span
          className="text-4xl text-cream-50 sm:text-5xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Wordmark />
        </motion.span>
      </motion.div>

      {/* Enter curtain: shrinks toward the top */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[95] origin-top bg-plum-900"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: DURATION, ease: EASE, delay: 0.05 }}
      >
        <span className="absolute inset-x-0 bottom-0 h-1 bg-ember-500" />
      </motion.div>
    </motion.div>
  )
}
