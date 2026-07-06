import { useState, type Dispatch } from 'react'
import { WORDS } from '../data/words'
import { MAX_BOX } from '../game/srs'
import type { PlayerState } from '../game/types'
import type { Action } from '../state/reducer'
import { freshPlayerState } from '../storage/storage'

interface Props {
  player: PlayerState
  dispatch: Dispatch<Action>
}

/** Light "collection" feel: every word you've met, with its mastery dots and iconic hint. */
export function WordListScreen({ player, dispatch }: Props) {
  const [openId, setOpenId] = useState<string | null>(null)
  const met = WORDS.filter((w) => player.wordProgress[w.id] !== undefined)

  return (
    <main className="screen words">
      <header className="words-header">
        <button className="btn-close" aria-label="Back to home" onClick={() => dispatch({ type: 'GO_HOME' })}>
          ←
        </button>
        <h2>My words</h2>
        <span className="words-count">
          {met.length}/{WORDS.length}
        </span>
      </header>

      {met.length === 0 ? (
        <p className="words-empty">Play your first pack to start collecting words! 🎒</p>
      ) : (
        <ul className="word-grid">
          {met.map((w) => {
            const p = player.wordProgress[w.id]
            const open = openId === w.id
            return (
              <li key={w.id}>
                <button className={`word-card ${open ? 'word-card-open' : ''}`} onClick={() => setOpenId(open ? null : w.id)}>
                  <span className="word-card-emoji">{w.emoji}</span>
                  <span className="word-card-word">
                    {w.word} {w.iconic && <span className="word-card-sparkle">✨</span>}
                  </span>
                  <span className="word-card-boxes" aria-label={`mastery ${p.box} of ${MAX_BOX}`}>
                    {Array.from({ length: MAX_BOX }, (_, i) => (
                      <span key={i} className={i < p.box ? 'box-dot box-dot-on' : 'box-dot'} />
                    ))}
                  </span>
                  {open && (
                    <span className="word-card-detail">
                      <span>{w.definition}</span>
                      <span className="word-card-example">“{w.exampleSentence}”</span>
                      {w.iconic && <span className="word-card-hint">✨ {w.iconic.hint}</span>}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <footer className="words-footer">
        <button
          className="btn-danger-link"
          onClick={() => {
            if (window.confirm('Reset ALL progress (streak, XP, learned words)?')) {
              dispatch({ type: 'RESET_PROGRESS', fresh: freshPlayerState() })
            }
          }}
        >
          Reset progress
        </button>
      </footer>
    </main>
  )
}
