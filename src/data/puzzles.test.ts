import { beforeAll, describe, expect, it } from 'vitest'
import { isValidWord, preloadDictionary } from '../game/dictionary'
import { PUZZLES } from './puzzles'

beforeAll(() => preloadDictionary())

// Curation quality gate: catches authoring mistakes the types can't.
describe('puzzle dataset', () => {
  it('has a healthy rotation size', () => {
    expect(PUZZLES.length).toBeGreaterThanOrEqual(50)
  })

  it('words are unique, lowercase a-z, 4-7 letters', () => {
    expect(new Set(PUZZLES.map((p) => p.word)).size).toBe(PUZZLES.length)
    for (const p of PUZZLES) expect(p.word, p.word).toMatch(/^[a-z]{4,7}$/)
  })

  it('every answer counts as a valid guess', () => {
    for (const p of PUZZLES) expect(isValidWord(p.word), p.word).toBe(true)
  })

  it('clues never contain their own answer', () => {
    for (const p of PUZZLES) {
      expect(p.clue.toLowerCase().includes(p.word), p.word).toBe(false)
    }
  })

  it('clues and examples are non-empty; clues stay one-line crisp', () => {
    for (const p of PUZZLES) {
      expect(p.clue.trim().length, p.word).toBeGreaterThan(8)
      expect(p.clue.length, p.word).toBeLessThanOrEqual(90)
      expect(p.exampleSentence.trim().length, p.word).toBeGreaterThan(0)
    }
  })

  it('iconic annotations are consistent and in range', () => {
    for (const p of PUZZLES) {
      if (p.iconicIndices === undefined) continue
      expect(p.shapeNote, p.word).toBeDefined()
      expect(p.iconicIndices.length, p.word).toBeGreaterThan(0)
      for (const i of p.iconicIndices) {
        expect(Number.isInteger(i) && i >= 0 && i < p.word.length, `${p.word}[${i}]`).toBe(true)
      }
    }
  })

  it('keeps a good share of shape-iconic words in the rotation', () => {
    expect(PUZZLES.filter((p) => p.iconicIndices !== undefined).length).toBeGreaterThanOrEqual(20)
  })
})
