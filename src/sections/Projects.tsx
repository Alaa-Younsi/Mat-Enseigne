import { Plus } from 'lucide-react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { InstagramIcon } from '@/components/ui/BrandIcons'
import { ButtonLink } from '@/components/ui/Button'
import { Img } from '@/components/ui/Img'
import { Lightbox, type LightboxItem } from '@/components/ui/Lightbox'
import { Reveal, SplitReveal } from '@/components/ui/Reveal'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { site } from '@/config/site'
import {
  categoryLabel,
  type Project,
  type ProjectCategory,
  projectCategories,
  projects,
} from '@/data/projects'
import { useSiteLink } from '@/hooks/useSiteLink'
import { cn } from '@/lib/cn'

/** Aspect ratio per visual weight — CSS columns keep the masonry hole-free under any filter. */
const sizeClass: Record<Project['size'], string> = {
  sm: 'aspect-square',
  tall: 'aspect-[3/4]',
  wide: 'aspect-[4/3]',
}

export function Projects() {
  const link = useSiteLink()
  const [filter, setFilter] = useState<ProjectCategory | 'all'>('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const visible = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  )

  const lightboxItems = useMemo<LightboxItem[]>(
    () =>
      visible.map((p) => ({
        id: p.id,
        image: p.image,
        alt: p.alt,
        title: p.title,
        caption: categoryLabel[p.category],
      })),
    [visible],
  )

  return (
    <section
      id="realisations"
      aria-labelledby="projects-title"
      className="grain relative overflow-hidden bg-cream-100 py-24 text-plum-800 sm:py-32"
    >
      <div className="container-px relative z-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionLabel index="03" className="text-plum-700">
              Réalisations
            </SectionLabel>
            <h2
              id="projects-title"
              className="mt-6 font-display font-bold text-[clamp(2.4rem,6vw,5.2rem)] leading-[0.98] tracking-[-0.04em]"
            >
              <SplitReveal text="Des façades" className="block" />
              <SplitReveal
                text="qui font parler."
                offset={2}
                className="block"
                wordClassName="font-serif font-normal italic text-ember-500"
              />
            </h2>
          </div>

          <Reveal delay={0.1}>
            <fieldset className="no-scrollbar -mx-5 m-0 flex min-w-0 gap-2 overflow-x-auto border-0 p-0 px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
              <legend className="sr-only">Filtrer les réalisations</legend>
              <LayoutGroup id="project-filters">
                {projectCategories.map((category) => {
                  const selected = filter === category.id
                  return (
                    <button
                      key={category.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setFilter(category.id)}
                      className={cn(
                        'relative shrink-0 rounded-full px-5 py-2.5 font-medium text-sm transition-colors',
                        selected
                          ? 'text-cream-50'
                          : 'text-plum-800 ring-1 ring-plum-800/20 hover:ring-plum-800/50',
                      )}
                    >
                      {selected && (
                        <motion.span
                          layoutId="filter-pill"
                          className="absolute inset-0 rounded-full bg-plum-800"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative">{category.label}</span>
                    </button>
                  )
                })}
              </LayoutGroup>
            </fieldset>
          </Reveal>
        </div>

        <motion.ul layout className="mt-12 columns-2 gap-3 sm:gap-4 lg:mt-16 lg:columns-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((project, i) => (
              <motion.li
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={cn('relative mb-3 break-inside-avoid sm:mb-4', sizeClass[project.size])}
              >
                <button
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  className="group relative block size-full overflow-hidden rounded-[1.25rem] bg-plum-800 text-left sm:rounded-[1.75rem]"
                  aria-label={`Agrandir : ${project.title}`}
                >
                  <Img
                    name={project.image}
                    alt={project.alt}
                    sizes="(min-width: 1024px) 30vw, 50vw"
                    className="size-full object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-110"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-plum-950/85 via-plum-950/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-6">
                    <span className="min-w-0">
                      <span className="block font-medium text-[0.65rem] text-ember-300 uppercase tracking-[0.2em] sm:text-[0.7rem]">
                        {categoryLabel[project.category]}
                      </span>
                      <span className="mt-1 block font-display font-semibold text-cream-50 text-sm leading-tight sm:text-lg">
                        {project.title}
                      </span>
                    </span>
                    <span className="hidden size-10 shrink-0 scale-50 place-items-center rounded-full bg-ember-500 text-cream-50 opacity-0 transition-all duration-500 ease-out-expo group-hover:scale-100 group-hover:opacity-100 sm:grid">
                      <Plus className="size-5" />
                    </span>
                  </span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        <Reveal className="mt-14 flex flex-col items-center gap-5 text-center">
          <p className="max-w-md text-plum-800/70">
            Nos derniers chantiers sont publiés chaque semaine sur Instagram.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href="/portfolio" onClick={link('/portfolio')}>
              Portfolio avant / après
            </ButtonLink>
            <ButtonLink
              href={site.instagram.url}
              variant="dark"
              icon={<InstagramIcon className="size-[1.1rem]" />}
            >
              @{site.instagram.handle}
            </ButtonLink>
          </div>
        </Reveal>
      </div>

      <Lightbox
        items={lightboxItems}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </section>
  )
}
