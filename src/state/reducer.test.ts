import { describe, expect, it } from 'vitest'
import { appReducer, freshGame, MAX_PROBES, type AppState } from './reducer'
import { puzzleFor } from '../game/daily'
import { emptyStats } from '../game/stats'

const DATE = '2026-07-07' // gameNo 1 -> 'winter'

function makeState(): AppState {
  const slice = freshGame(DATE)
  const { number, puzzle } = puzzleFor(DATE)
  return {
    ...slice,
    puzzle,
    gameNo: number,
    stats: emptyStats(),
    sheetOpen: false,
    sheetForced: false,
    howToOpen: false,
    notice: null,
  }
}

describe('PROBE', () => {
  it('reveals words in the order they are probed', () => {
    let s = makeState()
    s = appReducer(s, { type: 'PROBE', index: 3 })
    s = appReducer(s, { type: 'PROBE', index: 0 })
    s = appReducer(s, { type: 'PROBE', index: 7 })
    expect(s.probeOrder).toEqual([3, 0, 7])
  })

  it('ignores a repeat probe of an already-probed index', () => {
    let s = makeState()
    s = appReducer(s, { type: 'PROBE', index: 2 })
    s = appReducer(s, { type: 'PROBE', index: 2 })
    expect(s.probeOrder).toEqual([2])
  })

  it('forces the answer sheet open on the 6th probe', () => {
    let s = makeState()
    for (let i = 0; i < MAX_PROBES; i++) {
      s = appReducer(s, { type: 'PROBE', index: i })
    }
    expect(s.probeOrder).toHaveLength(MAX_PROBES)
    expect(s.sheetOpen).toBe(true)
    expect(s.sheetForced).toBe(true)
  })

  it('does not allow a 7th probe', () => {
    let s = makeState()
    for (let i = 0; i < MAX_PROBES; i++) {
      s = appReducer(s, { type: 'PROBE', index: i })
    }
    const before = s
    s = appReducer(s, { type: 'PROBE', index: 15 })
    expect(s).toBe(before)
  })
})

describe('sheet dismissal', () => {
  it('CLOSE_SHEET works normally when not forced', () => {
    let s = makeState()
    s = appReducer(s, { type: 'OPEN_SHEET' })
    expect(s.sheetOpen).toBe(true)
    s = appReducer(s, { type: 'CLOSE_SHEET' })
    expect(s.sheetOpen).toBe(false)
  })

  it('CLOSE_SHEET is blocked when the sheet was forced open', () => {
    let s = makeState()
    for (let i = 0; i < MAX_PROBES; i++) {
      s = appReducer(s, { type: 'PROBE', index: i })
    }
    expect(s.sheetForced).toBe(true)
    const forced = s
    s = appReducer(s, { type: 'CLOSE_SHEET' })
    expect(s).toBe(forced)
    expect(s.sheetOpen).toBe(true)
  })
})

describe('ANSWER', () => {
  it('a correct answer wins, records stats and probe count', () => {
    let s = makeState()
    s = appReducer(s, { type: 'PROBE', index: 0 })
    s = appReducer(s, { type: 'PROBE', index: 1 })
    s = appReducer(s, { type: 'ANSWER', value: 'Winter ' })
    expect(s.status).toBe('won')
    expect(s.answer).toBe('winter')
    expect(s.stats.played).toBe(1)
    expect(s.stats.won).toBe(1)
    expect(s.stats.dist[1]).toBe(1) // 2 probes used -> index 1
    expect(s.sheetOpen).toBe(false)
  })

  it('an incorrect answer loses and increments losses', () => {
    let s = makeState()
    s = appReducer(s, { type: 'ANSWER', value: 'nonsense' })
    expect(s.status).toBe('lost')
    expect(s.stats.losses).toBe(1)
    expect(s.stats.currentStreak).toBe(0)
  })

  it('answering immediately with zero probes works', () => {
    let s = makeState()
    s = appReducer(s, { type: 'ANSWER', value: 'winter' })
    expect(s.status).toBe('won')
    expect(s.probeOrder).toHaveLength(0)
    expect(s.stats.dist[0]).toBe(1)
  })

  it('a second ANSWER after the game has finished is inert', () => {
    let s = makeState()
    s = appReducer(s, { type: 'ANSWER', value: 'winter' })
    const finished = s
    s = appReducer(s, { type: 'ANSWER', value: 'nonsense' })
    expect(s).toBe(finished)
    expect(s.status).toBe('won')
  })
})
