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
  email?: string | undefined
  dimensions?: string | undefined
  timing?: string | undefined
  logo?: string | undefined
  contactPreference?: string | undefined
}

/**
 * Clean user input before it goes into the WhatsApp message: strips control, zero-width and
 * bidi-override characters (used to disguise text), collapses whitespace and caps the length.
 * `multiline` keeps paragraph breaks (max one blank line); otherwise the value is one line.
 */
export function sanitizeText(value: string | undefined, max: number, multiline = false): string {
  let text = (value ?? '')
    .normalize('NFC')
    // biome-ignore lint/suspicious/noControlCharactersInRegex: stripping control characters is the point
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, ' ')
    .replace(/[​-‏‪-‮⁦-⁩﻿]/g, '')
  text = multiline
    ? text
        .split('\n')
        .map((line) => line.replace(/\s+/g, ' ').trim())
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
    : text.replace(/\s+/g, ' ')
  text = text.trim()
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
}

/** Format a quote request as a readable WhatsApp message. */
export function formatQuoteMessage(request: QuoteRequest): string {
  const detail = (label: string, value: string | undefined, max = 120) => {
    const clean = sanitizeText(value, max)
    return clean ? `• ${label} : ${clean}` : null
  }

  const lines = [
    'Bonjour Mat Enseigne,',
    '',
    `Je m'appelle ${sanitizeText(request.name, 80)} et je souhaite un devis.`,
    '',
    detail('Prestation', request.service, 80),
    detail('Lieu', request.location, 80),
    detail('Dimensions', request.dimensions),
    detail('Délai', request.timing),
    detail('Logo', request.logo),
    detail('Téléphone', request.phone, 20),
    detail('E-mail', request.email),
    detail('Préférence de contact', request.contactPreference, 40),
    '',
    sanitizeText(request.message, 1200, true),
  ]
  return lines.filter((line): line is string => line !== null).join('\n')
}
