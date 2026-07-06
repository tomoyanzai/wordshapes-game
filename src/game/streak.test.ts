import { describe, expect, it } from 'vitest'
import { displayStreak, updateStreakOnPackComplete } from './streak'

describe('updateStreakOnPackComplete', () => {
  it('first ever completion starts the streak at 1', () => {
    const out = updateStreakOnPackComplete(
      { streak: 0, bestStreak: 0, lastCompletedPackDate: null },
      '2026-07-06',
    )
    expect(out).toEqual({ streak: 1, bestStreak: 1, lastCompletedPackDate: '2026-07-06' })
  })

  it('consecutive-day completion extends the streak', () => {
    const out = updateStreakOnPackComplete(
      { streak: 3, bestStreak: 3, lastCompletedPackDate: '2026-07-05' },
      '2026-07-06',
    )
    expect(out.streak).toBe(4)
    expect(out.bestStreak).toBe(4)
  })

  it('same-day double completion is a no-op', () => {
    const prev = { streak: 4, bestStreak: 4, lastCompletedPackDate: '2026-07-06' }
    expect(updateStreakOnPackComplete(prev, '2026-07-06')).toEqual(prev)
  })

  it('a gap resets the streak to 1 but keeps bestStreak', () => {
    const out = updateStreakOnPackComplete(
      { streak: 7, bestStreak: 7, lastCompletedPackDate: '2026-07-01' },
      '2026-07-06',
    )
    expect(out.streak).toBe(1)
    expect(out.bestStreak).toBe(7)
  })
})

describe('displayStreak', () => {
  it('shows the streak when last completion is today or yesterday', () => {
    const prev = { streak: 5, bestStreak: 5, lastCompletedPackDate: '2026-07-05' }
    expect(displayStreak(prev, '2026-07-05')).toBe(5)
    expect(displayStreak(prev, '2026-07-06')).toBe(5)
  })

  it('shows 0 for an older completion without mutating anything', () => {
    const prev = { streak: 5, bestStreak: 5, lastCompletedPackDate: '2026-07-01' }
    expect(displayStreak(prev, '2026-07-06')).toBe(0)
    expect(prev.streak).toBe(5)
  })
})
