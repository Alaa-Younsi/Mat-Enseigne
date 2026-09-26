import { portfolioImages } from './portfolio-images.generated'
import type { ProjectCategory } from './projects'

/**
 * Before / after projects shown on /portfolio.
 *
 * To add a project:
 *  1. Put `avant.jpg` + `apres.jpg` in `portfolio-originals/<slug>/`
 *  2. Run `bun run images`
 *  3. Add an entry below with the same `slug` (the first one is also shown on the home page).
 */
export interface PortfolioProject {
  /** Folder name in portfolio-originals/ — lowercase-with-dashes. */
  slug: string
  title: string
  category: ProjectCategory
  location?: string
  summary: string
  /** What was delivered, shown as tags. */
  work: readonly string[]
  /** Placeholder built from stock photography — remove once real projects exist. */
  demo?: boolean
}

export const portfolio: readonly PortfolioProject[] = [
  {
    slug: 'cer-monceau',
    title: 'Auto-école CER Monceau',
    category: 'facade',
    location: 'Paris',
    summary:
      'Changement d’enseigne complet : l’ancienne façade « Auto École Monceau » laisse place à l’identité CER, avec bandeau, enseigne drapeau et habillage des vitrines aux couleurs du réseau.',
    work: ['Bandeau', 'Enseigne drapeau', 'Vitrophanie'],
  },
  {
    slug: 'feeling-musique',
    title: 'Feeling Musique',
    category: 'facade',
    location: 'Rue de Rome, Paris 8e',
    summary:
      'L’enseigne drapeau ovale, usée et décolorée, retrouve un visuel net et lumineux, lisible depuis toute la rue de Rome.',
    work: ['Enseigne drapeau', 'Nouveau visuel', 'Pose'],
  },
  {
    slug: 'permis-en-accelere',
    title: 'Permis en Accéléré',
    category: 'vitrine',
    summary:
      'D’un local vide à une agence prête à accueillir ses élèves : bandeau de façade et vitrophanie grand format sur toutes les vitrines.',
    work: ['Bandeau', 'Vitrophanie', 'Adhésifs vitrine'],
  },
  {
    slug: 'artisan-pique',
    title: 'Artisan Pique',
    category: 'facade',
    location: 'Île-de-France',
    summary:
      'Nouvelle façade pour un artisan couvreur : bandeau repensé autour du logo, panneaux d’information et mise en valeur des métiers.',
    work: ['Bandeau', 'Logo', 'Panneaux façade'],
  },
]

export type Side = 'avant' | 'apres'

/** `Img` name for one side of a project (served from /images/portfolio). */
export function portfolioImage(slug: string, side: Side) {
  return `portfolio/${slug}-${side}`
}

/** Intrinsic size of a pair; falls back to 4:3 if the images were not generated yet. */
export function portfolioSize(slug: string) {
  return portfolioImages[slug] ?? { width: 1600, height: 1200 }
}
