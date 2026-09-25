import { cn } from '@/lib/cn'

/*
 * Bauhaus-inspired motifs lifted from the brand moodboard:
 * solid discs, half-discs and bar stacks.
 */

interface ShapeProps {
  className?: string
}

/** Evenly spaced start offsets (0–100) for `count` bars. */
function offsets(count: number) {
  return Array.from({ length: count }, (_, i) => (i * 100) / count)
}

export function Stripes({ className, bars = 4 }: ShapeProps & { bars?: number }) {
  return (
    <svg viewBox="0 0 100 100" className={cn('block', className)} aria-hidden="true">
      {offsets(bars).map((x) => (
        <rect key={x} x={x} y="0" width={55 / bars} height="100" fill="currentColor" />
      ))}
    </svg>
  )
}

export function HorizontalStripes({ className, bars = 4 }: ShapeProps & { bars?: number }) {
  return (
    <svg viewBox="0 0 100 100" className={cn('block', className)} aria-hidden="true">
      {offsets(bars).map((y) => (
        <rect key={y} x="0" y={y} width="100" height={55 / bars} fill="currentColor" />
      ))}
    </svg>
  )
}

export function HalfDisc({ className }: ShapeProps) {
  return (
    <svg viewBox="0 0 100 50" className={cn('block', className)} aria-hidden="true">
      <path d="M0 50a50 50 0 0 1 100 0Z" fill="currentColor" />
    </svg>
  )
}

export function Disc({ className }: ShapeProps) {
  return (
    <span
      aria-hidden="true"
      className={cn('block aspect-square rounded-full bg-current', className)}
    />
  )
}

/** Four-point spark used as a separator in marquees and lists. */
export function Spark({ className }: ShapeProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn('block', className)} aria-hidden="true">
      <path
        d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z"
        fill="currentColor"
      />
    </svg>
  )
}
