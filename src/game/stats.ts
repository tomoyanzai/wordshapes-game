import type { Stats } from './types'

export function emptyStats(): Stats {
  return {
    played: 0,
    won: 0,
    currentStreak: 0,
    maxStreak: 0,
    dist: [0, 0, 0, 0, 0, 0],
    lastWonPuzzle: null,
    lastPlayedPuzzle: null,
  }
}

/**
 * Records a finished puzzle. Idempotent per puzzle number. The streak
 * counts wins on consecutive puzzle numbers (i.e., consecutive days);
 * a loss or a skipped day breaks it.
 */
export function applyResult(stats: Stats, puzzleNo: number, won: boolean, guessCount: number): Stats {
  if (stats.lastPlayedPuzzle === puzzleNo) return stats
  const dist = [...stats.dist] as Stats['dist']
  let { currentStreak, lastWonPuzzle } = stats
  if (won) {
    dist[Math.min(guessCount, 6) - 1]++
    currentStreak = lastWonPuzzle === puzzleNo - 1 ? currentStreak + 1 : 1
    lastWonPuzzle = puzzleNo
  } else {
    currentStreak = 0
  }
  return {
    played: stats.played + 1,
    won: stats.won + (won ? 1 : 0),
    currentStreak,
    maxStreak: Math.max(stats.maxStreak, currentStreak),
    dist,
    lastWonPuzzle,
    lastPlayedPuzzle: puzzleNo,
  }
}
