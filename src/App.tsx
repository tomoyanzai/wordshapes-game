import { useEffect, useReducer } from 'react'
import { HomeScreen } from './components/HomeScreen'
import { QuizScreen } from './components/QuizScreen'
import { SummaryScreen } from './components/SummaryScreen'
import { WordListScreen } from './components/WordListScreen'
import { localDateString } from './game/dates'
import { appReducer, type AppState } from './state/reducer'
import { loadPlayerState, savePlayerState } from './storage/storage'

/**
 * The only place in the app that reads the real clock. In dev builds,
 * `?today=YYYY-MM-DD` overrides it so streaks and SRS scheduling can be
 * tested without waiting for actual tomorrows.
 */
function getToday(): string {
  if (import.meta.env.DEV) {
    const p = new URLSearchParams(window.location.search).get('today')
    if (p && /^\d{4}-\d{2}-\d{2}$/.test(p)) return p
  }
  return localDateString(new Date())
}

function initAppState(): AppState {
  return { player: loadPlayerState(), screen: 'home', session: null }
}

export default function App() {
  const [state, dispatch] = useReducer(appReducer, undefined, initAppState)

  useEffect(() => {
    savePlayerState(state.player)
  }, [state.player])

  const todayStr = getToday()

  switch (state.screen) {
    case 'quiz':
      return state.session ? (
        <QuizScreen session={state.session} dispatch={dispatch} />
      ) : (
        <HomeScreen player={state.player} todayStr={todayStr} dispatch={dispatch} />
      )
    case 'summary':
      return state.session ? (
        <SummaryScreen session={state.session} player={state.player} dispatch={dispatch} />
      ) : (
        <HomeScreen player={state.player} todayStr={todayStr} dispatch={dispatch} />
      )
    case 'words':
      return <WordListScreen player={state.player} dispatch={dispatch} />
    default:
      return <HomeScreen player={state.player} todayStr={todayStr} dispatch={dispatch} />
  }
}
