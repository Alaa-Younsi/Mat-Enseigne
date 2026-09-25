import { ReactLenis } from 'lenis/react'
import { useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

/** Global inertia scrolling. Disabled entirely for reduced-motion users. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()

  if (reduce) return children

  return (
    <ReactLenis root options={{ lerp: 0.1, wheelMultiplier: 1, autoRaf: true }}>
      {children}
    </ReactLenis>
  )
}
