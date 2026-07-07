import { isValidWord } from '../game/dictionary'
import { shapeOf, silhouette, SHAPE_LABEL } from '../game/shapes'
import { applyResult } from '../game/stats'
import type { GameStatus, Puzzle, Stats } from '../game/types'

export type Modal = 'help' | 'result' | null

export interface AppState {
  puzzleNo: number
  puzzle: Puzzle
  guesses: string[]
  current: string
  status: GameStatus
  stats: Stats
  /** id lets the same message re-trigger the toast animation */
  notice: { msg: string; id: number } | null
  modal: Modal
  /** true while the win/lose row animation plays, before the result modal */
  revealing: boolean
}

export type Action =
  | { type: 'TYPE'; letter: string }
  | { type: 'BACKSPACE' }
  | { type: 'SUBMIT' }
  | { type: 'REVEAL_DONE' }
  | { type: 'SHOW_MODAL'; modal: Exclude<Modal, null> }
  | { type: 'CLOSE_MODAL' }
  | { type: 'CLEAR_NOTICE' }

let noticeId = 0
const notice = (msg: string) => ({ msg, id: ++noticeId })

export function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'TYPE': {
      if (state.status !== 'playing' || state.modal !== null) return state
      const len = state.puzzle.word.length
      if (state.current.length >= len) return state
      const required = silhouette(state.puzzle.word)[state.current.length]
      if (shapeOf(action.letter) !== required) {
        return { ...state, notice: notice(`This spot needs ${SHAPE_LABEL[required]}`) }
      }
      return { ...state, current: state.current + action.letter }
    }

    case 'BACKSPACE': {
      if (state.status !== 'playing' || state.modal !== null) return state
      return { ...state, current: state.current.slice(0, -1) }
    }

    case 'SUBMIT': {
      if (state.status !== 'playing' || state.modal !== null) return state
      const answer = state.puzzle.word
      if (state.current.length < answer.length) {
        return { ...state, notice: notice('Not enough letters') }
      }
      if (!isValidWord(state.current)) {
        return { ...state, notice: notice('Not in word list') }
      }
      const guesses = [...state.guesses, state.current]
      const won = state.current === answer
      const lost = !won && guesses.length >= 6
      const status: GameStatus = won ? 'won' : lost ? 'lost' : 'playing'
      return {
        ...state,
        guesses,
        current: '',
        status,
        revealing: status !== 'playing',
        stats:
          status === 'playing'
            ? state.stats
            : applyResult(state.stats, state.puzzleNo, won, guesses.length),
      }
    }

    case 'REVEAL_DONE':
      if (!state.revealing) return state
      return { ...state, revealing: false, modal: 'result' }

    case 'SHOW_MODAL':
      return { ...state, modal: action.modal }

    case 'CLOSE_MODAL':
      return { ...state, modal: null }

    case 'CLEAR_NOTICE':
      return { ...state, notice: null }

    default:
      return state
  }
}
