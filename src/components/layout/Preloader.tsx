import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'mat-preloader-seen'
const LETTERS = ['M', 'A', 'T']
const DURATION_MS = 1700
/** Never hold the intro longer than this waiting for the display font. */
const FONT_TIMEOUT_MS = 700

function hasSeenPreloader() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function markPreloaderSeen() {
  try {
    sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // Storage unavailable (private mode) — the preloader simply shows again.
  }
}

/**
 * "Sign power-on" intro: the letters flicker on like a neon tube,
 * then the curtain lifts. Shown once per session, skipped for reduced motion.
 */
export function Preloader() {
  const reduce = useReducedMotion()
  const [visible, setVisible] = useState(() => !hasSeenPreloader())
  const [fontReady, setFontReady] = useState(false)

  // Start the flicker only once the display font is ready, so the letters never flash in a fallback face.
  useEffect(() => {
    if (!visible || reduce) return
    let cancelled = false
    const timeout = new Promise((resolve) => window.setTimeout(resolve, FONT_TIMEOUT_MS))
    const font = document.fonts
      .load('800 1em "Bricolage Grotesque Variable"')
      .catch(() => undefined)
    void Promise.race([font, timeout]).then(() => {
      if (!cancelled) setFontReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [visible, reduce])

  useEffect(() => {
    if (!visible) return
    if (reduce) {
      setVisible(false)
      return
    }
    if (!fontReady) return
    const timer = window.setTimeout(() => {
      markPreloaderSeen()
      setVisible(false)
    }, DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [visible, reduce, fontReady])

  return (
    <AnimatePresence>
      {visible && !reduce && (
        <motion.div
          key="preloader"
          aria-hidden="true"
          className="fixed inset-0 z-[100] grid place-items-center bg-plum-950"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex items-baseline gap-2 font-display font-extrabold text-[clamp(4rem,16vw,11rem)] text-ember-400 leading-none tracking-[-0.05em]">
            {LETTERS.map((letter, i) => (
              <motion.span
                key={letter}
                className="text-glow"
                initial={{ opacity: 0 }}
                animate={fontReady ? { opacity: [0.08, 1, 0.2, 1, 0.5, 1] } : { opacity: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.15 + i * 0.22,
                  times: [0, 0.2, 0.35, 0.5, 0.7, 1],
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
          <motion.p
            className="absolute bottom-10 font-medium text-[0.7rem] text-cream-200/70 uppercase tracking-[0.4em]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Enseignes · Paris
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
