import type { ReactNode } from 'react'
import { useId } from 'react'
import { cn } from '@/lib/cn'

interface RotatingBadgeProps {
  text: string
  className?: string
  children?: ReactNode
}

/** Circular text that slowly rotates around a centred mark. */
export function RotatingBadge({ text, className, children }: RotatingBadgeProps) {
  const pathId = useId()
  return (
    <div className={cn('relative grid aspect-square place-items-center', className)}>
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 size-full animate-spin-slow"
        aria-hidden="true"
      >
        <defs>
          <path id={pathId} d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0" />
        </defs>
        <text className="fill-current font-display font-semibold text-[15px] uppercase tracking-[0.32em]">
          <textPath href={`#${pathId}`}>{text}</textPath>
        </text>
      </svg>
      <span className="sr-only">{text}</span>
      {children}
    </div>
  )
}
