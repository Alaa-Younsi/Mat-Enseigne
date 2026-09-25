import { Check } from 'lucide-react'
import { motion, useReducedMotion, useScroll } from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'
import { Reveal, SplitReveal } from '@/components/ui/Reveal'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Disc, HalfDisc } from '@/components/ui/Shapes'
import { type Step, steps } from '@/data/content'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useScrollRange } from '@/hooks/useScrollRange'
import { cn } from '@/lib/cn'

const cardTheme = [
  'bg-plum-700 text-cream-100',
  'bg-ember-500 text-plum-950',
  'bg-cream-200 text-plum-900',
  'bg-plum-500 text-cream-50',
] as const

function StepCard({ step, i, className }: { step: Step; i: number; className?: string }) {
  return (
    <article
      className={cn(
        'relative flex flex-col justify-between overflow-hidden rounded-[2rem] p-7 sm:p-10',
        cardTheme[i % cardTheme.length],
        className,
      )}
    >
      <HalfDisc className="absolute -right-10 -bottom-px w-48 opacity-15" />
      <div className="relative flex items-start justify-between gap-6">
        <span className="font-display font-extrabold text-[5.5rem] leading-[0.8] tracking-[-0.06em] opacity-90 sm:text-[8rem]">
          {step.index}
        </span>
        <Disc className="mt-2 w-4 opacity-60" />
      </div>
      <div className="relative mt-10">
        <h3 className="font-display font-bold text-3xl tracking-[-0.03em] sm:text-4xl">
          {step.title}
        </h3>
        <p className="mt-4 max-w-md leading-relaxed opacity-80">{step.text}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {step.points.map((point) => (
            <li
              key={point}
              className="inline-flex items-center gap-1.5 rounded-full bg-current/10 px-3 py-1.5 font-medium text-sm"
            >
              <Check className="size-3.5" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

function Intro() {
  return (
    <div className="max-w-xl">
      <SectionLabel index="04" className="text-cream-100/70">
        Méthode
      </SectionLabel>
      <h2
        id="process-title"
        className="mt-6 font-display font-bold text-[clamp(2.4rem,5.4vw,5rem)] text-cream-50 leading-[0.98] tracking-[-0.04em]"
      >
        <SplitReveal text="De l’idée" className="block" />
        <SplitReveal
          text="à la pose."
          offset={2}
          className="block"
          wordClassName="font-serif font-normal italic text-ember-400"
        />
      </h2>
      <Reveal delay={0.15}>
        <p className="mt-6 text-cream-100/65 text-lg leading-relaxed">
          Quatre étapes claires, un seul interlocuteur. Vous savez toujours où en est votre projet.
        </p>
      </Reveal>
    </div>
  )
}

/** Desktop: vertical scroll drives a pinned horizontal track. */
function PinnedProcess() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const x = useScrollRange(scrollYProgress, [0, 1], [0, -distance])
  const progress = useScrollRange(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section
      ref={sectionRef}
      id="methode"
      aria-labelledby="process-title"
      className="relative bg-plum-950"
      style={{ height: `calc(100vh + ${distance}px)` }}
    >
      <div className="grain sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="relative z-10 flex w-max items-stretch gap-6 pr-[8vw] pl-[max(3rem,calc((100vw-88rem)/2+3rem))]"
        >
          <div className="flex w-[34rem] shrink-0 items-center">
            <Intro />
          </div>
          {steps.map((step, i) => (
            <StepCard
              key={step.index}
              step={step}
              i={i}
              className="h-[min(34rem,72vh)] w-[30rem] shrink-0"
            />
          ))}
        </motion.div>

        <div className="container-px relative z-10 mt-10">
          <div className="h-px w-full bg-cream-100/15">
            <motion.div className="h-px bg-ember-500" style={{ width: progress }} />
          </div>
        </div>
      </div>
    </section>
  )
}

/** Mobile / reduced motion: a simple vertical stack. */
function StackedProcess() {
  return (
    <section
      id="methode"
      aria-labelledby="process-title"
      className="grain relative overflow-hidden bg-plum-950 py-24 sm:py-32"
    >
      <div className="container-px relative z-10">
        <Intro />
        <ol className="mt-14 grid gap-4 sm:grid-cols-2">
          {steps.map((step, i) => (
            <Reveal as="li" key={step.index} delay={(i % 2) * 0.08}>
              <StepCard step={step} i={i} className="min-h-[26rem]" />
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function Process() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const reduce = useReducedMotion()
  return isDesktop && !reduce ? <PinnedProcess /> : <StackedProcess />
}
