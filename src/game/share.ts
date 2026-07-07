import { evaluateGuess } from './feedback'
import { silhouetteGlyphs } from './shapes'
import type { Mark } from './types'

const EMOJI: Record<Mark, string> = { hit: '🟩', near: '🟨', miss: '⬛' }

/**
 * The spoiler-free share grid. The silhouette row is the signature —
 * it shows the shape of the day's word without giving away a letter.
 *
 *   WordShapes #142 3/6
 *   ▲■■▼
 *   ⬛🟨⬛⬛
 *   🟩🟨⬛🟩
 *   🟩🟩🟩🟩
 */
export function shareText(puzzleNo: number, guesses: string[], answer: string, won: boolean): string {
  const score = won ? `${guesses.length}/6` : 'X/6'
  const rows = guesses.map((g) =>
    evaluateGuess(g, answer)
      .map((m) => EMOJI[m])
      .join(''),
  )
  return [`WordShapes #${puzzleNo} ${score}`, silhouetteGlyphs(answer), ...rows].join('\n')
}
