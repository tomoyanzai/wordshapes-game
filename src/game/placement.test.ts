import { describe, expect, it } from 'vitest'
import { applyPlay, at, emptyBoard, type Board, type Placement } from './board'
import { validateGeometry, validatePlay } from './placement'
import type { Tile } from './tiles'

// ---- fixtures ----
let nextId = 0
const t = (letter: string): Tile => ({ id: `x${nextId++}`, letter })
const pl = (index: number, letter: string, as?: string): Placement =>
  letter === '?' ? { index, tile: t('?'), as } : { index, tile: t(letter) }

/** boardFrom(['.........', '...cat...', ...]) — 9 rows of 9 chars, '.' = empty */
function boardFrom(rows: string[]): Board {
  const board = emptyBoard()
  rows.forEach((row, r) => {
    ;[...row].forEach((ch, c) => {
      if (ch !== '.') board[at(r, c)] = { letter: ch, blank: false, turn: 0 }
    })
  })
  return board
}

const CAT_ROW4 = boardFrom(['.........', '.........', '.........', '.........', '...cat...', '.........', '.........', '.........', '.........'])
// "cat" occupies (4,3)=39 (4,4)=40 (4,5)=41

const words = (r: ReturnType<typeof validateGeometry>) =>
  r.ok ? r.words.map((w) => w.word).sort() : r.error.code
const mainOf = (r: ReturnType<typeof validateGeometry>) =>
  r.ok ? r.words.find((w) => w.isMain)!.word : null

// ---- first play ----
describe('first play', () => {
  it('accepts a horizontal word covering center', () => {
    const r = validateGeometry(emptyBoard(), [pl(39, 'c'), pl(40, 'a'), pl(41, 't')])
    expect(words(r)).toEqual(['cat'])
    expect(mainOf(r)).toBe('cat')
  })

  it('accepts a vertical word through center', () => {
    const r = validateGeometry(emptyBoard(), [pl(at(3, 4), 'g'), pl(40, 'o')])
    expect(words(r)).toEqual(['go'])
  })

  it('rejects a first play missing the center square', () => {
    const r = validateGeometry(emptyBoard(), [pl(0, 'g'), pl(1, 'o')])
    expect(words(r)).toBe('must-cover-center')
  })

  it('rejects a single tile as the first play', () => {
    const r = validateGeometry(emptyBoard(), [pl(40, 'a')])
    expect(words(r)).toBe('too-short')
  })
})

// ---- basic input errors ----
describe('input errors', () => {
  it('rejects an empty placement list', () => {
    expect(words(validateGeometry(CAT_ROW4, []))).toBe('no-tiles')
  })

  it('rejects placing onto an occupied cell', () => {
    expect(words(validateGeometry(CAT_ROW4, [pl(40, 'x')]))).toBe('cell-occupied')
  })

  it('rejects two tiles on one square', () => {
    expect(words(validateGeometry(CAT_ROW4, [pl(42, 's'), pl(42, 'o')]))).toBe('duplicate-cell')
  })

  it('rejects an unresolved blank', () => {
    expect(words(validateGeometry(CAT_ROW4, [pl(42, '?')]))).toBe('blank-unresolved')
  })

  it('rejects diagonal placements', () => {
    const r = validateGeometry(CAT_ROW4, [pl(at(5, 3), 'o'), pl(at(6, 4), 'n')])
    expect(words(r)).toBe('not-in-line')
  })

  it('rejects a gap in the same column', () => {
    const r = validateGeometry(CAT_ROW4, [pl(at(0, 0), 'g'), pl(at(2, 0), 'o')])
    expect(words(r)).toBe('gap')
  })

  it('rejects a genuine gap in the same row', () => {
    const r = validateGeometry(CAT_ROW4, [pl(at(2, 1), 'g'), pl(at(2, 3), 'o')])
    expect(words(r)).toBe('gap')
  })

  it('accepts a gap bridged by an existing tile', () => {
    // s..cat..s? place s at (4,2) and s at (4,6): span covers cat → "scats"
    const r = validateGeometry(CAT_ROW4, [pl(at(4, 2), 's'), pl(at(4, 6), 's')])
    expect(words(r)).toEqual(['scats'])
  })
})

