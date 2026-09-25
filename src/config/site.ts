/**
 * Single source of truth for business information.
 * Everything public-facing (header, footer, SEO, contact links) reads from here.
 */
export const site = {
  name: 'Mat Enseigne',
  legalName: 'Mat Enseigne',
  tagline: 'Boostez votre visibilité avec une façade impactante',
  description:
    'Mat Enseigne conçoit, fabrique et pose vos enseignes à Paris et en Île-de-France : enseignes lumineuses, lettres en relief, enseignes drapeau, adhésifs vitrine, film dépoli et marquage de véhicules.',
  /** Injected at build time from VITE_SITE_URL (see vite.config.ts). */
  url: import.meta.env.VITE_SITE_URL,
  locale: 'fr_FR',
  area: 'Paris & Île-de-France',
  city: 'Paris',
  phone: {
    display: '06 05 89 44 11',
    e164: '+33605894411',
  },
  whatsapp: '33605894411',
  instagram: {
    handle: 'mat.enseigne',
    url: 'https://www.instagram.com/mat.enseigne/',
  },
} as const

export type Site = typeof site

export const navigation = [
  { label: 'Services', href: '#services' },
  { label: 'Réalisations', href: '#realisations' },
  { label: 'Méthode', href: '#methode' },
  { label: 'FAQ', href: '#faq' },
] as const
