export interface Step {
  index: string
  title: string
  text: string
  points: readonly string[]
}

export const steps: readonly Step[] = [
  {
    index: '01',
    title: 'Échange & relevé',
    text: 'On se rencontre sur place ou à distance. Nous prenons les mesures, les photos et écoutons vos objectifs.',
    points: ['Visite technique', 'Prise de cotes', 'Conseil matériaux'],
  },
  {
    index: '02',
    title: 'Maquette & devis',
    text: 'Vous recevez une simulation sur la photo de votre façade et un devis détaillé, sans surprise.',
    points: ['Simulation réaliste', 'Devis gratuit', 'Aide aux démarches mairie'],
  },
  {
    index: '03',
    title: 'Fabrication',
    text: 'Découpe, impression, assemblage et éclairage : chaque pièce est réalisée sur-mesure et contrôlée.',
    points: ['Matériaux pro', 'LED basse consommation', 'Contrôle qualité'],
  },
  {
    index: '04',
    title: 'Pose & finitions',
    text: 'Installation propre et sécurisée, raccordement, nettoyage : votre façade est prête à briller.',
    points: ['Pose soignée', 'Raccordement', 'Suivi après-pose'],
  },
]

export interface Faq {
  question: string
  answer: string
}

export const faqs: readonly Faq[] = [
  {
    question: 'Le devis est-il gratuit ?',
    answer:
      'Oui. Envoyez-nous une photo de votre façade, vitrine ou véhicule avec les dimensions approximatives : nous revenons vers vous avec une proposition claire et sans engagement.',
  },
  {
    question: 'Faut-il une autorisation pour installer une enseigne à Paris ?',
    answer:
      'Oui, à Paris toute enseigne est soumise à autorisation préalable au titre du Règlement Local de Publicité. Nous vous accompagnons dans la préparation du dossier (plans, simulations, dimensions).',
  },
  {
    question: 'Quels sont les délais de réalisation ?',
    answer:
      'Un lettrage adhésif ou un film dépoli peut être posé en quelques jours. Une enseigne lumineuse sur-mesure demande généralement quelques semaines, selon la complexité et les démarches administratives.',
  },
  {
    question: 'Intervenez-vous en dehors de Paris ?',
    answer:
      'Nous intervenons à Paris et dans toute l’Île-de-France. Pour les projets plus éloignés, contactez-nous : nous étudions chaque demande.',
  },
  {
    question: 'Combien de temps dure un marquage de véhicule ?',
    answer:
      'Avec des vinyles professionnels, un marquage garde son éclat plusieurs années. Il reste retirable sans abîmer la peinture d’origine, idéal pour les véhicules en leasing.',
  },
  {
    question: 'Pouvez-vous créer le visuel si je n’ai pas de logo ?',
    answer:
      'Bien sûr. Nous adaptons votre logo existant ou vous aidons à mettre en forme votre identité pour qu’elle rende parfaitement sur une façade, une vitrine ou un véhicule.',
  },
]

export interface Commitment {
  value: string
  title: string
  text: string
}

export const commitments: readonly Commitment[] = [
  {
    value: '100%',
    title: 'Sur-mesure',
    text: 'Chaque enseigne est dessinée pour votre façade, vos contraintes et votre identité.',
  },
  {
    value: '1',
    title: 'Interlocuteur unique',
    text: 'De la maquette à la pose, vous échangez avec la même personne, directement.',
  },
  {
    value: '6',
    title: 'Savoir-faire',
    text: 'Façade, lumineux, drapeau, vitrine, dépoli et véhicules : tout sous un même toit.',
  },
  {
    value: 'IDF',
    title: 'Paris & Île-de-France',
    text: 'Relevé, fabrication et pose partout dans Paris et sa région.',
  },
]

export const marqueeItems = [
  'Enseignes lumineuses',
  'Lettres en relief',
  'Enseignes drapeau',
  'Adhésifs vitrine',
  'Film dépoli',
  'Marquage véhicules',
  'Caissons LED',
  'Fabrication sur-mesure',
] as const
