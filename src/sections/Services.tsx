import { ArrowUpRight } from 'lucide-react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { type PointerEvent, useRef, useState } from 'react'
import { Img } from '@/components/ui/Img'
import { Reveal, SplitReveal } from '@/components/ui/Reveal'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { services } from '@/data/services'
import { useScrollTo } from '@/hooks/useScrollTo'
import { cn } from '@/lib/cn'

const PREVIEW_W = 340
const PREVIEW_H = 420

export function Services() {
  const listRef = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const scrollTo = useScrollTo()

  const x = useSpring(useMotionValue(0), { stiffness: 180, damping: 22, mass: 0.5 })
  const y = useSpring(useMotionValue(0), { stiffness: 180, damping: 22, mass: 0.5 })

  const onPointerMove = (event: PointerEvent<HTMLUListElement>) => {
    if (event.pointerType !== 'mouse' || !listRef.current) return
    const rect = listRef.current.getBoundingClientRect()
    x.set(event.clientX - rect.left - PREVIEW_W / 2)
    y.set(event.clientY - rect.top - PREVIEW_H / 2)
  }

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="grain relative overflow-hidden bg-plum-900 py-24 text-cream-100 sm:py-32"
    >
      <div className="container-px relative z-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel index="02" className="text-cream-100/70">
              Services
            </SectionLabel>
            <h2
              id="services-title"
              className="mt-6 font-display font-bold text-[clamp(2.4rem,6vw,5.2rem)] text-cream-50 leading-[0.98] tracking-[-0.04em]"
            >
              <SplitReveal text="Tout pour être" className="block" />
              <SplitReveal
                text="vu & reconnu."
                offset={3}
                className="block"
                wordClassName="font-serif font-normal italic text-ember-400"
              />
            </h2>
          </div>
          <Reveal className="lg:col-span-5" delay={0.15}>
            <p className="max-w-md text-cream-100/65 text-lg leading-relaxed lg:ml-auto">
              Six savoir-faire complémentaires, un seul atelier. De la petite vitrine à la façade
              lumineuse, chaque projet est pensé pour votre activité.
            </p>
          </Reveal>
        </div>

        <ul
          ref={listRef}
          onPointerMove={onPointerMove}
          onPointerLeave={() => setActive(null)}
          className="relative mt-16 border-cream-100/12 border-t sm:mt-20"
        >
          {/* Cursor-following preview (desktop, fine pointer) */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 z-20 hidden h-[420px] w-[340px] overflow-hidden rounded-[1.75rem] shadow-[0_40px_80px_-24px_rgba(0,0,0,0.8)] lg:block"
            style={{ x, y }}
            initial={false}
            animate={{ scale: active === null ? 0 : 1, opacity: active === null ? 0 : 1 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="flex flex-col"
              animate={{ y: -(active ?? 0) * PREVIEW_H }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            >
              {services.map((service) => (
                <Img
                  key={service.id}
                  name={service.image}
                  alt=""
                  sizes={`${PREVIEW_W}px`}
                  className="h-[420px] w-[340px] shrink-0 object-cover"
                />
              ))}
            </motion.div>
          </motion.div>

          {services.map((service, i) => (
            <li
              key={service.id}
              onPointerEnter={(event) => event.pointerType === 'mouse' && setActive(i)}
              className="group relative border-cream-100/12 border-b"
            >
              {/* Hover fill */}
              <span
                aria-hidden="true"
                className="absolute inset-0 origin-bottom scale-y-0 bg-ember-500 transition-transform duration-500 ease-out-expo group-hover:scale-y-100 max-lg:hidden"
              />
              <Reveal
                y={24}
                className="relative grid gap-5 py-8 sm:py-10 lg:grid-cols-12 lg:items-center lg:gap-8 lg:px-6"
              >
                <span className="font-medium text-ember-400 text-sm tracking-widest transition-colors group-hover:text-plum-900 lg:col-span-1">
                  {service.index}
                </span>
                <h3 className="font-display font-bold text-[clamp(1.9rem,4.2vw,3.6rem)] text-cream-50 leading-none tracking-[-0.035em] transition-[color,transform] duration-500 ease-out-expo group-hover:text-plum-950 lg:col-span-5 lg:group-hover:translate-x-3">
                  {service.title}
                </h3>

                {/* Inline image on touch / small screens */}
                <div className="overflow-hidden rounded-2xl lg:hidden">
                  <Img
                    name={service.image}
                    alt={service.imageAlt}
                    sizes="(min-width: 640px) 90vw, 100vw"
                    className={cn('aspect-[16/10] w-full object-cover', service.focus)}
                  />
                </div>

                <div className="lg:col-span-5">
                  <p className="text-cream-100/70 leading-relaxed transition-colors group-hover:text-plum-950/80">
                    {service.summary}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2" aria-label="Exemples">
                    {service.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full px-3 py-1 text-[0.78rem] text-cream-100/75 ring-1 ring-cream-100/20 transition-colors group-hover:text-plum-950 group-hover:ring-plum-950/30"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => scrollTo('#contact')}
                  aria-label={`Demander un devis : ${service.title}`}
                  className="hidden size-14 place-items-center justify-self-end rounded-full ring-1 ring-cream-100/25 transition-all duration-500 group-hover:rotate-45 group-hover:bg-plum-950 group-hover:ring-plum-950 lg:col-span-1 lg:grid"
                >
                  <ArrowUpRight className="size-5" />
                </button>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
