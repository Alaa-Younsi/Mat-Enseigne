import { cn } from '@/lib/cn'

interface WordmarkProps {
  className?: string
}

/**
 * Text-based logo until the client's final logo is delivered.
 * TODO(client): swap for the official SVG logo.
 */
export function Wordmark({ className }: WordmarkProps) {
  return (
    <span className={cn('inline-flex items-baseline gap-[0.18em] leading-none', className)}>
      <span className="font-display font-extrabold tracking-[-0.04em]">MAT</span>
      <span
        aria-hidden="true"
        className="inline-block size-[0.28em] translate-y-[-0.05em] rounded-full bg-ember-500"
      />
      <span className="font-serif text-[1.08em] italic tracking-tight">enseigne</span>
    </span>
  )
}
