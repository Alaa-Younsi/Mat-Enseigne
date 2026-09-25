import { describe, expect, it } from 'vitest'
import { formatQuoteMessage, whatsappLink } from './whatsapp'

describe('whatsappLink', () => {
  it('strips non-digits from the phone number', () => {
    expect(whatsappLink('', '+33 6 05 89 44 11')).toBe('https://wa.me/33605894411')
  })

  it('url-encodes the message', () => {
    const link = whatsappLink('Bonjour & merci ?', '33600000000')
    expect(link).toBe('https://wa.me/33600000000?text=Bonjour%20%26%20merci%20%3F')
  })

  it('falls back to a default message', () => {
    expect(whatsappLink()).toContain('?text=Bonjour')
  })
})

describe('formatQuoteMessage', () => {
  it('includes every provided field', () => {
    const message = formatQuoteMessage({
      name: ' Sarah ',
      phone: '0600000000',
      service: 'Enseigne lumineuse',
      location: 'Paris 11e',
      message: 'Façade de 6 mètres.',
    })
    expect(message).toContain("Je m'appelle Sarah et")
    expect(message).toContain('• Prestation : Enseigne lumineuse')
    expect(message).toContain('• Lieu : Paris 11e')
    expect(message.endsWith('Façade de 6 mètres.')).toBe(true)
  })

  it('omits the location line when empty', () => {
    const message = formatQuoteMessage({
      name: 'Sam',
      phone: '0600000000',
      service: 'Film dépoli',
      location: '  ',
      message: 'Bureaux.',
    })
    expect(message).not.toContain('Lieu')
  })
})
