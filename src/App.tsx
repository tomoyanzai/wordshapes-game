import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { BlankPickerModal } from './components/BlankPickerModal'
import { DefinitionSheet } from './components/DefinitionSheet'
import { GameBoard } from './components/GameBoard'
import { GoalTray } from './components/GoalTray'
import { HelperBar } from './components/HelperBar'
import { HelpModal } from './components/HelpModal'
import { Rack } from './components/Rack'
import { ResultModal } from './components/ResultModal'
import { SwapModal } from './components/SwapModal'
import { gameNumberFor } from './game/daily'
import { localDateString } from './game/dates'
import { dictionaryReady, preloadDictionary } from './game/dictionary'
import { validateGeometry, PLACEMENT_ERROR_TEXT } from './game/placement'
import {
  appReducer,
  freshGame,
  visibleGoals,
  type Action,
  type AppState,
  type GameSlice,
} from './state/reducer'
import { hasSeenHelp, loadGameSave, loadStats, markHelpSeen, saveGame, saveStats } from './storage/storage'

/**
 * The only place that reads the real clock for board selection. In dev,
 * `?today=YYYY-MM-DD` overrides it so future boards and streaks can be
 * tested without waiting for real tomorrows.
 */
function getToday(): string {
  if (import.meta.env.DEV) {
    const p = new URLSearchParams(window.location.search).get('today')
    if (p && /^\d{4}-\d{2}-\d{2}$/.test(p)) return p
  }
  return localDateString(new Date())
}

function initState(): AppState {
  const dateStr = getToday()
  const dayNo = gameNumberFor(dateStr)
  const game: GameSlice = loadGameSave(dayNo) ?? freshGame(dateStr, dayNo)
  return {
    ...game,
    stats: loadStats(),
    selectedTileId: null,
    blankTarget: null,
    notice: null,
    modal: hasSeenHelp() ? (game.status !== 'playing' ? 'result' : null) : 'help',
  }
}

const gameSlice = (s: AppState): GameSlice => ({
  dayNo: s.dayNo,
  board: s.board,
  bag: s.bag,
  rack: s.rack,
  pending: s.pending,
  goalIds: s.goalIds,
  cleared: s.cleared,
  rerolled: s.rerolled,
  turnsUsed: s.turnsUsed,
  helpers: s.helpers,
  history: s.history,
  status: s.status,
})

