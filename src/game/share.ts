import type { Puzzle, Tier } from './types'

const TIER_GLYPH: Record<Tier, string> = {
  'joins-it': '🟩',
  'same-world': '🟨',
  'far-away': '⬜',
}

/**
 * Spoiler-free share text:
 *
 *   Twenty Words #12 🧭        ← always the neutral compass, never a
 *                                 secret-themed emoji (would spoil the
 *                                 shared daily puzzle for others)
 *   🟩🟨⬜ → ✅                  ← one glyph per probe, in order, then the result
 */
export function shareText(gameNo: number, puzzle: Puzzle, probeOrderTiers: Tier[], won: boolean): string {
  void puzzle // puzzle identity must never leak into the share text
  const head = `Twenty Words #${gameNo} 🧭`
  const glyphs = probeOrderTiers.map((t) => TIER_GLYPH[t]).join('')
  const result = won ? '✅' : '❌'
  const resultLine = glyphs.length > 0 ? `${glyphs} → ${result}` : `→ ${result}`
  return `${head}\n${resultLine}`
}
