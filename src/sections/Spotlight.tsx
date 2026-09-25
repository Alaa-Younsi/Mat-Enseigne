import { motion, useReducedMotion, useScroll } from 'motion/react'
import { useRef } from 'react'
import { Img } from '@/components/ui/Img'
import { useScrollRange } from '@/hooks/useScrollRange'

/**
 * Scroll-driven reveal: a night street photo opens from an arch
 * (the brand's half-disc motif) to full-bleed while a line of copy lights up.
 */
export function Spotlight() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  const clipPath = useScrollRange(
    scrollYProgress,
    [0, 0.6],
    [
      'inset(18% 28% 12% 28% round 999px 999px 40px 40px)',
      'inset(0% 0% 0% 0% round 0px 0px 0px 0px)',
    ],
  )
  const scale = useScrollRange(scrollYProgress, [0, 0.6], [1.25, 1])
  const textOpacity = useScrollRange(scrollYProgress, [0.45, 0.7], [0, 1])
  const textY = useScrollRange(scrollYProgress, [0.45, 0.7], [40, 0])
  const introOpacity = useScrollRange(scrollYProgress, [0, 0.25], [1, 0])

  if (reduce) {
    return (
      <section
        aria-label="Paris la nuit"
        className="relative h-[80svh] overflow-hidden bg-plum-950"
      >
        <Img
          name="paris-street"
          alt="Rue commerçante parisienne illuminée à la tombée de la nuit"
          className="size-full object-cover"
        />
        <div className="absolute inset-0 grid place-items-center bg-plum-950/55 px-6 text-center">
          <p className="font-display font-bold text-[clamp(2.2rem,6vw,5.5rem)] text-cream-50 leading-[1] tracking-[-0.04em]">
            Le jour, on vous voit.
            <br />
            <span className="font-normal font-serif text-ember-400 italic">
              La nuit, on ne voit que vous.
            </span>
          </p>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} aria-label="Paris la nuit" className="relative h-[220vh] bg-plum-950">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.p
          style={{ opacity: introOpacity }}
          className="absolute inset-x-0 top-[6%] z-10 text-center font-medium text-[0.72rem] text-cream-100/60 uppercase tracking-[0.35em]"
        >
          Faites défiler — la ville s’allume
        </motion.p>

        <motion.div style={{ clipPath }} className="absolute inset-0 will-change-[clip-path]">
          <motion.div style={{ scale }} className="size-full">
            <Img
              name="paris-street"
              alt="Rue commerçante parisienne illuminée à la tombée de la nuit"
              className="size-full object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-plum-950/50 via-plum-950/30 to-plum-950/80" />
        </motion.div>

        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="absolute inset-0 z-10 grid place-items-center px-6 text-center"
        >
          <p className="font-display font-bold text-[clamp(2.2rem,6.4vw,6.2rem)] text-cream-50 leading-[1] tracking-[-0.04em]">
            Le jour, on vous voit.
            <br />
            <span className="font-normal font-serif text-ember-400 italic text-glow">
              La nuit, on ne voit que vous.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
