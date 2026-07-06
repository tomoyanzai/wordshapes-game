import { yesterdayOf } from './dates'

export interface StreakSlice {
  streak: number
  bestStreak: number
  lastCompletedPackDate: string | null
}

/**
 * Called exactly when a pack is completed. Idempotent for same-day
 * replays; consecutive-day completion extends the streak, any gap
 * restarts it at 1.
 */
export function updateStreakOnPackComplete(prev: StreakSlice, todayStr: string): StreakSlice {
  if (prev.lastCompletedPackDate === todayStr) return { ...prev }
  const streak = prev.lastCompletedPackDate === yesterdayOf(todayStr) ? prev.streak + 1 : 1
  return {
    streak,
    bestStreak: Math.max(prev.bestStreak, streak),
    lastCompletedPackDate: todayStr,
  }
}

/**
 * What the Home screen should show: a streak whose last completion is
 * older than yesterday is displayed as 0 (broken) without mutating
 * storage — the real reset happens on the next completion.
 */
export function displayStreak(prev: StreakSlice, todayStr: string): number {
  if (prev.lastCompletedPackDate === todayStr) return prev.streak
  if (prev.lastCompletedPackDate === yesterdayOf(todayStr)) return prev.streak
  return 0
}
