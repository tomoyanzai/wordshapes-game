import { describe, expect, it } from 'vitest'
import { EPOCH_DATE, gameNumberFor, puzzleFor } from './daily'
import { PUZZLES } from '../data/puzzles'

describe('gameNumberFor', () => {
  it('is 1 on the epoch date', () => {
    expect(gameNumberFor(EPOCH_DATE)).toBe(1)
  })

  it('increments by 1 per calendar day', () => {
    expect(gameNumberFor('2026-07-08')).toBe(2)
    expect(gameNumberFor('2026-07-09')).toBe(3)
  })
})

describe('puzzleFor', () => {
  it('is deterministic for a given date', () => {
    expect(puzzleFor('2026-07-07')).toEqual(puzzleFor('2026-07-07'))
  })

  it('rotates winter -> fire -> winter across consecutive days', () => {
    expect(puzzleFor('2026-07-07').puzzle.id).toBe('winter')
    expect(puzzleFor('2026-07-08').puzzle.id).toBe('fire')
    expect(puzzleFor('2026-07-09').puzzle.id).toBe('winter')
  })

  it('pairs the correct game number with each puzzle', () => {
    const day1 = puzzleFor(EPOCH_DATE)
    expect(day1.number).toBe(1)
    expect(day1.puzzle).toBe(PUZZLES[0])
  })
})
