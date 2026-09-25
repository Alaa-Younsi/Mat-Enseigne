import { type MotionValue, motion, useScroll } from 'motion/react'
import { useRef } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { HalfDisc, HorizontalStripes } from '@/components/ui/Shapes'
import { commitments } from '@/data/content'
import { useScrollRange } from '@/hooks/useScrollRange'
import { cn } from '@/lib/cn'

/** `*word*` marks a highlighted word rendered in ember serif italic. */
const MANIFESTO =
  'Votre façade est la première promesse faite à vos clients. Nous dessinons, fabriquons et posons des enseignes qui se *remarquent* de loin et se *retiennent* longtemps.'

interface WordProps {
  word: string
  progress: MotionValue<number>
  range: [number, number]
}

function Word({ word, progress, range }: WordProps) {
  const highlighted = word.startsWith('*')
  const clean = word.replaceAll('*', '')
  const opacity = useScrollRange(progress, range, [0.14, 1])

  return (
    <motion.span
      style={{ opacity }}
      className={cn(
        'mr-[0.22em] inline-block',
        highlighted && 'font-normal font-serif text-ember-500 italic',
      )}
    >
      {clean}
    </motion.span>
  )
}

export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = MANIFESTO.split(' ')

  return (
    <section
      aria-labelledby="manifesto-title"
      className="grain relative overflow-hidden bg-cream-100 pt-20 pb-24 text-plum-800 sm:pt-28 sm:pb-32"
    >
      <HalfDisc className="absolute -top-px right-[8%] w-40 rotate-180 text-plum-700 sm:w-56" />
      <HorizontalStripes
        bars={5}
        className="absolute bottom-16 -left-6 w-24 text-ember-500/80 sm:w-32"
      />

      <div className="container-px relative z-10">
        <SectionLabel index="01" className="text-plum-700">
          Notre approche
        </SectionLabel>
        <h2 id="manifesto-title" className="sr-only">
          Notre approche
        </h2>

        <p
          ref={ref}
          className="mt-10 max-w-6xl font-display font-bold text-[clamp(1.9rem,5vw,4.6rem)] leading-[1.06] tracking-[-0.035em]"
        >
          <span className="sr-only">{MANIFESTO.replaceAll('*', '')}</span>
          <span aria-hidden="true">
            {words.map((word, i) => (
              <Word
                // biome-ignore lint/suspicious/noArrayIndexKey: static sentence
                key={i}
                word={word}
                progress={scrollYProgress}
                range={[i / words.length, (i + 1) / words.length]}
              />
            ))}
          </span>
        </p>

        <dl className="mt-20 grid gap-px overflow-hidden rounded-3xl bg-plum-800/15 ring-1 ring-plum-800/15 sm:grid-cols-2 lg:grid-cols-4">
          {commitments.map((item, i) => (
            <Reveal
              key={item.title}
              delay={i * 0.08}
              className="group relative bg-cream-100 p-7 sm:p-8"
            >
              <dt>
                <span className="block font-display font-extrabold text-6xl text-plum-800 tracking-[-0.05em] transition-colors duration-500 group-hover:text-ember-500 sm:text-7xl">
                  {item.value}
                </span>
                <span className="mt-5 block font-display font-semibold text-lg">{item.title}</span>
              </dt>
              <dd className="mt-2 text-plum-800/70 leading-relaxed">{item.text}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
