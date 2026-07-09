import { useEffect, useReducer, useRef, useState } from 'react'
import { AnswerSheet } from './components/AnswerSheet'
import { ClueChip } from './components/ClueChip'
import { HowToModal } from './components/HowToModal'
import { ProbeBudget } from './components/ProbeBudget'
import { ResultPanel } from './components/ResultPanel'
import { StatsModal } from './components/StatsModal'
import { Toast } from './components/Toast'
import { WordGrid } from './components/WordGrid'
import { PUZZLES_BY_ID } from './data/puzzles'
import { puzzleFor } from './game/daily'
import { dayNumber, localDateString } from './game/dates'
import { appReducer, freshGame, MAX_PROBES, type Action, type AppState, type GameSlice } from './state/reducer'
import { hasSeenHelp, loadGameSave, loadStats, markHelpSeen, saveGame, saveStats } from './storage/storage'

/**
 * The only place that reads the real clock for puzzle selection. In dev,
 * `?today=YYYY-MM-DD` overrides it so future puzzles and streaks can be
 * tested without waiting for real tomorrows.
 */
function getToday(): string {
  if (import.meta.env.DEV) {
    const p = new URLSearchParams(window.location.search).get('today')
    if (p !== null && /^\d{4}-\d{2}-\d{2}$/.test(p)) return p
  }
  return localDateString(new Date())
}

function initState(): AppState {
  const dateStr = getToday()
  const dayNo = dayNumber(dateStr)
  const { number, puzzle: todaysPuzzle } = puzzleFor(dateStr)
  const game = loadGameSave(dayNo) ?? freshGame(dateStr)
  // rehydrate the full puzzle from the saved id — falls back to today's
  // puzzle if the id is unrecognized (shouldn't happen, but never crash)
  const puzzle = PUZZLES_BY_ID.get(game.puzzleId) ?? todaysPuzzle

  return {
    ...game,
    puzzle,
    gameNo: number,
    stats: loadStats(),
    sheetOpen: false,
    sheetForced: false,
    howToOpen: !hasSeenHelp(),
    notice: null,
  }
}

const gameSlice = (s: AppState): GameSlice => ({
  dayNo: s.dayNo,
  puzzleId: s.puzzleId,
  probeOrder: s.probeOrder,
  status: s.status,
  answer: s.answer,
})

export default function App() {
  const [state, dispatch] = useReducer(appReducer, undefined, initState)
  const [statsOpen, setStatsOpen] = useState(false)
  const lastNotice = useRef(0)

  const act = (a: Action) => dispatch(a)

  // persist the in-progress day's game on every relevant change
  useEffect(() => {
    saveGame(gameSlice(state))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.dayNo, state.puzzleId, state.probeOrder, state.status, state.answer])

  useEffect(() => {
    saveStats(state.stats)
  }, [state.stats])

  // auto-clear notices a couple seconds after they appear
  useEffect(() => {
    if (state.notice === null || state.notice.id === lastNotice.current) return
    lastNotice.current = state.notice.id
    const t = setTimeout(() => dispatch({ type: 'CLEAR_NOTICE' }), 2200)
    return () => clearTimeout(t)
  }, [state.notice])

  const closeHowTo = () => {
    markHelpSeen()
    act({ type: 'CLOSE_HOWTO' })
  }

  const remaining = MAX_PROBES - state.probeOrder.length
  const gridLocked = state.sheetOpen || state.status !== 'playing'

  return (
    <div className="page">
      <header className="hdr">
        <div className="eyebrow-row">
          <button className="help-btn" type="button" aria-label="Statistics" onClick={() => setStatsOpen(true)}>
            ▦
          </button>
          <p className="eyebrow">Twenty Words</p>
          <button className="help-btn" type="button" aria-label="How to play" onClick={() => act({ type: 'SHOW_HOWTO' })}>
            ?
          </button>
        </div>
        <h1 className="wordmark">wordgather</h1>
        <p className="rules">Six probes to feel out the secret word. One chance to name it.</p>
        <ClueChip clue={state.puzzle.clue} />
      </header>

      <ProbeBudget probesUsed={state.probeOrder.length} max={MAX_PROBES} finished={state.status !== 'playing'} />

      <WordGrid
        puzzle={state.puzzle}
        probeOrder={state.probeOrder}
        locked={gridLocked}
        onProbe={(index) => act({ type: 'PROBE', index })}
      />

      {state.status === 'playing' ? (
        <button
          className={`know-btn ${remaining <= 2 ? 'pulse' : ''}`}
          type="button"
          onClick={() => act({ type: 'OPEN_SHEET' })}
        >
          I know it
        </button>
      ) : (
        <ResultPanel gameNo={state.gameNo} puzzle={state.puzzle} status={state.status} probeOrder={state.probeOrder} />
      )}

      {state.sheetOpen && (
        <AnswerSheet
          puzzle={state.puzzle}
          forced={state.sheetForced}
          onSubmit={(value) => act({ type: 'ANSWER', value })}
          onClose={() => act({ type: 'CLOSE_SHEET' })}
        />
      )}

      {state.howToOpen && <HowToModal onClose={closeHowTo} />}

      {statsOpen && <StatsModal stats={state.stats} onClose={() => setStatsOpen(false)} />}

      {state.notice !== null && <Toast message={state.notice.msg} />}
    </div>
  )
}
