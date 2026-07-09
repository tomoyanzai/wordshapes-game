import { describe, expect, it } from 'vitest'
import { PUZZLES, PUZZLES_BY_ID } from './puzzles'

describe('PUZZLES', () => {
  it.each(PUZZLES)('$id has exactly 16 words and 6 wheel options', (puzzle) => {
    expect(puzzle.words).toHaveLength(16)
    expect(puzzle.wheel).toHaveLength(6)
  })

  it.each(PUZZLES)('$id: secret is accepted and not among the board words', (puzzle) => {
    expect(puzzle.accept).toContain(puzzle.secret)
    expect(puzzle.words.map((w) => w.word)).not.toContain(puzzle.secret)
  })

  it.each(PUZZLES)('$id: every joins-it word has a phrase', (puzzle) => {
    for (const w of puzzle.words.filter((w) => w.tier === 'joins-it')) {
      expect(w.phrase).toBeTruthy()
    }
  })

  it.each(PUZZLES)('$id: the wheel includes the secret', (puzzle) => {
    expect(puzzle.wheel).toContain(puzzle.secret)
  })

  it.each(PUZZLES)('$id: all board words and wheel options are lowercase a-z', (puzzle) => {
    for (const w of puzzle.words) expect(w.word).toMatch(/^[a-z]+$/)
    for (const w of puzzle.wheel) expect(w).toMatch(/^[a-z]+$/)
  })

  it('PUZZLES_BY_ID maps every id to its puzzle', () => {
    for (const p of PUZZLES) expect(PUZZLES_BY_ID.get(p.id)).toBe(p)
  })
})
