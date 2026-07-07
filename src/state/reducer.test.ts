import { beforeAll, describe, expect, it } from 'vitest'
import { at, emptyBoard } from '../game/board'
import { preloadDictionary } from '../game/dictionary'
import { GOALS } from '../game/goals'
import { emptyStats } from '../game/stats'
import type { Tile } from '../game/tiles'
import { appReducer, dayGoals, visibleGoals, type Action, type AppState } from './reducer'

beforeAll(() => preloadDictionary())

const tile = (id: string, letter: string): Tile => ({ id, letter })

// a fixed, hand-authored day: goal order chosen so outcomes are predictable
const DAY_GOALS = ['short', 'len5', 'center-line', 'hook', 'vertical', 'vowel-start', 'double-letter', 'flat']
const GOAL_IDS = [...DAY_GOALS, ...GOALS.map((g) => g.id).filter((id) => !DAY_GOALS.includes(id))]

function base(over: Partial<AppState> = {}): AppState {
  return {
    dayNo: 5,
    board: emptyBoard(),
    bag: [tile('b1', 'e'), tile('b2', 'r'), tile('b3', 'i'), tile('b4', 'd'), tile('b5', 'l'), tile('b6', 'm')],
    rack: [tile('r1', 'c'), tile('r2', 'a'), tile('r3', 't'), tile('r4', 's'), tile('r5', 'o'), tile('r6', 'n')],
    pending: [],
    goalIds: GOAL_IDS,
    cleared: [],
    rerolled: [],
    turnsUsed: 0,
    helpers: { swap: true, reroll: true, blank: true },
    history: [],
    status: 'playing',
    stats: emptyStats(),
    selectedTileId: null,
    blankTarget: null,
    notice: null,
    modal: null,
    ...over,
  }
}

const run = (s: AppState, ...actions: Action[]) => actions.reduce(appReducer, s)

/** stage rack tiles (by id) onto cells via the real select/tap flow */
function stage(s: AppState, moves: [string, number][]): AppState {
  return moves.reduce(
    (st, [tileId, index]) => run(st, { type: 'SELECT_TILE', tileId }, { type: 'TAP_CELL', index }),
    s,
  )
}

describe('tap-to-place', () => {
  it('selecting a tile and tapping a cell stages a placement', () => {
    const s = stage(base(), [['r1', 40]])
    expect(s.pending).toHaveLength(1)
    expect(s.pending[0]).toMatchObject({ index: 40, tile: { id: 'r1', letter: 'c' } })
    expect(s.selectedTileId).toBeNull()
  })

  it('tapping a pending cell lifts the tile back', () => {
    const s = run(stage(base(), [['r1', 40]]), { type: 'TAP_CELL', index: 40 })
    expect(s.pending).toHaveLength(0)
  })

  it('recall clears all staged tiles', () => {
    const s = run(stage(base(), [['r1', 40], ['r2', 41]]), { type: 'RECALL_ALL' })
    expect(s.pending).toHaveLength(0)
  })
})

