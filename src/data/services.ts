export interface Service {
  id: string
  index: string
  title: string
  summary: string
  tags: readonly string[]
  image: string
  imageAlt: string
  /** Tailwind object-position class for tight crops. */
  focus?: string
}

export const services: readonly Service[] = [
  {
    id: 'facade',
    index: '01',
    title: 'Enseignes de façade',
    summary:
      'Bandeaux, lettres découpées ou en relief : une façade lisible de loin, fidèle à votre identité et durable dans le temps.',
    tags: ['Lettres relief', 'Bandeau', 'Dibond', 'Plexiglas'],
    image: 'facade-gold',
    imageAlt: 'Façade de boutique parisienne avec lettrage doré sur bandeau noir',
  },
  {
    id: 'lumineuse',
    index: '02',
    title: 'Enseignes lumineuses',
    summary:
      'Caissons lumineux, lettres boîtier LED et néon LED : votre commerce reste visible, même après la tombée de la nuit.',
    tags: ['Lettres boîtier', 'Caisson LED', 'Néon LED', 'Rétroéclairage'],
    image: 'facade-coffee',
    imageAlt: 'Enseigne lumineuse avec lettres néon et flèche à ampoules, de nuit',
  },
  {
    id: 'drapeau',
    index: '03',
    title: 'Enseignes drapeau',
    summary:
      'Perpendiculaires à la façade, double face et éclairées si besoin : on vous repère depuis le trottoir, dans les deux sens.',
    tags: ['Double face', 'Potence', 'Lumineuse', 'Découpe forme'],
    image: 'paris-sign',
    focus: 'object-[center_12%]',
    imageAlt: 'Enseigne drapeau verticale sur une façade haussmannienne fleurie',
  },
  {
    id: 'vitrine',
    index: '04',
    title: 'Adhésifs & vitrophanie',
    summary:
      'Lettrage vinyle, horaires, logos et habillages complets de vitrine : un message clair, posé au millimètre.',
    tags: ['Lettrage vinyle', 'Vitrophanie', 'Micro-perforé', 'Horaires'],
    image: 'facade-window',
    imageAlt: 'Vitrine de boutique avec lettrage adhésif blanc sur la vitre',
  },
  {
    id: 'depoli',
    index: '05',
    title: 'Film dépoli & sablé',
    summary:
      'Intimité, élégance et lumière préservée : films dépolis unis, en bandes ou personnalisés pour bureaux, cabinets et commerces.',
    tags: ['Confidentialité', 'Bureaux', 'Motifs découpés', 'Anti-UV'],
    image: 'glass-doors',
    imageAlt: 'Cloison vitrée de bureau habillée d’un film dépoli à bandes',
  },
  {
    id: 'vehicule',
    index: '06',
    title: 'Marquage véhicules',
    summary:
      'Lettrage, covering partiel ou total : vos utilitaires deviennent une publicité mobile qui travaille pour vous chaque jour.',
    tags: ['Utilitaires', 'Covering', 'Lettrage', 'Flotte'],
    image: 'wrap-orange',
    imageAlt: 'Pose d’un film adhésif orange sur l’aile d’une voiture',
  },
]
