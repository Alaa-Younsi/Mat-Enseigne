import { useEffect } from 'react'
import { Link } from 'react-router'
import { site } from '@/config/site'

/**
 * Mentions légales (required for French professional websites — LCEN art. 6).
 * TODO(client): fill in the bracketed company details before going live.
 */
export default function LegalPage() {
  useEffect(() => {
    document.title = `Mentions légales — ${site.name}`
    window.scrollTo(0, 0)
  }, [])

  return (
    <article className="grain relative min-h-screen bg-cream-100 pt-36 pb-24 text-plum-800">
      <div className="container-px relative z-10 max-w-3xl">
        <Link to="/" className="font-medium text-ember-600 text-sm hover:underline">
          ← Retour à l’accueil
        </Link>
        <h1 className="mt-6 font-display font-bold text-5xl tracking-[-0.04em] sm:text-6xl">
          Mentions légales
        </h1>

        <div className="mt-12 space-y-10 leading-relaxed [&_h2]:font-display [&_h2]:font-semibold [&_h2]:text-2xl [&_h2]:tracking-tight [&_p]:mt-3 [&_p]:text-plum-800/80">
          <section>
            <h2>Éditeur du site</h2>
            <p>
              {site.legalName} — [forme juridique] au capital de [montant] €<br />
              Siège social : [adresse complète]
              <br />
              SIRET : [numéro] — RCS : [ville et numéro]
              <br />
              TVA intracommunautaire : [numéro]
              <br />
              Téléphone : {site.phone.display}
              <br />
              Directeur de la publication : [nom du responsable]
            </p>
          </section>

          <section>
            <h2>Hébergement</h2>
            <p>Vercel Inc. — 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — vercel.com</p>
          </section>

          <section>
            <h2>Propriété intellectuelle</h2>
            <p>
              L’ensemble des contenus de ce site (textes, visuels, logo, mise en page) est protégé
              par le droit d’auteur. Toute reproduction sans autorisation préalable est interdite.
              Certaines photographies d’illustration proviennent d’Unsplash (licence Unsplash).
            </p>
          </section>

          <section>
            <h2>Données personnelles</h2>
            <p>
              Ce site ne dépose aucun cookie de suivi et ne stocke aucune donnée personnelle. Le
              formulaire de devis prépare un message WhatsApp que vous choisissez d’envoyer : les
              informations transmises sont alors traitées uniquement pour répondre à votre demande.
              Conformément au RGPD, vous pouvez demander l’accès, la rectification ou la suppression
              de vos données en nous contactant au {site.phone.display}.
            </p>
          </section>
        </div>
      </div>
    </article>
  )
}
