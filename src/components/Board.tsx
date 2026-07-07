import { evaluateGuess } from '../game/feedback'

interface Props {
  answer: string
  guesses: string[]
  current: string
  /** row index that should play the flip animation (the latest submitted row) */
  animateRow: number
  shakeRow: boolean
}

export function Board({ answer, guesses, current, animateRow, shakeRow }: Props) {
  const len = answer.length
  const rows = Array.from({ length: 6 }, (_, r) => {
    if (r < guesses.length) return { kind: 'done' as const, word: guesses[r] }
    if (r === guesses.length) return { kind: 'live' as const, word: current }
    return { kind: 'empty' as const, word: '' }
  })

  return (
    <div className="board" style={{ ['--len' as string]: len }}>
      {rows.map((row, r) => {
        const marks = row.kind === 'done' ? evaluateGuess(row.word, answer) : null
        const shaking = shakeRow && row.kind === 'live'
        return (
          <div key={r} className={`board-row ${shaking ? 'row-shake' : ''}`}>
            {Array.from({ length: len }, (_, i) => {
              const ch = row.word[i] ?? ''
              const mark = marks?.[i]
              const animating = row.kind === 'done' && r === animateRow
              return (
                <span
                  key={i}
                  className={[
                    'tile',
                    ch !== '' && row.kind === 'live' ? 'tile-typed' : '',
                    mark !== undefined ? `tile-${mark}` : '',
                    animating ? 'tile-flip' : '',
                  ].join(' ')}
                  style={animating ? { animationDelay: `${i * 220}ms` } : undefined}
                >
                  {ch}
                </span>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
