import { dayNumber } from './dates'

/** Day #1 launches on this date; everyone gets the same setup each day. */
export const EPOCH_DATE = '2026-07-07'
const EPOCH_DAY = dayNumber(EPOCH_DATE)

export function gameNumberFor(dateStr: string): number {
  return Math.max(1, dayNumber(dateStr) - EPOCH_DAY + 1)
}
