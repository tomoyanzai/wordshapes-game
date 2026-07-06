import { describe, expect, it } from 'vitest'
import { WORDS } from '../data/words'
import type { PlayerState } from '../game/types'
import { appReducer, type AppState } from './reducer'

const DATE = '2026-07-06'

const freshPlayer = (): PlayerState => ({
  version: 1,
  xp: 0,
  streak: 0,
  bestStreak: 0,
  lastCompletedPackDate: null,
  wordProgress: {},
  settings: { reducedMotion: false },
})

const start = (): AppState =>
  appReducer({ player: freshPlayer(), screen: 'home', session: null }, { type: 'START_PACK', dateStr: DATE })

/** Answer the current question, optionally on purpose wrong, then advance past feedback/reveal. */
function playOne(state: AppState, correct: boolean): AppState {
  const s = state.session!
  const q = s.questions[s.index]
  const optionId = correct ? q.word.id : q.options.find((o) => o.id !== q.word.id)!.id
  let next = appReducer(state, { type: 'ANSWER', optionId })
  next = appReducer(next, { type: 'ADVANCE' })
  if (next.session!.phase === 'reveal') next = appReducer(next, { type: 'ADVANCE' })
  return next
}

describe('appReducer quiz flow', () => {
  it('START_PACK builds a 10-question session and moves to the quiz screen', () => {
    const s = start()
    expect(s.screen).toBe('quiz')
    expect(s.session!.questions).toHaveLength(10)
    expect(s.session!.countsForStreak).toBe(true)
  })

  it('a correct answer awards points, extends combo and records progress', () => {
    const s0 = start()
    const q = s0.session!.questions[0]
    const s1 = appReducer(s0, { type: 'ANSWER', optionId: q.word.id })
    expect(s1.session!.phase).toBe('feedback')
    expect(s1.session!.combo).toBe(1)
    expect(s1.session!.score).toBe(10)
    expect(s1.player.xp).toBe(10)
    expect(s1.player.wordProgress[q.word.id].box).toBe(2)
  })

  it('a wrong answer resets the combo and demotes the word to box 1', () => {
    let s = start()
    s = playOne(s, true)
    s = playOne(s, true)
    const q = s.session!.questions[s.session!.index]
    const wrong = q.options.find((o) => o.id !== q.word.id)!.id
    const after = appReducer(s, { type: 'ANSWER', optionId: wrong })
    expect(after.session!.combo).toBe(0)
    expect(after.player.wordProgress[q.word.id].box).toBe(1)
  })

  it('ANSWER is ignored outside the question phase (no double-scoring)', () => {
    const s0 = start()
    const q = s0.session!.questions[0]
    const s1 = appReducer(s0, { type: 'ANSWER', optionId: q.word.id })
    const s2 = appReducer(s1, { type: 'ANSWER', optionId: q.word.id })
    expect(s2).toBe(s1)
  })

  it('an iconic word routes through the reveal phase before the next question', () => {
    // find a date-agnostic iconic question by playing until we hit one
    let s = start()
    let sawReveal = false
    for (let i = 0; i < 10 && s.screen === 'quiz'; i++) {
      const q = s.session!.questions[s.session!.index]
      let next = appReducer(s, { type: 'ANSWER', optionId: q.word.id })
      next = appReducer(next, { type: 'ADVANCE' })
      if (q.word.iconic) {
        expect(next.session!.phase).toBe('reveal')
        sawReveal = true
        next = appReducer(next, { type: 'ADVANCE' })
      }
      s = next
    }
    // the pack is A1-heavy and A1 has many iconic words; if none appeared the
    // routing was still exercised structurally above — but flag it.
    expect(s.screen).toBe('summary')
    expect(sawReveal || WORDS.every((w) => !w.iconic)).toBe(true)
  })

  it('finishing a pack applies the streak and bonus exactly once', () => {
    let s = start()
    while (s.screen === 'quiz') s = playOne(s, true)
    expect(s.screen).toBe('summary')
    expect(s.player.streak).toBe(1)
    expect(s.player.lastCompletedPackDate).toBe(DATE)
    // 10 correct: 10+15+20+25+30*6 = 250, perfect bonus 50
    expect(s.session!.score).toBe(250)
    expect(s.session!.bonus).toBe(50)
    expect(s.player.xp).toBe(300)
  })

  it('a same-day replay does not re-award streak or bonus', () => {
    let s = start()
    while (s.screen === 'quiz') s = playOne(s, true)
    const xpAfterFirst = s.player.xp
    let replay = appReducer({ ...s, screen: 'home', session: null }, { type: 'START_PACK', dateStr: DATE })
    expect(replay.session!.countsForStreak).toBe(false)
    while (replay.screen === 'quiz') replay = playOne(replay, true)
    expect(replay.player.streak).toBe(1)
    expect(replay.session!.bonus).toBe(0)
    // answer XP still accrues on replays, bonus does not
    expect(replay.player.xp).toBeGreaterThan(xpAfterFirst)
    expect(replay.player.xp - xpAfterFirst).toBeLessThanOrEqual(250)
  })
})
