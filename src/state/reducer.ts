import { applyPlay, type Board, type Placement } from '../game/board'
import { dictionaryReady, isValidWord } from '../game/dictionary'
import { generateDay, GOALS_TO_WIN, TURN_BUDGET, VISIBLE_GOALS } from '../game/generate'
import { buildContext, GOALS_BY_ID, type GoalCard } from '../game/goals'
import { PLACEMENT_ERROR_TEXT, validatePlay } from '../game/placement'
import { createRng, seededShuffle } from '../game/rng'
import { applyResult } from '../game/stats'
import { RACK_SIZE, type Tile } from '../game/tiles'
import type { GameStatus, Stats } from '../game/types'

export type Modal = 'help' | 'result' | 'swap' | 'blank' | null

export interface HelperState {
  swap: boolean
  reroll: boolean
  blank: boolean
}

/** Everything that persists for the in-progress day. */
export interface GameSlice {
  dayNo: number
  board: Board
  /** remaining draw order, front = next */
  bag: Tile[]
  rack: Tile[]
  /** staged this turn; staged tiles stay in `rack` but render as used */
  pending: Placement[]
  goalIds: string[]
  cleared: { goalId: string; turn: number }[]
  rerolled: string[]
  turnsUsed: number
  helpers: HelperState
  history: { turn: number; words: string[]; clearedGoalIds: string[] }[]
  status: GameStatus
}

export interface AppState extends GameSlice {
  stats: Stats
  selectedTileId: string | null
  /** cell index waiting for the blank-letter picker */
  blankTarget: number | null
  notice: { msg: string; id: number } | null
  modal: Modal
}

export type Action =
  | { type: 'SELECT_TILE'; tileId: string }
  | { type: 'TAP_CELL'; index: number }
  | { type: 'PLACE_BLANK'; as: string }
  | { type: 'RECALL_ALL' }
  | { type: 'SHUFFLE_RACK'; seed: number }
  | { type: 'SUBMIT_PLAY' }
  | { type: 'USE_SWAP'; tileIds: string[] }
  | { type: 'USE_REROLL'; goalId: string }
  | { type: 'USE_BLANK'; tileId: string }
  | { type: 'CONCEDE' }
  | { type: 'SHOW_MODAL'; modal: Exclude<Modal, null> }
  | { type: 'CLOSE_MODAL' }
  | { type: 'CLEAR_NOTICE' }

let noticeId = 0
const notice = (msg: string) => ({ msg, id: ++noticeId })

/** The day's 8 target goals: rerolled cards are replaced from the reserve. */
export function dayGoals(s: Pick<GameSlice, 'goalIds' | 'rerolled'>): string[] {
  return s.goalIds.filter((id) => !s.rerolled.includes(id)).slice(0, GOALS_TO_WIN)
}

/** The up-to-3 goal cards the player is currently chasing. */
export function visibleGoals(s: Pick<GameSlice, 'goalIds' | 'rerolled' | 'cleared'>): GoalCard[] {
  const clearedIds = new Set(s.cleared.map((c) => c.goalId))
  return dayGoals(s)
    .filter((id) => !clearedIds.has(id))
    .slice(0, VISIBLE_GOALS)
    .map((id) => GOALS_BY_ID.get(id)!)
}

export function freshGame(dateStr: string, dayNo: number): GameSlice {
  const { bag, goalIds } = generateDay(dateStr)
  return {
    dayNo,
    board: Array(81).fill(null),
    bag: bag.slice(RACK_SIZE),
    rack: bag.slice(0, RACK_SIZE),
    pending: [],
    goalIds,
    cleared: [],
    rerolled: [],
    turnsUsed: 0,
    helpers: { swap: true, reroll: true, blank: true },
    history: [],
    status: 'playing',
  }
}

const usedIds = (pending: Placement[]) => new Set(pending.map((p) => p.tile.id))

