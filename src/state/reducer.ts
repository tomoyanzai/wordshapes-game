import { WORDS } from '../data/words'
import { dayNumber } from '../game/dates'
import { buildDailySession } from '../game/quiz'
import { packBonus, pointsForAnswer } from '../game/scoring'
import { applyAnswer } from '../game/srs'
import { updateStreakOnPackComplete } from '../game/streak'
import type { PlayerState, Question } from '../game/types'

export type Screen = 'home' | 'quiz' | 'summary' | 'words'
export type Phase = 'question' | 'feedback' | 'reveal'

export interface Session {
  /** Snapshotted at pack start so a midnight crossover mid-pack can't shift the day */
  dateStr: string
  /** True if this is the first completion of this date's pack (streak/bonus apply) */
  countsForStreak: boolean
  questions: Question[]
  index: number
  combo: number
  score: number
  bonus: number
  results: { wordId: string; correct: boolean }[]
  phase: Phase
  selectedId: string | null
}

export interface AppState {
  player: PlayerState
  screen: Screen
  session: Session | null
}

export type Action =
  | { type: 'START_PACK'; dateStr: string }
  | { type: 'ANSWER'; optionId: string }
  | { type: 'ADVANCE' }
  | { type: 'GO_HOME' }
  | { type: 'GO_WORDS' }
  | { type: 'RESET_PROGRESS'; fresh: PlayerState }

export function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'START_PACK': {
      const questions = buildDailySession(action.dateStr, WORDS, state.player.wordProgress)
      if (questions.length === 0) return { ...state, screen: 'home' }
      return {
        ...state,
        screen: 'quiz',
        session: {
          dateStr: action.dateStr,
          countsForStreak: state.player.lastCompletedPackDate !== action.dateStr,
          questions,
          index: 0,
          combo: 0,
          score: 0,
          bonus: 0,
          results: [],
          phase: 'question',
          selectedId: null,
        },
      }
    }

    case 'ANSWER': {
      const { session, player } = state
      if (!session || session.phase !== 'question') return state
      const q = session.questions[session.index]
      const correct = action.optionId === q.word.id
      const todayDay = dayNumber(session.dateStr)
      const gained = correct ? pointsForAnswer(session.combo) : 0
      return {
        ...state,
        player: {
          ...player,
          xp: player.xp + gained,
          wordProgress: {
            ...player.wordProgress,
            [q.word.id]: applyAnswer(player.wordProgress[q.word.id], correct, todayDay),
          },
        },
        session: {
          ...session,
          phase: 'feedback',
          selectedId: action.optionId,
          combo: correct ? session.combo + 1 : 0,
          score: session.score + gained,
          results: [...session.results, { wordId: q.word.id, correct }],
        },
      }
    }

    case 'ADVANCE': {
      const { session, player } = state
      if (!session) return state
      if (session.phase === 'question') return state
      // Iconic words get their shape-reveal interstitial before moving on
      if (session.phase === 'feedback' && session.questions[session.index].word.iconic) {
        return { ...state, session: { ...session, phase: 'reveal' } }
      }
      const next = session.index + 1
      if (next < session.questions.length) {
        return {
          ...state,
          session: { ...session, index: next, phase: 'question', selectedId: null },
        }
      }
      // Pack complete: bonus + streak apply only on the first completion of the day
      const correctCount = session.results.filter((r) => r.correct).length
      const bonus = session.countsForStreak ? packBonus(correctCount, session.results.length) : 0
      const streakSlice = updateStreakOnPackComplete(player, session.dateStr)
      return {
        ...state,
        screen: 'summary',
        player: { ...player, ...streakSlice, xp: player.xp + bonus },
        session: { ...session, bonus },
      }
    }

    case 'GO_HOME':
      return { ...state, screen: 'home', session: state.screen === 'summary' ? null : state.session }

    case 'GO_WORDS':
      return { ...state, screen: 'words' }

    case 'RESET_PROGRESS':
      return { player: action.fresh, screen: 'home', session: null }

    default:
      return state
  }
}
