import { beforeAll, describe, expect, it } from 'vitest'
import { preloadDictionary } from '../game/dictionary'
import { emptyStats } from '../game/stats'
import type { Puzzle } from '../game/types'
import { appReducer, type AppState } from './reducer'

const PUZZLE: Puzzle = {
  word: 'dusk',
  clue: 'the dim light just after sunset',
  exampleSentence: 'Bats come out at dusk.',
  level: 'B2',
  translations: {},
}

const base = (over: Partial<AppState> = {}): AppState => ({
  puzzleNo: 5,
  puzzle: PUZZLE,
  guesses: [],
  current: '',
  status: 'playing',
  stats: emptyStats(),
  notice: null,
  modal: null,
  revealing: false,
  ...over,
})

beforeAll(() => preloadDictionary())

const type = (s: AppState, word: string) =>
  [...word].reduce((st, letter) => appReducer(st, { type: 'TYPE', letter }), s)

describe('typing with the shape constraint', () => {
  it('accepts letters matching the silhouette (d-u-s-k = tall,small,small,tall)', () => {
    const s = type(base(), 'dusk')
    expect(s.current).toBe('dusk')
    expect(s.notice).toBeNull()
  })

  it('rejects a wrong-shape letter with an explanatory notice', () => {
    // position 0 needs a tall letter; "a" is small
    const s = appReducer(base(), { type: 'TYPE', letter: 'a' })
    expect(s.current).toBe('')
    expect(s.notice?.msg).toContain('tall letter')
  })

  it('accepts any letter of the right class, not just the answer letter', () => {
    const s = appReducer(base(), { type: 'TYPE', letter: 'b' })
    expect(s.current).toBe('b')
  })

  it('ignores typing beyond the word length and after finishing', () => {
    const full = type(base(), 'dusk')
    expect(type(full, 'd').current).toBe('dusk')
    expect(type(base({ status: 'won' }), 'd').current).toBe('')
  })

  it('backspace removes the last letter', () => {
    const s = appReducer(type(base(), 'du'), { type: 'BACKSPACE' })
    expect(s.current).toBe('d')
  })
})

describe('submitting', () => {
  it('rejects short rows and non-words with notices', () => {
    expect(appReducer(type(base(), 'du'), { type: 'SUBMIT' }).notice?.msg).toBe('Not enough letters')
    // "bnsk" fits the silhouette but is not a word
    const junk = type(base(), 'bnsk')
    expect(junk.current).toBe('bnsk')
    const s = appReducer(junk, { type: 'SUBMIT' })
    expect(s.notice?.msg).toBe('Not in word list')
    expect(s.guesses).toHaveLength(0)
  })

  it('accepts a valid wrong guess and keeps playing', () => {
    const s = appReducer(type(base(), 'busk'), { type: 'SUBMIT' })
    expect(s.guesses).toEqual(['busk'])
    expect(s.status).toBe('playing')
    expect(s.stats.played).toBe(0)
  })

  it('a correct guess wins, records stats once, then opens the result modal', () => {
    const s = appReducer(type(base(), 'dusk'), { type: 'SUBMIT' })
    expect(s.status).toBe('won')
    expect(s.revealing).toBe(true)
    expect(s.stats.played).toBe(1)
    expect(s.stats.currentStreak).toBe(1)
    expect(s.stats.dist[0]).toBe(1)
    const done = appReducer(s, { type: 'REVEAL_DONE' })
    expect(done.modal).toBe('result')
    expect(done.revealing).toBe(false)
  })

  it('a sixth wrong guess loses and breaks the streak', () => {
    let s = base({ stats: { ...emptyStats(), currentStreak: 3, maxStreak: 3, lastWonPuzzle: 4, played: 3, won: 3 } })
    for (let i = 0; i < 6; i++) {
      s = appReducer(type(s, 'busk'), { type: 'SUBMIT' })
    }
    expect(s.status).toBe('lost')
    expect(s.guesses).toHaveLength(6)
    expect(s.stats.currentStreak).toBe(0)
    expect(s.stats.played).toBe(4)
  })

  it('input is inert while a modal is open', () => {
    const s = base({ modal: 'help' })
    expect(appReducer(s, { type: 'TYPE', letter: 'd' }).current).toBe('')
    expect(appReducer(s, { type: 'SUBMIT' })).toEqual(s)
  })
})
