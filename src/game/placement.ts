import {
  CENTER,
  SIZE,
  isBoardEmpty,
  letterOf,
  rowOf,
  type Board,
  type FormedWord,
  type Placement,
} from './board'

export type PlacementError =
  | { code: 'no-tiles' }
  | { code: 'cell-occupied'; index: number }
  | { code: 'duplicate-cell' }
  | { code: 'blank-unresolved' }
  | { code: 'not-in-line' }
  | { code: 'gap' }
  | { code: 'must-cover-center' }
  | { code: 'too-short' }
  | { code: 'disconnected' }
  | { code: 'not-a-word'; word: string }

export type GeometryResult = { ok: true; words: FormedWord[] } | { ok: false; error: PlacementError }
export type PlayResult = GeometryResult

export const PLACEMENT_ERROR_TEXT: Record<PlacementError['code'], string> = {
  'no-tiles': 'Place at least one tile',
  'cell-occupied': 'That square is taken',
  'duplicate-cell': 'Two tiles on one square',
  'blank-unresolved': 'Choose a letter for the blank',
  'not-in-line': 'Tiles must sit in one row or column',
  gap: 'No gaps — the word must be connected',
  'must-cover-center': 'The first word must cover the center square',
  'too-short': 'Words need at least 2 letters',
  disconnected: 'New words must touch the tiles already played',
  'not-a-word': 'Not in the word list',
}

/**
 * Walks the full run of filled cells through `index` along `axis`.
 * Returns null for runs shorter than 2 (a lone letter is not a word).
 */
function extractRun(
  letterAt: (i: number) => string | null,
  index: number,
  axis: 'H' | 'V',
  newIndices: ReadonlySet<number>,
): FormedWord | null {
  const step = axis === 'H' ? 1 : SIZE
  let start = index
  for (;;) {
    const prev = start - step
    if (prev < 0) break
    if (axis === 'H' && rowOf(prev) !== rowOf(start)) break
    if (letterAt(prev) === null) break
    start = prev
  }
  const cells: FormedWord['cells'] = []
  for (let i = start; i < SIZE * SIZE; i += step) {
    if (axis === 'H' && rowOf(i) !== rowOf(start)) break
    const letter = letterAt(i)
    if (letter === null) break
    cells.push({ index: i, letter, isNew: newIndices.has(i) })
  }
  if (cells.length < 2) return null
  return { word: cells.map((c) => c.letter).join(''), cells, axis, isMain: false }
}

/**
 * Pure geometry validation + word extraction (no dictionary):
 * single line → no gaps → center rule on the first play → extract the
 * main word and every cross-word → connectivity to existing tiles.
 */
export function validateGeometry(board: Board, placements: Placement[]): GeometryResult {
  const fail = (error: PlacementError): GeometryResult => ({ ok: false, error })

  if (placements.length === 0) return fail({ code: 'no-tiles' })
  const indices = placements.map((p) => p.index)
  if (new Set(indices).size !== indices.length) return fail({ code: 'duplicate-cell' })
  for (const p of placements) {
    if (board[p.index] !== null) return fail({ code: 'cell-occupied', index: p.index })
    if (p.tile.letter === '?' && (p.as === undefined || !/^[a-z]$/.test(p.as))) {
      return fail({ code: 'blank-unresolved' })
    }
  }

  const sameRow = placements.every((p) => rowOf(p.index) === rowOf(placements[0].index))
  const sameCol = placements.every((p) => p.index % SIZE === placements[0].index % SIZE)
  if (!sameRow && !sameCol) return fail({ code: 'not-in-line' })

  const placed = new Map(placements.map((p) => [p.index, letterOf(p)]))
  const newIndices = new Set(indices)
  const letterAt = (i: number): string | null => board[i]?.letter ?? placed.get(i) ?? null

  // contiguity along the shared axis (existing tiles may bridge gaps)
  const axis: 'H' | 'V' = placements.length === 1 ? 'H' : sameRow ? 'H' : 'V'
  if (placements.length > 1) {
    const step = axis === 'H' ? 1 : SIZE
    const min = Math.min(...indices)
    const max = Math.max(...indices)
    for (let i = min; i <= max; i += step) {
      if (letterAt(i) === null) return fail({ code: 'gap' })
    }
  }

  const firstPlay = isBoardEmpty(board)
  if (firstPlay && !newIndices.has(CENTER)) return fail({ code: 'must-cover-center' })

  // word extraction
  const words: FormedWord[] = []
  if (placements.length === 1) {
    const h = extractRun(letterAt, indices[0], 'H', newIndices)
    const v = extractRun(letterAt, indices[0], 'V', newIndices)
    if (h === null && v === null) return fail({ code: 'too-short' })
    const main = h !== null && (v === null || h.cells.length >= v.cells.length) ? h : v!
    main.isMain = true
    words.push(main)
    const other = main === h ? v : h
    if (other !== null) words.push(other)
  } else {
    const main = extractRun(letterAt, indices[0], axis, newIndices)
    if (main === null) return fail({ code: 'too-short' }) // unreachable given contiguity, kept as a guard
    main.isMain = true
    words.push(main)
    const cross: 'H' | 'V' = axis === 'H' ? 'V' : 'H'
    for (const p of placements) {
      const run = extractRun(letterAt, p.index, cross, newIndices)
      if (run !== null) words.push(run)
    }
  }

  if (!firstPlay && !words.some((w) => w.cells.some((c) => !c.isNew))) {
    return fail({ code: 'disconnected' })
  }

  return { ok: true, words }
}

/** Geometry plus dictionary: every formed word must pass `isWord`. */
export function validatePlay(
  board: Board,
  placements: Placement[],
  isWord: (w: string) => boolean,
): PlayResult {
  const geo = validateGeometry(board, placements)
  if (!geo.ok) return geo
  for (const w of geo.words) {
    if (!isWord(w.word)) return { ok: false, error: { code: 'not-a-word', word: w.word } }
  }
  return geo
}
