import { describe, expect, it } from 'vitest'
import { applyAnswer } from './srs'
import type { WordProgress } from './types'

const TODAY = 20_000

const progress = (box: number): WordProgress => ({
  box,
  nextDueDay: TODAY,
  timesSeen: 3,
  timesCorrect: 2,
  firstSeenDay: TODAY - 10,
})

describe('applyAnswer', () => {
  it('new word answered correctly starts in box 2, due in 2 days', () => {
    const p = applyAnswer(undefined, true, TODAY)
    expect(p.box).toBe(2)
    expect(p.nextDueDay).toBe(TODAY + 2)
    expect(p.timesSeen).toBe(1)
    expect(p.timesCorrect).toBe(1)
    expect(p.firstSeenDay).toBe(TODAY)
  })

  it('new word answered wrong starts in box 1, due tomorrow', () => {
    const p = applyAnswer(undefined, false, TODAY)
    expect(p.box).toBe(1)
    expect(p.nextDueDay).toBe(TODAY + 1)
    expect(p.timesCorrect).toBe(0)
  })

  it('correct answers promote one box: 4 -> 5, due in 14 days', () => {
    const p = applyAnswer(progress(4), true, TODAY)
    expect(p.box).toBe(5)
    expect(p.nextDueDay).toBe(TODAY + 14)
  })

  it('box 5 stays capped at 5 on further correct answers', () => {
    expect(applyAnswer(progress(5), true, TODAY).box).toBe(5)
  })

  it('any wrong answer demotes straight to box 1', () => {
    const p = applyAnswer(progress(4), false, TODAY)
    expect(p.box).toBe(1)
    expect(p.nextDueDay).toBe(TODAY + 1)
  })

  it('increments counters and preserves firstSeenDay', () => {
    const p = applyAnswer(progress(2), true, TODAY)
    expect(p.timesSeen).toBe(4)
    expect(p.timesCorrect).toBe(3)
    expect(p.firstSeenDay).toBe(TODAY - 10)
  })
})
