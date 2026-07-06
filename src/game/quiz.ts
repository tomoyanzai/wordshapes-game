import { buildDailyPack } from './pack'
import { createRng, sample, seededShuffle, type Rng } from './rng'
import type { Question, Word, WordProgress } from './types'

/**
 * One multiple-choice question: seeded 50/50 direction flip, 3 distractors
 * from the same CEFR level when the pool allows (never sharing the
 * answer's emoji or definition — they'd be visually ambiguous), widening
 * to the whole dataset when it doesn't.
 */
export function buildQuestion(
  word: Word,
  allWords: readonly Word[],
  rng: Rng,
  isReview: boolean,
): Question {
  const type = rng() < 0.5 ? 'defToWord' : 'wordToDef'
  const usable = (w: Word) =>
    w.id !== word.id && w.emoji !== word.emoji && w.definition !== word.definition
  let pool = allWords.filter((w) => usable(w) && w.cefrLevel === word.cefrLevel)
  if (pool.length < 3) pool = allWords.filter(usable)
  const distractors = sample(pool, 3, rng)
  return { type, word, options: seededShuffle([word, ...distractors], rng), isReview }
}

/**
 * The whole day's quiz as one deterministic sequence: pack selection and
 * question generation are both pure functions of (dateStr, progress).
 */
export function buildDailySession(
  dateStr: string,
  allWords: readonly Word[],
  progress: Record<string, WordProgress>,
): Question[] {
  const pack = buildDailyPack(dateStr, allWords, progress)
  const rng = createRng(`${dateStr}:questions`)
  return pack.map((w) => buildQuestion(w, allWords, rng, progress[w.id] !== undefined))
}
