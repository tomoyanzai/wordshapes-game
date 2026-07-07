import type { ShapeClass } from './types'

// Lowercase letterform skeleton classes — the "Bouma shape" of a word.
// tall  = ascenders that rise above x-height
// small = letters that live inside the x-height band
// tail  = descenders that drop below the baseline
const TALL = new Set('bdfhklt')
const TAIL = new Set('gjpqy')

export function shapeOf(letter: string): ShapeClass {
  if (TALL.has(letter)) return 'tall'
  if (TAIL.has(letter)) return 'tail'
  return 'small'
}

export function silhouette(word: string): ShapeClass[] {
  return [...word].map(shapeOf)
}

export const SHAPE_GLYPH: Record<ShapeClass, string> = {
  tall: '▲',
  small: '■',
  tail: '▼',
}

export function silhouetteGlyphs(word: string): string {
  return silhouette(word)
    .map((c) => SHAPE_GLYPH[c])
    .join('')
}

export const LETTERS_FOR_SHAPE: Record<ShapeClass, string> = {
  tall: 'bdfhklt',
  small: 'aceimnorsuvwxz',
  tail: 'gjpqy',
}

export const SHAPE_LABEL: Record<ShapeClass, string> = {
  tall: 'a tall letter (b d f h k l t)',
  small: 'a small letter (no stem, no tail)',
  tail: 'a letter with a tail (g j p q y)',
}
