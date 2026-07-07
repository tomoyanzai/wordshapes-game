import { describe, expect, it } from 'vitest'
import { at, emptyBoard } from './board'
import { shareText } from './share'
import type { GameSlice } from '../state/reducer'

function slice(over: Partial<GameSlice>): GameSlice {
  return {
    dayNo: 12,
    board: emptyBoard(),
    bag: [],
    rack: [],
    pending: [],
    goalIds: [],
    cleared: [],
    rerolled: [],
    turnsUsed: 0,
    helpers: { swap: true, reroll: true, blank: true },
    history: [],
    status: 'won',
    ...over,
  }
}

describe('shareText', () => {
  it('renders a win header, per-turn row, and 3-line minimap', () => {
    const board = emptyBoard()
    // cluster tiles in the center quadrant
    for (const [r, c] of [[3, 3], [3, 4], [3, 5], [4, 3], [4, 4], [4, 5], [5, 4]] as const) {
      board[at(r, c)] = { letter: 'a', blank: false, turn: 1 }
    }
    const text = shareText(12, slice({
      board,
      status: 'won',
      turnsUsed: 3,
      cleared: Array.from({ length: 8 }, (_, i) => ({ goalId: `g${i}`, turn: 3 })),
      history: [
        { turn: 1, words: ['cat'], clearedGoalIds: ['a'] },
        { turn: 2, words: ['on'], clearedGoalIds: [] },
        { turn: 3, words: ['zebra'], clearedGoalIds: ['b', 'c'] },
      ],
    }))
    expect(text).toBe(
      ['WordGather #12 — 8/8 goals in 3 turns', '🟩🟨🟩', '░░░', '░▓░', '░░░'].join('\n'),
    )
  })

  it('renders a loss header and lists spent helpers', () => {
    const text = shareText(3, slice({
      status: 'lost',
      turnsUsed: 12,
      cleared: [{ goalId: 'x', turn: 2 }],
      history: [{ turn: 1, words: ['hi'], clearedGoalIds: [] }],
      helpers: { swap: false, reroll: true, blank: false },
    }))
    const lines = text.split('\n')
    expect(lines[0]).toBe('WordGather #3 — 1/8 goals — out of turns')
    expect(lines[lines.length - 1]).toBe('🛟 swap · blank')
  })

  it('never leaks letters below the header', () => {
    const text = shareText(5, slice({
      history: [{ turn: 1, words: ['secret'], clearedGoalIds: [] }],
      cleared: [],
      status: 'lost',
      turnsUsed: 12,
    }))
    const [, ...rest] = text.split('\n')
    // the helper line is words, but never board words — with no helpers spent there is none
    for (const row of rest) expect(row).not.toMatch(/[a-z]/i)
  })
})
