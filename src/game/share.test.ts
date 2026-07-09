import { describe, expect, it } from 'vitest'
import { shareText } from './share'
import { PUZZLES } from '../data/puzzles'
import type { Tier } from './types'

const [winter] = PUZZLES

describe('shareText', () => {
  it('renders a mixed probe sequence for a win', () => {
    const tiers: Tier[] = ['joins-it', 'same-world', 'far-away']
    const text = shareText(1, winter, tiers, true)
    expect(text).toBe('Twenty Words #1 🧭\n🟩🟨⬜ → ✅')
  })

  it('renders a loss', () => {
    const tiers: Tier[] = ['same-world', 'same-world']
    const text = shareText(7, winter, tiers, false)
    expect(text).toBe('Twenty Words #7 🧭\n🟨🟨 → ❌')
  })

  it('always uses the neutral compass, never a secret-themed emoji, regardless of the puzzle', () => {
    for (const puzzle of PUZZLES) {
      const text = shareText(1, puzzle, [], true)
      expect(text.split('\n')[0]).toBe('Twenty Words #1 🧭')
    }
  })

  it('renders a bare arrow when zero probes were used', () => {
    expect(shareText(2, winter, [], true)).toBe('Twenty Words #2 🧭\n→ ✅')
    expect(shareText(2, winter, [], false)).toBe('Twenty Words #2 🧭\n→ ❌')
  })

  it('never leaks the secret word or clue', () => {
    const text = shareText(4, winter, ['joins-it', 'joins-it'], true)
    expect(text.toLowerCase()).not.toContain(winter.secret)
  })
})
