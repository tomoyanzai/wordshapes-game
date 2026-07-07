import type { Stats } from './types'

export function emptyStats(): Stats {
  return {
    played: 0,
    won: 0,
    currentStreak: 0,
    maxStreak: 0,
    dist: Array(13).fill(0), // wins by turns used (1..12); [12] = losses
    lastWonDay: null,
    lastPlayedDay: null,
  }
}

/**
 * Records a finished day. Idempotent per day number. The streak counts
 * wins on consecutive days; a loss or a skipped day breaks it.
 */
export function applyResult(stats: Stats, dayNo: number, won: boolean, turnsUsed: number): Stats {
  if (stats.lastPlayedDay === dayNo) return stats
  const dist = [...stats.dist]
  let { currentStreak, lastWonDay } = stats
  if (won) {
    dist[Math.min(Math.max(turnsUsed, 1), 12) - 1]++
    currentStreak = lastWonDay === dayNo - 1 ? currentStreak + 1 : 1
    lastWonDay = dayNo
  } else {
    dist[12]++
    currentStreak = 0
  }
  return {
    played: stats.played + 1,
    won: stats.won + (won ? 1 : 0),
    currentStreak,
    maxStreak: Math.max(stats.maxStreak, currentStreak),
    dist,
    lastWonDay,
    lastPlayedDay: dayNo,
  }
}
