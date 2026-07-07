import { describe, expect, it } from 'vitest'
import { evaluateGuess, keyStates } from './feedback'

describe('evaluateGuess', () => {
  it('marks exact and misplaced letters', () => {
    expect(evaluateGuess('gust', 'dusk')).toEqual(['miss', 'hit', 'hit', 'miss'])
    expect(evaluateGuess('dusk', 'dusk')).toEqual(['hit', 'hit', 'hit', 'hit'])
  })

  it('marks a present-but-misplaced letter as near', () => {
    // s appears in "dusk" but not at position 0
    expect(evaluateGuess('snug', 'dusk')[0]).toBe('near')
  })

  it('does not over-mark duplicate letters in the guess', () => {
    // answer has one o; guess "oooo" gets exactly one hit at the o position, rest miss
    expect(evaluateGuess('ooze', 'loom')).toEqual(['near', 'hit', 'miss', 'miss'])
  })

  it('exact matches claim letters before near marks', () => {
    // answer "hollo w/o w" style duplicate: answer 'hollow' has two o and two l
    expect(evaluateGuess('wobble', 'hollow')).toEqual(['near', 'hit', 'miss', 'miss', 'near', 'miss'])
  })

  it('limits near marks to the number of unclaimed copies', () => {
    // answer "abyss": one a. guess "banana": one near for the first misplaced a... length mismatch, use same length
    expect(evaluateGuess('sassy', 'abyss')).toEqual(['near', 'near', 'miss', 'hit', 'near'])
  })
})

describe('keyStates', () => {
  it('keeps the best-known state per letter across guesses', () => {
    const states = keyStates(['gust', 'dusk'], 'dusk')
    expect(states['d']).toBe('hit')
    expect(states['g']).toBe('miss')
    expect(states['u']).toBe('hit')
  })

  it('never downgrades a hit to near', () => {
    const states = keyStates(['dusk', 'snug'], 'dusk')
    expect(states['s']).toBe('hit')
  })
})
