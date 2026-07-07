export interface Tile {
  /** stable per-day id, e.g. "t17" (bag position at generation time) */
  id: string
  /** 'a'..'z', or '?' for a blank created by the Blank helper */
  letter: string
}

// 60 tiles: Scrabble's distribution scaled down for a 9×9 goal game.
// Q and V are dropped deliberately — with no scoring there is no upside
// to their pain, and neither has friendly 2-letter crossings. Blanks are
// not in the bag; the Blank helper is the only source.
export const TILE_DISTRIBUTION: Record<string, number> = {
  a: 5, b: 1, c: 2, d: 2, e: 6, f: 1, g: 2, h: 2, i: 4, j: 1, k: 1, l: 3,
  m: 2, n: 4, o: 4, p: 2, r: 4, s: 3, t: 4, u: 2, w: 1, x: 1, y: 2, z: 1,
}

export const BAG_SIZE = 60
export const RACK_SIZE = 6

/** The unshuffled bag, in stable alphabetical order (shuffled per day by seed). */
export function baseBag(): Tile[] {
  const tiles: Tile[] = []
  for (const [letter, count] of Object.entries(TILE_DISTRIBUTION)) {
    for (let i = 0; i < count; i++) tiles.push({ id: `t${tiles.length}`, letter })
  }
  return tiles
}

export const VOWELS = new Set('aeiou')
export const RARE_LETTERS = new Set('jkxz')