export function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SELECT_TILE': {
      if (state.status !== 'playing') return state
      if (usedIds(state.pending).has(action.tileId)) return state
      return {
        ...state,
        selectedTileId: state.selectedTileId === action.tileId ? null : action.tileId,
      }
    }

    case 'TAP_CELL': {
      if (state.status !== 'playing') return state
      const lifted = state.pending.find((p) => p.index === action.index)
      if (lifted !== undefined) {
        return { ...state, pending: state.pending.filter((p) => p !== lifted) }
      }
      if (state.selectedTileId === null) return state
      if (state.board[action.index] !== null) {
        return { ...state, notice: notice('That square is taken') }
      }
      const tile = state.rack.find((t) => t.id === state.selectedTileId)
      if (tile === undefined) return state
      if (tile.letter === '?') {
        return { ...state, blankTarget: action.index, modal: 'blank' }
      }
      return {
        ...state,
        pending: [...state.pending, { index: action.index, tile }],
        selectedTileId: null,
      }
    }

    case 'PLACE_BLANK': {
      if (state.blankTarget === null || state.selectedTileId === null) return state
      const tile = state.rack.find((t) => t.id === state.selectedTileId)
      if (tile === undefined || !/^[a-z]$/.test(action.as)) return state
      return {
        ...state,
        pending: [...state.pending, { index: state.blankTarget, tile, as: action.as }],
        selectedTileId: null,
        blankTarget: null,
        modal: null,
      }
    }

    case 'RECALL_ALL':
      return { ...state, pending: [], selectedTileId: null }

    case 'SHUFFLE_RACK':
      return { ...state, rack: seededShuffle(state.rack, createRng(`shuffle:${action.seed}`)) }

    case 'SUBMIT_PLAY': {
      if (state.status !== 'playing' || state.pending.length === 0) return state
      if (!dictionaryReady()) {
        return { ...state, notice: notice('Word list still loading — one moment') }
      }
      const result = validatePlay(state.board, state.pending, isValidWord)
      if (!result.ok) {
        const msg =
          result.error.code === 'not-a-word'
            ? `“${result.error.word.toUpperCase()}” — ${PLACEMENT_ERROR_TEXT['not-a-word']}`
            : PLACEMENT_ERROR_TEXT[result.error.code]
        return { ...state, notice: notice(msg) }
      }

      const turn = state.turnsUsed + 1
      const boardAfter = applyPlay(state.board, state.pending, turn)
      const ctx = buildContext(state.board, boardAfter, result.words, state.pending, turn)
      const newlyCleared = visibleGoals(state).filter((g) => g.check(ctx))
      const cleared = [...state.cleared, ...newlyCleared.map((g) => ({ goalId: g.id, turn }))]

      const used = usedIds(state.pending)
      const kept = state.rack.filter((t) => !used.has(t.id))
      const draw = Math.min(RACK_SIZE - kept.length, state.bag.length)
      const rack = [...kept, ...state.bag.slice(0, draw)]
      const bag = state.bag.slice(draw)

      const won = cleared.length >= GOALS_TO_WIN
      const lost = !won && turn >= TURN_BUDGET
      const status: GameStatus = won ? 'won' : lost ? 'lost' : 'playing'

      return {
        ...state,
        board: boardAfter,
        bag,
        rack,
        pending: [],
        selectedTileId: null,
        cleared,
        turnsUsed: turn,
        history: [
          ...state.history,
          { turn, words: result.words.map((w) => w.word), clearedGoalIds: newlyCleared.map((g) => g.id) },
        ],
        status,
        stats: status === 'playing' ? state.stats : applyResult(state.stats, state.dayNo, won, turn),
        modal: status === 'playing' ? state.modal : 'result',
        notice:
          newlyCleared.length > 0 && status === 'playing'
            ? notice(`Goal${newlyCleared.length > 1 ? 's' : ''} cleared! ${cleared.length}/${GOALS_TO_WIN}`)
            : state.notice,
      }
    }

    case 'USE_SWAP': {
      if (state.status !== 'playing' || !state.helpers.swap) return state
      const ids = new Set(action.tileIds.slice(0, 3))
      const out = state.rack.filter((t) => ids.has(t.id))
      if (out.length === 0) return { ...state, modal: null }
      const kept = state.rack.filter((t) => !ids.has(t.id))
      const draw = Math.min(out.length, state.bag.length)
      return {
        ...state,
        rack: [...kept, ...state.bag.slice(0, draw)],
        bag: [...state.bag.slice(draw), ...out],
        pending: [],
        selectedTileId: null,
        helpers: { ...state.helpers, swap: false },
        modal: null,
      }
    }

    case 'USE_REROLL': {
      if (state.status !== 'playing' || !state.helpers.reroll) return state
      if (!visibleGoals(state).some((g) => g.id === action.goalId)) return state
      return {
        ...state,
        rerolled: [...state.rerolled, action.goalId],
        helpers: { ...state.helpers, reroll: false },
        notice: notice('New goal drawn'),
      }
    }

    case 'USE_BLANK': {
      if (state.status !== 'playing' || !state.helpers.blank) return state
      if (usedIds(state.pending).has(action.tileId)) return state
      const rack = state.rack.map((t) => (t.id === action.tileId ? { ...t, letter: '?' } : t))
      if (rack.every((t, i) => t === state.rack[i])) return state
      return {
        ...state,
        rack,
        helpers: { ...state.helpers, blank: false },
        notice: notice('Tile turned blank — place it as any letter'),
      }
    }

    case 'CONCEDE': {
      if (state.status !== 'playing') return state
      return {
        ...state,
        status: 'lost',
        pending: [],
        stats: applyResult(state.stats, state.dayNo, false, TURN_BUDGET),
        modal: 'result',
      }
    }

    case 'SHOW_MODAL':
      return { ...state, modal: action.modal }

    case 'CLOSE_MODAL':
      return { ...state, modal: null, blankTarget: null }

    case 'CLEAR_NOTICE':
      return { ...state, notice: null }

    default:
      return state
  }
}
