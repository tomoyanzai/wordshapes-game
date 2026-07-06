import { describe, expect, it } from 'vitest'
import { WORDS } from './words'

// Dataset quality gate: catches authoring mistakes the type system can't.
describe('word dataset', () => {
  it('has unique ids and unique word strings', () => {
    expect(new Set(WORDS.map((w) => w.id)).size).toBe(WORDS.length)
    expect(new Set(WORDS.map((w) => w.word)).size).toBe(WORDS.length)
  })

  it('every word is lowercase ASCII letters only (safe to split into letter spans)', () => {
    for (const w of WORDS) {
      expect(w.word, w.id).toMatch(/^[a-z]+$/)
      expect(w.id).toBe(w.word)
    }
  })

  it('every entry has non-empty emoji, definition and example sentence', () => {
    for (const w of WORDS) {
      expect(w.emoji.length, w.id).toBeGreaterThan(0)
      expect(w.definition.trim().length, w.id).toBeGreaterThan(0)
      expect(w.exampleSentence.trim().length, w.id).toBeGreaterThan(0)
    }
  })

  it('iconic letterIndices are valid, non-empty and in range', () => {
    for (const w of WORDS) {
      if (!w.iconic) continue
      expect(w.iconic.hint.trim().length, w.id).toBeGreaterThan(0)
      expect(w.iconic.letterIndices.length, w.id).toBeGreaterThan(0)
      for (const i of w.iconic.letterIndices) {
        expect(Number.isInteger(i), w.id).toBe(true)
        expect(i, w.id).toBeGreaterThanOrEqual(0)
        expect(i, w.id).toBeLessThan(w.word.length)
      }
    }
  })

  it('has at least 15 words per CEFR level (guarantees distractor pools)', () => {
    for (const level of ['A1', 'A2', 'B1'] as const) {
      expect(WORDS.filter((w) => w.cefrLevel === level).length).toBeGreaterThanOrEqual(15)
    }
  })

  it('has a healthy set of iconic words', () => {
    expect(WORDS.filter((w) => w.iconic).length).toBeGreaterThanOrEqual(20)
  })

  it('definitions are unique (a question must have one right answer)', () => {
    expect(new Set(WORDS.map((w) => w.definition)).size).toBe(WORDS.length)
  })
})
