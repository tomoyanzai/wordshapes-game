import { describe, expect, it } from 'vitest'
import { dateStringFromDayNumber, dayNumber } from './dates'
import { generateDay, GOALS_TO_WIN } from './generate'
import { GOALS, GOALS_BY_ID } from './goals'
import { BAG_SIZE, RACK_SIZE, RARE_LETTERS, TILE_DISTRIBUTION, VOWELS } from './tiles'

describe('tile distribution', () => {
  it('sums to exactly 60 with no Q or V', () => {
    expect(Object.values(TILE_DISTRIBUTION).reduce((a, b) => a + b, 0)).toBe(BAG_SIZE)
    expect(TILE_DISTRIBUTION['q']).toBeUndefined()
    expect(TILE_DISTRIBUTION['v']).toBeUndefined()
  })
})

describe('generateDay', () => {
  it('is deterministic for the same date', () => {
    const a = generateDay('2026-07-15')
    const b = generateDay('2026-07-15')
    expect(a.bag.map((t) => t.id)).toEqual(b.bag.map((t) => t.id))
    expect(a.goalIds).toEqual(b.goalIds)
  })

  it('differs across dates', () => {
    expect(generateDay('2026-07-15').goalIds).not.toEqual(generateDay('2026-07-16').goalIds)
  })

  it('holds all structural invariants across 365 consecutive dates', () => {
    const start = dayNumber('2026-07-07')
    for (let d = 0; d < 365; d++) {
      const dateStr = dateStringFromDayNumber(start + d)
      const { bag, goalIds } = generateDay(dateStr)

      // bag is a permutation of the base bag
      expect(bag, dateStr).toHaveLength(BAG_SIZE)
      expect(new Set(bag.map((t) => t.id)).size, dateStr).toBe(BAG_SIZE)

      // opening rack smoothing
      const rack = bag.slice(0, RACK_SIZE)
      const vowels = rack.filter((t) => VOWELS.has(t.letter)).length
      expect(vowels, `${dateStr} rack vowels`).toBeGreaterThanOrEqual(2)
      expect(vowels, `${dateStr} rack vowels`).toBeLessThanOrEqual(3)
      expect(rack.filter((t) => RARE_LETTERS.has(t.letter)).length, `${dateStr} rack rares`).toBeLessThanOrEqual(1)
      const counts: Record<string, number> = {}
      for (const t of rack) counts[t.letter] = (counts[t.letter] ?? 0) + 1
      expect(Math.max(...Object.values(counts)), `${dateStr} rack triples`).toBeLessThanOrEqual(2)

      // goal list covers the whole catalog with the day's 8 up front
      expect(goalIds, dateStr).toHaveLength(GOALS.length)
      expect(new Set(goalIds).size, dateStr).toBe(GOALS.length)
      const day = goalIds.slice(0, GOALS_TO_WIN).map((id) => GOALS_BY_ID.get(id)!)
      expect(day.filter((g) => g.difficulty === 1).length, `${dateStr} easies`).toBeGreaterThanOrEqual(3)
      expect(day.filter((g) => g.difficulty === 3).length, `${dateStr} hards`).toBeLessThanOrEqual(1)
      expect(day.filter((g) => g.category === 'semantic').length, `${dateStr} semantic`).toBeLessThanOrEqual(2)
      expect(day.filter((g) => g.category === 'shape').length, `${dateStr} shape`).toBeLessThanOrEqual(2)
      expect(day.filter((g) => g.id === 'len6' || g.id === 'len7').length, `${dateStr} big-len`).toBeLessThanOrEqual(1)

      // easiest-first: the visible opening 3 contain no difficulty-3 goal
      expect(day.slice(0, 3).every((g) => g.difficulty < 3), `${dateStr} opening`).toBe(true)

      // rare-letter nudge: if drawn, a J/K/X/Z sits in the first 30 tiles
      if (goalIds.slice(0, GOALS_TO_WIN).includes('rare-letter')) {
        expect(bag.slice(0, 30).some((t) => RARE_LETTERS.has(t.letter)), `${dateStr} rare nudge`).toBe(true)
      }
    }
  })
})
