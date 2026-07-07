import { CENTER, SIZE, type Board, type Placement } from '../game/board'

interface Props {
  board: Board
  pending: Placement[]
  lastTurn: number
  onTapCell: (index: number) => void
}

export function GameBoard({ board, pending, lastTurn, onTapCell }: Props) {
  const pendingAt = new Map(pending.map((p) => [p.index, p]))

  return (
    <div className="gboard" role="grid" aria-label="game board">
      {Array.from({ length: SIZE * SIZE }, (_, i) => {
        const cell = board[i]
        const pend = pendingAt.get(i)
        const cls = ['gcell']
        if (cell !== null) {
          cls.push('gcell-tile')
          if (cell.turn === lastTurn && lastTurn > 0) cls.push('gcell-last')
        } else if (pend !== undefined) {
          cls.push('gcell-pending')
        } else if (i === CENTER) {
          cls.push('gcell-center')
        }
        const letter = cell?.letter ?? (pend !== undefined ? (pend.tile.letter === '?' ? pend.as : pend.tile.letter) : '')
        return (
          <button key={i} className={cls.join(' ')} onClick={() => onTapCell(i)} aria-label={`cell ${i}`}>
            {letter}
            {(cell?.blank ?? false) && <span className="gcell-blankmark">•</span>}
            {cell === null && pend === undefined && i === CENTER && '✦'}
          </button>
        )
      })}
    </div>
  )
}
