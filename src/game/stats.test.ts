import { describe, expect, it } from 'vitest'
import { applyResult, emptyStats } from './stats'

describe('applyResult', () => {
  it('records a first win in the probes-used slot', () => {
    const s = applyResult(emptyStats(), 10, true, 3)
    expect(s.played).toBe(1)
    expect(s.won).toBe(1)
    expect(s.currentStreak).toBe(1)
    expect(s.dist[2]).toBe(1)
    expect(s.lastWonDay).toBe(10)
  })

  it('extends the streak on consecutive days, resets after a gap', () => {
    let s = applyResult(emptyStats(), 10, true, 1)
    s = applyResult(s, 11, true, 2)
    expect(s.currentStreak).toBe(2)
    s = applyResult(s, 14, true, 2)
    expect(s.currentStreak).toBe(1)
    expect(s.maxStreak).toBe(2)
  })

  it('a loss increments losses and breaks the streak', () => {
    let s = applyResult(emptyStats(), 10, true, 1)
    s = applyResult(s, 11, false, 6)
    expect(s.currentStreak).toBe(0)
    expect(s.losses).toBe(1)
    expect(s.played).toBe(2)
  })

  it('is idempotent per day', () => {
    const once = applyResult(emptyStats(), 10, true, 1)
    expect(applyResult(once, 10, true, 1)).toBe(once)
    const lossOnce = applyResult(emptyStats(), 20, false, 6)
    expect(applyResult(lossOnce, 20, false, 6)).toBe(lossOnce)
  })
})