export default function App() {
  const [state, dispatch] = useReducer(appReducer, undefined, initState)
  const [dictReady, setDictReady] = useState(dictionaryReady())
  const [definitionWord, setDefinitionWord] = useState<string | null>(null)
  const lastNotice = useRef(0)

  useEffect(() => {
    void preloadDictionary().then(() => setDictReady(true))
  }, [])

  // persist game + stats on every commit
  useEffect(() => {
    saveGame(gameSlice(state))
  }, [state.board, state.bag, state.rack, state.cleared, state.rerolled, state.turnsUsed, state.helpers, state.history, state.status]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    saveStats(state.stats)
  }, [state.stats])

  // auto-clear notices
  useEffect(() => {
    if (state.notice === null || state.notice.id === lastNotice.current) return
    lastNotice.current = state.notice.id
    const t = setTimeout(() => dispatch({ type: 'CLEAR_NOTICE' }), 2200)
    return () => clearTimeout(t)
  }, [state.notice])

  // live geometry preview for the staged tiles
  const preview = useMemo(() => {
    if (state.pending.length === 0) return null
    const geo = validateGeometry(state.board, state.pending)
    if (geo.ok) {
      const main = geo.words.find((w) => w.isMain)
      return { ok: true as const, text: geo.words.map((w) => w.word.toUpperCase()).join(' · '), main: main?.word }
    }
    return { ok: false as const, text: PLACEMENT_ERROR_TEXT[geo.error.code] }
  }, [state.board, state.pending])

  const visible = visibleGoals(state)
  const act = (a: Action) => dispatch(a)
  const lastPlayWords = state.history[state.history.length - 1]?.words ?? []

  return (
    <div className="app">
      <header className="topbar">
        <button className="icon-btn" aria-label="How to play" onClick={() => act({ type: 'SHOW_MODAL', modal: 'help' })}>
          ?
        </button>
        <h1 className="wordmark">wordgather</h1>
        <button className="icon-btn" aria-label="Statistics" onClick={() => act({ type: 'SHOW_MODAL', modal: 'result' })}>
          ▦
        </button>
      </header>

      <main className="play">
        <GoalTray
          visible={visible}
          clearedCount={state.cleared.length}
          canReroll={state.helpers.reroll && state.status === 'playing'}
          onReroll={(goalId) => act({ type: 'USE_REROLL', goalId })}
        />

        <GameBoard
          board={state.board}
          pending={state.pending}
          lastTurn={state.turnsUsed}
          onTapCell={(index) => act({ type: 'TAP_CELL', index })}
        />

        <div className={`preview ${preview === null ? '' : preview.ok ? 'preview-ok' : 'preview-bad'}`}>
          {preview !== null
            ? preview.text
            : state.status === 'playing'
              ? lastPlayWords.length > 0
                ? lastPlayWords.map((w) => (
                    <button key={w} className="wordchip wordchip-inline" onClick={() => setDefinitionWord(w)}>
                      {w}
                    </button>
                  ))
                : 'Tap a tile, then a square'
              : 'Done for today'}
        </div>

        <Rack
          rack={state.rack}
          pending={state.pending}
          selectedTileId={state.selectedTileId}
          onSelect={(tileId) => act({ type: 'SELECT_TILE', tileId })}
        />

        <div className="actionbar">
          <button className="btn-ghost" disabled={state.pending.length === 0} onClick={() => act({ type: 'RECALL_ALL' })}>
            ↩ recall
          </button>
          <button className="btn-ghost" onClick={() => act({ type: 'SHUFFLE_RACK', seed: Math.floor(Math.random() * 1e9) })}>
            ⤨ mix
          </button>
          <button
            className="btn-primary btn-submit"
            disabled={state.status !== 'playing' || state.pending.length === 0 || !dictReady || preview?.ok !== true}
            onClick={() => act({ type: 'SUBMIT_PLAY' })}
          >
            {dictReady ? 'Play word' : 'Loading…'}
          </button>
        </div>

        <HelperBar
          helpers={state.helpers}
          turnsUsed={state.turnsUsed}
          onSwap={() => act({ type: 'SHOW_MODAL', modal: 'swap' })}
          onBlank={() => {
            const target = state.rack.find((t) => t.letter !== '?' && !state.pending.some((p) => p.tile.id === t.id))
            if (target !== undefined) act({ type: 'USE_BLANK', tileId: state.selectedTileId ?? target.id })
          }}
        />

        {state.status === 'playing' && state.turnsUsed > 0 && (
          <button
            className="concede"
            onClick={() => {
              if (window.confirm('Give up on today’s board?')) act({ type: 'CONCEDE' })
            }}
          >
            concede
          </button>
        )}
      </main>

      {state.notice !== null && <div className="toast">{state.notice.msg}</div>}

      {state.modal === 'help' && (
        <HelpModal
          onClose={() => {
            markHelpSeen()
            act({ type: 'CLOSE_MODAL' })
          }}
        />
      )}
      {state.modal === 'result' && (
        <ResultModal
          gameNo={state.dayNo}
          game={gameSlice(state)}
          stats={state.stats}
          onWordTap={(w) => setDefinitionWord(w)}
          onClose={() => act({ type: 'CLOSE_MODAL' })}
        />
      )}
      {state.modal === 'swap' && (
        <SwapModal
          rack={state.rack}
          onConfirm={(tileIds) => act({ type: 'USE_SWAP', tileIds })}
          onClose={() => act({ type: 'CLOSE_MODAL' })}
        />
      )}
      {state.modal === 'blank' && (
        <BlankPickerModal
          onPick={(as) => act({ type: 'PLACE_BLANK', as })}
          onClose={() => act({ type: 'CLOSE_MODAL' })}
        />
      )}
      {definitionWord !== null && <DefinitionSheet word={definitionWord} onClose={() => setDefinitionWord(null)} />}
    </div>
  )
}
