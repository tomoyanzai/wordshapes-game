import { dayNumber } from './dates'
import { createRng, seededShuffle } from './rng'
import { MAX_BOX } from './srs'
import type { CefrLevel, Word, WordProgress } from './types'

export const PACK_SIZE = 10
export const MAX_REVIEW = 5

const LEVEL_ORDER: CefrLevel[] = ['A1', 'A2', 'B1']

/**
 * Words with progress that are due on or before `todayDay`, most-overdue
 * first (id as tiebreaker for stability). Mastered (box 5) words are
 * excluded unless `includeMastered`.
 */
export function dueWords(
  words: readonly Word[],
  progress: Record<string, WordProgress>,
  todayDay: number,
  includeMastered = false,
): Word[] {
  return words
    .filter((w) => {
      const p = progress[w.id]
      return p !== undefined && p.nextDueDay <= todayDay && (includeMastered || p.box < MAX_BOX)
    })
    .sort((a, b) => {
      const pa = progress[a.id]
      const pb = progress[b.id]
      return pa.nextDueDay - pb.nextDueDay || a.id.localeCompare(b.id)
    })
}

/**
 * The daily pack: a pure, deterministic function of (dateStr, progress).
 * Up to MAX_REVIEW due words (most overdue first, no RNG — fairness),
 * topped up with new words. New words are introduced easiest level first,
 * seeded-shuffled *within* each level so the date varies which A1 words a
 * beginner meets. If new words run out, remaining due words (even
 * mastered ones) fill the pack; a short pack is returned as a last resort.
 */
export function buildDailyPack(
  dateStr: string,
  words: readonly Word[],
  progress: Record<string, WordProgress>,
): Word[] {
  const todayDay = dayNumber(dateStr)
  const rng = createRng(dateStr)

  const reviews = dueWords(words, progress, todayDay).slice(0, MAX_REVIEW)

  const newByLevel = LEVEL_ORDER.flatMap((level) =>
    seededShuffle(
      words.filter((w) => progress[w.id] === undefined && w.cefrLevel === level),
      rng,
    ),
  )
  let pack = [...reviews, ...newByLevel.slice(0, PACK_SIZE - reviews.length)]

  if (pack.length < PACK_SIZE) {
    const chosen = new Set(pack.map((w) => w.id))
    const topUp = dueWords(words, progress, todayDay, true).filter((w) => !chosen.has(w.id))
    pack = [...pack, ...topUp.slice(0, PACK_SIZE - pack.length)]
  }

  return seededShuffle(pack, rng)
}
