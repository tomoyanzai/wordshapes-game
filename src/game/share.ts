import { SIZE } from './board'
import { GOALS_TO_WIN } from './generate'
import type { GameSlice } from '../state/reducer'

/**
 * Spoiler-free share text:
 *
 *   WordGather #12 — 8/8 goals in 10 turns
 *   🟩🟩🟨🟩🟩🟨🟩🟩🟩🟩       ← per turn: cleared ≥1 goal / no clear
 *   ▒▓░
 *   ▒▓▒
 *   ░▒▒                        ← 3×3 board-density minimap
 *   🛟 swap · blank             ← only if helpers were spent
 */
export function shareText(gameNo: number, game: GameSlice): string {
  const clearedCount = game.cleared.length
  const won = game.status === 'won'
  const head = won
    ? `WordGather #${gameNo} — ${clearedCount}/${GOALS_TO_WIN} goals in ${game.turnsUsed} turns`
    : `WordGather #${gameNo} — ${clearedCount}/${GOALS_TO_WIN} goals — out of turns`

  const turnRow = game.history.map((h) => (h.clearedGoalIds.length > 0 ? '🟩' : '🟨')).join('')

  const mini: string[] = []
  for (let qr = 0; qr < 3; qr++) {
    let line = ''
    for (let qc = 0; qc < 3; qc++) {
      let filled = 0
      for (let r = qr * 3; r < qr * 3 + 3; r++) {
        for (let c = qc * 3; c < qc * 3 + 3; c++) {
          if (game.board[r * SIZE + c] !== null) filled++
        }
      }
      line += filled <= 2 ? '░' : filled <= 5 ? '▒' : '▓'
    }
    mini.push(line)
  }

  const spent = (['swap', 'reroll', 'blank'] as const).filter((h) => !game.helpers[h])
  const lines = [head, turnRow, ...mini]
  if (spent.length > 0) lines.push(`🛟 ${spent.join(' · ')}`)
  return lines.join('\n')
}
