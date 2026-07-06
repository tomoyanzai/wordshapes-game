import { describe, expect, it } from 'vitest'
import { dayNumber } from './dates'
import { buildDailyPack, MAX_REVIEW, PACK_SIZE } from './pack'
import type { CefrLevel, Word, WordProgress } from './types'

const mkWord = (id: string, cefrLevel: CefrLevel): Word => ({
  id,
  word: id,
  definition: `definition of ${id}`,
  emoji: '🔤',
  exampleSentence: `Example with ${id}.`,
  cefrLevel,
  tags: [],
  translations: {},
})

const mkProgress = (nextDueDay: number, box = 2): WordProgress => ({
  box,
  nextDueDay,
  timesSeen: 1,
  timesCorrect: 1,
  firstSeenDay: nextDueDay - 2,
})

// 30 words: 10 per level
const WORDS: Word[] = (['A1', 'A2', 'B1'] as const).flatMap((lvl) =>
  Array.from({ length: 10 }, (_, i) => mkWord(`${lvl.toLowerCase()}-${i}`, lvl)),
)

const DATE = '2026-07-06'
const TODAY = dayNumber(DATE)

describe('buildDailyPack', () => {
  it('is deterministic for the same date and progress', () => {
    const progress = { 'a1-0': mkProgress(TODAY - 1), 'a2-3': mkProgress(TODAY) }
    const a = buildDailyPack(DATE, WORDS, progress)
    const b = buildDailyPack(DATE, WORDS, progress)
    expect(a.map((w) => w.id)).toEqual(b.map((w) => w.id))
  })

  it('selects different new words on different dates', () => {
    const a = buildDailyPack('2026-07-06', WORDS, {})
    const b = buildDailyPack('2026-07-07', WORDS, {})
    expect(a.map((w) => w.id)).not.toEqual(b.map((w) => w.id))
  })

  it('fills a fresh player pack with PACK_SIZE new words, all A1 when enough exist', () => {
    const pack = buildDailyPack(DATE, WORDS, {})
    expect(pack).toHaveLength(PACK_SIZE)
    expect(new Set(pack.map((w) => w.id)).size).toBe(PACK_SIZE)
    expect(pack.every((w) => w.cefrLevel === 'A1')).toBe(true)
  })

  it('includes due words up to MAX_REVIEW, most overdue first', () => {
    const progress: Record<string, WordProgress> = {}
    for (let i = 0; i < 8; i++) progress[`a1-${i}`] = mkProgress(TODAY - i)
    const pack = buildDailyPack(DATE, WORDS, progress)
    const reviewIds = pack.filter((w) => progress[w.id] !== undefined).map((w) => w.id)
    expect(reviewIds).toHaveLength(MAX_REVIEW)
    // most overdue = a1-7 (due TODAY-7) ... a1-3 (due TODAY-3)
    expect(new Set(reviewIds)).toEqual(new Set(['a1-7', 'a1-6', 'a1-5', 'a1-4', 'a1-3']))
  })

  it('excludes words that are not yet due and mastered (box 5) words', () => {
    const progress = {
      'a1-0': mkProgress(TODAY + 3),
      'a1-1': mkProgress(TODAY, 5),
    }
    const pack = buildDailyPack(DATE, WORDS, progress)
    expect(pack.map((w) => w.id)).not.toContain('a1-0')
    expect(pack.map((w) => w.id)).not.toContain('a1-1')
  })

  it('tops up with due (even mastered) words when new words run out', () => {
    const few = WORDS.slice(0, 12)
    const progress: Record<string, WordProgress> = {}
    // 11 of 12 words seen: 6 due (one mastered), 5 not due
    for (let i = 0; i < 6; i++) progress[few[i].id] = mkProgress(TODAY - 1, i === 0 ? 5 : 2)
    for (let i = 6; i < 11; i++) progress[few[i].id] = mkProgress(TODAY + 5)
    const pack = buildDailyPack(DATE, few, progress)
    expect(new Set(pack.map((w) => w.id)).size).toBe(pack.length)
    // 5 non-mastered due + 1 new + mastered top-up = 7
    expect(pack).toHaveLength(7)
    expect(pack.map((w) => w.id)).toContain(few[0].id)
  })

  it('returns an empty pack when nothing is available', () => {
    const one = WORDS.slice(0, 1)
    const progress = { [one[0].id]: mkProgress(TODAY + 3) }
    expect(buildDailyPack(DATE, one, progress)).toHaveLength(0)
  })
})
