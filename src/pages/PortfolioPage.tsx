import { ArrowLeft, ArrowRight, Hand, MapPin } from 'lucide-react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { BeforeAfter } from '@/components/ui/BeforeAfter'
import { WhatsAppIcon } from '@/components/ui/BrandIcons'
import { ButtonLink } from '@/components/ui/Button'
import { Img } from '@/components/ui/Img'
import { Reveal, SplitReveal } from '@/components/ui/Reveal'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { HalfDisc, Stripes } from '@/components/ui/Shapes'
import { portfolio, portfolioImage, portfolioSize } from '@/data/portfolio'
import { categoryLabel, type ProjectCategory } from '@/data/projects'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useSiteLink } from '@/hooks/useSiteLink'
import { cn } from '@/lib/cn'
import { whatsappLink } from '@/lib/whatsapp'

const EASE = [0.16, 1, 0.3, 1] as const

/** Portfolio categories map onto service ids for the contact form pre-selection. */
const serviceForCategory: Partial<Record<ProjectCategory, string>> = {
  facade: 'facade',
  lumineuse: 'lumineuse',
  vitrine: 'vitrine',
  vehicule: 'vehicule',
}

export default function PortfolioPage() {
  usePageMeta({
    title: 'Portfolio avant / après — Mat Enseigne',
    description:
      'Faites glisser pour comparer : découvrez les façades, enseignes, vitrines et véhicules transformés par Mat Enseigne à Paris.',
    path: '/portfolio',
  })

  const link = useSiteLink()
  const [params, setParams] = useSearchParams()
  const filter = (params.get('categorie') as ProjectCategory | null) ?? 'all'

  const categories = useMemo(() => {
    const present = new Set(portfolio.map((p) => p.category))
    return [...present]
  }, [])

  const visible = useMemo(
    () => (filter === 'all' ? portfolio : portfolio.filter((p) => p.category === filter)),
    [filter],
  )

  const requested = params.get('projet')
  const index = Math.max(
    0,
    visible.findIndex((p) => p.slug === requested),
  )
  const project = visible[index]

  /** Merge search params; `null` (or the "all" filter) removes the key. */
  const update = (next: Record<string, string | null>) => {
    const merged = new URLSearchParams(params)
    for (const [key, value] of Object.entries(next)) {
      if (value === null || value === 'all') merged.delete(key)
      else merged.set(key, value)
    }
    setParams(merged, { replace: true, preventScrollReset: true })
  }

  const select = (i: number) => {
    const target = visible[(i + visible.length) % visible.length]
    if (target) update({ projet: target.slug })
  }

  const size = project ? portfolioSize(project.slug) : { width: 4, height: 3 }
  const service = project ? serviceForCategory[project.category] : undefined
  const contactHref = service ? `/contact?service=${service}` : '/contact'

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="grain relative overflow-x-clip bg-plum-950 pt-36 pb-14 text-cream-100 sm:pt-44 sm:pb-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 right-[-8rem] size-[36rem] rounded-full bg-plum-600/40 blur-[120px]" />
          <div className="absolute bottom-[-16rem] left-[-10rem] size-[34rem] rounded-full bg-ember-600/20 blur-[140px]" />
        </div>
        <Stripes
          bars={4}
          className="absolute top-28 right-[6%] hidden h-28 w-24 text-ember-500 md:block"
        />

        <div className="container-px relative z-10 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel index="PF" className="text-cream-100/70">
              Portfolio
            </SectionLabel>
            <h1 className="mt-6 font-display font-extrabold text-[clamp(3.2rem,12vw,9rem)] text-cream-50 leading-[0.9] tracking-[-0.05em]">
              <SplitReveal text="Avant," immediate className="block" />
              <SplitReveal
                text="après."
                immediate
                offset={1}
                className="block"
                wordClassName="font-serif font-normal italic text-ember-400"
              />
            </h1>
          </div>
          <Reveal className="lg:col-span-5" delay={0.3}>
            <p className="max-w-md text-cream-100/70 text-lg leading-relaxed">
              Des façades fatiguées aux enseignes qui attirent l’œil. Faites glisser le curseur sur
              chaque photo pour révéler le travail réalisé.
            </p>
            <p className="mt-6 inline-flex items-center gap-3 rounded-full bg-cream-100/5 px-4 py-2 text-cream-100/80 text-sm ring-1 ring-cream-100/10">
              <Hand className="size-4 text-ember-400" />
              Glissez ← → sur l’image
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- Stage ---------- */}
      <section
        aria-label="Projets avant / après"
        className="relative z-10 pb-24 text-cream-100 sm:pb-32"
      >
        <div className="container-px">
          {categories.length > 1 && (
            <fieldset className="no-scrollbar -mx-5 m-0 flex min-w-0 gap-2 overflow-x-auto border-0 p-0 px-5 pb-8 sm:mx-0 sm:flex-wrap sm:px-0">
              <legend className="sr-only">Filtrer les projets</legend>
              <LayoutGroup id="portfolio-filters">
                {(['all', ...categories] as const).map((category) => {
                  const selected = filter === category
                  return (
                    <button
                      key={category}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => update({ categorie: category, projet: null })}
                      className={cn(
                        'relative shrink-0 rounded-full px-5 py-2.5 font-medium text-sm transition-colors',
                        selected
                          ? 'text-plum-950'
                          : 'text-cream-100/80 ring-1 ring-cream-100/20 hover:ring-cream-100/50',
                      )}
                    >
                      {selected && (
                        <motion.span
                          layoutId="portfolio-filter-pill"
                          className="absolute inset-0 rounded-full bg-cream-100"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative">
                        {category === 'all' ? 'Tous les projets' : categoryLabel[category]}
                      </span>
                    </button>
                  )
                })}
              </LayoutGroup>
            </fieldset>
          )}

          {project ? (
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              {/* Slider */}
              <div className="lg:col-span-8">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={project.slug}
                    initial={{ opacity: 0, y: 24, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -16, scale: 0.98 }}
                    transition={{ duration: 0.55, ease: EASE }}
                    className="mx-auto w-full"
                    style={{ maxWidth: `calc(76svh * ${size.width / size.height})` }}
                  >
                    <BeforeAfter
                      before={{
                        name: portfolioImage(project.slug, 'avant'),
                        alt: `${project.title} — avant intervention`,
                      }}
                      after={{
                        name: portfolioImage(project.slug, 'apres'),
                        alt: `${project.title} — après intervention de Mat Enseigne`,
                      }}
                      width={size.width}
                      height={size.height}
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      priority
                      className="rounded-[1.5rem] shadow-[0_40px_120px_-40px_rgba(217,99,43,0.45)] ring-1 ring-cream-100/10 sm:rounded-[2rem]"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Details */}
              <div className="flex flex-col lg:col-span-4">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={project.slug}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <p className="font-display font-extrabold text-6xl text-cream-100/15 tabular-nums tracking-[-0.05em] sm:text-7xl">
                      {String(index + 1).padStart(2, '0')}
                      <span className="text-3xl"> / {String(visible.length).padStart(2, '0')}</span>
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                      <span className="rounded-full bg-ember-500 px-3 py-1 font-semibold text-cream-50">
                        {categoryLabel[project.category]}
                      </span>
                      {project.location && (
                        <span className="inline-flex items-center gap-1.5 text-cream-100/60">
                          <MapPin className="size-4" />
                          {project.location}
                        </span>
                      )}
                      {project.demo && (
                        <span className="rounded-full px-3 py-1 text-cream-100/60 ring-1 ring-cream-100/20">
                          Visuel de démonstration
                        </span>
                      )}
                    </div>
                    <h2 className="mt-5 font-display font-bold text-4xl text-cream-50 leading-tight tracking-[-0.035em]">
                      {project.title}
                    </h2>
                    <p className="mt-4 text-cream-100/70 leading-relaxed">{project.summary}</p>
                    <ul className="mt-6 flex flex-wrap gap-2" aria-label="Prestations réalisées">
                      {project.work.map((item) => (
                        <li
                          key={item}
                          className="rounded-full px-3 py-1 text-[0.8rem] text-cream-100/80 ring-1 ring-cream-100/20"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-10 flex items-center gap-3 lg:mt-auto lg:pt-10">
                  <button
                    type="button"
                    onClick={() => select(index - 1)}
                    aria-label="Projet précédent"
                    className="grid size-14 place-items-center rounded-full ring-1 ring-cream-100/25 transition-colors hover:bg-cream-100 hover:text-plum-950"
                  >
                    <ArrowLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => select(index + 1)}
                    aria-label="Projet suivant"
                    className="grid size-14 place-items-center rounded-full bg-ember-500 text-cream-50 transition-colors hover:bg-ember-400"
                  >
                    <ArrowRight className="size-5" />
                  </button>
                  <div className="ml-2 h-px flex-1 bg-cream-100/15">
                    <motion.div
                      className="h-px bg-ember-500"
                      animate={{ width: `${((index + 1) / visible.length) * 100}%` }}
                      transition={{ duration: 0.6, ease: EASE }}
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <ButtonLink href={contactHref} onClick={link(contactHref)}>
                    Un projet similaire ?
                  </ButtonLink>
                </div>
              </div>
            </div>
          ) : (
            <p className="py-20 text-center text-cream-100/60">
              Aucun projet dans cette catégorie.
            </p>
          )}

          {/* Thumbnails */}
          {visible.length > 1 && (
            <div className="mt-16 sm:mt-20">
              <h2 className="font-medium text-[0.72rem] text-cream-100/50 uppercase tracking-[0.28em]">
                Tous les projets
              </h2>
              <ul className="no-scrollbar -mx-5 mt-5 flex snap-x gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-4">
                {visible.map((item, i) => {
                  const active = i === index
                  return (
                    <li key={item.slug} className="w-[62vw] shrink-0 snap-start sm:w-auto">
                      <button
                        type="button"
                        onClick={() => select(i)}
                        aria-current={active ? 'true' : undefined}
                        className="group block w-full text-left"
                      >
                        <span
                          className={cn(
                            'relative block overflow-hidden rounded-2xl ring-2 transition-all duration-500',
                            active
                              ? 'ring-ember-500'
                              : 'ring-transparent opacity-70 group-hover:opacity-100',
                          )}
                        >
                          <Img
                            name={portfolioImage(item.slug, 'apres')}
                            alt=""
                            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 62vw"
                            className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
                          />
                          <span className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
                            <Img
                              name={portfolioImage(item.slug, 'avant')}
                              alt=""
                              sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 62vw"
                              className="h-full w-[200%] max-w-none object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
                            />
                          </span>
                          <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-cream-50/90" />
                        </span>
                        <span className="mt-3 flex items-baseline gap-2">
                          <span className="font-medium text-ember-400 text-xs tabular-nums">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span
                            className={cn(
                              'font-display font-semibold transition-colors',
                              active ? 'text-cream-50' : 'text-cream-100/70',
                            )}
                          >
                            {item.title}
                          </span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="grain relative overflow-hidden bg-cream-100 py-24 text-plum-800 sm:py-32">
        <HalfDisc className="absolute -top-px left-[10%] w-44 rotate-180 text-plum-700 sm:w-60" />
        <div className="container-px relative z-10 flex flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-3xl font-display font-bold text-[clamp(2.4rem,6vw,5.2rem)] leading-[0.98] tracking-[-0.04em]">
            <SplitReveal text="Votre façade est" className="block" />
            <SplitReveal
              text="la prochaine."
              offset={3}
              className="block"
              wordClassName="font-serif font-normal italic text-ember-500"
            />
          </h2>
          <Reveal className="flex flex-wrap gap-3" delay={0.15}>
            <ButtonLink href="/contact" onClick={link('/contact')}>
              Demander un devis
            </ButtonLink>
            <ButtonLink
              href={whatsappLink()}
              variant="dark"
              icon={<WhatsAppIcon className="size-[1.1rem]" />}
            >
              WhatsApp
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  )
}
