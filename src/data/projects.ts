export type ProjectCategory = 'facade' | 'lumineuse' | 'vitrine' | 'vehicule' | 'atelier'

export interface Project {
  id: string
  title: string
  category: ProjectCategory
  image: string
  alt: string
  /** Visual weight in the bento grid. */
  size: 'sm' | 'tall' | 'wide'
}

export const projectCategories: readonly { id: ProjectCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Tout' },
  { id: 'facade', label: 'Façade' },
  { id: 'lumineuse', label: 'Lumineuse' },
  { id: 'vitrine', label: 'Vitrine & dépoli' },
  { id: 'vehicule', label: 'Véhicules' },
  { id: 'atelier', label: 'Fabrication' },
]

export const categoryLabel: Record<ProjectCategory, string> = {
  facade: 'Façade',
  lumineuse: 'Lumineuse',
  vitrine: 'Vitrine & dépoli',
  vehicule: 'Véhicules',
  atelier: 'Fabrication',
}

/**
 * Gallery content.
 * TODO(client): replace these reference photos with Mat Enseigne's own
 * projects (same naming: `<name>-800.webp` + `<name>-1600.webp` in /public/images).
 */
export const projects: readonly Project[] = [
  {
    id: 'p1',
    title: 'Lettrage doré sur bandeau',
    category: 'facade',
    image: 'facade-gold',
    alt: 'Façade noire et lettres dorées d’une boutique historique',
    size: 'wide',
  },
  {
    id: 'p2',
    title: 'Enseigne éclairée de nuit',
    category: 'lumineuse',
    image: 'paris-storefront',
    alt: 'Terrasse parisienne sous la pluie, enseigne éclairée',
    size: 'tall',
  },
  {
    id: 'p3',
    title: 'Film dépoli à bandes',
    category: 'vitrine',
    image: 'glass-doors',
    alt: 'Bureau vitré équipé d’un film dépoli décoratif',
    size: 'tall',
  },
  {
    id: 'p4',
    title: 'Lettres relief rétroéclairées',
    category: 'lumineuse',
    image: 'facade-night',
    alt: 'Commerce avec enseigne lumineuse orange de nuit',
    size: 'sm',
  },
  {
    id: 'p5',
    title: 'Film de protection carrosserie',
    category: 'vehicule',
    image: 'wrap-detail',
    alt: 'Pose d’un film transparent sur l’avant d’une voiture',
    size: 'sm',
  },
  {
    id: 'p6',
    title: 'Lettrage peint sur rideau',
    category: 'facade',
    image: 'facade-french',
    alt: 'Rideau métallique décoré de grandes lettres calligraphiées',
    size: 'wide',
  },
  {
    id: 'p7',
    title: 'Découpe & fraisage',
    category: 'atelier',
    image: 'atelier-drill',
    alt: 'Artisan fraisant une pièce en atelier',
    size: 'tall',
  },
  {
    id: 'p8',
    title: 'Lettrage vitrine',
    category: 'vitrine',
    image: 'facade-window',
    alt: 'Lettrage adhésif blanc sur la vitrine d’un magasin',
    size: 'sm',
  },
  {
    id: 'p9',
    title: 'Lettres lumineuses XXL',
    category: 'lumineuse',
    image: 'lumineuse-eger',
    alt: 'Grandes lettres lumineuses installées sur une place, de nuit',
    size: 'wide',
  },
  {
    id: 'p10',
    title: 'Enseigne drapeau sur potence',
    category: 'facade',
    image: 'facade-wine',
    alt: 'Enseigne drapeau bleu marine sur potence en fer forgé',
    size: 'sm',
  },
  {
    id: 'p11',
    title: 'Impression grand format',
    category: 'atelier',
    image: 'print-banner',
    alt: 'Traceur grand format imprimant une bâche',
    size: 'sm',
  },
  {
    id: 'p12',
    title: 'Utilitaire prêt à marquer',
    category: 'vehicule',
    image: 'van-yellow',
    alt: 'Fourgon utilitaire garé sur une rue pavée',
    size: 'wide',
  },
  {
    id: 'p13',
    title: 'Covering couleur',
    category: 'vehicule',
    image: 'wrap-orange',
    alt: 'Application d’un film adhésif orange sur une carrosserie',
    size: 'tall',
  },
  {
    id: 'p14',
    title: 'Néon LED en vitrine',
    category: 'lumineuse',
    image: 'neon-office',
    alt: 'Néon LED bleu dans la vitrine d’un bureau, de nuit',
    size: 'sm',
  },
  {
    id: 'p15',
    title: 'Lettres boîtier verticales',
    category: 'facade',
    image: 'facade-building',
    alt: 'Enseigne verticale avec lettres boîtier bleues',
    size: 'tall',
  },
  {
    id: 'p16',
    title: 'Pose grand format',
    category: 'atelier',
    image: 'print-mural',
    alt: 'Pose d’un visuel géant sur une façade depuis une nacelle',
    size: 'tall',
  },
]
