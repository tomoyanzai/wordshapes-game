import type { Dispatch } from 'react'
import type { PlayerState } from '../game/types'
import type { Action, Session } from '../state/reducer'

interface Props {
  session: Session
  player: PlayerState
  dispatch: Dispatch<Action>
}

export function SummaryScreen({ session, player, dispatch }: Props) {
  const correctCount = session.results.filter((r) => r.correct).length
  const total = session.results.length
  const perfect = total > 0 && correctCount === total
  const newWords = session.questions.filter((q) => !q.isReview).map((q) => q.word)
  const resultFor = (wordId: string) => session.results.find((r) => r.wordId === wordId)?.correct

  return (
    <main className="screen summary">
      <h2 className="summary-title">{perfect ? '🏆 Perfect pack!' : '🎉 Pack complete!'}</h2>

      <section className="summary-score">
        <p className="summary-big">
          {correctCount}/{total} correct
        </p>
        <p className="summary-points">
          +{session.score} XP
          {session.bonus > 0 && <span className="summary-bonus"> +{session.bonus} bonus</span>}
        </p>
        {session.countsForStreak && (
          <p className="summary-streak">🔥 Streak: {player.streak} day{player.streak === 1 ? '' : 's'}</p>
        )}
      </section>

      <section className="summary-words">
        {session.questions.map((q) => (
          <div key={q.word.id} className="summary-word">
            <span className="summary-word-mark">{resultFor(q.word.id) ? '✅' : '❌'}</span>
            <span className="summary-word-emoji">{q.word.emoji}</span>
            <span className="summary-word-text">{q.word.word}</span>
            {q.word.iconic && <span className="summary-word-iconic" title={q.word.iconic.hint}>✨</span>}
            {!q.isReview && <span className="new-chip">new</span>}
          </div>
        ))}
        {newWords.length > 0 && (
          <p className="summary-note">
            You met {newWords.length} new word{newWords.length === 1 ? '' : 's'} today. Missed words will come back sooner. 🔁
          </p>
        )}
      </section>

      <div className="summary-actions">
        <button className="btn btn-primary" onClick={() => dispatch({ type: 'GO_HOME' })}>
          Home
        </button>
        <button className="btn btn-ghost" onClick={() => dispatch({ type: 'GO_WORDS' })}>
          📖 My words
        </button>
      </div>
    </main>
  )
}
