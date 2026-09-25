import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface MarqueeProps {
  children: ReactNode
  /** Seconds for one full loop. */
  duration?: number
  reverse?: boolean
  className?: string
  pauseOnHover?: boolean
}

/**
 * Seamless CSS marquee: content is rendered twice and translated by -50%,
 * so it loops without a visible jump. The duplicate is hidden from assistive tech.
 */
export function Marquee({
  children,
  duration = 40,
  reverse = false,
  className,
  pauseOnHover = false,
}: MarqueeProps) {
  return (
    <div className={cn('group flex overflow-hidden', className)}>
      <div
        className={cn(
          'flex w-max shrink-0',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee',
          pauseOnHover && 'group-hover:[animation-play-state:paused]',
        )}
        style={{ '--marquee-duration': `${duration}s` } as CSSProperties}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
