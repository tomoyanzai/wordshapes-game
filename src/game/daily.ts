import { PUZZLES } from '../data/puzzles'
import { dayNumber } from './dates'
import type { Puzzle } from './types'

/** Puzzle #1 launches on this date; everyone gets the same word each day. */
export const EPOCH_DATE = '2026-07-07'
const EPOCH_DAY = dayNumber(EPOCH_DATE)

export function puzzleNumberFor(dateStr: string): number {
  return Math.max(1, dayNumber(dateStr) - EPOCH_DAY + 1)
}

export function puzzleFor(dateStr: string): { number: number; puzzle: Puzzle } {
  const number = puzzleNumberFor(dateStr)
  return { number, puzzle: PUZZLES[(number - 1) % PUZZLES.length] }
}
