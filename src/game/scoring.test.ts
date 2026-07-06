import { describe, expect, it } from 'vitest'
import { packBonus, pointsForAnswer } from './scoring'

describe('pointsForAnswer', () => {
  it('follows the combo table and caps at 30', () => {
    expect(pointsForAnswer(0)).toBe(10)
    expect(pointsForAnswer(1)).toBe(15)
    expect(pointsForAnswer(2)).toBe(20)
    expect(pointsForAnswer(3)).toBe(25)
    expect(pointsForAnswer(4)).toBe(30)
    expect(pointsForAnswer(9)).toBe(30)
  })
})

describe('packBonus', () => {
  it('gives the flat bonus plus extra for a perfect pack', () => {
    expect(packBonus(7, 10)).toBe(20)
    expect(packBonus(10, 10)).toBe(50)
    expect(packBonus(0, 0)).toBe(20)
  })
})
