import type { WordProgress } from './types'

export const MAX_BOX = 5

/** Days until a word in a given box comes back for review. */
export const INTERVALS: Record<number, number> = { 1: 1, 2: 2, 3: 4, 4: 7, 5: 14 }

/**
 * Leitner transition: correct answers promote one box (capped at 5),
 * any wrong answer sends the word back to box 1. Box-5 words still get
 * a 14-day refresh cycle so the review well never fully dries up.
 */
export function applyAnswer(
  prev: WordProgress | undefined,
  correct: boolean,
  todayDay: number,
): WordProgress {
  const box = prev
    ? correct
      ? Math.min(prev.box + 1, MAX_BOX)
      : 1
    : correct
      ? 2
      : 1
  return {
    box,
    nextDueDay: todayDay + INTERVALS[box],
    timesSeen: (prev?.timesSeen ?? 0) + 1,
    timesCorrect: (prev?.timesCorrect ?? 0) + (correct ? 1 : 0),
    firstSeenDay: prev?.firstSeenDay ?? todayDay,
  }
}
