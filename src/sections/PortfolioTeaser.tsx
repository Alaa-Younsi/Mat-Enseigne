import { Hand } from 'lucide-react'
import { BeforeAfter } from '@/components/ui/BeforeAfter'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal, SplitReveal } from '@/components/ui/Reveal'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Disc, HorizontalStripes } from '@/components/ui/Shapes'
import { portfolio, portfolioImage, portfolioSize } from '@/data/portfolio'
import { useSiteLink } from '@/hooks/useSiteLink'

/** Home-page teaser for the before/after portfolio. */
export function PortfolioTeaser() {
  const link = useSiteLink()
  const featured = portfolio[0]
  if (!featured) return null
  const size = portfolioSize(featured.slug)

  return (
    <section
      aria-labelledby="teaser-title"
      className="grain relative overflow-hidden bg-cream-100 py-24 text-plum-800 sm:py-32"
    >
      <HorizontalStripes
        bars={5}
        className="absolute top-16 -right-4 w-24 text-ember-500/80 sm:w-32"
      />
      <Disc className="absolute bottom-20 left-[4%] w-6 text-plum-500" />

      <div className="container-px relative z-10 grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionLabel index="PF" className="text-plum-700">
            Avant / après
          </SectionLabel>
          <h2
            id="teaser-title"
            className="mt-6 font-display font-bold text-[clamp(2.4rem,6vw,5.2rem)] leading-[0.98] tracking-[-0.04em]"
          >
            <SplitReveal text="La différence" className="block" />
            <SplitReveal
              text="se voit."
              offset={2}
              className="block"
              wordClassName="font-serif font-normal italic text-ember-500"
            />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-lg text-plum-800/70 leading-relaxed">
              Faites glisser le curseur pour passer de la façade d’origine au résultat final.
              Retrouvez toutes nos transformations dans le portfolio.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href="/portfolio" onClick={link('/portfolio')}>
                Voir le portfolio
              </ButtonLink>
              <ButtonLink
                href="/contact"
                onClick={link('/contact')}
                variant="outline"
                className="text-plum-800"
              >
                Demander un devis
              </ButtonLink>
            </div>
            <p className="mt-8 inline-flex items-center gap-2 text-plum-800/60 text-sm">
              <Hand className="size-4 text-ember-500" />
              Glissez ← → sur l’image
            </p>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-7" delay={0.15}>
          <div
            className="mx-auto"
            style={{ maxWidth: `calc(70svh * ${size.width / size.height})` }}
          >
            <BeforeAfter
              before={{
                name: portfolioImage(featured.slug, 'avant'),
                alt: `${featured.title} — avant`,
              }}
              after={{
                name: portfolioImage(featured.slug, 'apres'),
                alt: `${featured.title} — après`,
              }}
              width={size.width}
              height={size.height}
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="rounded-[1.75rem] shadow-[0_40px_100px_-40px_rgba(59,24,70,0.55)] sm:rounded-[2rem]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
