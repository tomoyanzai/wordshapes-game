import { puzzleFor } from '../game/daily'
import { dayNumber } from '../game/dates'
import { applyResult } from '../game/stats'
import type { GameStatus, Puzzle, Stats, Tier } from '../game/types'

export const MAX_PROBES = 6

/** Everything that persists for the in-progress day. */
export interface GameSlice {
  dayNo: number
  puzzleId: string
  /** indices into puzzle.words, in probe order */
  probeOrder: number[]
  status: GameStatus
  /** the guess the player committed, null if none */
  answer: string | null
}

export interface AppState extends GameSlice {
  puzzle: Puzzle
  gameNo: number
  stats: Stats
  sheetOpen: boolean
  /** true when opened by the 6th probe; blocks dismissal */
  sheetForced: boolean
  howToOpen: boolean
  notice: { msg: string; id: number } | null
}

export type Action =
  | { type: 'PROBE'; index: number }
  | { type: 'OPEN_SHEET' }
  | { type: 'CLOSE_SHEET' }
  | { type: 'ANSWER'; value: string }
  | { type: 'SHOW_HOWTO' }
  | { type: 'CLOSE_HOWTO' }
  | { type: 'CLEAR_NOTICE' }

export function freshGame(dateStr: string): GameSlice {
  const { puzzle } = puzzleFor(dateStr)
  return {
    dayNo: dayNumber(dateStr),
    puzzleId: puzzle.id,
    probeOrder: [],
    status: 'playing',
    answer: null,
  }
}

/** The tier revealed by each probe, in the order the player made them. */
export function deriveProbeTiers(puzzle: Puzzle, probeOrder: number[]): Tier[] {
  return probeOrder.map((i) => puzzle.words[i].tier)
}

export function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'PROBE': {
      if (state.status !== 'playing') return state
      if (state.sheetOpen) return state
      if (state.probeOrder.includes(action.index)) return state
      if (state.probeOrder.length >= MAX_PROBES) return state
      const probeOrder = [...state.probeOrder, action.index]
      const forced = probeOrder.length === MAX_PROBES
      return {
        ...state,
        probeOrder,
        sheetOpen: forced ? true : state.sheetOpen,
        sheetForced: forced ? true : state.sheetForced,
      }
    }

    case 'OPEN_SHEET': {
      if (state.status !== 'playing') return state
      return { ...state, sheetOpen: true, sheetForced: false }
    }

    case 'CLOSE_SHEET': {
      if (state.sheetForced) return state
      return { ...state, sheetOpen: false }
    }

    case 'ANSWER': {
      if (state.status !== 'playing') return state
      const normalized = action.value.trim().toLowerCase()
      const won = state.puzzle.accept.includes(normalized)
      const status: GameStatus = won ? 'won' : 'lost'
      return {
        ...state,
        status,
        answer: normalized,
        sheetOpen: false,
        stats: applyResult(state.stats, state.dayNo, won, state.probeOrder.length),
      }
    }

    case 'SHOW_HOWTO':
      return { ...state, howToOpen: true }

    case 'CLOSE_HOWTO':
      return { ...state, howToOpen: false }

    case 'CLEAR_NOTICE':
      return { ...state, notice: null }

    default:
      return state
  }
}
