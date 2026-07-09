interface Props {
  probesUsed: number
  max: number
  finished: boolean
}

/** Six dots on their own row, plus a caption on the line below — never overlapping. */
export function ProbeBudget({ probesUsed, max, finished }: Props) {
  const remaining = max - probesUsed

  return (
    <div className="budget-wrap">
      <div className="budget-row" aria-hidden="true">
        {Array.from({ length: max }, (_, i) => (
          <span key={i} className={`budget-dot ${i < probesUsed ? 'filled' : ''}`} />
        ))}
      </div>
      <p className="budget-caption">
        {finished
          ? `probes used: ${probesUsed} of ${max}`
          : `${remaining} ${remaining === 1 ? 'probe' : 'probes'} remaining`}
      </p>
    </div>
  )
}
