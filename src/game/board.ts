import type { Tile } from './tiles'

export const SIZE = 9
export const CENTER = Math.floor((SIZE * SIZE) / 2) // 40

/** A committed board cell. `blank` marks a helper-blank tile; `turn` is when it landed. */
export type Cell = { letter: string; blank: boolean; turn: number } | null

/** length 81; index = row * SIZE + col */
export type Board = Cell[]

export interface Placement {
  index: number
  tile: Tile
  /** resolved letter — required iff tile.letter === '?' */
  as?: string
}

export interface FormedWord {
  /** lowercase, blanks resolved */
  word: string
  cells: { index: number; letter: string; isNew: boolean }[]
  axis: 'H' | 'V'
  isMain: boolean
}

export const emptyBoard = (): Board => Array<Cell>(SIZE * SIZE).fill(null)
export const rowOf = (i: number): number => Math.floor(i / SIZE)
export const colOf = (i: number): number => i % SIZE
export const at = (row: number, col: number): number => row * SIZE + col

export function letterOf(p: Placement): string {
  return p.tile.letter === '?' ? (p.as ?? '?') : p.tile.letter
}

export function applyPlay(board: Board, placements: Placement[], turn: number): Board {
  const next = [...board]
  for (const p of placements) {
    next[p.index] = { letter: letterOf(p), blank: p.tile.letter === '?', turn }
  }
  return next
}

export function isBoardEmpty(board: Board): boolean {
  return board.every((c) => c === null)
}

export function tilesOnBoard(board: Board): number {
  return board.reduce((n, c) => n + (c !== null ? 1 : 0), 0)
}
