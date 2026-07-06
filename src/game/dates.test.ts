import { describe, expect, it } from 'vitest'
import { dateStringFromDayNumber, dayNumber, localDateString, yesterdayOf } from './dates'

describe('localDateString', () => {
  it('formats from LOCAL calendar components with zero padding', () => {
    expect(localDateString(new Date(2026, 0, 5))).toBe('2026-01-05')
    expect(localDateString(new Date(2026, 11, 31))).toBe('2026-12-31')
  })
})

describe('dayNumber', () => {
  it('is exactly +1 across a US DST spring-forward boundary', () => {
    expect(dayNumber('2026-03-09') - dayNumber('2026-03-08')).toBe(1)
  })

  it('is exactly +1 across month and year boundaries', () => {
    expect(dayNumber('2026-03-01') - dayNumber('2026-02-28')).toBe(1)
    expect(dayNumber('2027-01-01') - dayNumber('2026-12-31')).toBe(1)
  })

  it('round-trips through dateStringFromDayNumber', () => {
    for (const s of ['2026-07-06', '2000-02-29', '2026-01-01']) {
      expect(dateStringFromDayNumber(dayNumber(s))).toBe(s)
    }
  })
})

describe('yesterdayOf', () => {
  it('handles plain, month, and year boundaries', () => {
    expect(yesterdayOf('2026-07-06')).toBe('2026-07-05')
    expect(yesterdayOf('2026-07-01')).toBe('2026-06-30')
    expect(yesterdayOf('2026-01-01')).toBe('2025-12-31')
  })
})
