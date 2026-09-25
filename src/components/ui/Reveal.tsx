import { motion, type Variants } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

const EASE = [0.16, 1, 0.3, 1] as const

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  /** Vertical offset in px the element travels from. */
  y?: number
  as?: 'div' | 'li' | 'p' | 'span'
}

/** Fades and lifts its children into view once, when scrolled into the viewport. */
export function Reveal({ children, className, delay = 0, y = 32, as = 'div' }: RevealProps) {
  const Component = motion[as]
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </Component>
  )
}

const wordVariants: Variants = {
  hidden: { y: '110%' },
  visible: (i: number) => ({
    y: '0%',
    transition: { duration: 0.9, ease: EASE, delay: i * 0.06 },
  }),
}

interface SplitRevealProps {
  text: string
  className?: string
  wordClassName?: string
  /** Delay offset (in word units) before this line starts. */
  offset?: number
  /** Animate on mount instead of on scroll. */
  immediate?: boolean
}

/** Masked word-by-word reveal for display headings. */
export function SplitReveal({
  text,
  className,
  wordClassName,
  offset = 0,
  immediate = false,
}: SplitRevealProps) {
  const words = text.split(' ')
  const trigger = immediate
    ? { animate: 'visible' as const }
    : { whileInView: 'visible' as const, viewport: { once: true, margin: '0px 0px -10% 0px' } }

  return (
    <motion.span className={cn('inline', className)} initial="hidden" {...trigger}>
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: static text, order never changes
          key={`${word}-${i}`}
          aria-hidden="true"
          className="inline-block overflow-hidden pb-[0.08em] align-bottom"
        >
          <motion.span
            className={cn('inline-block will-change-transform', wordClassName)}
            variants={wordVariants}
            custom={i + offset}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}
