import { describe, expect, it } from 'vitest'
import { createRng, sample, seededShuffle } from './rng'

describe('createRng', () => {
  it('produces an identical sequence for the same seed', () => {
    const a = createRng('wordgather:2026-07-10')
    const b = createRng('wordgather:2026-07-10')
    for (let i = 0; i < 20; i++) expect(a()).toBe(b())
  })

  it('produces different sequences for different seeds', () => {
    const a = createRng('2026-07-10')
    const b = createRng('2026-07-11')
    expect(Array.from({ length: 10 }, () => a())).not.toEqual(Array.from({ length: 10 }, () => b()))
  })
})

describe('seededShuffle / sample', () => {
  const items = ['a', 'b', 'c', 'd', 'e', 'f', 'g']

  it('is a deterministic permutation that does not mutate input', () => {
    const copy = [...items]
    const out = seededShuffle(items, createRng('x'))
    expect(items).toEqual(copy)
    expect([...out].sort()).toEqual([...items].sort())
    expect(out).toEqual(seededShuffle(items, createRng('x')))
  })

  it('sample returns n distinct items', () => {
    const out = sample(items, 3, createRng('s'))
    expect(out).toHaveLength(3)
    expect(new Set(out).size).toBe(3)
  })
})
