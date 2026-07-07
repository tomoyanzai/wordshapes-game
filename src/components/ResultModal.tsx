import { useEffect, useState } from 'react'
import { shareText } from '../game/share'
import type { GameStatus, Puzzle, Stats } from '../game/types'

interface Props {
  puzzleNo: number
  puzzle: Puzzle
  guesses: string[]
  status: GameStatus
  stats: Stats
  onClose: () => void
}

function msToNextMidnight(): number {
  const now = new Date()
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  return next.getTime() - now.getTime()
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

/** Doubles as the stats screen mid-game (no dossier/share until finished). */
export function ResultModal({ puzzleNo, puzzle, guesses, status, stats, onClose }: Props) {
  const [copied, setCopied] = useState(false)
  const finished = status !== 'playing'
  const iconic = new Set(puzzle.iconicIndices ?? [])
  const winPct = stats.played > 0 ? Math.round((100 * stats.won) / stats.played) : 0
  const maxDist = Math.max(1, ...stats.dist)

  const share = async () => {
    const text = shareText(puzzleNo, guesses, puzzle.word, status === 'won')
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
      // clipboard unavailable: nothing sensible to do
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" aria-label="Close" onClick={onClose}>
          ✕
        </button>

        {finished && (
          <section className="dossier">
            <p className="dossier-verdict">{status === 'won' ? 'Solved' : 'The word was'}</p>
            <p className="dossier-word">
              {[...puzzle.word].map((ch, i) => (
                <span key={i} className={iconic.has(i) ? 'dossier-letter dossier-iconic' : 'dossier-letter'}>
                  {ch}
                </span>
              ))}
            </p>
            <p className="dossier-clue">
              {puzzle.clue} <span className="level-chip">{puzzle.level}</span>
            </p>
            <p className="dossier-example">“{puzzle.exampleSentence}”</p>
            {puzzle.shapeNote !== undefined && <p className="dossier-note">◆ {puzzle.shapeNote}</p>}
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
            {stats.dist.map((n, i) => (
              <div key={i} className="dist-row">
                <span className="dist-label">{i + 1}</span>
                <span
                  className={`dist-bar ${finished && status === 'won' && guesses.length === i + 1 ? 'dist-bar-latest' : ''}`}
                  style={{ width: `${Math.max(7, (100 * n) / maxDist)}%` }}
                >
                  {n}
                </span>
              </div>
            ))}
          </div>
        </section>

        {finished && (
          <section className="result-actions">
            <div className="next-puzzle">
              <span>Next word</span>
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
