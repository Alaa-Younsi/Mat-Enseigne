import { ArrowUp } from 'lucide-react'
import { Link } from 'react-router'
import { InstagramIcon, WhatsAppIcon } from '@/components/ui/BrandIcons'
import { Spark } from '@/components/ui/Shapes'
import { Wordmark } from '@/components/ui/Wordmark'
import { navigation, site } from '@/config/site'
import { services } from '@/data/services'
import { useScrollTo } from '@/hooks/useScrollTo'
import { useSiteLink } from '@/hooks/useSiteLink'

/** Each letter carries its position so keys stay stable without using the map index. */
const GIANT = [...'MAT ENSEIGNE'].map((char, position) => ({ char, position }))
/** Letters that flicker on their own, like a sign with tired tubes. */
const FLICKERING = new Set([1, 7])

export function Footer() {
  const scrollTo = useScrollTo()
  const link = useSiteLink()
  const year = new Date().getFullYear()

  return (
    <footer className="grain relative overflow-hidden bg-plum-950 pt-20 text-cream-100 sm:pt-28">
      <div className="container-px relative z-10">
        <div className="grid gap-12 border-cream-100/10 border-b pb-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Wordmark className="text-3xl text-cream-50" />
            <p className="mt-5 max-w-sm text-cream-100/65 leading-relaxed">
              {site.tagline}. Conception, fabrication et pose d’enseignes à {site.area}.
            </p>
            <div className="mt-7 flex gap-3">
              <span
                role="img"
                aria-label="WhatsApp"
                className="grid size-12 place-items-center rounded-full bg-cream-100/5 ring-1 ring-cream-100/15 transition-colors hover:bg-ember-500 hover:ring-ember-500"
              >
                <WhatsAppIcon className="size-5" />
              </span>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid size-12 place-items-center rounded-full bg-cream-100/5 ring-1 ring-cream-100/15 transition-colors hover:bg-ember-500 hover:ring-ember-500"
              >
                <InstagramIcon className="size-5" />
              </a>
            </div>
          </div>

          <nav aria-label="Plan du site" className="md:col-span-2">
            <h2 className="font-medium text-[0.7rem] text-cream-100/45 uppercase tracking-[0.28em]">
              Navigation
            </h2>
            <ul className="mt-5 space-y-3">
              {[{ label: 'Accueil', to: '/' }, ...navigation].map((item) => (
                <li key={item.to}>
                  <a
                    href={item.to}
                    onClick={link(item.to)}
                    className="text-cream-100/80 transition-colors hover:text-ember-400"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className="font-medium text-[0.7rem] text-cream-100/45 uppercase tracking-[0.28em]">
              Savoir-faire
            </h2>
            <ul className="mt-5 space-y-3">
              {services.map((service) => (
                <li key={service.id} className="text-cream-100/80">
                  {service.title}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h2 className="font-medium text-[0.7rem] text-cream-100/45 uppercase tracking-[0.28em]">
              Contact
            </h2>
            <ul className="mt-5 space-y-3 text-cream-100/80">
              <li>
                <a
                  href={site.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-ember-400"
                >
                  @{site.instagram.handle}
                </a>
              </li>
              <li>{site.area}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Giant interactive sign — hover a letter to switch it on. */}
      <div className="relative z-10 select-none overflow-hidden py-6 sm:py-10" aria-hidden="true">
        <p className="flex justify-center whitespace-nowrap font-display font-extrabold text-[clamp(3.4rem,13.2vw,15rem)] leading-[0.85] tracking-[-0.06em]">
          {GIANT.map(({ char, position }) =>
            char === ' ' ? (
              <span key={position} className="w-[0.25em]" />
            ) : (
              <span
                key={position}
                className={
                  FLICKERING.has(position)
                    ? 'animate-flicker text-ember-500 text-glow'
                    : 'text-plum-800 transition-[color,text-shadow] duration-[1.6s] hover:text-ember-400 hover:duration-100 hover:[text-shadow:0_0_0.2em_var(--color-ember-500),0_0_0.6em_var(--color-ember-600)]'
                }
              >
                {char}
              </span>
            ),
          )}
        </p>
      </div>

      <div className="container-px relative z-10">
        <div className="flex flex-col gap-4 border-cream-100/10 border-t pt-7 pb-24 text-cream-100/50 text-sm sm:flex-row sm:items-center sm:justify-between sm:pr-24 sm:pb-7">
          <div className="space-y-1.5">
            <p className="flex items-center gap-2">
              <Spark className="size-3 text-ember-500" />© {year} {site.name}. Tous droits réservés.
            </p>
            <p>
              Website Developed by{' '}
              <a
                href="https://alaayounsi.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream-100/80 underline decoration-cream-100/30 underline-offset-4 transition-colors hover:text-ember-400 hover:decoration-ember-400"
              >
                Alaa Younsi
              </a>
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/mentions-legales" className="transition-colors hover:text-cream-50">
              Mentions légales
            </Link>
            <button
              type="button"
              onClick={() => scrollTo('#top')}
              className="group inline-flex items-center gap-2 transition-colors hover:text-cream-50"
            >
              Haut de page
              <ArrowUp className="size-4 transition-transform group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
