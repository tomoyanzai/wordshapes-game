import type { Dispatch } from 'react'
import type { Action, Session } from '../state/reducer'
import { IconicReveal } from './IconicReveal'
import { QuestionCard } from './QuestionCard'

interface Props {
  session: Session
  dispatch: Dispatch<Action>
}

export function QuizScreen({ session, dispatch }: Props) {
  const q = session.questions[session.index]
  const total = session.questions.length

  return (
    <main className="screen quiz">
      <header className="quiz-header">
        <button className="btn-close" aria-label="Quit pack" onClick={() => dispatch({ type: 'GO_HOME' })}>
          ✕
        </button>
        <div className="progress-track" role="progressbar" aria-valuenow={session.index + 1} aria-valuemin={1} aria-valuemax={total}>
          <div className="progress-fill" style={{ width: `${((session.index + (session.phase === 'question' ? 0 : 1)) / total) * 100}%` }} />
        </div>
        <span className="quiz-score">⭐ {session.score}</span>
      </header>

      {session.combo >= 2 && session.phase !== 'question' && (
        <p className="combo-note">🔥 Combo ×{session.combo}!</p>
      )}

      {session.phase === 'reveal' && q.word.iconic ? (
        <IconicReveal word={q.word} onContinue={() => dispatch({ type: 'ADVANCE' })} />
      ) : (
        <QuestionCard
          question={q}
          phase={session.phase}
          selectedId={session.selectedId}
          onAnswer={(optionId) => dispatch({ type: 'ANSWER', optionId })}
          onContinue={() => dispatch({ type: 'ADVANCE' })}
        />
      )}
    </main>
  )
}
