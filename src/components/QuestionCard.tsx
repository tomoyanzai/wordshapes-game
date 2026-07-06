import type { Question } from '../game/types'
import type { Phase } from '../state/reducer'

interface Props {
  question: Question
  phase: Phase
  selectedId: string | null
  onAnswer: (optionId: string) => void
  onContinue: () => void
}

export function QuestionCard({ question, phase, selectedId, onAnswer, onContinue }: Props) {
  const answered = phase !== 'question'
  const correct = selectedId === question.word.id

  const optionClass = (id: string) => {
    if (!answered) return 'answer'
    if (id === question.word.id) return 'answer answer-correct'
    if (id === selectedId) return 'answer answer-wrong'
    return 'answer answer-dim'
  }

  return (
    <section className="question-card">
      {question.isReview && <span className="review-chip">review</span>}

      {question.type === 'defToWord' ? (
        <div className="prompt">
          <span className="prompt-emoji">{question.word.emoji}</span>
          <p className="prompt-text">{question.word.definition}</p>
          <p className="prompt-ask">Which word is it?</p>
        </div>
      ) : (
        <div className="prompt">
          <span className="prompt-word">{question.word.word}</span>
          <p className="prompt-ask">What does it mean?</p>
        </div>
      )}

      <div className="answers">
        {question.options.map((opt) =>
          question.type === 'defToWord' ? (
            <button key={opt.id} className={optionClass(opt.id)} disabled={answered} onClick={() => onAnswer(opt.id)}>
              {opt.word}
            </button>
          ) : (
            <button key={opt.id} className={optionClass(opt.id)} disabled={answered} onClick={() => onAnswer(opt.id)}>
              <span className="answer-emoji">{opt.emoji}</span> {opt.definition}
            </button>
          ),
        )}
      </div>

      {answered && (
        <div className={`feedback ${correct ? 'feedback-correct' : 'feedback-wrong'}`}>
          <p className="feedback-title">
            {correct ? '✔ Nice!' : `✘ It was “${question.word.word}” ${question.word.emoji}`}
          </p>
          <p className="feedback-example">“{question.word.exampleSentence}”</p>
          <button className="btn btn-primary" autoFocus onClick={onContinue}>
            Continue
          </button>
        </div>
      )}
    </section>
  )
}
