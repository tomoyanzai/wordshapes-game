import { dayNumber } from './dates'
import { PUZZLES } from '../data/puzzles'
import type { Puzzle } from './types'

/** Day #1 launches on this date; everyone gets the same setup each day. */
export const EPOCH_DATE = '2026-07-07'
const EPOCH_DAY = dayNumber(EPOCH_DATE)

export function gameNumberFor(dateStr: string): number {
  return Math.max(1, dayNumber(dateStr) - EPOCH_DAY + 1)
}

/** Rotates deterministically through the puzzle pack, one per calendar day. */
export function puzzleFor(dateStr: string): { number: number; puzzle: Puzzle } {
  const number = gameNumberFor(dateStr)
  const puzzle = PUZZLES[(number - 1) % PUZZLES.length]
  return { number, puzzle }
}
