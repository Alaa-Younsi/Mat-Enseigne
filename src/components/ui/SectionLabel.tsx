import { cn } from '@/lib/cn'

interface SectionLabelProps {
  index: string
  children: string
  className?: string
}

/** Small eyebrow label shown above section headings, e.g. "(02) — Services". */
export function SectionLabel({ index, children, className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        'flex items-center gap-3 font-medium text-[0.72rem] uppercase tracking-[0.28em]',
        className,
      )}
    >
      <span className="text-ember-500">({index})</span>
      <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
      <span>{children}</span>
    </p>
  )
}
