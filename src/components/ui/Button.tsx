import { ArrowUpRight } from 'lucide-react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Magnetic } from './Magnetic'

type Variant = 'primary' | 'light' | 'outline' | 'dark'

const variants: Record<Variant, string> = {
  primary:
    'bg-ember-500 text-cream-50 hover:bg-ember-400 shadow-[0_10px_40px_-12px] shadow-ember-500/60',
  light: 'bg-cream-100 text-plum-800 hover:bg-cream-50',
  outline: 'border border-current/25 text-current hover:border-current/60',
  dark: 'bg-plum-800 text-cream-100 hover:bg-plum-700',
}

interface ButtonLinkProps extends ComponentPropsWithoutRef<'a'> {
  variant?: Variant
  icon?: ReactNode
  magnetic?: boolean
}

/** Pill-shaped call-to-action link with a sliding arrow. */
export function ButtonLink({
  variant = 'primary',
  icon,
  magnetic = true,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const isExternal = typeof rest.href === 'string' && /^https?:/.test(rest.href)
  const link = (
    <a
      className={cn(
        'group relative inline-flex items-center gap-3 overflow-hidden rounded-full py-2 pr-2 pl-6',
        'font-display font-semibold text-[0.95rem] tracking-tight transition-colors duration-300',
        variants[variant],
        className,
      )}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      <span>{children}</span>
      <span
        aria-hidden="true"
        className={cn(
          'relative grid size-10 place-items-center overflow-hidden rounded-full',
          variant === 'primary' ? 'bg-cream-50 text-ember-600' : 'bg-ember-500 text-cream-50',
        )}
      >
        {icon ?? (
          <>
            <ArrowUpRight className="size-[1.1rem] transition-transform duration-500 ease-out-expo group-hover:translate-x-6 group-hover:-translate-y-6" />
            <ArrowUpRight className="absolute size-[1.1rem] -translate-x-6 translate-y-6 transition-transform duration-500 ease-out-expo group-hover:translate-x-0 group-hover:translate-y-0" />
          </>
        )}
      </span>
    </a>
  )

  return magnetic ? <Magnetic strength={0.2}>{link}</Magnetic> : link
}
