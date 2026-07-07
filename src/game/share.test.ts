import { describe, expect, it } from 'vitest'
import { shareText } from './share'

describe('shareText', () => {
  it('renders the header, silhouette row, and one emoji row per guess', () => {
    const text = shareText(7, ['gust', 'dusk'], 'dusk', true)
    expect(text).toBe(['WordShapes #7 2/6', '▲■■▲', '⬛🟩🟩⬛', '🟩🟩🟩🟩'].join('\n'))
  })

  it('grid rows are spoiler-free — no letters below the header line', () => {
    const [, ...rows] = shareText(3, ['snug', 'gust'], 'dusk', false).split('\n')
    for (const row of rows) expect(row).not.toMatch(/[a-z]/i)
  })

  it('shows X/6 for a loss', () => {
    const text = shareText(3, ['gust', 'gust', 'gust', 'gust', 'gust', 'gust'], 'dusk', false)
    expect(text.startsWith('WordShapes #3 X/6')).toBe(true)
  })
})
