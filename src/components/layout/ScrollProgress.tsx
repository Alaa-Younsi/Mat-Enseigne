import { motion, useScroll, useSpring } from 'motion/react'

/** Thin ember bar at the very top that tracks page scroll progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-ember-600 via-ember-500 to-ember-300"
      style={{ scaleX }}
    />
  )
}
