import { describe, expect, it } from 'vitest'
import { applyResult, emptyStats } from './stats'

describe('applyResult', () => {
  it('records a first win in the turns-used slot', () => {
    const s = applyResult(emptyStats(), 10, true, 7)
    expect(s.played).toBe(1)
    expect(s.won).toBe(1)
    expect(s.currentStreak).toBe(1)
    expect(s.dist[6]).toBe(1)
    expect(s.lastWonDay).toBe(10)
  })

  it('extends the streak on consecutive days, resets after a gap', () => {
    let s = applyResult(emptyStats(), 10, true, 5)
    s = applyResult(s, 11, true, 6)
    expect(s.currentStreak).toBe(2)
    s = applyResult(s, 14, true, 6)
    expect(s.currentStreak).toBe(1)
    expect(s.maxStreak).toBe(2)
  })

  it('a loss lands in slot 12 and breaks the streak', () => {
    let s = applyResult(emptyStats(), 10, true, 5)
    s = applyResult(s, 11, false, 12)
    expect(s.currentStreak).toBe(0)
    expect(s.dist[12]).toBe(1)
    expect(s.played).toBe(2)
  })

  it('is idempotent per day', () => {
    const once = applyResult(emptyStats(), 10, true, 5)
    expect(applyResult(once, 10, true, 5)).toBe(once)
  })
})
