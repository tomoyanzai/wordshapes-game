import { describe, expect, it } from 'vitest'
import { LETTERS_FOR_SHAPE, shapeOf, silhouette, silhouetteGlyphs } from './shapes'

describe('shapeOf', () => {
  it('classifies ascenders, descenders and x-height letters', () => {
    for (const ch of 'bdfhklt') expect(shapeOf(ch), ch).toBe('tall')
    for (const ch of 'gjpqy') expect(shapeOf(ch), ch).toBe('tail')
    for (const ch of 'aceimnorsuvwxz') expect(shapeOf(ch), ch).toBe('small')
  })

  it('covers all 26 letters exactly once across the keyboard groups', () => {
    const all = LETTERS_FOR_SHAPE.tall + LETTERS_FOR_SHAPE.small + LETTERS_FOR_SHAPE.tail
    expect([...all].sort().join('')).toBe('abcdefghijklmnopqrstuvwxyz')
  })
})

describe('silhouette', () => {
  it('maps "bed" to tall-small-tall (the bed with two posts)', () => {
    expect(silhouette('bed')).toEqual(['tall', 'small', 'tall'])
  })

  it('maps "ooze" and "lanky" correctly', () => {
    expect(silhouette('ooze')).toEqual(['small', 'small', 'small', 'small'])
    expect(silhouette('lanky')).toEqual(['tall', 'small', 'small', 'tall', 'tail'])
  })
})

describe('silhouetteGlyphs', () => {
  it('renders the share-row glyphs', () => {
    expect(silhouetteGlyphs('bed')).toBe('▲■▲')
    expect(silhouetteGlyphs('gully')).toBe('▼■▲▲▼')
  })
})
