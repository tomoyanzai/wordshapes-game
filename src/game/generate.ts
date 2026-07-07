import { GOALS, type GoalCard } from './goals'
import { createRng, seededShuffle } from './rng'
import { baseBag, RACK_SIZE, RARE_LETTERS, VOWELS, type Tile } from './tiles'

export const GOALS_TO_WIN = 8
export const TURN_BUDGET = 12
export const VISIBLE_GOALS = 3

export interface DaySetup {
  /** shuffled + smoothed draw order; rack = first RACK_SIZE tiles */
  bag: Tile[]
  /** the day's 8 goals first, then the reroll reserve, all in draw order */
  goalIds: string[]
}

const isVowel = (t: Tile) => VOWELS.has(t.letter)
const isRare = (t: Tile) => RARE_LETTERS.has(t.letter)

/**
 * Deterministic opening-rack smoothing: the first RACK_SIZE tiles must
 * have 2–3 vowels, ≤1 rare letter (J/K/X/Z), and no letter three times.
 * Offenders swap with the last suitable donor scanning from the bag's
 * end — same input, same output, everywhere.
 */
function smoothOpening(bag: Tile[]): void {
  const swapWithDonor = (rackIdx: number, donorOk: (t: Tile) => boolean): boolean => {
    for (let d = bag.length - 1; d >= RACK_SIZE; d--) {
      if (donorOk(bag[d])) {
        ;[bag[rackIdx], bag[d]] = [bag[d], bag[rackIdx]]
        return true
      }
    }
    return false
  }

  for (let guard = 0; guard < 20; guard++) {
    const rack = bag.slice(0, RACK_SIZE)
    const vowels = rack.filter(isVowel).length
    const rares = rack.filter(isRare).length
    const counts: Record<string, number> = {}
    for (const t of rack) counts[t.letter] = (counts[t.letter] ?? 0) + 1
    const tripled = Object.entries(counts).find(([, n]) => n >= 3)?.[0]

    if (vowels < 2) {
      const i = rack.findIndex((t) => !isVowel(t))
      if (!swapWithDonor(i, isVowel)) break
    } else if (vowels > 3) {
      const i = rack.findIndex(isVowel)
      if (!swapWithDonor(i, (t) => !isVowel(t) && !isRare(t))) break
    } else if (rares > 1) {
      const i = rack.findIndex(isRare)
      if (!swapWithDonor(i, (t) => !isRare(t) && !isVowel(t))) break
    } else if (tripled !== undefined) {
      const i = rack.findIndex((t) => t.letter === tripled)
      const sameVowelness = isVowel(rack[i])
      // prefer a donor that keeps the vowel balance intact
      if (!swapWithDonor(i, (t) => t.letter !== tripled && !isRare(t) && isVowel(t) === sameVowelness)) {
        if (!swapWithDonor(i, (t) => t.letter !== tripled && !isRare(t))) break
      }
    } else {
      break
    }
  }
}

/**
 * Draw the day's 8 goals from a seeded shuffle of the catalog under the
 * balance constraints, ordered easiest-first so the opening 3 are never
 * a wall. The unpicked remainder (same shuffled order) follows as the
 * reroll reserve.
 */
function drawGoals(shuffled: GoalCard[]): string[] {
  const isBigLen = (g: GoalCard) => g.id === 'len6' || g.id === 'len7'
  const violatesQuota = (g: GoalCard, others: GoalCard[]): boolean =>
    (g.difficulty === 3 && others.filter((p) => p.difficulty === 3).length >= 1) ||
    (g.category === 'semantic' && others.filter((p) => p.category === 'semantic').length >= 2) ||
    (g.category === 'shape' && others.filter((p) => p.category === 'shape').length >= 2) ||
    (isBigLen(g) && others.some(isBigLen))

  const picked: GoalCard[] = []
  const rest: GoalCard[] = []
  for (const g of shuffled) {
    if (picked.length >= GOALS_TO_WIN || violatesQuota(g, picked)) rest.push(g)
    else picked.push(g)
  }

  // guarantee ≥3 easy goals: swap the hardest picks for unpicked easies
  // that still respect every quota once the victim is removed
  while (picked.filter((p) => p.difficulty === 1).length < 3) {
    const victimIdx = picked
      .map((p) => p.difficulty)
      .lastIndexOf(Math.max(...picked.map((p) => p.difficulty)) as 1 | 2 | 3)
    const without = picked.filter((_, i) => i !== victimIdx)
    const donor = rest.find((g) => g.difficulty === 1 && !violatesQuota(g, without))
    if (donor === undefined) break
    rest.splice(rest.indexOf(donor), 1)
    rest.unshift(picked[victimIdx])
    picked[victimIdx] = donor
  }

  // easiest-first ordering (stable) so the visible 3 start friendly
  const ordered = [...picked].sort((a, b) => a.difficulty - b.difficulty)
  return [...ordered, ...rest].map((g) => g.id)
}

/** If the rare-letter goal is in the day's 8, a J/K/X/Z tile must appear in the first 30 draws. */
function nudgeRareLetter(bag: Tile[], goalIds: string[]): void {
  if (!goalIds.slice(0, GOALS_TO_WIN).includes('rare-letter')) return
  const horizon = Math.min(30, bag.length)
  if (bag.slice(0, horizon).some(isRare)) return
  const src = bag.findIndex(isRare)
  if (src === -1) return
  ;[bag[horizon - 1], bag[src]] = [bag[src], bag[horizon - 1]]
}

export function generateDay(dateStr: string): DaySetup {
  const rng = createRng(`wordgather:${dateStr}`)
  const bag = seededShuffle(baseBag(), rng)
  smoothOpening(bag)
  const goalIds = drawGoals(seededShuffle(GOALS, rng))
  nudgeRareLetter(bag, goalIds)
  return { bag, goalIds }
}
