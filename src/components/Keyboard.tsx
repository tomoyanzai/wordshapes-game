import { keyStates } from '../game/feedback'
import { shapeOf, silhouette } from '../game/shapes'
import type { GameStatus } from '../game/types'

interface Props {
  answer: string
  guesses: string[]
  current: string
  status: GameStatus
  onKey: (key: string) => void
}

const ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']

/**
 * QWERTY with the game's twist: while you type, only letters matching the
 * next position's shape class light up. Dimmed keys still respond — they
 * explain why they don't fit (that's the teaching moment).
 */
export function Keyboard({ answer, guesses, current, status, onKey }: Props) {
  const states = keyStates(guesses, answer)
  const len = answer.length
  const required =
    status === 'playing' && current.length < len ? silhouette(answer)[current.length] : null

  const keyClass = (ch: string) => {
    const parts = ['key']
    const mark = states[ch]
    if (mark !== undefined) parts.push(`key-${mark}`)
    if (required !== null && shapeOf(ch) !== required) parts.push('key-off')
    return parts.join(' ')
  }

  return (
    <div className="keyboard">
      {ROWS.map((row, r) => (
        <div key={r} className="kb-row">
          {r === 2 && (
            <button className="key key-wide" onClick={() => onKey('enter')}>
              enter
            </button>
          )}
          {[...row].map((ch) => (
            <button key={ch} className={keyClass(ch)} onClick={() => onKey(ch)}>
              {ch}
            </button>
          ))}
          {r === 2 && (
            <button className="key key-wide" aria-label="backspace" onClick={() => onKey('backspace')}>
              ⌫
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
