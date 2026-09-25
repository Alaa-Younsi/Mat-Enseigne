import { ArrowDown } from 'lucide-react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { type PointerEvent, useRef } from 'react'
import { ButtonLink } from '@/components/ui/Button'
import { Img } from '@/components/ui/Img'
import { SplitReveal } from '@/components/ui/Reveal'
import { RotatingBadge } from '@/components/ui/RotatingBadge'
import { Disc, HalfDisc, Spark, Stripes } from '@/components/ui/Shapes'
import { site } from '@/config/site'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useScrollRange } from '@/hooks/useScrollRange'
import { useScrollTo } from '@/hooks/useScrollTo'

const EASE = [0.16, 1, 0.3, 1] as const

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const scrollTo = useScrollTo()

  // Scroll-linked exit: content drifts up, image zooms.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const contentY = useScrollRange(scrollYProgress, [0, 1], ['0%', '-18%'])
  const contentOpacity = useScrollRange(scrollYProgress, [0, 0.7], [1, 0])
  const imageScale = useScrollRange(scrollYProgress, [0, 1], [1, 1.18])

  // Pointer parallax (desktop only).
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 60, damping: 18 })
  const sy = useSpring(py, { stiffness: 60, damping: 18 })
  const archX = useTransform(sx, (v) => v * -14)
  const archY = useTransform(sy, (v) => v * -10)
  const cardX = useTransform(sx, (v) => v * 26)
  const cardY = useTransform(sy, (v) => v * 18)
  const shapeX = useTransform(sx, (v) => v * 40)

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reduce || event.pointerType !== 'mouse') return
    px.set(event.clientX / window.innerWidth - 0.5)
    py.set(event.clientY / window.innerHeight - 0.5)
  }

  return (
    <section
      ref={ref}
      id="top"
      onPointerMove={onPointerMove}
      className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-plum-950 pt-28 pb-10 lg:pt-32"
    >
      {/* Ambient light */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 size-[42rem] rounded-full bg-plum-600/40 blur-[120px]" />
        <div className="absolute right-[-10rem] bottom-[-12rem] size-[38rem] rounded-full bg-ember-600/25 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(246_235_214/0.04)_1px,transparent_1px)] bg-[size:calc(100%/6)_100%]" />
      </div>

      <motion.div
        style={reduce || !isDesktop ? {} : { y: contentY, opacity: contentOpacity }}
        className="container-px relative z-10 grid flex-1 items-center gap-12 lg:grid-cols-12 lg:gap-8"
      >
        {/* Copy */}
        <div className="lg:col-span-7">
          <motion.p
            className="inline-flex items-center gap-3 rounded-full bg-cream-100/5 py-2 pr-4 pl-3 text-[0.78rem] text-cream-100/80 ring-1 ring-cream-100/10 backdrop-blur"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-ember-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-ember-500" />
            </span>
            Enseignes · Adhésifs · Véhicules — {site.city}
          </motion.p>

          <h1 className="mt-7 font-display font-extrabold text-[clamp(2.5rem,11.5vw,4.75rem)] text-cream-50 leading-[0.95] tracking-[-0.045em] lg:text-[clamp(4rem,6.6vw,7.6rem)]">
            <SplitReveal text="Des enseignes" immediate offset={2} className="block" />
            <span className="block">
              <SplitReveal text="qui" immediate offset={4} />{' '}
              <motion.span
                className="inline-block pr-[0.08em] font-normal font-serif text-ember-400 italic tracking-[-0.02em]"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.25, 1, 0.5, 1] }}
                transition={{ duration: 1.1, delay: 0.9, times: [0, 0.15, 0.3, 0.5, 0.7, 1] }}
              >
                <span className="text-glow animate-flicker [animation-delay:3s] [animation-duration:7s]">
                  allument
                </span>
              </motion.span>
            </span>
            <SplitReveal text="votre façade." immediate offset={6} className="block" />
          </h1>

          <motion.p
            className="mt-7 max-w-xl text-[1.05rem] text-cream-100/70 leading-relaxed sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
          >
            {site.tagline}. Nous concevons, fabriquons et posons vos enseignes lumineuses, lettres
            en relief, adhésifs vitrine et marquages de véhicules, à {site.area}.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 1.05 }}
          >
            <ButtonLink
              href="#contact"
              onClick={(event) => {
                event.preventDefault()
                scrollTo('#contact')
              }}
            >
              Demander un devis
            </ButtonLink>
            <ButtonLink
              href="#realisations"
              variant="outline"
              className="text-cream-100"
              onClick={(event) => {
                event.preventDefault()
                scrollTo('#realisations')
              }}
            >
              Nos réalisations
            </ButtonLink>
          </motion.div>
        </div>

        {/* Visual */}
        <div className="relative mx-auto w-full max-w-[26rem] sm:max-w-[30rem] lg:col-span-5 lg:max-w-none">
          <motion.div
            aria-hidden="true"
            className="absolute -top-6 -right-2 w-20 text-ember-500 sm:w-24"
            style={reduce ? {} : { x: shapeX }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 0.6 }}
          >
            <Stripes bars={4} />
          </motion.div>

          <motion.div
            className="relative ml-auto aspect-[4/5] w-[86%] overflow-hidden rounded-t-full rounded-b-[2rem] bg-plum-800 ring-1 ring-cream-100/10"
            style={reduce ? {} : { x: archX, y: archY }}
            initial={{ clipPath: 'inset(100% 0 0 0 round 999px 999px 32px 32px)' }}
            animate={{ clipPath: 'inset(0% 0 0 0 round 999px 999px 32px 32px)' }}
            transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.35 }}
          >
            <motion.div className="size-full" style={reduce ? {} : { scale: imageScale }}>
              <Img
                name="paris-storefront"
                alt="Enseigne éclairée d’un café parisien, de nuit sous la pluie"
                sizes="(min-width: 1024px) 38vw, 86vw"
                priority
                className="size-full object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-plum-950/70 via-transparent to-transparent" />
            <p className="absolute right-6 bottom-6 hidden max-w-[55%] text-right sm:block font-serif text-cream-50 text-lg leading-snug italic sm:text-xl">
              Paris, de jour comme de nuit.
            </p>
          </motion.div>

          <motion.div
            className="absolute bottom-[14%] left-0 w-[40%]"
            style={reduce ? {} : { x: cardX, y: cardY }}
          >
            <motion.div
              className="-rotate-6 overflow-hidden rounded-2xl bg-plum-800 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] ring-1 ring-cream-100/15"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: EASE, delay: 1 }}
            >
              <Img
                name="facade-coffee"
                alt="Enseigne lumineuse à lettres néon"
                sizes="(min-width: 1024px) 16vw, 36vw"
                priority
                className="aspect-square w-full object-cover"
              />
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute -bottom-6 left-[30%] w-24 text-cream-100 sm:w-28"
            initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: EASE, delay: 1.2 }}
          >
            <RotatingBadge text="Enseignes • Adhésifs • Véhicules • " className="w-full">
              <span className="grid size-9 place-items-center rounded-full bg-ember-500 text-cream-50 sm:size-10">
                <Spark className="size-4" />
              </span>
            </RotatingBadge>
          </motion.div>

          <Disc className="absolute top-[18%] left-[4%] w-5 text-plum-400" />
          <HalfDisc className="absolute top-[42%] -right-3 w-16 rotate-90 text-plum-600" />
        </div>
      </motion.div>

      {/* Scroll cue */}
      <div className="container-px relative z-10 mt-12 flex items-end justify-between text-[0.72rem] text-cream-100/50 uppercase tracking-[0.28em]">
        <button
          type="button"
          onClick={() => scrollTo('#services')}
          className="group inline-flex items-center gap-3 transition-colors hover:text-cream-50"
        >
          <span className="grid size-10 place-items-center rounded-full ring-1 ring-cream-100/20 transition-colors group-hover:bg-ember-500 group-hover:ring-ember-500">
            <ArrowDown className="size-4 animate-bounce [animation-duration:2s]" />
          </span>
          Découvrir
        </button>
        <span className="hidden sm:block">Conception · Fabrication · Pose</span>
      </div>
    </section>
  )
}
