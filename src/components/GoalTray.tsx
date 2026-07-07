import { GOALS_TO_WIN } from '../game/generate'
import type { GoalCard } from '../game/goals'

const CATEGORY_ICON: Record<GoalCard['category'], string> = {
  length: '↔',
  letters: 'ab',
  placement: '⌗',
  semantic: '◎',
  shape: '▲■▼',
}

interface Props {
  visible: GoalCard[]
  clearedCount: number
  canReroll: boolean
  onReroll: (goalId: string) => void
}

export function GoalTray({ visible, clearedCount, canReroll, onReroll }: Props) {
  return (
    <section className="goaltray" aria-label="goals">
      <div className="goaltray-head">
        <span className="goaltray-count">
          {clearedCount}/{GOALS_TO_WIN} goals
        </span>
        <span className="goaltray-dots" aria-hidden="true">
          {Array.from({ length: GOALS_TO_WIN }, (_, i) => (
            <span key={i} className={i < clearedCount ? 'gdot gdot-on' : 'gdot'} />
          ))}
        </span>
      </div>
      <div className="goaltray-cards">
        {visible.map((g) => (
          <div key={g.id} className={`goalchip goalchip-${g.category}`}>
            <span className="goalchip-icon" aria-hidden="true">
              {CATEGORY_ICON[g.category]}
            </span>
            <span className="goalchip-text">{g.text}</span>
            {canReroll && (
              <button
                className="goalchip-reroll"
                aria-label={`replace goal: ${g.text}`}
                title="Replace this goal (once per day)"
                onClick={() => onReroll(g.id)}
              >
                ↻
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
