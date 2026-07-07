import { describe, expect, it } from 'vitest'
import { applyPlay, at, emptyBoard, type Board, type Placement } from './board'
import { buildContext, GOALS, type PlayContext } from './goals'
import { validateGeometry } from './placement'
import type { Tile } from './tiles'

// Contexts are built through the REAL placement engine so the goal
// contract stays honest (geometry, isMain, isNew flags all authentic).

let nextId = 0
const t = (letter: string): Tile => ({ id: `g${nextId++}`, letter })
const pl = (index: number, letter: string): Placement => ({ index, tile: t(letter) })

function boardFrom(rows: string[]): Board {
  const board = emptyBoard()
  rows.forEach((row, r) => {
    ;[...row].forEach((ch, c) => {
      if (ch !== '.') board[at(r, c)] = { letter: ch, blank: false, turn: 0 }
    })
  })
  return board
}

function ctxOf(board: Board, placements: Placement[], turn = 1): PlayContext {
  const geo = validateGeometry(board, placements)
  if (!geo.ok) throw new Error(`test scenario invalid: ${geo.error.code}`)
  return buildContext(board, applyPlay(board, placements, turn), geo.words, placements, turn)
}

const CAT = boardFrom(['.........', '.........', '.........', '.........', '...cat...', '.........', '.........', '.........', '.........'])
const rowPlay = (word: string, row: number, startCol: number, board = emptyBoard()) =>
  ctxOf(board, [...word].map((ch, i) => pl(at(row, startCol + i), ch)))

// Each context, and exactly which goal ids it should clear.
const CONTEXTS: Record<string, { ctx: PlayContext; clears: string[] }> = {
  zebra: {
    ctx: rowPlay('zebra', 4, 2), // first play through center
    clears: ['len5', 'rare-letter', 'no-repeats', 'animal', 'center-line', 'big-spend', 'symmetric'],
  },
  cheese: {
    ctx: rowPlay('cheese', 4, 2),
    clears: ['len5', 'len6', 'double-letter', 'three-vowels', 'digraph', 'food', 'center-line', 'big-spend'],
  },
  lettuce: {
    ctx: rowPlay('lettuce', 4, 2), // 7 letters, reaches col 8
    clears: ['len5', 'len6', 'len7', 'double-letter', 'three-vowels', 'food', 'center-line', 'big-spend', 'skyline', 'edge'],
  },
  arose: {
    ctx: rowPlay('arose', 4, 2),
    clears: ['len5', 'no-repeats', 'vowel-start', 'three-vowels', 'flat', 'center-line', 'big-spend'],
  },
  little: {
    ctx: rowPlay('little', 4, 2),
    clears: ['len5', 'len6', 'double-letter', 'skyline', 'center-line', 'big-spend'],
  },
  jolly: {
    ctx: rowPlay('jolly', 4, 4), // center → right edge (col 8)
    clears: ['len5', 'rare-letter', 'double-letter', 'one-vowel', 'tails', 'edge', 'center-line', 'big-spend'],
  },
  elbow: {
    ctx: rowPlay('elbow', 4, 2),
    clears: ['len5', 'no-repeats', 'vowel-start', 'body', 'center-line', 'big-spend'],
  },
  amber: {
    // a-m-b-e-r silhouette is ■■▲■■ — a genuine palindrome with 2 classes
    ctx: rowPlay('amber', 4, 2),
    clears: ['len5', 'no-repeats', 'vowel-start', 'color', 'center-line', 'big-spend', 'symmetric'],
  },
  leaf: {
    // l-e-a-f is ▲■■▲ — symmetric too
    ctx: rowPlay('leaf', 4, 2),
    clears: ['nature', 'center-line', 'symmetric'],
  },
  catsHook: {
    // extend cat → cats: main word reuses board tiles; one vowel, 4 letters
    ctx: ctxOf(CAT, [pl(at(4, 6), 's')]),
    clears: ['hook', 'center-line', 'one-vowel'],
  },
  gasVertical: {
    // vertical through the a of cat; "gas" is a little word
    ctx: ctxOf(CAT, [pl(at(3, 4), 'g'), pl(at(5, 4), 's')]),
    clears: ['hook', 'vertical', 'center-line', 'short'],
  },
  onParallel: {
    // "on" under cat → words: on, ao, tn; main "on" sits on the center column
    ctx: ctxOf(CAT, [pl(at(5, 4), 'o'), pl(at(5, 5), 'n')]),
    clears: ['short', 'multi-word', 'crossroads', 'vowel-start', 'center-line'],
  },
  gagParallel: {
    // "gag" hanging off the t of cat, away from the center row/column →
    // words: gag + cross tg. The only context clearing nothing central.
    ctx: ctxOf(CAT, [pl(at(5, 5), 'g'), pl(at(5, 6), 'a'), pl(at(5, 7), 'g')]),
    clears: ['short', 'multi-word', 'bookends', 'tails'],
  },
}

describe('goal catalog', () => {
  it('has exactly 28 goals with unique ids', () => {
    expect(GOALS).toHaveLength(28)
    expect(new Set(GOALS.map((g) => g.id)).size).toBe(28)
  })

  it('difficulty spread supports the deck constraints (≥3 easy exists, etc.)', () => {
    expect(GOALS.filter((g) => g.difficulty === 1).length).toBeGreaterThanOrEqual(8)
    expect(GOALS.filter((g) => g.difficulty === 3).length).toBeLessThanOrEqual(4)
  })

  for (const g of GOALS) {
    it(`"${g.id}" passes and fails on the expected contexts`, () => {
      const passing = Object.entries(CONTEXTS).filter(([, c]) => c.clears.includes(g.id))
      const failing = Object.entries(CONTEXTS).filter(([, c]) => !c.clears.includes(g.id))
      expect(passing.length, `goal ${g.id} needs ≥1 passing context`).toBeGreaterThan(0)
      expect(failing.length, `goal ${g.id} needs ≥1 failing context`).toBeGreaterThan(0)
      for (const [name, c] of passing) {
        expect(g.check(c.ctx), `${g.id} should PASS on ${name} (words: ${c.ctx.words.join(',')})`).toBe(true)
      }
      for (const [name, c] of failing) {
        expect(g.check(c.ctx), `${g.id} should FAIL on ${name} (words: ${c.ctx.words.join(',')})`).toBe(false)
      }
    })
  }
})
