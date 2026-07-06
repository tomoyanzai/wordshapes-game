export const BASE_POINTS = 10
export const COMBO_STEP = 5
export const MAX_POINTS = 30
export const PACK_BONUS = 20
export const PERFECT_BONUS = 30

/** 10 base + 5 per combo level, capped at 30 (combo 0→10, 1→15, 2→20, 3→25, 4+→30). */
export function pointsForAnswer(comboBefore: number): number {
  return Math.min(BASE_POINTS + comboBefore * COMBO_STEP, MAX_POINTS)
}

/** Flat completion bonus, plus extra for a perfect pack. */
export function packBonus(correctCount: number, total: number): number {
  return PACK_BONUS + (total > 0 && correctCount === total ? PERFECT_BONUS : 0)
}
