import { beforeAll, describe, expect, it } from 'vitest'
import { isValidWord, preloadDictionary } from '../game/dictionary'
import { CATEGORIES } from './categories'

beforeAll(() => preloadDictionary())

describe('semantic category lists', () => {
  it('every category word is lowercase a-z, 2–9 letters', () => {
    for (const [cat, set] of Object.entries(CATEGORIES)) {
      for (const w of set) expect(w, `${cat}:${w}`).toMatch(/^[a-z]{2,9}$/)
    }
  })

  it('every category word exists in the game dictionary', () => {
    const missing: string[] = []
    for (const [cat, set] of Object.entries(CATEGORIES)) {
      for (const w of set) if (!isValidWord(w)) missing.push(`${cat}:${w}`)
    }
    expect(missing, missing.join(', ')).toEqual([])
  })

  it('each category is big enough to be clearable', () => {
    for (const [cat, set] of Object.entries(CATEGORIES)) {
      expect(set.size, cat).toBeGreaterThanOrEqual(40)
    }
  })
})