describe('SUBMIT_PLAY', () => {
  it('rejects a non-word with a notice and commits nothing', () => {
    // "casn" fits geometry through center but is not a word
    const s = run(stage(base(), [['r1', 39], ['r2', 40], ['r4', 41], ['r6', 42]]), { type: 'SUBMIT_PLAY' })
    expect(s.notice?.msg).toContain('CASN')
    expect(s.turnsUsed).toBe(0)
    expect(s.board.every((c) => c === null)).toBe(true)
  })

  it('a valid first play commits, refills the rack, and clears matching visible goals', () => {
    // "cats" across the center: clears center-line (visible) but not short/len5
    const s = run(stage(base(), [['r1', 38], ['r2', 39], ['r3', 40], ['r4', 41]]), { type: 'SUBMIT_PLAY' })
    expect(s.turnsUsed).toBe(1)
    expect(s.board[at(4, 4)]?.letter).toBe('t')
    expect(s.cleared.map((c) => c.goalId)).toEqual(['center-line'])
    expect(s.rack).toHaveLength(6) // 2 kept + 4 drawn
    expect(s.bag).toHaveLength(2)
    expect(s.history).toHaveLength(1)
    expect(s.history[0].words).toEqual(['cats'])
    expect(s.stats.played).toBe(0) // not finished
  })

  it('winning applies stats exactly once and opens the result modal', () => {
    const nearly = base({
      cleared: Array.from({ length: 7 }, (_, i) => ({ goalId: GOAL_IDS[i + 1], turn: 1 })),
      turnsUsed: 4,
    })
    // visible = ['short'] → play "cat" (3 letters) to clear it
    const s = run(stage(nearly, [['r1', 39], ['r2', 40], ['r3', 41]]), { type: 'SUBMIT_PLAY' })
    expect(s.status).toBe('won')
    expect(s.cleared).toHaveLength(8)
    expect(s.modal).toBe('result')
    expect(s.stats.played).toBe(1)
    expect(s.stats.won).toBe(1)
    expect(s.stats.dist[4]).toBe(1) // won on turn 5
    // double-submit is inert
    expect(appReducer(s, { type: 'SUBMIT_PLAY' })).toEqual(s)
  })

  it('the 12th turn without the 8th goal loses', () => {
    const late = base({ turnsUsed: 11 })
    const s = run(stage(late, [['r1', 39], ['r2', 40], ['r3', 41]]), { type: 'SUBMIT_PLAY' })
    expect(s.status).toBe('lost')
    expect(s.stats.dist[12]).toBe(1)
    expect(s.stats.currentStreak).toBe(0)
  })

  it('rack stops refilling when the bag runs dry', () => {
    const dry = base({ bag: [tile('b1', 'e')] })
    const s = run(stage(dry, [['r1', 38], ['r2', 39], ['r3', 40], ['r4', 41]]), { type: 'SUBMIT_PLAY' })
    expect(s.rack).toHaveLength(3) // 2 kept + 1 drawn
    expect(s.bag).toHaveLength(0)
  })
})

describe('helpers', () => {
  it('swap exchanges tiles, returns them under the bag, and consumes the helper', () => {
    const s = run(base(), { type: 'USE_SWAP', tileIds: ['r1', 'r2'] })
    expect(s.rack.map((t) => t.id)).toEqual(['r3', 'r4', 'r5', 'r6', 'b1', 'b2'])
    expect(s.bag.map((t) => t.id)).toEqual(['b3', 'b4', 'b5', 'b6', 'r1', 'r2'])
    expect(s.helpers.swap).toBe(false)
    expect(appReducer(s, { type: 'USE_SWAP', tileIds: ['r3'] })).toBe(s) // spent
  })

  it('reroll replaces a visible goal with the next reserve goal', () => {
    const s = run(base(), { type: 'USE_REROLL', goalId: 'len5' })
    expect(s.rerolled).toEqual(['len5'])
    expect(dayGoals(s)).toHaveLength(8)
    expect(dayGoals(s)).not.toContain('len5')
    expect(dayGoals(s)).toContain(GOAL_IDS[8])
    expect(visibleGoals(s).map((g) => g.id)).toEqual(['short', 'center-line', 'hook'])
    expect(s.helpers.reroll).toBe(false)
  })

  it('reroll only works on a visible goal', () => {
    const s = run(base(), { type: 'USE_REROLL', goalId: 'flat' })
    expect(s.rerolled).toEqual([])
    expect(s.helpers.reroll).toBe(true)
  })

  it('blank converts a rack tile; placing it goes through the letter picker', () => {
    let s = run(base(), { type: 'USE_BLANK', tileId: 'r6' })
    expect(s.rack.find((t) => t.id === 'r6')?.letter).toBe('?')
    expect(s.helpers.blank).toBe(false)
    s = run(s, { type: 'SELECT_TILE', tileId: 'r6' }, { type: 'TAP_CELL', index: 40 })
    expect(s.modal).toBe('blank')
    expect(s.blankTarget).toBe(40)
    s = appReducer(s, { type: 'PLACE_BLANK', as: 'x' })
    expect(s.pending[0]).toMatchObject({ index: 40, as: 'x' })
    expect(s.modal).toBeNull()
  })
})

describe('concede', () => {
  it('ends the day as a loss with stats applied', () => {
    const s = run(base({ turnsUsed: 3 }), { type: 'CONCEDE' })
    expect(s.status).toBe('lost')
    expect(s.stats.dist[12]).toBe(1)
    expect(s.modal).toBe('result')
  })
})
