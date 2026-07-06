import { describe, expect, it } from 'vitest'
import { createRng, sample, seededShuffle } from './rng'

describe('createRng', () => {
  it('produces an identical sequence for the same seed', () => {
    const a = createRng('2026-07-06')
    const b = createRng('2026-07-06')
    for (let i = 0; i < 20; i++) expect(a()).toBe(b())
  })

  it('produces different sequences for different seeds', () => {
    const a = createRng('2026-07-06')
    const b = createRng('2026-07-07')
    const seqA = Array.from({ length: 10 }, () => a())
    const seqB = Array.from({ length: 10 }, () => b())
    expect(seqA).not.toEqual(seqB)
  })

  it('stays within [0, 1)', () => {
    const rng = createRng('bounds')
    for (let i = 0; i < 100; i++) {
      const v = rng()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })
})

describe('seededShuffle', () => {
  const items = ['a', 'b', 'c', 'd', 'e', 'f', 'g']

  it('is a permutation and does not mutate the input', () => {
    const copy = [...items]
    const out = seededShuffle(items, createRng('x'))
    expect(items).toEqual(copy)
    expect([...out].sort()).toEqual([...items].sort())
  })

  it('is deterministic for the same seed', () => {
    expect(seededShuffle(items, createRng('s'))).toEqual(seededShuffle(items, createRng('s')))
  })
})

describe('sample', () => {
  it('returns n distinct items from the array', () => {
    const out = sample([1, 2, 3, 4, 5], 3, createRng('s'))
    expect(out).toHaveLength(3)
    expect(new Set(out).size).toBe(3)
  })
})
