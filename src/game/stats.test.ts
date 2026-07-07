import { describe, expect, it } from 'vitest'
import { applyResult, emptyStats } from './stats'

describe('applyResult', () => {
  it('records a first win', () => {
    const s = applyResult(emptyStats(), 10, true, 3)
    expect(s.played).toBe(1)
    expect(s.won).toBe(1)
    expect(s.currentStreak).toBe(1)
    expect(s.maxStreak).toBe(1)
    expect(s.dist[2]).toBe(1)
    expect(s.lastWonPuzzle).toBe(10)
  })

  it('extends the streak on consecutive puzzle numbers', () => {
    let s = applyResult(emptyStats(), 10, true, 3)
    s = applyResult(s, 11, true, 4)
    expect(s.currentStreak).toBe(2)
    expect(s.maxStreak).toBe(2)
  })

  it('a skipped day restarts the streak at 1 but keeps maxStreak', () => {
    let s = applyResult(emptyStats(), 10, true, 3)
    s = applyResult(s, 11, true, 2)
    s = applyResult(s, 14, true, 2)
    expect(s.currentStreak).toBe(1)
    expect(s.maxStreak).toBe(2)
  })

  it('a loss breaks the streak and counts as played', () => {
    let s = applyResult(emptyStats(), 10, true, 3)
    s = applyResult(s, 11, false, 6)
    expect(s.currentStreak).toBe(0)
    expect(s.played).toBe(2)
    expect(s.won).toBe(1)
    expect(s.dist).toEqual([0, 0, 1, 0, 0, 0])
  })

  it('is idempotent for the same puzzle number', () => {
    const once = applyResult(emptyStats(), 10, true, 3)
    expect(applyResult(once, 10, true, 3)).toBe(once)
  })
})
