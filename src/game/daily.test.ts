import { describe, expect, it } from 'vitest'
import { PUZZLES } from '../data/puzzles'
import { EPOCH_DATE, puzzleFor, puzzleNumberFor } from './daily'

describe('puzzleNumberFor', () => {
  it('starts at #1 on the epoch date and increments daily', () => {
    expect(puzzleNumberFor(EPOCH_DATE)).toBe(1)
    expect(puzzleNumberFor('2026-07-08')).toBe(2)
    expect(puzzleNumberFor('2026-08-06')).toBe(31)
  })

  it('clamps dates before the epoch to #1', () => {
    expect(puzzleNumberFor('2026-01-01')).toBe(1)
  })
})

describe('puzzleFor', () => {
  it('is deterministic and the same for everyone on a date', () => {
    expect(puzzleFor('2026-07-20')).toEqual(puzzleFor('2026-07-20'))
  })

  it('walks the curated list in order and wraps around', () => {
    expect(puzzleFor(EPOCH_DATE).puzzle).toBe(PUZZLES[0])
    expect(puzzleFor('2026-07-08').puzzle).toBe(PUZZLES[1])
    const day = new Date(Date.UTC(2026, 6, 7 + PUZZLES.length))
    const wrapped = `${day.getUTCFullYear()}-${String(day.getUTCMonth() + 1).padStart(2, '0')}-${String(day.getUTCDate()).padStart(2, '0')}`
    expect(puzzleFor(wrapped).puzzle).toBe(PUZZLES[0])
  })
})