// ---- extension & connectivity ----
describe('extension and connectivity', () => {
  it('extends a word at the tail', () => {
    const r = validateGeometry(CAT_ROW4, [pl(at(4, 6), 's')])
    expect(words(r)).toEqual(['cats'])
    expect(mainOf(r)).toBe('cats')
  })

  it('extends a word at the head', () => {
    const r = validateGeometry(CAT_ROW4, [pl(at(4, 2), 's')])
    expect(words(r)).toEqual(['scat'])
  })

  it('extends at both ends in one play', () => {
    const r = validateGeometry(CAT_ROW4, [pl(at(4, 2), 's'), pl(at(4, 6), 's')])
    expect(words(r)).toEqual(['scats'])
  })

  it('rejects a disconnected island', () => {
    const r = validateGeometry(CAT_ROW4, [pl(at(0, 0), 'g'), pl(at(0, 1), 'o')])
    expect(words(r)).toBe('disconnected')
  })

  it('rejects a word only touching diagonally', () => {
    const r = validateGeometry(CAT_ROW4, [pl(at(5, 6), 'g'), pl(at(5, 7), 'o')])
    expect(words(r)).toBe('disconnected')
  })

  it('accepts a parallel play connected via cross-words, extracting all of them', () => {
    // under "cat": place "on" at (5,4),(5,5) → main "on", crosses "ao" and "tn"
    const r = validateGeometry(CAT_ROW4, [pl(at(5, 4), 'o'), pl(at(5, 5), 'n')])
    expect(words(r)).toEqual(['ao', 'on', 'tn'])
    expect(mainOf(r)).toBe('on')
    if (r.ok) {
      const cross = r.words.find((w) => w.word === 'ao')!
      expect(cross.axis).toBe('V')
      expect(cross.cells.map((c) => c.isNew)).toEqual([false, true])
    }
  })

  it('a vertical play crossing through an existing word connects', () => {
    // vertical word through the 'a' of cat: (3,4)=g above, a=(4,4) existing, (5,4)=s below → "gas"
    const r = validateGeometry(CAT_ROW4, [pl(at(3, 4), 'g'), pl(at(5, 4), 's')])
    expect(words(r)).toEqual(['gas'])
    if (r.ok) expect(r.words[0].cells.map((c) => c.isNew)).toEqual([true, false, true])
  })
})

// ---- single-tile plays ----
describe('single-tile plays', () => {
  it('a single tile forming words on both axes marks the longer as main', () => {
    // board: "ca" at (4,3),(4,4) and "t" at (3,5). Place 't' at (4,5):
    // H run = "cat" (3 cells), V run = "tt" (2 cells) → main "cat"
    const board = boardFrom(['.........', '.........', '.........', '.....t...', '...ca....', '.........', '.........', '.........', '.........'])
    const r = validateGeometry(board, [pl(at(4, 5), 't')])
    expect(words(r)).toEqual(['cat', 'tt'])
    expect(mainOf(r)).toBe('cat')
  })

  it('rejects a single tile that forms no 2+ letter word', () => {
    const board = CAT_ROW4
    const r = validateGeometry(board, [pl(at(6, 5), 'x')]) // two rows below, isolated
    expect(words(r)).toBe('too-short')
  })
})

// ---- blanks ----
describe('blank tiles', () => {
  it('a resolved blank contributes its chosen letter to the word', () => {
    const r = validateGeometry(CAT_ROW4, [pl(at(4, 6), '?', 's')])
    expect(words(r)).toEqual(['cats'])
  })

  it('applyPlay records the blank flag and turn number', () => {
    const next = applyPlay(CAT_ROW4, [pl(at(4, 6), '?', 's')], 3)
    expect(next[at(4, 6)]).toEqual({ letter: 's', blank: true, turn: 3 })
    expect(CAT_ROW4[at(4, 6)]).toBeNull() // original untouched
  })
})

// ---- board edges / wrap guards ----
describe('edges and wrap guards', () => {
  it('extends a word hugging the top-right corner without wrapping', () => {
    const board = boardFrom(['.......at', '.........', '.........', '.........', '...cat...', '.........', '.........', '.........', '.........'])
    const r = validateGeometry(board, [pl(at(0, 6), 'r')])
    expect(words(r)).toEqual(['rat'])
    if (r.ok) expect(r.words[0].cells.map((c) => c.index)).toEqual([at(0, 6), at(0, 7), at(0, 8)])
  })

  it('a horizontal run never wraps across rows', () => {
    // tiles at (0,7),(0,8) and an existing tile at (1,0) — run must not leak to index 9
    const board = boardFrom(['.........', 'x........', '.........', '.........', '...cat...', '.........', '.........', '.........', '.........'])
    const r = validateGeometry(board, [pl(at(0, 7), 'g'), pl(at(0, 8), 'o')])
    expect(words(r)).toBe('disconnected') // and critically NOT a 3-letter word "gox"
  })

  it('a vertical word can run the full board height', () => {
    const board = emptyBoard()
    const placements = Array.from({ length: 9 }, (_, r) => pl(at(r, 4), 'a'))
    const res = validateGeometry(board, placements)
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.words[0].word).toBe('aaaaaaaaa')
  })
})

// ---- dictionary layer ----
describe('validatePlay', () => {
  const DICT = new Set(['cat', 'cats', 'on', 'an', 'tn', 'gas'])
  const isWord = (w: string) => DICT.has(w)

  it('passes when every formed word is in the dictionary', () => {
    const r = validatePlay(CAT_ROW4, [pl(at(4, 6), 's')], isWord)
    expect(words(r)).toEqual(['cats'])
  })

  it('rejects the play when one cross-word is invalid, naming it', () => {
    // "on" under "at": crosses "ao" (invalid) and "tn" (valid in toy dict)
    const r = validatePlay(CAT_ROW4, [pl(at(5, 4), 'o'), pl(at(5, 5), 'n')], isWord)
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toEqual({ code: 'not-a-word', word: 'ao' })
  })

  it('rejects an invalid main word', () => {
    const r = validatePlay(emptyBoard(), [pl(39, 'z'), pl(40, 'z')], isWord)
    if (!r.ok) expect(r.error.code).toBe('not-a-word')
  })
})
