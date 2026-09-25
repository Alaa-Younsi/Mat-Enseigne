import { useEffect } from 'react'
import { Link } from 'react-router'
import { site } from '@/config/site'

export default function NotFoundPage() {
  useEffect(() => {
    document.title = `Page introuvable — ${site.name}`
  }, [])

  return (
    <section className="grain relative grid min-h-[100svh] place-items-center overflow-hidden bg-plum-950 px-6 text-center">
      <div className="relative z-10">
        <p className="font-display font-extrabold text-[clamp(7rem,30vw,18rem)] text-ember-500 leading-none tracking-[-0.06em]">
          4<span className="animate-flicker text-glow">0</span>4
        </p>
        <h1 className="mt-4 font-display font-bold text-3xl text-cream-50 tracking-tight">
          Cette enseigne s’est éteinte.
        </h1>
        <p className="mt-3 text-cream-100/60">
          La page que vous cherchez n’existe pas ou a été déplacée.
        </p>
        <Link
          to="/"
          className="mt-10 inline-flex rounded-full bg-cream-100 px-7 py-3.5 font-display font-semibold text-plum-800 transition-colors hover:bg-ember-500 hover:text-cream-50"
        >
          Retour à l’accueil
        </Link>
      </div>
    </section>
  )
}
