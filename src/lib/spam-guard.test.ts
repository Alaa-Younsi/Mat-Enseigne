import { describe, expect, it } from 'vitest'
import {
  checkSubmission,
  countLinks,
  MAX_SENDS,
  recordSubmission,
  SEND_WINDOW_MS,
} from './spam-guard'

const NOW = 1_800_000_000_000

function memoryStorage() {
  const data = new Map<string, string>()
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  }
}

const base = { honeypot: '', startedAt: NOW - 20_000, message: 'Une enseigne lumineuse.', now: NOW }

describe('checkSubmission', () => {
  it('accepts a normal human submission', () => {
    expect(checkSubmission({ ...base, storage: memoryStorage() })).toBe('ok')
  })

  it('flags a filled honeypot as a bot', () => {
    expect(checkSubmission({ ...base, honeypot: 'http://spam' })).toBe('bot')
  })

  it('rejects forms submitted faster than a human can type', () => {
    expect(checkSubmission({ ...base, startedAt: NOW - 500 })).toBe('too_fast')
  })

  it('rejects link spam', () => {
    expect(checkSubmission({ ...base, message: 'https://a.x https://b.x www.c.com' })).toBe('links')
    expect(countLinks('voir www.site.fr')).toBe(1)
  })

  it('rate-limits after MAX_SENDS hand-offs within the window', () => {
    const storage = memoryStorage()
    for (let i = 0; i < MAX_SENDS; i++) recordSubmission(storage, NOW - i * 1000)
    expect(checkSubmission({ ...base, storage })).toBe('rate_limited')
    expect(checkSubmission({ ...base, storage, now: NOW + SEND_WINDOW_MS })).toBe('ok')
  })

  it('survives corrupted or unavailable storage', () => {
    const broken = { getItem: () => '{not json', setItem: () => {} }
    expect(checkSubmission({ ...base, storage: broken })).toBe('ok')
    expect(checkSubmission({ ...base, storage: null })).toBe('ok')
  })
})
