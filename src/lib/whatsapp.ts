import { site } from '@/config/site'

const DEFAULT_MESSAGE = 'Bonjour Mat Enseigne, je souhaite obtenir un devis pour un projet.'

/** Build a wa.me deep link with an optional pre-filled message. */
export function whatsappLink(message: string = DEFAULT_MESSAGE, phone: string = site.whatsapp) {
  const digits = phone.replace(/\D/g, '')
  const text = message.trim()
  return text
    ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
    : `https://wa.me/${digits}`
}

export interface QuoteRequest {
  name: string
  phone: string
  service: string
  location?: string | undefined
  message: string
}

/** Format a quote request as a readable WhatsApp message. */
export function formatQuoteMessage(request: QuoteRequest): string {
  const lines = [
    'Bonjour Mat Enseigne,',
    '',
    `Je m'appelle ${request.name.trim()} et je souhaite un devis.`,
    '',
    `• Prestation : ${request.service}`,
    request.location?.trim() ? `• Lieu : ${request.location.trim()}` : null,
    `• Téléphone : ${request.phone.trim()}`,
    '',
    request.message.trim(),
  ]
  return lines.filter((line): line is string => line !== null).join('\n')
}
