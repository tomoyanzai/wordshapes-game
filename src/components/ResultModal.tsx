import { useEffect, useState } from 'react'
import { GOALS_TO_WIN } from '../game/generate'
import { shareText } from '../game/share'
import type { Stats } from '../game/types'
import type { GameSlice } from '../state/reducer'

interface Props {
  gameNo: number
  game: GameSlice
  stats: Stats
  onWordTap: (word: string) => void
  onClose: () => void
}

function msToNextMidnight(): number {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime()
}

function Countdown() {
  const [ms, setMs] = useState(msToNextMidnight)
  useEffect(() => {
    const t = setInterval(() => setMs(msToNextMidnight()), 1000)
    return () => clearInterval(t)
  }, [])
  const s = Math.max(0, Math.floor(ms / 1000))
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    <span className="countdown">
      {pad(Math.floor(s / 3600))}:{pad(Math.floor((s % 3600) / 60))}:{pad(s % 60)}
    </span>
  )
}

/** Doubles as the stats screen mid-game (no verdict/share until finished). */
export function ResultModal({ gameNo, game, stats, onWordTap, onClose }: Props) {
  const [copied, setCopied] = useState(false)
  const finished = game.status !== 'playing'
  const winPct = stats.played > 0 ? Math.round((100 * stats.won) / stats.played) : 0
  const wordsMet = [...new Set(game.history.flatMap((h) => h.words))].filter((w) => w.length >= 3)
  const distWins = stats.dist.slice(0, 12)
  const maxDist = Math.max(1, ...distWins)

  const share = async () => {
    const text = shareText(gameNo, game)
    try {
      if (navigator.share !== undefined) {
        await navigator.share({ text })
        return
      }
    } catch {
      // fall through to clipboard
    }
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" aria-label="Close" onClick={onClose}>
          ✕
        </button>

        {finished && (
          <section className="verdict">
            <p className="verdict-title">
              {game.status === 'won' ? 'All goals gathered' : 'Out of turns'}
            </p>
            <p className="verdict-line">
              {game.cleared.length}/{GOALS_TO_WIN} goals
              {game.status === 'won' ? ` in ${game.turnsUsed} turn${game.turnsUsed === 1 ? '' : 's'}` : ''}
            </p>
          </section>
        )}

        <section className="stats-block">
          <h3>Statistics</h3>
          <div className="stats-grid">
            <div>
              <strong>{stats.played}</strong>
              <span>played</span>
            </div>
            <div>
              <strong>{winPct}</strong>
              <span>win %</span>
            </div>
            <div>
              <strong>{stats.currentStreak}</strong>
              <span>streak</span>
            </div>
            <div>
              <strong>{stats.maxStreak}</strong>
              <span>max</span>
            </div>
          </div>
          <div className="dist">
            {distWins.map((n, i) => (
              <div key={i} className="dist-row">
                <span className="dist-label">{i + 1}</span>
                <span
                  className={`dist-bar ${finished && game.status === 'won' && game.turnsUsed === i + 1 ? 'dist-bar-latest' : ''}`}
                  style={{ width: `${Math.max(7, (100 * n) / maxDist)}%` }}
                >
                  {n}
                </span>
              </div>
            ))}
          </div>
        </section>

        {finished && wordsMet.length > 0 && (
          <section className="recap">
            <h3>Words you met</h3>
            <div className="recap-words">
              {wordsMet.map((w) => (
                <button key={w} className="wordchip" onClick={() => onWordTap(w)}>
                  {w}
                </button>
              ))}
            </div>
            <p className="recap-hint">Tap a word for its meaning.</p>
          </section>
        )}

        {finished && (
          <section className="result-actions">
            <div className="next-puzzle">
              <span>Next board</span>
              <Countdown />
            </div>
            <button className="share-btn" onClick={share}>
              {copied ? 'Copied!' : 'Share'}
            </button>
          </section>
        )}
      </div>
    </div>
  )
}
