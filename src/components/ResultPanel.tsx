import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { shareText } from '../game/share'
import type { GameStatus, Puzzle, Tier } from '../game/types'
import { deriveProbeTiers } from '../state/reducer'

interface Props {
  gameNo: number
  puzzle: Puzzle
  status: Exclude<GameStatus, 'playing'>
  /** indices into puzzle.words, in probe order */
  probeOrder: number[]
  /** free-play mode: show a button to jump to the next puzzle now */
  devMode?: boolean
  onNext?: () => void
}

const TIER_GROUPS: { tier: Tier; label: string; pips: string }[] = [
  { tier: 'joins-it', label: 'Joins it:', pips: '●●●' },
  { tier: 'same-world', label: 'Same world:', pips: '●●' },
  { tier: 'far-away', label: 'Far away:', pips: '○' },
]

function renderNote(note: string, phrase: string | undefined): ReactNode {
  if (phrase === undefined) return note
  const idx = note.indexOf(phrase)
  if (idx === -1) return note
  return (
    <>
      {note.slice(0, idx)}
      <span className="relate-phrase">{phrase}</span>
      {note.slice(idx + phrase.length)}
    </>
  )
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

export function ResultPanel({ gameNo, puzzle, status, probeOrder, devMode = false, onNext }: Props) {
  const [copied, setCopied] = useState(false)
  const won = status === 'won'
  const probesUsed = probeOrder.length

  const probedSet = useMemo(() => new Set(probeOrder), [probeOrder])
  const tiers = useMemo(() => deriveProbeTiers(puzzle, probeOrder), [puzzle, probeOrder])
  const shareBody = useMemo(() => shareText(gameNo, puzzle, tiers, won), [gameNo, puzzle, tiers, won])

  const share = async () => {
    try {
      if (navigator.share !== undefined) {
        await navigator.share({ text: shareBody })
        return
      }
    } catch {
      // user cancelled or share failed — fall through to clipboard
    }
    try {
      await navigator.clipboard.writeText(shareBody)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable: nothing sensible to do
    }
  }

  return (
    <section className="result-panel" aria-live="polite">
      <div className={`result-headline ${won ? 'win' : 'lose'}`}>
        {won ? (
          <>
            <p className="result-title win">
              ◆ {puzzle.secret.toUpperCase()} — solved with{' '}
              {probesUsed === 0 ? 'no probes' : `${probesUsed} ${probesUsed === 1 ? 'probe' : 'probes'}`}
            </p>
            {puzzle.winNote.length > 0 && <p className="result-sub">{puzzle.winNote}</p>}
          </>
        ) : (
          <p className="result-title lose">The word was {puzzle.secret.toUpperCase()}.</p>
        )}
      </div>

      <div>
        <p className="relate-heading">How every word relates:</p>
        <div className="relate-groups">
          {TIER_GROUPS.map((group) => {
            const words = puzzle.words
              .map((w, index) => ({ ...w, index }))
              .filter((w) => w.tier === group.tier)
            return (
              <div className={`relate-group ${group.tier}`} key={group.tier}>
                <div className="relate-group-label">
                  <span className="pip-mini">{group.pips}</span>
                  {group.label}
                </div>
                {words.map((w) => (
                  <div className={`relate-item ${probedSet.has(w.index) ? 'probed' : ''}`} key={w.word}>
                    <span className="relate-marker" aria-hidden="true" />
                    <span className="relate-word">{w.word}</span>
                    <span className="relate-note">{renderNote(w.note, w.phrase)}</span>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      <div className="share-block">{shareBody}</div>

      <button className="share-btn" type="button" onClick={() => void share()}>
        {copied ? 'Copied!' : 'Share'}
      </button>

      {devMode && onNext !== undefined ? (
        <button className="dev-next-btn" type="button" onClick={onNext}>
          Play next puzzle → <span className="dev-tag">free play</span>
        </button>
      ) : (
        <p className="next-puzzle">
          Next puzzle in <Countdown />
        </p>
      )}
    </section>
  )
}
