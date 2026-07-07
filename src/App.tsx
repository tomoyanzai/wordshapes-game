import { useEffect, useReducer, useRef, useState } from 'react'
import { Board } from './components/Board'
import { HelpModal } from './components/HelpModal'
import { Keyboard } from './components/Keyboard'
import { ResultModal } from './components/ResultModal'
import { Silhouette } from './components/Silhouette'
import { puzzleFor } from './game/daily'
import { localDateString } from './game/dates'
import { appReducer, type AppState } from './state/reducer'
import { hasSeenHelp, loadGameSave, loadStats, markHelpSeen, saveGame, saveStats } from './storage/storage'

/**
 * The only place that reads the real clock for puzzle selection. In dev,
 * `?today=YYYY-MM-DD` overrides it so streaks and future puzzles can be
 * tested without waiting for actual tomorrows.
 */
function getToday(): string {
  if (import.meta.env.DEV) {
    const p = new URLSearchParams(window.location.search).get('today')
    if (p && /^\d{4}-\d{2}-\d{2}$/.test(p)) return p
  }
  return localDateString(new Date())
}

function initState(): AppState {
  const { number, puzzle } = puzzleFor(getToday())
  const save = loadGameSave(number)
  const status = save?.status ?? 'playing'
  return {
    puzzleNo: number,
    puzzle,
    guesses: save?.guesses ?? [],
    current: '',
    status,
    stats: loadStats(),
    notice: null,
    modal: hasSeenHelp() ? (status !== 'playing' ? 'result' : null) : 'help',
    revealing: false,
  }
}

export default function App() {
  const [state, dispatch] = useReducer(appReducer, undefined, initState)
  const [shake, setShake] = useState(0)
  const lastNotice = useRef(0)

  // persist board + stats
  useEffect(() => {
    saveGame({ puzzleNo: state.puzzleNo, guesses: state.guesses, status: state.status })
  }, [state.puzzleNo, state.guesses, state.status])
  useEffect(() => {
    saveStats(state.stats)
  }, [state.stats])

  // notices: shake the live row and auto-clear
  useEffect(() => {
    if (state.notice === null || state.notice.id === lastNotice.current) return
    lastNotice.current = state.notice.id
    setShake((n) => n + 1)
    const t = setTimeout(() => dispatch({ type: 'CLEAR_NOTICE' }), 1800)
    return () => clearTimeout(t)
  }, [state.notice])

  // after the last row flips, open the result modal
  useEffect(() => {
    if (!state.revealing) return
    const t = setTimeout(() => dispatch({ type: 'REVEAL_DONE' }), 1900)
    return () => clearTimeout(t)
  }, [state.revealing])

  // physical keyboard
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'Enter') dispatch({ type: 'SUBMIT' })
      else if (e.key === 'Backspace') dispatch({ type: 'BACKSPACE' })
      else if (/^[a-zA-Z]$/.test(e.key)) dispatch({ type: 'TYPE', letter: e.key.toLowerCase() })
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const onKey = (key: string) => {
    if (key === 'enter') dispatch({ type: 'SUBMIT' })
    else if (key === 'backspace') dispatch({ type: 'BACKSPACE' })
    else dispatch({ type: 'TYPE', letter: key })
  }

  const closeModal = () => {
    if (state.modal === 'help') markHelpSeen()
    dispatch({ type: 'CLOSE_MODAL' })
  }

  return (
    <div className="app">
      <header className="topbar">
        <button className="icon-btn" aria-label="How to play" onClick={() => dispatch({ type: 'SHOW_MODAL', modal: 'help' })}>
          ?
        </button>
        <h1 className="wordmark">wordshapes</h1>
        <button className="icon-btn" aria-label="Statistics" onClick={() => dispatch({ type: 'SHOW_MODAL', modal: 'result' })}>
          ▦
        </button>
      </header>

      <main className="play">
        <div className="clue-bar">
          <span className="puzzle-no">#{state.puzzleNo}</span>
          <p className="clue">{state.puzzle.clue}</p>
        </div>
        <Silhouette word={state.puzzle.word} />
        <Board
          answer={state.puzzle.word}
          guesses={state.guesses}
          current={state.current}
          animateRow={state.guesses.length - 1}
          shakeRow={shake > 0 && state.notice !== null}
        />
        <Keyboard
          answer={state.puzzle.word}
          guesses={state.guesses}
          current={state.current}
          status={state.status}
          onKey={onKey}
        />
      </main>

      {state.notice !== null && <div className="toast">{state.notice.msg}</div>}

      {state.modal === 'help' && <HelpModal onClose={closeModal} />}
      {state.modal === 'result' && (
        <ResultModal
          puzzleNo={state.puzzleNo}
          puzzle={state.puzzle}
          guesses={state.guesses}
          status={state.status}
          stats={state.stats}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
