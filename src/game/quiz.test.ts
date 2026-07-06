import { describe, expect, it } from 'vitest'
import { createRng } from './rng'
import { buildDailySession, buildQuestion } from './quiz'
import type { CefrLevel, Word } from './types'

const mkWord = (id: string, cefrLevel: CefrLevel, emoji = `e-${id}`): Word => ({
  id,
  word: id,
  definition: `definition of ${id}`,
  emoji,
  exampleSentence: `Example with ${id}.`,
  cefrLevel,
  tags: [],
  translations: {},
})

const WORDS: Word[] = [
  ...Array.from({ length: 8 }, (_, i) => mkWord(`a1-${i}`, 'A1')),
  ...Array.from({ length: 8 }, (_, i) => mkWord(`a2-${i}`, 'A2')),
  ...Array.from({ length: 8 }, (_, i) => mkWord(`b1-${i}`, 'B1')),
]

describe('buildQuestion', () => {
  it('returns 4 unique options including the answer', () => {
    const q = buildQuestion(WORDS[0], WORDS, createRng('s'), false)
    expect(q.options).toHaveLength(4)
    expect(new Set(q.options.map((o) => o.id)).size).toBe(4)
    expect(q.options.map((o) => o.id)).toContain(WORDS[0].id)
  })

  it('draws distractors from the same CEFR level when the pool allows', () => {
    const q = buildQuestion(WORDS[0], WORDS, createRng('s'), false)
    expect(q.options.every((o) => o.cefrLevel === 'A1')).toBe(true)
  })

  it('widens the pool when the level has too few candidates', () => {
    const thin = [mkWord('a1-x', 'A1'), ...WORDS.filter((w) => w.cefrLevel === 'B1')]
    const q = buildQuestion(thin[0], thin, createRng('s'), false)
    expect(q.options).toHaveLength(4)
  })

  it('never uses a distractor sharing the answer word’s emoji', () => {
    const twin = mkWord('a1-twin', 'A1', WORDS[0].emoji)
    const pool = [...WORDS, twin]
    for (let i = 0; i < 10; i++) {
      const q = buildQuestion(WORDS[0], pool, createRng(`seed-${i}`), false)
      expect(q.options.map((o) => o.id)).not.toContain('a1-twin')
    }
  })

  it('is deterministic for the same rng seed', () => {
    const a = buildQuestion(WORDS[0], WORDS, createRng('s'), false)
    const b = buildQuestion(WORDS[0], WORDS, createRng('s'), false)
    expect(a.type).toBe(b.type)
    expect(a.options.map((o) => o.id)).toEqual(b.options.map((o) => o.id))
  })
})

describe('buildDailySession', () => {
  it('produces one question per pack word with review flags from progress', () => {
    const progress = {
      'a1-0': { box: 2, nextDueDay: 0, timesSeen: 1, timesCorrect: 1, firstSeenDay: 0 },
    }
    const session = buildDailySession('2026-07-06', WORDS, progress)
    expect(session.length).toBeGreaterThan(0)
    for (const q of session) {
      expect(q.isReview).toBe(progress[q.word.id as keyof typeof progress] !== undefined)
    }
  })

  it('is fully deterministic end to end', () => {
    const a = buildDailySession('2026-07-06', WORDS, {})
    const b = buildDailySession('2026-07-06', WORDS, {})
    expect(a.map((q) => ({ id: q.word.id, type: q.type, opts: q.options.map((o) => o.id) }))).toEqual(
      b.map((q) => ({ id: q.word.id, type: q.type, opts: q.options.map((o) => o.id) })),
    )
  })
})
