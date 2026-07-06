import type { Dispatch } from 'react'
import { WORDS } from '../data/words'
import { dayNumber } from '../game/dates'
import { dueWords } from '../game/pack'
import { displayStreak } from '../game/streak'
import type { PlayerState } from '../game/types'
import type { Action } from '../state/reducer'

interface Props {
  player: PlayerState
  todayStr: string
  dispatch: Dispatch<Action>
}

export function HomeScreen({ player, todayStr, dispatch }: Props) {
  const streak = displayStreak(player, todayStr)
  const doneToday = player.lastCompletedPackDate === todayStr
  const dueCount = dueWords(WORDS, player.wordProgress, dayNumber(todayStr)).length
  const learnedCount = Object.keys(player.wordProgress).length

  return (
    <main className="screen home">
      <header className="home-header">
        <h1 className="logo">
          Word<span className="logo-accent">Shapes</span>
        </h1>
        <p className="tagline">Some words look like what they mean. 🛏️</p>
      </header>

      <section className="stats-row" aria-label="Your progress">
        <div className="stat">
          <span className="stat-emoji">{streak > 0 ? '🔥' : '🩶'}</span>
          <span className="stat-value">{streak}</span>
          <span className="stat-label">day streak</span>
        </div>
        <div className="stat">
          <span className="stat-emoji">⭐</span>
          <span className="stat-value">{player.xp}</span>
          <span className="stat-label">XP</span>
        </div>
        <div className="stat">
          <span className="stat-emoji">📚</span>
          <span className="stat-value">{learnedCount}</span>
          <span className="stat-label">words met</span>
        </div>
      </section>

      <section className="home-cta">
        {doneToday ? (
          <>
            <p className="done-note">✅ Today’s pack is done — come back tomorrow to keep your streak!</p>
            <button className="btn btn-secondary" onClick={() => dispatch({ type: 'START_PACK', dateStr: todayStr })}>
              Play again (just for fun)
            </button>
          </>
        ) : (
          <button className="btn btn-primary btn-big" onClick={() => dispatch({ type: 'START_PACK', dateStr: todayStr })}>
            ▶ Play today’s pack
            {dueCount > 0 && <span className="due-badge">{dueCount} to review</span>}
          </button>
        )}
        <button className="btn btn-ghost" onClick={() => dispatch({ type: 'GO_WORDS' })}>
          📖 My words
        </button>
      </section>

      {player.bestStreak > 1 && <p className="best-streak">Best streak: {player.bestStreak} days</p>}
    </main>
  )
}
